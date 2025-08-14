/**
 * Text-to-Speech Testing Suite
 * Phase 2: TTS functionality comprehensive tests
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import {
  TextToSpeechService,
  TTSConfig,
} from "@/lib/services/TextToSpeechService";
import { TextHighlighter } from "@/lib/services/TextHighlighter";
import {
  AccessibilityProvider,
  AccessibilityToolbar,
  useAccessibility,
} from "@/components/ui/AccessibilityToolbar";

// Mock Web Speech API
const mockSpeechSynthesis = {
  speak: jest.fn(),
  cancel: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  getVoices: jest.fn(() => [
    { name: "Test Voice 1", lang: "en-US", default: true, voiceURI: "test1" },
    { name: "Test Voice 2", lang: "es-ES", default: false, voiceURI: "test2" },
  ]),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  pending: false,
  speaking: false,
  paused: false,
};

const mockSpeechSynthesisUtterance = jest.fn().mockImplementation((text) => ({
  text,
  voice: null,
  volume: 1,
  rate: 1,
  pitch: 1,
  lang: "en-US",
  onstart: null,
  onend: null,
  onerror: null,
  onpause: null,
  onresume: null,
  onboundary: null,
}));

// Setup global mocks
global.speechSynthesis = mockSpeechSynthesis as any;
global.SpeechSynthesisUtterance = mockSpeechSynthesisUtterance as any;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
global.localStorage = localStorageMock as any;

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 0));

// Test component to access TTS functionality
const TTSTestComponent = () => {
  const {
    speakText,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    isSpeaking,
    isPaused,
    isTTSSupported,
    availableVoices,
    preferences,
    updatePreferences,
  } = useAccessibility();

  return (
    <div>
      <span data-testid="tts-supported">{isTTSSupported.toString()}</span>
      <span data-testid="is-speaking">{isSpeaking.toString()}</span>
      <span data-testid="is-paused">{isPaused.toString()}</span>
      <span data-testid="voice-count">{availableVoices.length}</span>
      <span data-testid="speech-rate">{preferences.speechRate}</span>

      <button
        data-testid="speak-button"
        onClick={() => speakText("Hello world", document.createElement("div"))}
      >
        Speak
      </button>
      <button data-testid="pause-button" onClick={pauseSpeech}>
        Pause
      </button>
      <button data-testid="resume-button" onClick={resumeSpeech}>
        Resume
      </button>
      <button data-testid="stop-button" onClick={stopSpeech}>
        Stop
      </button>

      <button
        data-testid="enable-tts"
        onClick={() => updatePreferences({ textToSpeech: true })}
      >
        Enable TTS
      </button>

      <button
        data-testid="change-rate"
        onClick={() => updatePreferences({ speechRate: 1.5 })}
      >
        Change Rate
      </button>
    </div>
  );
};

const renderWithProvider = (component: React.ReactElement) => {
  return render(<AccessibilityProvider>{component}</AccessibilityProvider>);
};

describe("TextToSpeechService", () => {
  let ttsService: TextToSpeechService;

  beforeEach(() => {
    jest.clearAllMocks();
    ttsService = new TextToSpeechService();
  });

  test("detects TTS support correctly", () => {
    expect(ttsService.getTTSSupport()).toBe(true);
  });

  test("gets available voices", () => {
    const voices = ttsService.getVoices();
    expect(voices).toHaveLength(2);
    expect(voices[0].name).toBe("Test Voice 1");
    expect(voices[1].name).toBe("Test Voice 2");
  });

  test("groups voices by language", () => {
    const grouped = ttsService.getVoicesByLanguage();
    expect(grouped).toHaveProperty("en");
    expect(grouped).toHaveProperty("es");
    expect(grouped.en).toHaveLength(1);
    expect(grouped.es).toHaveLength(1);
  });

  test("finds best voice for language", () => {
    const voice = ttsService.findBestVoice("en-US");
    expect(voice).toBeTruthy();
    expect(voice?.name).toBe("Test Voice 1");
  });

  test("validates TTS configuration", () => {
    const config = TextToSpeechService.validateConfig({
      rate: 3.0, // Should be clamped to 2.0
      pitch: -1, // Should be clamped to 0.0
      volume: 1.5, // Should be clamped to 1.0
    });

    expect(config.rate).toBe(2.0);
    expect(config.pitch).toBe(0.0);
    expect(config.volume).toBe(1.0);
  });

  test("speaks text with configuration", async () => {
    const config: Partial<TTSConfig> = {
      rate: 1.5,
      pitch: 1.2,
      volume: 0.8,
      language: "en-US",
    };

    const mockUtterance = { onend: null, onerror: null };
    mockSpeechSynthesisUtterance.mockReturnValue(mockUtterance);

    const speakPromise = ttsService.speak("Hello world", config);

    // Simulate successful completion
    setTimeout(() => {
      if (mockUtterance.onend) {
        mockUtterance.onend();
      }
    }, 10);

    await expect(speakPromise).resolves.toBeUndefined();
    expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
  });

  test("handles speech errors", async () => {
    const mockUtterance = { onend: null, onerror: null };
    mockSpeechSynthesisUtterance.mockReturnValue(mockUtterance);

    const speakPromise = ttsService.speak("Hello world");

    // Simulate error
    setTimeout(() => {
      if (mockUtterance.onerror) {
        mockUtterance.onerror({ error: "synthesis-failed" });
      }
    }, 10);

    await expect(speakPromise).rejects.toThrow("Speech synthesis error");
  });

  test("controls speech playback", () => {
    ttsService.pause();
    expect(mockSpeechSynthesis.pause).toHaveBeenCalled();

    ttsService.resume();
    expect(mockSpeechSynthesis.resume).toHaveBeenCalled();

    ttsService.stop();
    expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
  });
});

describe("TextHighlighter", () => {
  let highlighter: TextHighlighter;
  let testElement: HTMLElement;

  beforeEach(() => {
    highlighter = new TextHighlighter();
    testElement = document.createElement("div");
    testElement.textContent = "This is a test sentence for highlighting.";
    document.body.appendChild(testElement);
  });

  afterEach(() => {
    highlighter.destroy();
    document.body.removeChild(testElement);
  });

  test("highlights text correctly", () => {
    highlighter.highlightText(testElement, 5, 2); // Highlight "is"

    const highlightedElement = testElement.querySelector(
      ".accessibility-speaking",
    );
    expect(highlightedElement).toBeTruthy();
    expect(highlightedElement?.textContent).toBe("is");
  });

  test("highlights words correctly", () => {
    highlighter.highlightWord(testElement, 2); // Highlight third word "test"

    const highlightedElement = testElement.querySelector(
      ".accessibility-speaking",
    );
    expect(highlightedElement).toBeTruthy();
    expect(highlightedElement?.textContent).toBe("test");
  });

  test("removes highlighting", () => {
    highlighter.highlightText(testElement, 0, 4);
    expect(testElement.querySelector(".accessibility-speaking")).toBeTruthy();

    highlighter.removeHighlight();
    expect(testElement.querySelector(".accessibility-speaking")).toBeFalsy();
    expect(testElement.textContent).toBe(
      "This is a test sentence for highlighting.",
    );
  });

  test("handles multiple segments", () => {
    const segments = [
      { text: "This", startIndex: 0, endIndex: 4 },
      { text: "test", startIndex: 10, endIndex: 14 },
    ];

    highlighter.highlightSegments(testElement, segments);

    const highlightedElements = testElement.querySelectorAll(
      ".accessibility-speaking",
    );
    expect(highlightedElements).toHaveLength(2);
  });

  test("updates configuration", () => {
    highlighter.updateConfig({
      backgroundColor: "#ff0000",
      className: "custom-highlight",
    });

    highlighter.highlightText(testElement, 0, 4);
    const highlightedElement = testElement.querySelector(".custom-highlight");
    expect(highlightedElement).toBeTruthy();
  });
});

describe("TTS Integration with AccessibilityProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  test("initializes TTS support detection", () => {
    renderWithProvider(<TTSTestComponent />);

    expect(screen.getByTestId("tts-supported")).toHaveTextContent("true");
    expect(screen.getByTestId("voice-count")).toHaveTextContent("2");
  });

  test("TTS controls work when enabled", async () => {
    renderWithProvider(<TTSTestComponent />);

    // Enable TTS first
    const enableButton = screen.getByTestId("enable-tts");
    fireEvent.click(enableButton);

    // Now try to speak
    const speakButton = screen.getByTestId("speak-button");
    fireEvent.click(speakButton);

    await waitFor(() => {
      expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
    });
  });

  test("speech rate changes are applied", async () => {
    renderWithProvider(<TTSTestComponent />);

    const changeRateButton = screen.getByTestId("change-rate");
    fireEvent.click(changeRateButton);

    await waitFor(() => {
      expect(screen.getByTestId("speech-rate")).toHaveTextContent("1.5");
    });
  });

  test("TTS controls are disabled when TTS is off", () => {
    renderWithProvider(<TTSTestComponent />);

    const speakButton = screen.getByTestId("speak-button");
    fireEvent.click(speakButton);

    // Should not call speak when TTS is disabled
    expect(mockSpeechSynthesis.speak).not.toHaveBeenCalled();
  });

  test("pause and resume controls work", async () => {
    renderWithProvider(<TTSTestComponent />);

    // Enable TTS and start speaking
    fireEvent.click(screen.getByTestId("enable-tts"));
    fireEvent.click(screen.getByTestId("speak-button"));

    // Simulate speaking state
    const mockUtterance = { onstart: null };
    mockSpeechSynthesisUtterance.mockReturnValue(mockUtterance);

    if (mockUtterance.onstart) {
      mockUtterance.onstart();
    }

    await waitFor(() => {
      expect(screen.getByTestId("is-speaking")).toHaveTextContent("true");
    });

    // Test pause
    const pauseButton = screen.getByTestId("pause-button");
    fireEvent.click(pauseButton);
    expect(mockSpeechSynthesis.pause).toHaveBeenCalled();

    // Test resume
    const resumeButton = screen.getByTestId("resume-button");
    fireEvent.click(resumeButton);
    expect(mockSpeechSynthesis.resume).toHaveBeenCalled();

    // Test stop
    const stopButton = screen.getByTestId("stop-button");
    fireEvent.click(stopButton);
    expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
  });
});

describe("TTS Toolbar Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(
      JSON.stringify({ textToSpeech: true }),
    );
  });

  test("TTS controls appear when TTS is enabled", async () => {
    renderWithProvider(<AccessibilityToolbar />);

    const button = screen.getByRole("button", {
      name: /open accessibility menu/i,
    });
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Text-to-Speech Controls")).toBeInTheDocument();
      expect(screen.getByText("Read Page")).toBeInTheDocument();
      expect(screen.getByText("Read Selection")).toBeInTheDocument();
    });
  });

  test("reading speed control works", async () => {
    renderWithProvider(<AccessibilityToolbar />);

    const button = screen.getByRole("button", {
      name: /open accessibility menu/i,
    });
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Reading Speed")).toBeInTheDocument();
    });

    const fastButton = screen.getByRole("button", { name: "Fast (1.5x)" });
    await userEvent.click(fastButton);

    expect(fastButton).toHaveAttribute("aria-pressed", "true");
  });

  test("read page functionality", async () => {
    // Add some content to the page
    const mainElement = document.createElement("main");
    mainElement.textContent = "This is the main content of the page.";
    document.body.appendChild(mainElement);

    renderWithProvider(<AccessibilityToolbar />);

    const button = screen.getByRole("button", {
      name: /open accessibility menu/i,
    });
    await userEvent.click(button);

    await waitFor(() => {
      const readPageButton = screen.getByRole("button", {
        name: "Read entire page",
      });
      expect(readPageButton).toBeInTheDocument();

      fireEvent.click(readPageButton);
      expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
    });

    document.body.removeChild(mainElement);
  });
});

describe("Browser Compatibility", () => {
  test("handles missing Web Speech API gracefully", () => {
    // Temporarily remove Web Speech API
    const originalSpeechSynthesis = global.speechSynthesis;
    const originalSpeechSynthesisUtterance = global.SpeechSynthesisUtterance;

    delete (global as any).speechSynthesis;
    delete (global as any).SpeechSynthesisUtterance;

    const ttsService = new TextToSpeechService();
    expect(ttsService.getTTSSupport()).toBe(false);

    // Restore
    global.speechSynthesis = originalSpeechSynthesis;
    global.SpeechSynthesisUtterance = originalSpeechSynthesisUtterance;
  });

  test("provides browser-specific information", () => {
    const ttsService = new TextToSpeechService();
    const browserInfo = ttsService.getBrowserInfo();

    expect(browserInfo).toHaveProperty("browser");
    expect(browserInfo).toHaveProperty("limitations");
    expect(browserInfo).toHaveProperty("recommendations");
    expect(Array.isArray(browserInfo.limitations)).toBe(true);
    expect(Array.isArray(browserInfo.recommendations)).toBe(true);
  });
});

describe("Performance", () => {
  test("TTS initialization is performant", () => {
    const start = performance.now();
    new TextToSpeechService();
    const end = performance.now();

    expect(end - start).toBeLessThan(50); // Should initialize quickly
  });

  test("highlighting operations are performant", () => {
    const highlighter = new TextHighlighter();
    const element = document.createElement("div");
    element.textContent = "A".repeat(1000); // Large text

    const start = performance.now();
    highlighter.highlightText(element, 0, 100);
    const end = performance.now();

    expect(end - start).toBeLessThan(100); // Should highlight quickly

    highlighter.destroy();
  });

  test("memory cleanup works correctly", () => {
    const highlighter = new TextHighlighter();
    const element = document.createElement("div");
    element.textContent = "Test content";

    highlighter.highlightText(element, 0, 4);
    expect(highlighter.isHighlighting()).toBe(true);

    highlighter.destroy();
    expect(highlighter.isHighlighting()).toBe(false);
  });
});

/**
 * Text-to-Speech Service
 * Phase 2: Core TTS functionality with Web Speech API
 */

export interface TTSConfig {
  rate: number; // 0.5 - 2.0
  pitch: number; // 0.0 - 2.0
  volume: number; // 0.0 - 1.0
  voice: string; // Voice identifier
  language: string; // Language code (e.g., 'en-US')
}

export interface TTSEventCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onError?: (error: Error) => void;
  onBoundary?: (event: SpeechSynthesisEvent) => void;
}

export class TextToSpeechService {
  private synthesis: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  private isSupported: boolean;
  private isPaused: boolean = false;
  private isPlaying: boolean = false;
  private currentText: string = "";
  private callbacks: TTSEventCallbacks = {};

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.isSupported = this.checkSupport();

    // Handle browser-specific issues
    this.handleBrowserQuirks();
  }

  /**
   * Check if Text-to-Speech is supported in the current browser
   */
  private checkSupport(): boolean {
    return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  }

  /**
   * Handle browser-specific quirks and limitations
   */
  private handleBrowserQuirks(): void {
    // Chrome/Safari: speechSynthesis.getVoices() might be empty initially
    if (this.isSupported) {
      // Trigger voices loading
      this.synthesis.getVoices();

      // Listen for voices changed event
      this.synthesis.addEventListener("voiceschanged", () => {
        // Voices are now available
      });
    }
  }

  /**
   * Get available voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    if (!this.isSupported) return [];

    const voices = this.synthesis.getVoices();

    // Filter out voices that might not work properly
    return voices.filter((voice) => voice.lang && voice.name);
  }

  /**
   * Get voices grouped by language
   */
  getVoicesByLanguage(): Record<string, SpeechSynthesisVoice[]> {
    const voices = this.getVoices();
    const grouped: Record<string, SpeechSynthesisVoice[]> = {};

    voices.forEach((voice) => {
      const lang = voice.lang.split("-")[0]; // Get base language (e.g., 'en' from 'en-US')
      if (!grouped[lang]) {
        grouped[lang] = [];
      }
      grouped[lang].push(voice);
    });

    return grouped;
  }

  /**
   * Find the best voice for a given language
   */
  findBestVoice(language: string): SpeechSynthesisVoice | null {
    const voices = this.getVoices();

    // Try exact match first
    let voice = voices.find((v) => v.lang === language);
    if (voice) return voice;

    // Try language prefix match (e.g., 'en' matches 'en-US')
    const langPrefix = language.split("-")[0];
    voice = voices.find((v) => v.lang.startsWith(langPrefix));
    if (voice) return voice;

    // Try default voice
    voice = voices.find((v) => v.default);
    if (voice) return voice;

    // Return first available voice
    return voices[0] || null;
  }

  /**
   * Speak the given text with configuration
   */
  async speak(
    text: string,
    config: Partial<TTSConfig> = {},
    callbacks: TTSEventCallbacks = {},
  ): Promise<void> {
    if (!this.isSupported) {
      throw new Error("Text-to-Speech is not supported in this browser");
    }

    if (!text.trim()) {
      throw new Error("No text provided for speech");
    }

    // Stop any current speech
    this.stop();

    // Store callbacks
    this.callbacks = callbacks;
    this.currentText = text;

    // Create utterance
    this.utterance = new SpeechSynthesisUtterance(text);

    // Apply configuration
    this.applyConfig(this.utterance, config);

    // Set up event listeners
    this.setupEventListeners(this.utterance);

    // Start speaking
    return new Promise((resolve, reject) => {
      if (!this.utterance) {
        reject(new Error("Failed to create utterance"));
        return;
      }

      this.utterance.onend = () => {
        this.isPlaying = false;
        this.isPaused = false;
        this.callbacks.onEnd?.();
        resolve();
      };

      this.utterance.onerror = (event) => {
        this.isPlaying = false;
        this.isPaused = false;
        const error = new Error(`Speech synthesis error: ${event.error}`);
        this.callbacks.onError?.(error);
        reject(error);
      };

      this.synthesis.speak(this.utterance);
      this.isPlaying = true;
      this.isPaused = false;
      this.callbacks.onStart?.();
    });
  }

  /**
   * Apply TTS configuration to utterance
   */
  private applyConfig(
    utterance: SpeechSynthesisUtterance,
    config: Partial<TTSConfig>,
  ): void {
    // Set rate (0.5 - 2.0, default 1.0)
    utterance.rate = Math.max(0.1, Math.min(2.0, config.rate ?? 1.0));

    // Set pitch (0.0 - 2.0, default 1.0)
    utterance.pitch = Math.max(0.0, Math.min(2.0, config.pitch ?? 1.0));

    // Set volume (0.0 - 1.0, default 1.0)
    utterance.volume = Math.max(0.0, Math.min(1.0, config.volume ?? 1.0));

    // Set language
    if (config.language) {
      utterance.lang = config.language;
    }

    // Set voice
    if (config.voice) {
      const voice = this.getVoices().find(
        (v) => v.name === config.voice || v.voiceURI === config.voice,
      );
      if (voice) {
        utterance.voice = voice;
      }
    } else if (config.language) {
      // Auto-select best voice for language
      const voice = this.findBestVoice(config.language);
      if (voice) {
        utterance.voice = voice;
      }
    }
  }

  /**
   * Set up event listeners for utterance
   */
  private setupEventListeners(utterance: SpeechSynthesisUtterance): void {
    utterance.onstart = () => {
      this.isPlaying = true;
      this.isPaused = false;
    };

    utterance.onpause = () => {
      this.isPaused = true;
      this.callbacks.onPause?.();
    };

    utterance.onresume = () => {
      this.isPaused = false;
      this.callbacks.onResume?.();
    };

    utterance.onboundary = (event) => {
      // Called at word/sentence boundaries
      this.callbacks.onBoundary?.(event);
    };
  }

  /**
   * Pause current speech
   */
  pause(): void {
    if (this.isSupported && this.isPlaying && !this.isPaused) {
      this.synthesis.pause();
      this.isPaused = true;
      this.callbacks.onPause?.();
    }
  }

  /**
   * Resume paused speech
   */
  resume(): void {
    if (this.isSupported && this.isPlaying && this.isPaused) {
      this.synthesis.resume();
      this.isPaused = false;
      this.callbacks.onResume?.();
    }
  }

  /**
   * Stop current speech
   */
  stop(): void {
    if (this.isSupported) {
      this.synthesis.cancel();
      this.isPlaying = false;
      this.isPaused = false;
      this.utterance = null;
    }
  }

  /**
   * Toggle play/pause
   */
  toggle(): void {
    if (this.isPlaying) {
      if (this.isPaused) {
        this.resume();
      } else {
        this.pause();
      }
    }
  }

  /**
   * Check if TTS is currently playing
   */
  isCurrentlyPlaying(): boolean {
    return this.isPlaying && !this.isPaused;
  }

  /**
   * Check if TTS is currently paused
   */
  isCurrentlyPaused(): boolean {
    return this.isPlaying && this.isPaused;
  }

  /**
   * Check if TTS is supported
   */
  getTTSSupport(): boolean {
    return this.isSupported;
  }

  /**
   * Get current text being spoken
   */
  getCurrentText(): string {
    return this.currentText;
  }

  /**
   * Get default TTS configuration
   */
  static getDefaultConfig(): TTSConfig {
    return {
      rate: 0.75,
      pitch: 1.0,
      volume: 1.0,
      voice: "",
      language: "en-US",
    };
  }

  /**
   * Validate TTS configuration
   */
  static validateConfig(config: Partial<TTSConfig>): TTSConfig {
    const defaults = TextToSpeechService.getDefaultConfig();

    return {
      rate: Math.max(0.1, Math.min(2.0, config.rate ?? defaults.rate)),
      pitch: Math.max(0.0, Math.min(2.0, config.pitch ?? defaults.pitch)),
      volume: Math.max(0.0, Math.min(1.0, config.volume ?? defaults.volume)),
      voice: config.voice ?? defaults.voice,
      language: config.language ?? defaults.language,
    };
  }

  /**
   * Get browser-specific limitations and recommendations
   */
  getBrowserInfo(): {
    browser: string;
    limitations: string[];
    recommendations: string[];
  } {
    const userAgent = navigator.userAgent;

    if (userAgent.includes("Chrome")) {
      return {
        browser: "Chrome",
        limitations: [
          "Voices may not be available immediately",
          "Long text may be cut off after 15 seconds",
        ],
        recommendations: [
          "Wait for voiceschanged event",
          "Break long text into chunks",
        ],
      };
    }

    if (userAgent.includes("Firefox")) {
      return {
        browser: "Firefox",
        limitations: [
          "Limited voice selection",
          "May have different voice quality",
        ],
        recommendations: ["Test voice quality", "Provide fallback voices"],
      };
    }

    if (userAgent.includes("Safari")) {
      return {
        browser: "Safari",
        limitations: [
          "Requires user interaction to start",
          "May pause in background",
        ],
        recommendations: [
          "Ensure user has interacted with page",
          "Handle visibility change events",
        ],
      };
    }

    return {
      browser: "Unknown",
      limitations: ["Unknown browser limitations"],
      recommendations: ["Test thoroughly in this browser"],
    };
  }
}

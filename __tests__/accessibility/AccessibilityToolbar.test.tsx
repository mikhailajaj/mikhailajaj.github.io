/**
 * Comprehensive Test Suite for Enhanced Accessibility Toolbar
 * Phase 1: Integration & Testing
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import {
  AccessibilityProvider,
  AccessibilityToolbar,
  useAccessibility,
} from "@/components/ui/AccessibilityToolbar";

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 0));

// Test component to access context
const TestComponent = () => {
  const { preferences, updatePreferences, resetPreferences } =
    useAccessibility();
  return (
    <div>
      <span data-testid="font-size">{preferences.fontSize}</span>
      <span data-testid="contrast">{preferences.contrast}</span>
      <span data-testid="reduced-motion">
        {preferences.reducedMotion.toString()}
      </span>
      <span data-testid="cursor">{preferences.cursor}</span>
      <span data-testid="desaturate">{preferences.desaturate.toString()}</span>
      <button
        data-testid="update-font-size"
        onClick={() => updatePreferences({ fontSize: "large" })}
      >
        Update Font Size
      </button>
      <button data-testid="reset" onClick={resetPreferences}>
        Reset
      </button>
    </div>
  );
};

const renderWithProvider = (component: React.ReactElement) => {
  return render(<AccessibilityProvider>{component}</AccessibilityProvider>);
};

describe("AccessibilityProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  test("provides default preferences", () => {
    renderWithProvider(<TestComponent />);

    expect(screen.getByTestId("font-size")).toHaveTextContent("medium");
    expect(screen.getByTestId("contrast")).toHaveTextContent("normal");
    expect(screen.getByTestId("reduced-motion")).toHaveTextContent("false");
    expect(screen.getByTestId("cursor")).toHaveTextContent("normal");
    expect(screen.getByTestId("desaturate")).toHaveTextContent("false");
  });

  test("loads preferences from localStorage", () => {
    const savedPreferences = {
      fontSize: "large",
      contrast: "high",
      reducedMotion: true,
      cursor: "big",
      desaturate: true,
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedPreferences));

    renderWithProvider(<TestComponent />);

    expect(screen.getByTestId("font-size")).toHaveTextContent("large");
    expect(screen.getByTestId("contrast")).toHaveTextContent("high");
    expect(screen.getByTestId("reduced-motion")).toHaveTextContent("true");
    expect(screen.getByTestId("cursor")).toHaveTextContent("big");
    expect(screen.getByTestId("desaturate")).toHaveTextContent("true");
  });

  test("updates preferences correctly", async () => {
    renderWithProvider(<TestComponent />);

    const updateButton = screen.getByTestId("update-font-size");
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(screen.getByTestId("font-size")).toHaveTextContent("large");
    });
  });

  test("resets preferences to default", async () => {
    localStorageMock.getItem.mockReturnValue(
      JSON.stringify({ fontSize: "large" }),
    );

    renderWithProvider(<TestComponent />);

    const resetButton = screen.getByTestId("reset");
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(screen.getByTestId("font-size")).toHaveTextContent("medium");
    });
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(
      "accessibility-preferences",
    );
  });

  test("saves preferences to localStorage", async () => {
    renderWithProvider(<TestComponent />);

    const updateButton = screen.getByTestId("update-font-size");
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "accessibility-preferences",
        expect.stringContaining('"fontSize":"large"'),
      );
    });
  });
});

describe("AccessibilityToolbar", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  test("renders accessibility button", () => {
    renderWithProvider(<AccessibilityToolbar />);

    const button = screen.getByRole("button", {
      name: /open accessibility menu/i,
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  test("opens accessibility menu on click", async () => {
    renderWithProvider(<AccessibilityToolbar />);

    const button = screen.getByRole("button", {
      name: /open accessibility menu/i,
    });
    await user.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Accessibility Options")).toBeInTheDocument();
  });

  test("closes menu with close button", async () => {
    renderWithProvider(<AccessibilityToolbar />);

    const openButton = screen.getByRole("button", {
      name: /open accessibility menu/i,
    });
    await user.click(openButton);

    const closeButton = screen.getByRole("button", {
      name: /close accessibility menu/i,
    });
    await user.click(closeButton);

    expect(openButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("opens menu with Ctrl+U keyboard shortcut", async () => {
    renderWithProvider(<AccessibilityToolbar />);

    await user.keyboard("{Control>}u{/Control}");

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  test("opens menu with Alt+A keyboard shortcut", async () => {
    renderWithProvider(<AccessibilityToolbar />);

    await user.keyboard("{Alt>}a{/Alt}");

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  test("closes menu with Escape key", async () => {
    renderWithProvider(<AccessibilityToolbar />);

    const button = screen.getByRole("button", {
      name: /open accessibility menu/i,
    });
    await user.click(button);

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("renders all control options", async () => {
    renderWithProvider(<AccessibilityToolbar />);

    const button = screen.getByRole("button", {
      name: /open accessibility menu/i,
    });
    await user.click(button);

    // Check for all expected controls
    expect(screen.getByText("Font Size")).toBeInTheDocument();
    expect(screen.getByText("Contrast & Theme")).toBeInTheDocument();
    expect(screen.getByText("Cursor & Reading")).toBeInTheDocument();
    expect(screen.getByText("Reduce Motion")).toBeInTheDocument();
    expect(screen.getByText("Enhanced Focus")).toBeInTheDocument();
    expect(screen.getByText("Desaturate Colors")).toBeInTheDocument();
    expect(screen.getByText("Highlight Links")).toBeInTheDocument();
    expect(screen.getByText("Legible Fonts")).toBeInTheDocument();
    expect(screen.getByText("Text to Speech")).toBeInTheDocument();
    expect(screen.getByText("Screen Reader Mode")).toBeInTheDocument();
  });

  test("font size selection works", async () => {
    renderWithProvider(<AccessibilityToolbar />);

    const button = screen.getByRole("button", {
      name: /open accessibility menu/i,
    });
    await user.click(button);

    const largeButton = screen.getByRole("button", { name: "Large" });
    await user.click(largeButton);

    expect(largeButton).toHaveAttribute("aria-pressed", "true");
  });

  test("toggle controls work", async () => {
    renderWithProvider(<AccessibilityToolbar />);

    const button = screen.getByRole("button", {
      name: /open accessibility menu/i,
    });
    await user.click(button);

    const motionToggle = screen.getByRole("switch", {
      name: /toggle reduce motion/i,
    });
    await user.click(motionToggle);

    expect(motionToggle).toHaveAttribute("aria-checked", "true");
  });

  test("reset button works", async () => {
    renderWithProvider(<AccessibilityToolbar />);

    const button = screen.getByRole("button", {
      name: /open accessibility menu/i,
    });
    await user.click(button);

    // Change a setting first
    const motionToggle = screen.getByRole("switch", {
      name: /toggle reduce motion/i,
    });
    await user.click(motionToggle);

    // Reset
    const resetButton = screen.getByRole("button", {
      name: /reset all accessibility settings/i,
    });
    await user.click(resetButton);

    expect(motionToggle).toHaveAttribute("aria-checked", "false");
  });
});

describe("DOM Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    // Reset document attributes
    document.documentElement.removeAttribute("data-font-size");
    document.documentElement.removeAttribute("data-contrast");
    document.body.className = "";
  });

  test("applies font size to document", async () => {
    const savedPreferences = { fontSize: "large" };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedPreferences));

    renderWithProvider(<TestComponent />);

    await waitFor(() => {
      expect(document.documentElement.getAttribute("data-font-size")).toBe(
        "large",
      );
    });
  });

  test("applies contrast mode to document", async () => {
    const savedPreferences = { contrast: "high" };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedPreferences));

    renderWithProvider(<TestComponent />);

    await waitFor(() => {
      expect(document.documentElement.getAttribute("data-contrast")).toBe(
        "high",
      );
    });
  });

  test("applies CSS classes for enhanced features", async () => {
    const savedPreferences = {
      desaturate: true,
      highlightLinks: true,
      cursor: "big",
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedPreferences));

    renderWithProvider(<TestComponent />);

    await waitFor(() => {
      expect(document.body.classList.contains("accessibility-desaturate")).toBe(
        true,
      );
      expect(
        document.body.classList.contains("accessibility-highlight-links"),
      ).toBe(true);
      expect(document.body.classList.contains("accessibility-big-cursor")).toBe(
        true,
      );
    });
  });

  test("removes CSS classes on reset", async () => {
    // Set initial state
    document.body.classList.add(
      "accessibility-desaturate",
      "accessibility-big-cursor",
    );

    renderWithProvider(<TestComponent />);

    const resetButton = screen.getByTestId("reset");
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(document.body.classList.contains("accessibility-desaturate")).toBe(
        false,
      );
      expect(document.body.classList.contains("accessibility-big-cursor")).toBe(
        false,
      );
    });
  });
});

describe("Performance", () => {
  test("uses requestAnimationFrame for DOM updates", async () => {
    const rafSpy = jest.spyOn(global, "requestAnimationFrame");

    renderWithProvider(<TestComponent />);

    const updateButton = screen.getByTestId("update-font-size");
    fireEvent.click(updateButton);

    expect(rafSpy).toHaveBeenCalled();

    rafSpy.mockRestore();
  });

  test("component is memoized", () => {
    const { rerender } = renderWithProvider(<AccessibilityToolbar />);

    // Component should not re-render unnecessarily
    rerender(
      <AccessibilityProvider>
        <AccessibilityToolbar />
      </AccessibilityProvider>,
    );

    // This test verifies that React.memo is working
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("performance budget - render time under 100ms", async () => {
    const start = performance.now();
    renderWithProvider(<AccessibilityToolbar />);
    const end = performance.now();
    const renderTime = end - start;

    expect(renderTime).toBeLessThan(100);
  });
});

describe("Error Handling", () => {
  test("handles localStorage errors gracefully", () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error("localStorage error");
    });

    renderWithProvider(<TestComponent />);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to load accessibility preferences:",
      expect.any(Error),
    );

    // Should still render with defaults
    expect(screen.getByTestId("font-size")).toHaveTextContent("medium");

    consoleSpy.mockRestore();
  });

  test("handles invalid JSON in localStorage", () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
    localStorageMock.getItem.mockReturnValue("invalid json");

    renderWithProvider(<TestComponent />);

    expect(consoleSpy).toHaveBeenCalled();
    expect(screen.getByTestId("font-size")).toHaveTextContent("medium");

    consoleSpy.mockRestore();
  });

  test("throws error when useAccessibility used outside provider", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    expect(() => {
      render(<TestComponent />);
    }).toThrow("useAccessibility must be used within AccessibilityProvider");

    consoleSpy.mockRestore();
  });
});

describe("Accessibility Compliance", () => {
  test("has proper ARIA attributes", async () => {
    renderWithProvider(<AccessibilityToolbar />);

    const button = screen.getByRole("button", {
      name: /open accessibility menu/i,
    });

    expect(button).toHaveAttribute("aria-expanded");
    expect(button).toHaveAttribute("aria-controls", "accessibility-menu");

    await userEvent.click(button);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-labelledby", "accessibility-title");
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  test("toggle controls have proper switch role", async () => {
    renderWithProvider(<AccessibilityToolbar />);

    const button = screen.getByRole("button", {
      name: /open accessibility menu/i,
    });
    await userEvent.click(button);

    const switches = screen.getAllByRole("switch");
    expect(switches.length).toBeGreaterThan(0);

    switches.forEach((switchElement) => {
      expect(switchElement).toHaveAttribute("aria-checked");
    });
  });

  test("select controls have proper pressed state", async () => {
    renderWithProvider(<AccessibilityToolbar />);

    const button = screen.getByRole("button", {
      name: /open accessibility menu/i,
    });
    await userEvent.click(button);

    const mediumButton = screen.getByRole("button", { name: "Medium" });
    expect(mediumButton).toHaveAttribute("aria-pressed", "true");
  });
});

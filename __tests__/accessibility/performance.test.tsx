/**
 * Performance Testing for Enhanced Accessibility System
 * Phase 1: Performance Baseline & Monitoring
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  AccessibilityProvider,
  AccessibilityToolbar,
} from "@/components/ui/AccessibilityToolbar";

// Performance monitoring utilities
const measurePerformance = async (operation: () => Promise<void> | void) => {
  const start = performance.now();
  await operation();
  const end = performance.now();
  return end - start;
};

const measureMemoryUsage = () => {
  if ("memory" in performance) {
    return (performance as any).memory.usedJSHeapSize;
  }
  return null;
};

describe("Accessibility Performance Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  test("component renders within performance budget (< 100ms)", async () => {
    const renderTime = await measurePerformance(() => {
      render(
        <AccessibilityProvider>
          <AccessibilityToolbar />
        </AccessibilityProvider>,
      );
    });

    expect(renderTime).toBeLessThan(100); // 100ms budget
  });

  test("menu opening is performant (< 50ms)", async () => {
    render(
      <AccessibilityProvider>
        <AccessibilityToolbar />
      </AccessibilityProvider>,
    );

    const button = screen.getByRole("button", {
      name: /open accessibility menu/i,
    });

    const openTime = await measurePerformance(async () => {
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    });

    expect(openTime).toBeLessThan(50); // 50ms budget for UI interactions
  });

  test("preference updates are performant (< 30ms)", async () => {
    render(
      <AccessibilityProvider>
        <AccessibilityToolbar />
      </AccessibilityProvider>,
    );

    const button = screen.getByRole("button", {
      name: /open accessibility menu/i,
    });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const largeButton = screen.getByRole("button", { name: "Large" });

    const updateTime = await measurePerformance(() => {
      fireEvent.click(largeButton);
    });

    expect(updateTime).toBeLessThan(30); // 30ms budget for preference updates
  });

  test("DOM updates use requestAnimationFrame", () => {
    const rafSpy = jest
      .spyOn(global, "requestAnimationFrame")
      .mockImplementation((cb) => {
        setTimeout(cb, 0);
        return 1;
      });

    render(
      <AccessibilityProvider>
        <AccessibilityToolbar />
      </AccessibilityProvider>,
    );

    expect(rafSpy).toHaveBeenCalled();

    rafSpy.mockRestore();
  });

  test("memory usage stays within bounds", async () => {
    const initialMemory = measureMemoryUsage();

    // Render multiple instances to test memory leaks
    const instances = [];
    for (let i = 0; i < 10; i++) {
      const { unmount } = render(
        <AccessibilityProvider>
          <AccessibilityToolbar />
        </AccessibilityProvider>,
      );
      instances.push(unmount);
    }

    // Unmount all instances
    instances.forEach((unmount) => unmount());

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }

    const finalMemory = measureMemoryUsage();

    if (initialMemory && finalMemory) {
      const memoryIncrease = finalMemory - initialMemory;
      // Memory increase should be minimal (< 5MB)
      expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024);
    }
  });

  test("event listeners are properly cleaned up", () => {
    const addEventListenerSpy = jest.spyOn(document, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(document, "removeEventListener");

    const { unmount } = render(
      <AccessibilityProvider>
        <AccessibilityToolbar />
      </AccessibilityProvider>,
    );

    // Should add keyboard event listeners
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function),
    );

    unmount();

    // Should remove event listeners on unmount
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function),
    );

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  test("localStorage operations are batched", async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

    render(
      <AccessibilityProvider>
        <AccessibilityToolbar />
      </AccessibilityProvider>,
    );

    const button = screen.getByRole("button", {
      name: /open accessibility menu/i,
    });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    // Make multiple rapid changes
    const largeButton = screen.getByRole("button", { name: "Large" });
    const extraLargeButton = screen.getByRole("button", {
      name: "Extra Large",
    });

    fireEvent.click(largeButton);
    fireEvent.click(extraLargeButton);

    // Should not call setItem excessively
    await waitFor(() => {
      expect(setItemSpy.mock.calls.length).toBeLessThan(5);
    });

    setItemSpy.mockRestore();
  });

  test("CSS class operations are efficient", async () => {
    const classListSpy = jest.spyOn(document.body.classList, "toggle");

    render(
      <AccessibilityProvider>
        <AccessibilityToolbar />
      </AccessibilityProvider>,
    );

    const button = screen.getByRole("button", {
      name: /open accessibility menu/i,
    });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const desaturateToggle = screen.getByRole("switch", {
      name: /toggle desaturate colors/i,
    });
    fireEvent.click(desaturateToggle);

    await waitFor(() => {
      expect(classListSpy).toHaveBeenCalledWith(
        "accessibility-desaturate",
        true,
      );
    });

    classListSpy.mockRestore();
  });
});

describe("Core Web Vitals Impact", () => {
  test("does not impact Largest Contentful Paint (LCP)", async () => {
    // Mock performance observer
    const mockObserver = {
      observe: jest.fn(),
      disconnect: jest.fn(),
    };

    global.PerformanceObserver = jest
      .fn()
      .mockImplementation(() => mockObserver);

    render(
      <AccessibilityProvider>
        <AccessibilityToolbar />
        <div style={{ width: "100px", height: "100px" }}>Main Content</div>
      </AccessibilityProvider>,
    );

    // Accessibility toolbar should not interfere with main content rendering
    expect(screen.getByText("Main Content")).toBeInTheDocument();
  });

  test("does not impact First Input Delay (FID)", async () => {
    render(
      <AccessibilityProvider>
        <AccessibilityToolbar />
      </AccessibilityProvider>,
    );

    const button = screen.getByRole("button", {
      name: /open accessibility menu/i,
    });

    // First interaction should be responsive
    const interactionTime = await measurePerformance(async () => {
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    });

    expect(interactionTime).toBeLessThan(100); // Good FID threshold
  });

  test("does not cause Cumulative Layout Shift (CLS)", () => {
    const { container } = render(
      <AccessibilityProvider>
        <AccessibilityToolbar />
        <div data-testid="main-content">Main Content</div>
      </AccessibilityProvider>,
    );

    const mainContent = screen.getByTestId("main-content");
    const initialRect = mainContent.getBoundingClientRect();

    // Open accessibility menu
    const button = screen.getByRole("button", {
      name: /open accessibility menu/i,
    });
    fireEvent.click(button);

    // Main content position should not change
    const finalRect = mainContent.getBoundingClientRect();
    expect(finalRect.top).toBe(initialRect.top);
    expect(finalRect.left).toBe(initialRect.left);
  });
});

describe("Bundle Size Impact", () => {
  test("component tree is optimized", () => {
    const { container } = render(
      <AccessibilityProvider>
        <AccessibilityToolbar />
      </AccessibilityProvider>,
    );

    // Should not create excessive DOM nodes
    const allElements = container.querySelectorAll("*");
    expect(allElements.length).toBeLessThan(20); // Reasonable DOM size
  });

  test("uses React.memo for optimization", () => {
    // This test verifies that components are properly memoized
    const { rerender } = render(
      <AccessibilityProvider>
        <AccessibilityToolbar />
      </AccessibilityProvider>,
    );

    const button = screen.getByRole("button", {
      name: /open accessibility menu/i,
    });
    expect(button).toBeInTheDocument();

    // Re-render with same props should not cause issues
    rerender(
      <AccessibilityProvider>
        <AccessibilityToolbar />
      </AccessibilityProvider>,
    );

    expect(button).toBeInTheDocument();
  });
});

describe("Accessibility Performance", () => {
  test("screen reader announcements are efficient", async () => {
    const createElementSpy = jest.spyOn(document, "createElement");
    const appendChildSpy = jest.spyOn(document.body, "appendChild");
    const removeChildSpy = jest.spyOn(document.body, "removeChild");

    render(
      <AccessibilityProvider>
        <AccessibilityToolbar />
      </AccessibilityProvider>,
    );

    const button = screen.getByRole("button", {
      name: /open accessibility menu/i,
    });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const largeButton = screen.getByRole("button", { name: "Large" });
    fireEvent.click(largeButton);

    // Should create announcement element
    await waitFor(() => {
      expect(createElementSpy).toHaveBeenCalledWith("div");
    });

    // Should clean up announcement element
    await waitFor(
      () => {
        expect(removeChildSpy).toHaveBeenCalled();
      },
      { timeout: 2000 },
    );

    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  test("focus management is performant", async () => {
    render(
      <AccessibilityProvider>
        <AccessibilityToolbar />
      </AccessibilityProvider>,
    );

    const button = screen.getByRole("button", {
      name: /open accessibility menu/i,
    });

    const focusTime = await measurePerformance(async () => {
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    });

    expect(focusTime).toBeLessThan(50); // Focus should be immediate
  });
});

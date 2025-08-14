/**
 * Consolidated Layout System Tests
 * Tests for the main consolidated layout component and auto-detection
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { usePathname } from "next/navigation";
import {
  ConsolidatedLayout,
  LayoutProvider,
  type LayoutType,
} from "@/components/layouts/ConsolidatedLayout";
import { getLayoutConfigForPath } from "@/components/layouts/LayoutConfig";

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// Mock dependencies
jest.mock("@/components/layouts/components/TopNavigation", () => ({
  TopNavigation: ({ onMenuToggle }: any) => (
    <nav data-testid="top-navigation">
      <button onClick={onMenuToggle} data-testid="menu-toggle">
        Menu
      </button>
    </nav>
  ),
}));

jest.mock("@/components/layouts/components/SideMenu", () => ({
  SideMenu: ({ content, isCollapsed, onToggle }: any) => (
    <aside
      data-testid="side-menu"
      data-content={content}
      data-collapsed={isCollapsed}
    >
      <button onClick={onToggle} data-testid="sidebar-toggle">
        Toggle
      </button>
    </aside>
  ),
}));

jest.mock("@/components/ui/navigation/DomainAwareNavigation", () => ({
  DomainAwareNavigation: ({ currentDomain }: any) => (
    <nav data-testid="domain-navigation" data-domain={currentDomain}>
      Domain Navigation
    </nav>
  ),
}));

jest.mock("@/components/ui/layout/Footer", () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

jest.mock("@/components/ui/feedback/ScrollProgress", () => ({
  ScrollProgress: () => <div data-testid="scroll-progress">Progress</div>,
}));

jest.mock("@/components/features/accessibility/AccessibilityFeatures", () => ({
  AccessibilityFeatures: () => (
    <div data-testid="accessibility-features">A11y</div>
  ),
}));

describe("ConsolidatedLayout", () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue("/test");
    // Mock window.innerWidth for responsive tests
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  describe("Layout Type Detection", () => {
    test("auto-detects main layout for domain pages", () => {
      (usePathname as jest.Mock).mockReturnValue("/cloud-engineering");

      render(
        <ConsolidatedLayout>
          <div>Cloud content</div>
        </ConsolidatedLayout>,
      );

      expect(screen.getByTestId("domain-navigation")).toBeInTheDocument();
      expect(screen.getByText("Cloud content")).toBeInTheDocument();
    });

    test("auto-detects documentation layout for docs pages", () => {
      (usePathname as jest.Mock).mockReturnValue("/docs/api");

      render(
        <ConsolidatedLayout>
          <div>Documentation content</div>
        </ConsolidatedLayout>,
      );

      expect(screen.getByText("Documentation content")).toBeInTheDocument();
      // Documentation layout should have specific structure
      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    test("auto-detects blog layout for blog pages", () => {
      (usePathname as jest.Mock).mockReturnValue("/blog/my-post");

      render(
        <ConsolidatedLayout>
          <div>Blog content</div>
        </ConsolidatedLayout>,
      );

      expect(screen.getByText("Blog content")).toBeInTheDocument();
    });

    test("auto-detects minimal layout for homepage", () => {
      (usePathname as jest.Mock).mockReturnValue("/");

      render(
        <ConsolidatedLayout>
          <div>Homepage content</div>
        </ConsolidatedLayout>,
      );

      expect(screen.getByText("Homepage content")).toBeInTheDocument();
      // Minimal layout should not have navigation
      expect(screen.queryByTestId("domain-navigation")).not.toBeInTheDocument();
    });
  });

  describe("Explicit Layout Types", () => {
    test("respects explicit layout type override", () => {
      (usePathname as jest.Mock).mockReturnValue("/some-page");

      render(
        <ConsolidatedLayout layoutType="documentation">
          <div>Forced documentation layout</div>
        </ConsolidatedLayout>,
      );

      expect(
        screen.getByText("Forced documentation layout"),
      ).toBeInTheDocument();
    });

    test("applies custom configuration", () => {
      render(
        <ConsolidatedLayout
          layoutType="unified"
          config={{
            showSideMenu: true,
            sideMenuContent: "navigation",
            showScrollProgress: false,
          }}
        >
          <div>Custom config content</div>
        </ConsolidatedLayout>,
      );

      expect(screen.getByTestId("side-menu")).toBeInTheDocument();
      expect(screen.getByTestId("side-menu")).toHaveAttribute(
        "data-content",
        "navigation",
      );
      expect(screen.queryByTestId("scroll-progress")).not.toBeInTheDocument();
    });
  });

  describe("Responsive Behavior", () => {
    test("handles mobile viewport", async () => {
      // Mock mobile viewport
      Object.defineProperty(window, "innerWidth", {
        value: 768,
      });

      render(
        <ConsolidatedLayout
          layoutType="unified"
          config={{ showSideMenu: true }}
        >
          <div>Mobile content</div>
        </ConsolidatedLayout>,
      );

      // Trigger resize event
      fireEvent(window, new Event("resize"));

      await waitFor(() => {
        expect(screen.getByTestId("side-menu")).toHaveAttribute(
          "data-collapsed",
          "true",
        );
      });
    });

    test("handles desktop viewport", async () => {
      // Mock desktop viewport
      Object.defineProperty(window, "innerWidth", {
        value: 1200,
      });

      render(
        <ConsolidatedLayout
          layoutType="unified"
          config={{ showSideMenu: true }}
        >
          <div>Desktop content</div>
        </ConsolidatedLayout>,
      );

      // Trigger resize event
      fireEvent(window, new Event("resize"));

      await waitFor(() => {
        expect(screen.getByTestId("side-menu")).toHaveAttribute(
          "data-collapsed",
          "false",
        );
      });
    });
  });

  describe("Interactive Elements", () => {
    test("side menu toggle works", () => {
      render(
        <ConsolidatedLayout
          layoutType="unified"
          config={{ showSideMenu: true }}
        >
          <div>Interactive content</div>
        </ConsolidatedLayout>,
      );

      const toggleButton = screen.getByTestId("sidebar-toggle");
      const sideMenu = screen.getByTestId("side-menu");

      // Initial state
      expect(sideMenu).toHaveAttribute("data-collapsed", "false");

      // Click toggle
      fireEvent.click(toggleButton);

      expect(sideMenu).toHaveAttribute("data-collapsed", "true");
    });

    test("mobile menu toggle works", () => {
      render(
        <ConsolidatedLayout
          layoutType="unified"
          config={{ showSideMenu: true }}
        >
          <div>Mobile menu content</div>
        </ConsolidatedLayout>,
      );

      const menuToggle = screen.getByTestId("menu-toggle");

      // Click should not throw error
      expect(() => fireEvent.click(menuToggle)).not.toThrow();
    });
  });

  describe("Domain-Specific Features", () => {
    test("passes domain to domain-aware navigation", () => {
      render(
        <ConsolidatedLayout layoutType="main" domain="cloud">
          <div>Cloud domain content</div>
        </ConsolidatedLayout>,
      );

      expect(screen.getByTestId("domain-navigation")).toHaveAttribute(
        "data-domain",
        "cloud",
      );
    });

    test("handles undefined domain gracefully", () => {
      render(
        <ConsolidatedLayout layoutType="main">
          <div>No domain content</div>
        </ConsolidatedLayout>,
      );

      expect(screen.getByTestId("domain-navigation")).toBeInTheDocument();
    });
  });

  describe("Loading States", () => {
    test("shows loading skeleton when loading prop is true", () => {
      render(
        <ConsolidatedLayout loading={true}>
          <div>This should not be visible</div>
        </ConsolidatedLayout>,
      );

      expect(
        screen.queryByText("This should not be visible"),
      ).not.toBeInTheDocument();
    });

    test("shows content when loading prop is false", () => {
      render(
        <ConsolidatedLayout loading={false}>
          <div>This should be visible</div>
        </ConsolidatedLayout>,
      );

      expect(screen.getByText("This should be visible")).toBeInTheDocument();
    });
  });

  describe("Accessibility Features", () => {
    test("includes accessibility features by default", () => {
      render(
        <ConsolidatedLayout>
          <div>Accessible content</div>
        </ConsolidatedLayout>,
      );

      expect(screen.getByTestId("accessibility-features")).toBeInTheDocument();
    });

    test("can disable accessibility features", () => {
      render(
        <ConsolidatedLayout config={{ showAccessibilityFeatures: false }}>
          <div>Content without a11y</div>
        </ConsolidatedLayout>,
      );

      expect(
        screen.queryByTestId("accessibility-features"),
      ).not.toBeInTheDocument();
    });

    test("main content has proper accessibility attributes", () => {
      render(
        <ConsolidatedLayout>
          <div>Accessible main content</div>
        </ConsolidatedLayout>,
      );

      const mainContent = screen.getByRole("main");
      expect(mainContent).toHaveAttribute("id", "main-content");
      expect(mainContent).toHaveAttribute("tabIndex", "-1");
    });
  });
});

describe("LayoutProvider", () => {
  test("provides layout without explicit configuration", () => {
    (usePathname as jest.Mock).mockReturnValue("/data-analytics");

    render(
      <LayoutProvider>
        <div>Provider content</div>
      </LayoutProvider>,
    );

    expect(screen.getByText("Provider content")).toBeInTheDocument();
    expect(screen.getByTestId("domain-navigation")).toBeInTheDocument();
  });

  test("accepts layout type override", () => {
    render(
      <LayoutProvider layoutType="minimal">
        <div>Minimal provider content</div>
      </LayoutProvider>,
    );

    expect(screen.getByText("Minimal provider content")).toBeInTheDocument();
    expect(screen.queryByTestId("domain-navigation")).not.toBeInTheDocument();
  });
});

describe("Layout Configuration", () => {
  test("getLayoutConfigForPath returns correct configuration", () => {
    const { layoutType, config } = getLayoutConfigForPath("/docs/api");

    expect(layoutType).toBe("documentation");
    expect(config.showSideMenu).toBe(true);
    expect(config.sideMenuContent).toBe("toc");
  });

  test("handles unknown paths with fallback", () => {
    const { layoutType, config } = getLayoutConfigForPath("/unknown/path");

    expect(layoutType).toBe("unified");
    expect(config.layoutType).toBe("unified");
  });
});

describe("Error Handling", () => {
  test("handles missing dependencies gracefully", () => {
    // Mock console.error to avoid noise in tests
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => {
      render(
        <ConsolidatedLayout>
          <div>Error test content</div>
        </ConsolidatedLayout>,
      );
    }).not.toThrow();

    consoleSpy.mockRestore();
  });

  test("handles invalid layout configuration", () => {
    expect(() => {
      render(
        <ConsolidatedLayout
          layoutType="invalid"
          as
          any
          config={{ invalidProp: true } as any}
        >
          <div>Invalid config content</div>
        </ConsolidatedLayout>,
      );
    }).not.toThrow();
  });
});

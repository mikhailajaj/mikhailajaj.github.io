/**
 * Next.js Layout Integration Tests
 * Comprehensive testing for the enhanced layout system
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { usePathname } from "next/navigation";
import {
  createMainLayout,
  createDocumentationLayout,
  createBlogLayout,
  createNestedLayout,
  withLayout,
  withMainLayout,
  createEnhancedApp,
  hasCustomLayout,
  extractLayoutConfig,
  type NextPageWithLayout,
} from "@/components/layouts/NextJSLayoutIntegration";

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// Mock layout components
jest.mock("@/components/layouts/ConsolidatedLayout", () => ({
  ConsolidatedLayout: ({ children, layoutType, ...props }: any) => (
    <div
      data-testid={`layout-${layoutType}`}
      data-layout-props={JSON.stringify(props)}
    >
      {children}
    </div>
  ),
  LayoutProvider: ({ children }: any) => (
    <div data-testid="layout-provider">{children}</div>
  ),
}));

// Mock other dependencies
jest.mock("@/lib/contexts/ProductionProviders", () => ({
  ProductionDataProviders: ({ children }: any) => <div>{children}</div>,
}));

jest.mock("@/components/ui/AccessibilityToolbar", () => ({
  AccessibilityProvider: ({ children }: any) => <div>{children}</div>,
  AccessibilityToolbar: () => <div data-testid="accessibility-toolbar" />,
}));

describe("NextJS Layout Integration", () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue("/test");
  });

  describe("Layout Factory Functions", () => {
    test("createMainLayout creates correct layout function", () => {
      const getLayout = createMainLayout("cloud", {
        pageTitle: "Cloud Services",
      });

      const page = <div>Test content</div>;
      const { container } = render(getLayout(page));

      expect(screen.getByTestId("layout-main")).toBeInTheDocument();
      expect(container.querySelector("[data-layout-props]")).toHaveAttribute(
        "data-layout-props",
        expect.stringContaining("cloud"),
      );
    });

    test("createDocumentationLayout creates correct layout function", () => {
      const getLayout = createDocumentationLayout(
        "API Docs",
        "Complete API reference",
      );

      const page = <div>Documentation content</div>;
      render(getLayout(page));

      expect(screen.getByTestId("layout-documentation")).toBeInTheDocument();
    });

    test("createBlogLayout creates correct layout function", () => {
      const getLayout = createBlogLayout({
        config: { sideMenuContent: "toc" },
      });

      const page = <div>Blog content</div>;
      render(getLayout(page));

      expect(screen.getByTestId("layout-blog")).toBeInTheDocument();
    });

    test("createNestedLayout creates nested structure", () => {
      const getLayout = createNestedLayout(
        "main",
        "unified",
        { domain: "data" },
        { config: { sideMenuContent: "filters" } },
      );

      const page = <div>Nested content</div>;
      render(getLayout(page));

      expect(screen.getByTestId("layout-main")).toBeInTheDocument();
      expect(screen.getByTestId("layout-unified")).toBeInTheDocument();
    });
  });

  describe("Layout Decorators", () => {
    test("withLayout decorator adds layout to component", () => {
      const TestComponent = () => <div>Test component</div>;
      const WrappedComponent = withLayout(TestComponent, "service");

      expect(WrappedComponent.getLayout).toBeDefined();
      expect(typeof WrappedComponent.getLayout).toBe("function");

      if (WrappedComponent.getLayout) {
        const page = <div>Test</div>;
        render(WrappedComponent.getLayout(page));
        expect(screen.getByTestId("layout-service")).toBeInTheDocument();
      }
    });

    test("withMainLayout decorator adds main layout with domain", () => {
      const TestComponent = () => <div>Test component</div>;
      const WrappedComponent = withMainLayout(TestComponent, "cloud");

      expect(WrappedComponent.getLayout).toBeDefined();

      if (WrappedComponent.getLayout) {
        const page = <div>Test</div>;
        render(WrappedComponent.getLayout(page));
        expect(screen.getByTestId("layout-main")).toBeInTheDocument();
      }
    });
  });

  describe("Enhanced App Component", () => {
    test("enhanced app handles getLayout function", () => {
      const TestPage: NextPageWithLayout = () => <div>Page content</div>;
      TestPage.getLayout = createMainLayout("data");

      const EnhancedApp = createEnhancedApp();
      render(<EnhancedApp Component={TestPage} pageProps={{}} />);

      expect(screen.getByTestId("layout-main")).toBeInTheDocument();
      expect(screen.getByText("Page content")).toBeInTheDocument();
    });

    test("enhanced app handles static layout properties", () => {
      const TestPage: NextPageWithLayout = () => <div>Page content</div>;
      TestPage.layoutType = "documentation";
      TestPage.layoutConfig = { pageTitle: "Test Docs" };

      const EnhancedApp = createEnhancedApp();
      render(<EnhancedApp Component={TestPage} pageProps={{}} />);

      expect(screen.getByTestId("layout-documentation")).toBeInTheDocument();
    });

    test("enhanced app falls back to auto-detection", () => {
      const TestPage = () => <div>Page content</div>;

      const EnhancedApp = createEnhancedApp();
      render(<EnhancedApp Component={TestPage} pageProps={{}} />);

      expect(screen.getByTestId("layout-provider")).toBeInTheDocument();
    });
  });

  describe("Layout Utilities", () => {
    test("hasCustomLayout detects custom layouts", () => {
      const PageWithGetLayout: NextPageWithLayout = () => <div>Test</div>;
      PageWithGetLayout.getLayout = createMainLayout();

      const PageWithStaticLayout: NextPageWithLayout = () => <div>Test</div>;
      PageWithStaticLayout.layoutType = "blog";

      const PageWithoutLayout = () => <div>Test</div>;

      expect(hasCustomLayout(PageWithGetLayout)).toBe(true);
      expect(hasCustomLayout(PageWithStaticLayout)).toBe(true);
      expect(hasCustomLayout(PageWithoutLayout as any)).toBe(false);
    });

    test("extractLayoutConfig extracts layout configuration", () => {
      const TestPage: NextPageWithLayout = () => <div>Test</div>;
      TestPage.layoutType = "unified";
      TestPage.layoutConfig = { pageTitle: "Test Page" };

      const config = extractLayoutConfig(TestPage);

      expect(config.layoutType).toBe("unified");
      expect(config.config?.pageTitle).toBe("Test Page");
      expect(config.hasCustomLayout).toBe(true);
    });
  });

  describe("Layout State Persistence", () => {
    test("layout state persists between page transitions", () => {
      const getLayout = createMainLayout("cloud");

      // First render
      const page1 = <div>Page 1</div>;
      const { rerender } = render(getLayout(page1));

      // Simulate page transition
      const page2 = <div>Page 2</div>;
      rerender(getLayout(page2));

      // Layout should persist (same layout component)
      expect(screen.getByTestId("layout-main")).toBeInTheDocument();
      expect(screen.getByText("Page 2")).toBeInTheDocument();
    });
  });

  describe("Conditional Layouts", () => {
    test("conditional layout selects correct layout", () => {
      const TestPage: NextPageWithLayout = () => <div>Conditional content</div>;

      TestPage.getLayout = function getLayout(page: React.ReactElement) {
        const isAdmin = true; // Mock condition

        return isAdmin
          ? createMainLayout("cloud")(page)
          : createBlogLayout()(page);
      };

      if (TestPage.getLayout) {
        const page = <div>Test</div>;
        render(TestPage.getLayout(page));
        expect(screen.getByTestId("layout-main")).toBeInTheDocument();
      }
    });
  });

  describe("Error Handling", () => {
    test("handles missing layout gracefully", () => {
      const TestPage = () => <div>Page content</div>;
      const EnhancedApp = createEnhancedApp();

      expect(() => {
        render(<EnhancedApp Component={TestPage} pageProps={{}} />);
      }).not.toThrow();

      expect(screen.getByTestId("layout-provider")).toBeInTheDocument();
    });

    test("handles invalid layout configuration", () => {
      const TestPage: NextPageWithLayout = () => <div>Page content</div>;
      TestPage.layoutType = "invalid" as any;

      const EnhancedApp = createEnhancedApp();

      expect(() => {
        render(<EnhancedApp Component={TestPage} pageProps={{}} />);
      }).not.toThrow();
    });
  });

  describe("Performance Optimization", () => {
    test("layout functions are memoizable", () => {
      const getLayout1 = createMainLayout("cloud");
      const getLayout2 = createMainLayout("cloud");

      // Functions should be different instances but produce same result
      expect(getLayout1).not.toBe(getLayout2);

      const page = <div>Test</div>;
      const result1 = getLayout1(page);
      const result2 = getLayout2(page);

      // Results should be equivalent
      expect(result1.type).toBe(result2.type);
    });

    test("nested layouts optimize rendering", () => {
      const getLayout = createNestedLayout("main", "unified");
      const page = <div>Nested content</div>;

      render(getLayout(page));

      // Both layouts should be present
      expect(screen.getByTestId("layout-main")).toBeInTheDocument();
      expect(screen.getByTestId("layout-unified")).toBeInTheDocument();
    });
  });
});

describe("Integration with Existing System", () => {
  test("integrates with consolidated layout system", () => {
    const getLayout = createMainLayout("data", {
      config: {
        showSideMenu: true,
        sideMenuContent: "navigation",
      },
    });

    const page = <div>Integration test</div>;
    render(getLayout(page));

    expect(screen.getByTestId("layout-main")).toBeInTheDocument();
  });

  test("maintains backward compatibility", () => {
    // Test that existing layout patterns still work
    const TestPage = () => <div>Legacy page</div>;
    const EnhancedApp = createEnhancedApp();

    render(<EnhancedApp Component={TestPage} pageProps={{}} />);

    expect(screen.getByTestId("layout-provider")).toBeInTheDocument();
    expect(screen.getByText("Legacy page")).toBeInTheDocument();
  });
});

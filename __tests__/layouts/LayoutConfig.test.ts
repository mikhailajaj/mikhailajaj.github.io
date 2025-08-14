/**
 * Layout Configuration Tests
 * Tests for layout configuration system and path-based detection
 */

import {
  LAYOUT_PRESETS,
  PATH_CONFIGURATIONS,
  getLayoutConfigForPath,
  createLayoutConfig,
  validateLayoutConfig,
  RESPONSIVE_BREAKPOINTS,
  THEME_CONFIGURATIONS,
} from "@/components/layouts/LayoutConfig";
import type {
  LayoutType,
  LayoutConfig,
} from "@/components/layouts/ConsolidatedLayout";

describe("Layout Configuration System", () => {
  describe("Layout Presets", () => {
    test("all layout types have presets", () => {
      const expectedLayoutTypes: LayoutType[] = [
        "main",
        "documentation",
        "blog",
        "service",
        "unified",
        "minimal",
      ];

      expectedLayoutTypes.forEach((layoutType) => {
        expect(LAYOUT_PRESETS[layoutType]).toBeDefined();
        expect(LAYOUT_PRESETS[layoutType].layoutType).toBe(layoutType);
      });
    });

    test("main layout preset has correct configuration", () => {
      const mainLayout = LAYOUT_PRESETS.main;

      expect(mainLayout.navigationType).toBe("domain-aware");
      expect(mainLayout.backgroundType).toBe("solid");
      expect(mainLayout.showSideMenu).toBe(false);
      expect(mainLayout.showFooter).toBe(true);
      expect(mainLayout.showMobileBottomNav).toBe(true);
    });

    test("documentation layout preset has correct configuration", () => {
      const docLayout = LAYOUT_PRESETS.documentation;

      expect(docLayout.navigationType).toBe("none");
      expect(docLayout.showSideMenu).toBe(true);
      expect(docLayout.sideMenuContent).toBe("toc");
      expect(docLayout.showFooter).toBe(false);
    });

    test("blog layout preset has correct configuration", () => {
      const blogLayout = LAYOUT_PRESETS.blog;

      expect(blogLayout.navigationType).toBe("main");
      expect(blogLayout.backgroundType).toBe("animated");
      expect(blogLayout.showVisualEffects).toBe(true);
      expect(blogLayout.zIndexBase).toBe(20);
    });

    test("minimal layout preset has minimal configuration", () => {
      const minimalLayout = LAYOUT_PRESETS.minimal;

      expect(minimalLayout.navigationType).toBe("none");
      expect(minimalLayout.backgroundType).toBe("none");
      expect(minimalLayout.showSideMenu).toBe(false);
      expect(minimalLayout.showFooter).toBe(false);
      expect(minimalLayout.showScrollProgress).toBe(false);
    });
  });

  describe("Path-Based Configuration", () => {
    test("detects homepage as minimal layout", () => {
      const { layoutType, config } = getLayoutConfigForPath("/");

      expect(layoutType).toBe("minimal");
      expect(config.layoutType).toBe("minimal");
    });

    test("detects documentation paths", () => {
      const paths = ["/docs", "/docs/api", "/docs/guides/setup"];

      paths.forEach((path) => {
        const { layoutType, config } = getLayoutConfigForPath(path);
        expect(layoutType).toBe("documentation");
        expect(config.sideMenuContent).toBe("toc");
      });
    });

    test("detects blog paths", () => {
      const { layoutType: listingLayout } = getLayoutConfigForPath("/blog");
      const { layoutType: postLayout } =
        getLayoutConfigForPath("/blog/my-post");

      expect(listingLayout).toBe("blog");
      expect(postLayout).toBe("blog");
    });

    test("detects domain-specific paths", () => {
      const domainPaths = [
        "/cloud-engineering",
        "/data-analytics",
        "/full-stack",
        "/ux-ui-design",
        "/technical-consulting",
        "/experience",
        "/education",
        "/achievements",
      ];

      domainPaths.forEach((path) => {
        const { layoutType } = getLayoutConfigForPath(path);
        expect(layoutType).toBe("main");
      });
    });

    test("detects service paths", () => {
      const servicePaths = [
        "/services",
        "/services/cloud",
        "/services/consulting",
      ];

      servicePaths.forEach((path) => {
        const { layoutType } = getLayoutConfigForPath(path);
        expect(layoutType).toBe("service");
      });
    });

    test("detects project paths as unified", () => {
      const projectPaths = [
        "/projects",
        "/projects/123",
        "/projects/cloud-app",
      ];

      projectPaths.forEach((path) => {
        const { layoutType, config } = getLayoutConfigForPath(path);
        expect(layoutType).toBe("unified");
        expect(config.sideMenuContent).toBe("filters");
      });
    });

    test("falls back to unified for unknown paths", () => {
      const unknownPaths = ["/unknown", "/random/path", "/some/deep/path"];

      unknownPaths.forEach((path) => {
        const { layoutType } = getLayoutConfigForPath(path);
        expect(layoutType).toBe("unified");
      });
    });
  });

  describe("Custom Configuration Creation", () => {
    test("createLayoutConfig merges base and overrides", () => {
      const customConfig = createLayoutConfig("main", {
        showSideMenu: true,
        sideMenuContent: "navigation",
        backgroundType: "gradient",
      });

      expect(customConfig.layoutType).toBe("main");
      expect(customConfig.navigationType).toBe("domain-aware"); // From base
      expect(customConfig.showSideMenu).toBe(true); // Override
      expect(customConfig.sideMenuContent).toBe("navigation"); // Override
      expect(customConfig.backgroundType).toBe("gradient"); // Override
    });

    test("createLayoutConfig preserves base configuration", () => {
      const customConfig = createLayoutConfig("documentation", {
        showScrollProgress: false,
      });

      expect(customConfig.layoutType).toBe("documentation");
      expect(customConfig.showSideMenu).toBe(true); // From base
      expect(customConfig.sideMenuContent).toBe("toc"); // From base
      expect(customConfig.showScrollProgress).toBe(false); // Override
    });
  });

  describe("Configuration Validation", () => {
    test("validates valid configuration", () => {
      const validConfig: Partial<LayoutConfig> = {
        layoutType: "main",
        navigationType: "domain-aware",
        showSideMenu: false,
      };

      const errors = validateLayoutConfig(validConfig);
      expect(errors).toHaveLength(0);
    });

    test("detects invalid layout type", () => {
      const invalidConfig: Partial<LayoutConfig> = {
        layoutType: "invalid" as LayoutType,
      };

      const errors = validateLayoutConfig(invalidConfig);
      expect(errors).toContain("Invalid layoutType: invalid");
    });

    test("detects incompatible navigation type", () => {
      const incompatibleConfig: Partial<LayoutConfig> = {
        layoutType: "blog",
        navigationType: "domain-aware",
      };

      const errors = validateLayoutConfig(incompatibleConfig);
      expect(errors).toContain(
        "Domain-aware navigation is only compatible with main layout type",
      );
    });

    test("detects side menu configuration conflict", () => {
      const conflictConfig: Partial<LayoutConfig> = {
        showSideMenu: true,
        sideMenuContent: "none",
      };

      const errors = validateLayoutConfig(conflictConfig);
      expect(errors).toContain(
        "Side menu is enabled but content type is set to none",
      );
    });

    test("handles multiple validation errors", () => {
      const multiErrorConfig: Partial<LayoutConfig> = {
        layoutType: "invalid" as LayoutType,
        showSideMenu: true,
        sideMenuContent: "none",
      };

      const errors = validateLayoutConfig(multiErrorConfig);
      expect(errors.length).toBeGreaterThan(1);
    });
  });

  describe("Responsive Breakpoints", () => {
    test("defines all required breakpoints", () => {
      expect(RESPONSIVE_BREAKPOINTS.mobile).toBeDefined();
      expect(RESPONSIVE_BREAKPOINTS.tablet).toBeDefined();
      expect(RESPONSIVE_BREAKPOINTS.desktop).toBeDefined();
      expect(RESPONSIVE_BREAKPOINTS.large).toBeDefined();
      expect(RESPONSIVE_BREAKPOINTS.xlarge).toBeDefined();
    });

    test("breakpoints have correct format", () => {
      Object.values(RESPONSIVE_BREAKPOINTS).forEach((breakpoint) => {
        expect(typeof breakpoint).toBe("string");
        expect(breakpoint).toMatch(/\(.*\)/); // Should contain media query syntax
      });
    });
  });

  describe("Theme Configurations", () => {
    test("defines light and dark themes", () => {
      expect(THEME_CONFIGURATIONS.light).toBeDefined();
      expect(THEME_CONFIGURATIONS.dark).toBeDefined();
    });

    test("themes have required properties", () => {
      const requiredProps = [
        "background",
        "text",
        "border",
        "sidebar",
        "navigation",
      ];

      [THEME_CONFIGURATIONS.light, THEME_CONFIGURATIONS.dark].forEach(
        (theme) => {
          requiredProps.forEach((prop) => {
            expect(theme[prop as keyof typeof theme]).toBeDefined();
            expect(typeof theme[prop as keyof typeof theme]).toBe("string");
          });
        },
      );
    });

    test("theme classes are valid Tailwind CSS", () => {
      const tailwindPattern = /^(bg-|text-|border-)/;

      Object.values(THEME_CONFIGURATIONS).forEach((theme) => {
        Object.values(theme).forEach((className) => {
          expect(className).toMatch(tailwindPattern);
        });
      });
    });
  });

  describe("Path Configuration Patterns", () => {
    test("path patterns are valid", () => {
      PATH_CONFIGURATIONS.forEach((config) => {
        expect(config.pattern).toBeDefined();
        expect(config.layoutType).toBeDefined();

        if (typeof config.pattern === "string") {
          expect(config.pattern.length).toBeGreaterThan(0);
        } else {
          expect(config.pattern).toBeInstanceOf(RegExp);
        }
      });
    });

    test("path patterns match expected routes", () => {
      const testCases = [
        { path: "/", expectedType: "minimal" },
        { path: "/docs/api", expectedType: "documentation" },
        { path: "/blog", expectedType: "blog" },
        { path: "/blog/my-post", expectedType: "blog" },
        { path: "/projects/123", expectedType: "unified" },
        { path: "/cloud-engineering", expectedType: "main" },
        { path: "/services/cloud", expectedType: "service" },
      ];

      testCases.forEach(({ path, expectedType }) => {
        const { layoutType } = getLayoutConfigForPath(path);
        expect(layoutType).toBe(expectedType);
      });
    });
  });

  describe("Configuration Merging", () => {
    test("path-specific config overrides base config", () => {
      const { config } = getLayoutConfigForPath("/projects/filters");

      // Should have unified base config
      expect(config.layoutType).toBe("unified");
      expect(config.navigationType).toBe("top");

      // Should have path-specific override
      expect(config.sideMenuContent).toBe("filters");
      expect(config.showPageHeader).toBe(true);
    });

    test("preserves base config when no overrides", () => {
      const { config } = getLayoutConfigForPath("/cloud-engineering");

      // Should match main preset exactly
      const mainPreset = LAYOUT_PRESETS.main;
      expect(config.navigationType).toBe(mainPreset.navigationType);
      expect(config.backgroundType).toBe(mainPreset.backgroundType);
      expect(config.showFooter).toBe(mainPreset.showFooter);
    });
  });
});

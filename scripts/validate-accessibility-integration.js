#!/usr/bin/env node

/**
 * Accessibility Integration Validation Script
 * Phase 1: Integration & Testing - Validation
 */

const fs = require("fs");
const path = require("path");

console.log("🚀 Accessibility Integration Validation Starting...\n");

// Color codes for console output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  header: (msg) =>
    console.log(`${colors.bold}${colors.blue}\n=== ${msg} ===${colors.reset}`),
};

// Validation results
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  details: [],
};

function addResult(type, message, details = "") {
  results[type]++;
  results.details.push({ type, message, details });

  switch (type) {
    case "passed":
      log.success(message);
      break;
    case "failed":
      log.error(message);
      break;
    case "warnings":
      log.warning(message);
      break;
  }

  if (details) {
    console.log(`   ${details}`);
  }
}

// File existence checks
function checkFileExists(filePath, description) {
  log.header(`Checking ${description}`);

  if (fs.existsSync(filePath)) {
    addResult("passed", `${description} exists at ${filePath}`);
    return true;
  } else {
    addResult("failed", `${description} missing at ${filePath}`);
    return false;
  }
}

// File content validation
function validateFileContent(filePath, patterns, description) {
  if (!fs.existsSync(filePath)) {
    addResult("failed", `Cannot validate ${description} - file missing`);
    return false;
  }

  const content = fs.readFileSync(filePath, "utf8");
  let allPassed = true;

  patterns.forEach(({ pattern, name, required = true }) => {
    const regex = new RegExp(pattern, "i");
    if (regex.test(content)) {
      addResult("passed", `${description}: ${name} found`);
    } else {
      if (required) {
        addResult("failed", `${description}: ${name} missing`);
        allPassed = false;
      } else {
        addResult("warnings", `${description}: ${name} not found (optional)`);
      }
    }
  });

  return allPassed;
}

// Main validation function
async function validateIntegration() {
  log.header("Phase 1: Integration & Testing Validation");

  // 1. Check core files exist
  log.header("File Existence Validation");

  const coreFiles = [
    {
      path: "components/ui/AccessibilityToolbar.tsx",
      desc: "Enhanced Accessibility Component",
    },
    {
      path: "app/enhanced-accessibility.css",
      desc: "Enhanced Accessibility CSS",
    },
    { path: "app/layout.tsx", desc: "Next.js Layout" },
    {
      path: "__tests__/accessibility/AccessibilityToolbar.test.tsx",
      desc: "Component Tests",
    },
    {
      path: "__tests__/accessibility/performance.test.tsx",
      desc: "Performance Tests",
    },
    {
      path: "docs/plan/ACCESSIBILITY-ENHANCEMENT-MASTER-PLAN.md",
      desc: "Master Plan",
    },
  ];

  coreFiles.forEach(({ path: filePath, desc }) => {
    checkFileExists(filePath, desc);
  });

  // 2. Validate component implementation
  log.header("Component Implementation Validation");

  const componentPatterns = [
    {
      pattern: "interface AccessibilityPreferences",
      name: "TypeScript interfaces",
      required: true,
    },
    {
      pattern: "cursor.*normal.*big.*reading-guide",
      name: "Cursor enhancement options",
      required: true,
    },
    {
      pattern: "desaturate.*boolean",
      name: "Desaturate feature",
      required: true,
    },
    {
      pattern: "highlightLinks.*boolean",
      name: "Link highlighting feature",
      required: true,
    },
    {
      pattern: "legibleFonts.*boolean",
      name: "Legible fonts feature",
      required: true,
    },
    {
      pattern: "textToSpeech.*boolean",
      name: "Text-to-speech feature",
      required: true,
    },
    {
      pattern: "React\\.memo",
      name: "Performance optimization (React.memo)",
      required: true,
    },
    {
      pattern: "useCallback",
      name: "Performance optimization (useCallback)",
      required: true,
    },
    {
      pattern: "useMemo",
      name: "Performance optimization (useMemo)",
      required: true,
    },
    {
      pattern: "requestAnimationFrame",
      name: "DOM update optimization",
      required: true,
    },
    {
      pattern: "aria-expanded",
      name: "ARIA accessibility attributes",
      required: true,
    },
    { pattern: 'role="switch"', name: "Proper ARIA roles", required: true },
  ];

  validateFileContent(
    "components/ui/AccessibilityToolbar.tsx",
    componentPatterns,
    "Accessibility Component",
  );

  // 3. Validate CSS implementation
  log.header("CSS Implementation Validation");

  const cssPatterns = [
    {
      pattern: "\\[data-font-size",
      name: "Font size data attributes",
      required: true,
    },
    {
      pattern: "\\[data-contrast",
      name: "Contrast data attributes",
      required: true,
    },
    {
      pattern: "accessibility-desaturate",
      name: "Desaturate CSS class",
      required: true,
    },
    {
      pattern: "accessibility-highlight-links",
      name: "Link highlighting CSS",
      required: true,
    },
    {
      pattern: "accessibility-legible-fonts",
      name: "Legible fonts CSS",
      required: true,
    },
    {
      pattern: "accessibility-big-cursor",
      name: "Big cursor CSS",
      required: true,
    },
    {
      pattern: "accessibility-reading-guide",
      name: "Reading guide CSS",
      required: true,
    },
    {
      pattern: "filter.*grayscale",
      name: "Desaturation filter",
      required: true,
    },
    {
      pattern: "prefers-reduced-motion",
      name: "Motion preference support",
      required: true,
    },
    {
      pattern: "@media.*max-width.*768px",
      name: "Mobile responsiveness",
      required: true,
    },
  ];

  validateFileContent(
    "app/enhanced-accessibility.css",
    cssPatterns,
    "Enhanced CSS",
  );

  // 4. Validate layout integration
  log.header("Layout Integration Validation");

  const layoutPatterns = [
    {
      pattern: "import.*enhanced-accessibility\\.css",
      name: "CSS import",
      required: true,
    },
    {
      pattern: "import.*AccessibilityProvider.*AccessibilityToolbar",
      name: "Component imports",
      required: true,
    },
    {
      pattern: "<AccessibilityProvider>",
      name: "Provider wrapper",
      required: true,
    },
    {
      pattern: "<AccessibilityToolbar",
      name: "Toolbar component",
      required: true,
    },
  ];

  validateFileContent("app/layout.tsx", layoutPatterns, "Layout Integration");

  // 5. Validate test coverage
  log.header("Test Coverage Validation");

  const testPatterns = [
    {
      pattern: "describe.*AccessibilityProvider",
      name: "Provider tests",
      required: true,
    },
    {
      pattern: "describe.*AccessibilityToolbar",
      name: "Toolbar tests",
      required: true,
    },
    {
      pattern: "describe.*Performance",
      name: "Performance tests",
      required: true,
    },
    {
      pattern: "test.*keyboard.*shortcut",
      name: "Keyboard navigation tests",
      required: true,
    },
    {
      pattern: "test.*localStorage",
      name: "Storage persistence tests",
      required: true,
    },
    {
      pattern: "test.*ARIA",
      name: "Accessibility compliance tests",
      required: true,
    },
    {
      pattern: "expect.*toBeLessThan.*100",
      name: "Performance budget tests",
      required: true,
    },
  ];

  const componentTestExists = validateFileContent(
    "__tests__/accessibility/AccessibilityToolbar.test.tsx",
    testPatterns,
    "Component Tests",
  );
  const performanceTestExists = fs.existsSync(
    "__tests__/accessibility/performance.test.tsx",
  );

  if (performanceTestExists) {
    addResult("passed", "Performance test suite exists");
  } else {
    addResult("failed", "Performance test suite missing");
  }

  // 6. Check package.json for required dependencies
  log.header("Dependency Validation");

  if (fs.existsSync("package.json")) {
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    const requiredDeps = [
      "react",
      "framer-motion",
      "react-icons",
      "@testing-library/react",
      "@testing-library/jest-dom",
      "@testing-library/user-event",
    ];

    requiredDeps.forEach((dep) => {
      if (dependencies[dep]) {
        addResult("passed", `Required dependency: ${dep}`);
      } else {
        addResult(
          "warnings",
          `Missing dependency: ${dep} (may need installation)`,
        );
      }
    });
  } else {
    addResult("failed", "package.json not found");
  }

  // 7. Validate TypeScript configuration
  log.header("TypeScript Configuration Validation");

  if (fs.existsSync("tsconfig.json")) {
    addResult("passed", "TypeScript configuration exists");

    const tsConfig = JSON.parse(fs.readFileSync("tsconfig.json", "utf8"));
    if (tsConfig.compilerOptions && tsConfig.compilerOptions.strict) {
      addResult("passed", "Strict TypeScript mode enabled");
    } else {
      addResult("warnings", "Strict TypeScript mode not enabled");
    }
  } else {
    addResult("warnings", "TypeScript configuration missing");
  }

  // 8. Generate final report
  log.header("Validation Summary");

  console.log(`\n${colors.bold}📊 VALIDATION RESULTS:${colors.reset}`);
  console.log(`${colors.green}✅ Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}❌ Failed: ${results.failed}${colors.reset}`);
  console.log(
    `${colors.yellow}⚠️  Warnings: ${results.warnings}${colors.reset}`,
  );

  const totalChecks = results.passed + results.failed + results.warnings;
  const successRate = ((results.passed / totalChecks) * 100).toFixed(1);

  console.log(`\n${colors.bold}Success Rate: ${successRate}%${colors.reset}`);

  // Determine overall status
  if (results.failed === 0) {
    if (results.warnings === 0) {
      log.success("\n🎉 PHASE 1 VALIDATION: PERFECT! All checks passed.");
      console.log(
        `${colors.green}${colors.bold}✨ Ready to proceed to Phase 2: Text-to-Speech Implementation${colors.reset}`,
      );
    } else {
      log.warning("\n✅ PHASE 1 VALIDATION: PASSED with warnings.");
      console.log(
        `${colors.yellow}⚠️  Please review warnings before proceeding to Phase 2${colors.reset}`,
      );
    }
  } else {
    log.error("\n❌ PHASE 1 VALIDATION: FAILED");
    console.log(
      `${colors.red}🔧 Please fix failed checks before proceeding${colors.reset}`,
    );
  }

  // Generate detailed report
  console.log(`\n${colors.bold}📋 DETAILED REPORT:${colors.reset}`);
  results.details.forEach(({ type, message, details }, index) => {
    const icon = type === "passed" ? "✅" : type === "failed" ? "❌" : "⚠️";
    console.log(`${index + 1}. ${icon} ${message}`);
    if (details) console.log(`   ${details}`);
  });

  // Next steps
  console.log(`\n${colors.bold}🚀 NEXT STEPS:${colors.reset}`);

  if (results.failed === 0) {
    console.log(
      `${colors.green}1. Run tests: npm test -- __tests__/accessibility/${colors.reset}`,
    );
    console.log(
      `${colors.green}2. Start development server: npm run dev${colors.reset}`,
    );
    console.log(
      `${colors.green}3. Test accessibility features manually${colors.reset}`,
    );
    console.log(
      `${colors.green}4. Proceed to Phase 2: Text-to-Speech Implementation${colors.reset}`,
    );
  } else {
    console.log(`${colors.red}1. Fix failed validation checks${colors.reset}`);
    console.log(
      `${colors.red}2. Re-run validation: node scripts/validate-accessibility-integration.js${colors.reset}`,
    );
    console.log(
      `${colors.red}3. Ensure all core files are properly integrated${colors.reset}`,
    );
  }

  return results.failed === 0;
}

// Run validation
validateIntegration()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    log.error(`Validation failed with error: ${error.message}`);
    process.exit(1);
  });

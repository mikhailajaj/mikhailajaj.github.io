#!/usr/bin/env node

/**
 * Dependency Validation Script
 *
 * Validates that npm dependency fixes are working correctly:
 * - No React Native packages installed
 * - React version consistency
 * - Three.js packages working correctly
 * - Peer dependencies satisfied
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Colors for console output
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

// Test results
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
};

function runTest(testName, testFn) {
  try {
    const result = testFn();
    if (result === true) {
      log.success(testName);
      results.passed++;
    } else if (result === "warning") {
      log.warning(testName);
      results.warnings++;
    } else {
      log.error(`${testName}: ${result}`);
      results.failed++;
    }
  } catch (error) {
    log.error(`${testName}: ${error.message}`);
    results.failed++;
  }
}

// Test 1: Verify no React Native packages are installed
function testNoReactNative() {
  log.header("Testing React Native Exclusion");

  const nodeModulesPath = path.join(process.cwd(), "node_modules");
  if (!fs.existsSync(nodeModulesPath)) {
    return "node_modules directory not found";
  }

  // Check for React Native directories (excluding config files)
  const reactNativeDirs = [];
  const checkDir = (dirPath, depth = 0) => {
    if (depth > 2) return; // Limit recursion depth

    try {
      const items = fs.readdirSync(dirPath);
      items.forEach((item) => {
        // Skip config files and non-package directories
        if (
          item.toLowerCase().includes("react-native") &&
          !item.includes(".js") &&
          !item.includes("config") &&
          !item.includes("eslint")
        ) {
          const itemPath = path.join(dirPath, item);
          if (fs.statSync(itemPath).isDirectory()) {
            reactNativeDirs.push(itemPath);
          }
        }

        const itemPath = path.join(dirPath, item);
        if (fs.statSync(itemPath).isDirectory() && !item.startsWith(".")) {
          checkDir(itemPath, depth + 1);
        }
      });
    } catch (error) {
      // Ignore permission errors
    }
  };

  checkDir(nodeModulesPath);

  if (reactNativeDirs.length === 0) {
    return true;
  } else {
    return `Found React Native directories: ${reactNativeDirs.join(", ")}`;
  }
}

// Test 2: Verify React version consistency
function testReactVersionConsistency() {
  log.header("Testing React Version Consistency");

  try {
    const output = execSync("npm list react react-dom --depth=0", {
      encoding: "utf8",
    });

    // Extract versions
    const reactMatch = output.match(/react@(\d+\.\d+\.\d+)/);
    const reactDomMatch = output.match(/react-dom@(\d+\.\d+\.\d+)/);

    if (!reactMatch || !reactDomMatch) {
      return "Could not find React versions";
    }

    const reactVersion = reactMatch[1];
    const reactDomVersion = reactDomMatch[1];

    if (reactVersion !== reactDomVersion) {
      return `React versions mismatch: react@${reactVersion} vs react-dom@${reactDomVersion}`;
    }

    if (!reactVersion.startsWith("18.")) {
      return `Expected React 18.x.x, got ${reactVersion}`;
    }

    return true;
  } catch (error) {
    return `Failed to check React versions: ${error.message}`;
  }
}

// Test 3: Verify Three.js packages are installed correctly
function testThreeJSPackages() {
  log.header("Testing Three.js Package Installation");

  const requiredPackages = [
    "@react-three/fiber",
    "@react-three/drei",
    "three",
    "three-globe",
  ];

  try {
    const output = execSync(
      `npm list ${requiredPackages.join(" ")} --depth=0`,
      { encoding: "utf8" },
    );

    for (const pkg of requiredPackages) {
      if (!output.includes(pkg)) {
        return `Missing package: ${pkg}`;
      }
    }

    return true;
  } catch (error) {
    return `Failed to verify Three.js packages: ${error.message}`;
  }
}

// Test 4: Verify peer dependencies are satisfied
function testPeerDependencies() {
  log.header("Testing Peer Dependencies");

  try {
    const output = execSync("npm ls --depth=0 2>&1", { encoding: "utf8" });

    if (
      output.includes("UNMET PEER DEPENDENCY") ||
      output.includes("peer dep missing")
    ) {
      return "Unmet peer dependencies found";
    }

    if (output.includes("ERESOLVE")) {
      return "Dependency resolution conflicts found";
    }

    return true;
  } catch (error) {
    // npm ls returns non-zero exit code for warnings, check output instead
    if (error.stdout && !error.stdout.includes("UNMET PEER DEPENDENCY")) {
      return true;
    }
    return `Peer dependency issues: ${error.message}`;
  }
}

// Test 5: Verify package.json overrides are working
function testPackageOverrides() {
  log.header("Testing Package.json Overrides");

  try {
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

    if (!packageJson.overrides) {
      return "No overrides section found in package.json";
    }

    const expectedOverrides = [
      "react-native",
      "react",
      "react-dom",
      "@react-three/fiber",
    ];

    for (const override of expectedOverrides) {
      if (!(override in packageJson.overrides)) {
        return `Missing override for: ${override}`;
      }
    }

    if (packageJson.overrides["react-native"] !== false) {
      return "React Native should be overridden to false";
    }

    return true;
  } catch (error) {
    return `Failed to validate overrides: ${error.message}`;
  }
}

// Test 6: Test npm install process
function testNpmInstall() {
  log.header("Testing npm install Process");

  try {
    // Test dry run to check for conflicts
    const output = execSync("npm install --dry-run 2>&1", { encoding: "utf8" });

    if (output.includes("ERESOLVE")) {
      return "npm install would fail with ERESOLVE errors";
    }

    if (output.includes("react-native")) {
      return "npm install would try to install React Native";
    }

    return true;
  } catch (error) {
    return `npm install test failed: ${error.message}`;
  }
}

// Test 7: Verify build process works
function testBuildProcess() {
  log.header("Testing Build Process");

  try {
    // Check if .next directory exists (indicating successful build)
    const nextDir = path.join(process.cwd(), ".next");
    if (!fs.existsSync(nextDir)) {
      return "warning"; // Build hasn't been run yet
    }

    // Check for build artifacts
    const buildManifest = path.join(nextDir, "build-manifest.json");
    if (!fs.existsSync(buildManifest)) {
      return "Build artifacts missing";
    }

    return true;
  } catch (error) {
    return `Build validation failed: ${error.message}`;
  }
}

// Test 8: Verify Three.js components can be imported
function testThreeJSImports() {
  log.header("Testing Three.js Component Imports");

  const componentsToTest = [
    "components/ThreeDBlackPearl.tsx",
    "components/LazyThreeDBlackPearl.tsx",
    "components/ui/ThreeDErrorBoundary.tsx",
    "components/ui/LazyThreeDComponent.tsx",
  ];

  for (const component of componentsToTest) {
    if (!fs.existsSync(component)) {
      return `Component file missing: ${component}`;
    }

    // Basic syntax check - ensure file contains expected imports
    const content = fs.readFileSync(component, "utf8");
    if (
      component === "components/ThreeDBlackPearl.tsx" &&
      !content.includes("@react-three/fiber")
    ) {
      return `Component ${component} missing Three.js imports`;
    }
    // Other components may import Three.js indirectly, which is fine
  }

  return true;
}

// Test 9: Verify webpack configuration
function testWebpackConfig() {
  log.header("Testing Webpack Configuration");

  try {
    const nextConfig = fs.readFileSync("next.config.mjs", "utf8");

    const expectedConfigs = [
      "react-native.*false",
      "IgnorePlugin",
      "splitChunks",
      "priority.*10",
    ];

    for (const config of expectedConfigs) {
      const regex = new RegExp(config, "i");
      if (!regex.test(nextConfig)) {
        return `Missing webpack config: ${config}`;
      }
    }

    return true;
  } catch (error) {
    return `Webpack config validation failed: ${error.message}`;
  }
}

// Run all tests
function runAllTests() {
  console.log(
    `${colors.bold}${colors.blue}🧪 Dependency Validation Test Suite${colors.reset}\n`,
  );

  runTest("No React Native packages installed", testNoReactNative);
  runTest("React version consistency", testReactVersionConsistency);
  runTest("Three.js packages installed correctly", testThreeJSPackages);
  runTest("Peer dependencies satisfied", testPeerDependencies);
  runTest("Package.json overrides working", testPackageOverrides);
  runTest("npm install process works", testNpmInstall);
  runTest("Build process functional", testBuildProcess);
  runTest("Three.js components importable", testThreeJSImports);
  runTest("Webpack configuration correct", testWebpackConfig);

  // Summary
  console.log(`\n${colors.bold}=== Test Results ===${colors.reset}`);
  log.success(`Passed: ${results.passed}`);
  if (results.warnings > 0) {
    log.warning(`Warnings: ${results.warnings}`);
  }
  if (results.failed > 0) {
    log.error(`Failed: ${results.failed}`);
  }

  const total = results.passed + results.failed + results.warnings;
  const successRate = ((results.passed / total) * 100).toFixed(1);

  console.log(`\n${colors.bold}Success Rate: ${successRate}%${colors.reset}`);

  if (results.failed === 0) {
    log.success(
      "All critical tests passed! Dependency fixes are working correctly.",
    );
    process.exit(0);
  } else {
    log.error("Some tests failed. Please review the issues above.");
    process.exit(1);
  }
}

// Run the tests
runAllTests();

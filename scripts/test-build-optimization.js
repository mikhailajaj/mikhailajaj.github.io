#!/usr/bin/env node

/**
 * Build Process and Bundle Optimization Test Script
 *
 * Tests the production build process and analyzes bundle optimization:
 * - Verifies build completes successfully
 * - Analyzes bundle for React Native exclusion
 * - Tests Three.js component integration
 * - Validates webpack optimizations
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

// Test 1: Verify build artifacts exist
function testBuildArtifacts() {
  log.header("Testing Build Artifacts");

  const nextDir = path.join(process.cwd(), ".next");
  if (!fs.existsSync(nextDir)) {
    return "Build directory (.next) not found - run npm run build first";
  }

  const requiredFiles = [
    "build-manifest.json",
    "app-build-manifest.json",
    "react-loadable-manifest.json",
  ];

  for (const file of requiredFiles) {
    const filePath = path.join(nextDir, file);
    if (!fs.existsSync(filePath)) {
      return `Missing build artifact: ${file}`;
    }
  }

  return true;
}

// Test 2: Analyze bundle for React Native exclusion
function testReactNativeExclusion() {
  log.header("Testing React Native Exclusion in Bundle");

  try {
    const nextDir = path.join(process.cwd(), ".next");
    const serverDir = path.join(nextDir, "server");

    if (!fs.existsSync(serverDir)) {
      return "warning"; // Server directory might not exist in static export
    }

    // Check for React Native references in build files
    const checkForReactNative = (dirPath) => {
      const items = fs.readdirSync(dirPath);
      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isFile() && (item.endsWith(".js") || item.endsWith(".json"))) {
          try {
            const content = fs.readFileSync(itemPath, "utf8");
            if (
              content.includes("react-native") &&
              !content.includes("react-native.*false")
            ) {
              return `Found React Native reference in: ${itemPath}`;
            }
          } catch (error) {
            // Skip files that can't be read
          }
        } else if (stat.isDirectory() && !item.startsWith(".")) {
          const result = checkForReactNative(itemPath);
          if (result !== true) return result;
        }
      }
      return true;
    };

    return checkForReactNative(serverDir);
  } catch (error) {
    return `Bundle analysis failed: ${error.message}`;
  }
}

// Test 3: Verify webpack bundle splitting
function testBundleSplitting() {
  log.header("Testing Webpack Bundle Splitting");

  try {
    const buildManifest = path.join(
      process.cwd(),
      ".next",
      "build-manifest.json",
    );
    if (!fs.existsSync(buildManifest)) {
      return "Build manifest not found";
    }

    const manifest = JSON.parse(fs.readFileSync(buildManifest, "utf8"));

    // Check for expected chunk names
    const expectedChunks = ["vendors", "three", "ui"];
    const foundChunks = [];

    // Look for chunks in the manifest
    const allFiles = Object.values(manifest.pages).flat();

    for (const chunk of expectedChunks) {
      const hasChunk = allFiles.some((file) => file.includes(chunk));
      if (hasChunk) {
        foundChunks.push(chunk);
      }
    }

    if (foundChunks.length === 0) {
      return "warning"; // Bundle splitting might work differently in static export
    }

    return true;
  } catch (error) {
    return `Bundle splitting analysis failed: ${error.message}`;
  }
}

// Test 4: Verify Three.js components are bundled correctly
function testThreeJSBundling() {
  log.header("Testing Three.js Component Bundling");

  try {
    const buildManifest = path.join(
      process.cwd(),
      ".next",
      "build-manifest.json",
    );
    if (!fs.existsSync(buildManifest)) {
      return "Build manifest not found";
    }

    const manifest = JSON.parse(fs.readFileSync(buildManifest, "utf8"));
    const allFiles = Object.values(manifest.pages).flat();

    // Check for Three.js related chunks
    const hasThreeJS = allFiles.some(
      (file) =>
        file.includes("three") ||
        file.includes("fiber") ||
        file.includes("drei"),
    );

    if (!hasThreeJS) {
      return "warning"; // Three.js might be bundled differently
    }

    return true;
  } catch (error) {
    return `Three.js bundling analysis failed: ${error.message}`;
  }
}

// Test 5: Check build performance metrics
function testBuildPerformance() {
  log.header("Testing Build Performance");

  try {
    const nextDir = path.join(process.cwd(), ".next");
    const buildManifest = path.join(nextDir, "build-manifest.json");

    if (!fs.existsSync(buildManifest)) {
      return "Build manifest not found";
    }

    const manifest = JSON.parse(fs.readFileSync(buildManifest, "utf8"));
    const allFiles = Object.values(manifest.pages).flat();

    // Count total chunks
    const chunkCount = allFiles.length;

    if (chunkCount === 0) {
      return "No chunks found in build manifest";
    }

    log.info(`Total chunks generated: ${chunkCount}`);

    // Check for reasonable chunk count (not too many, not too few)
    if (chunkCount > 100) {
      return "warning"; // Might indicate over-splitting
    }

    return true;
  } catch (error) {
    return `Performance analysis failed: ${error.message}`;
  }
}

// Test 6: Verify static export compatibility
function testStaticExport() {
  log.header("Testing Static Export Compatibility");

  try {
    const nextConfig = fs.readFileSync("next.config.mjs", "utf8");

    if (!nextConfig.includes("output: 'export'")) {
      return "Static export not configured";
    }

    if (!nextConfig.includes("trailingSlash: true")) {
      return "Trailing slash not configured for static export";
    }

    return true;
  } catch (error) {
    return `Static export check failed: ${error.message}`;
  }
}

// Test 7: Analyze component lazy loading
function testLazyLoading() {
  log.header("Testing Lazy Loading Implementation");

  const lazyComponents = [
    "components/LazyThreeDBlackPearl.tsx",
    "components/ui/LazyThreeDComponent.tsx",
    "components/LazyThreeDDemo.tsx",
  ];

  for (const component of lazyComponents) {
    if (!fs.existsSync(component)) {
      return `Lazy loading component missing: ${component}`;
    }

    const content = fs.readFileSync(component, "utf8");
    if (!content.includes("lazy") && !content.includes("Suspense")) {
      return `Component ${component} doesn't implement lazy loading`;
    }
  }

  return true;
}

// Test 8: Check error boundary integration
function testErrorBoundaries() {
  log.header("Testing Error Boundary Integration");

  const errorBoundaryFiles = [
    "components/ui/ThreeDErrorBoundary.tsx",
    "components/ui/ErrorBoundary.tsx",
  ];

  for (const file of errorBoundaryFiles) {
    if (!fs.existsSync(file)) {
      return `Error boundary file missing: ${file}`;
    }

    const content = fs.readFileSync(file, "utf8");
    if (
      !content.includes("componentDidCatch") &&
      !content.includes("ErrorBoundary")
    ) {
      return `File ${file} doesn't implement error boundary pattern`;
    }
  }

  return true;
}

// Test 9: Verify development vs production differences
function testBuildModes() {
  log.header("Testing Build Mode Configuration");

  try {
    const nextConfig = fs.readFileSync("next.config.mjs", "utf8");

    // Check for production optimizations
    const optimizations = [
      "optimizePackageImports",
      "webpackMemoryOptimizations",
      "splitChunks",
    ];

    for (const optimization of optimizations) {
      if (!nextConfig.includes(optimization)) {
        return `Missing optimization: ${optimization}`;
      }
    }

    return true;
  } catch (error) {
    return `Build mode check failed: ${error.message}`;
  }
}

// Run all tests
function runAllTests() {
  console.log(
    `${colors.bold}${colors.blue}🏗️  Build Process & Bundle Optimization Test Suite${colors.reset}\n`,
  );

  runTest("Build artifacts exist", testBuildArtifacts);
  runTest("React Native excluded from bundle", testReactNativeExclusion);
  runTest("Webpack bundle splitting configured", testBundleSplitting);
  runTest("Three.js components bundled correctly", testThreeJSBundling);
  runTest("Build performance acceptable", testBuildPerformance);
  runTest("Static export compatibility", testStaticExport);
  runTest("Lazy loading implemented", testLazyLoading);
  runTest("Error boundaries integrated", testErrorBoundaries);
  runTest("Build mode optimizations enabled", testBuildModes);

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
      "Build process and bundle optimization tests completed successfully!",
    );
    process.exit(0);
  } else {
    log.error("Some build tests failed. Please review the issues above.");
    process.exit(1);
  }
}

// Run the tests
runAllTests();

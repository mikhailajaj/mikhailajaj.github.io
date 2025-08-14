#!/usr/bin/env node

/**
 * Documentation Validation Script (Consolidation-aware)
 *
 * Validates documentation files for:
 * - Broken links
 * - Missing files referenced in documentation
 * - Code examples syntax
 * - Required sections in key docs (root README, CONTRIBUTING, DEPLOYMENT, SECURITY, architecture README)
 *
 * Usage: npm run docs:validate
 */

const fs = require("fs");
const path = require("path");

// Colors for console output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateFileExists(filePath) {
  return fs.existsSync(filePath);
}

function validateMarkdownStructure(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const issues = [];

  const relPath = path
    .relative(process.cwd(), filePath)
    .replace(/\\/g, "/"); // normalize windows paths

  // Required sections for specific docs (by path)
  const rootRequired = {
    "README.md": ["Table of Contents", "Quick Start", "Installation"],
    "CONTRIBUTING.md": [
      "Getting Started",
      "Code of Conduct",
      "Pull Request",
    ],
    "DEPLOYMENT.md": ["Prerequisites", "Environment"],
    "SECURITY.md": ["Reporting Security Vulnerabilities"],
  };

  const archRequired = {
    "docs/architecture/README.md": [
      "Contents",
      // Narrative docs do not require strict headings beyond contents
    ],
  };

  const requiredSections = rootRequired[relPath] || archRequired[relPath];

  if (requiredSections) {
    requiredSections.forEach((section) => {
      if (!content.includes(section)) {
        issues.push(`Missing required section: ${section}`);
      }
    });
  }

  // Remove code blocks to avoid parsing links within them
  const contentWithoutCodeBlocks = content.replace(/```[\s\S]*?```/g, "");

  // Check for broken internal links (skip anchor links)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  while ((match = linkRegex.exec(contentWithoutCodeBlocks)) !== null) {
    const linkPath = match[2];
    // Skip anchor links (starting with #), external links, and mailto links
    if (
      !linkPath.startsWith("#") &&
      !linkPath.includes("://") &&
      !linkPath.startsWith("mailto:")
    ) {
      if (
        linkPath.startsWith("./") ||
        linkPath.startsWith("../") ||
        !linkPath.includes("/")
      ) {
        const fullPath = path.resolve(path.dirname(filePath), linkPath);
        if (!validateFileExists(fullPath)) {
          issues.push(`Broken internal link: ${linkPath}`);
        }
      }
    }
  }

  return issues;
}

function validateCodeExamples(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const issues = [];

  // Find code blocks
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let match;
  while ((match = codeBlockRegex.exec(content)) !== null) {
    const language = match[1];
    const code = match[2];

    // Basic syntax validation for common languages
    if (language === "javascript" || language === "typescript") {
      // Check for basic syntax issues
      if (code.includes("function") && !code.includes("{")) {
        issues.push("Potential syntax error in code block");
      }
    }

    if (language === "json") {
      try {
        JSON.parse(code);
      } catch (e) {
        issues.push("Invalid JSON in code block");
      }
    }
  }

  return issues;
}

function main() {
  log("🔍 Starting documentation validation...", "blue");

  const docsToValidate = [
    "README.md",
    "CONTRIBUTING.md",
    "DEPLOYMENT.md",
    "SECURITY.md",
    "docs/README.md",
    "docs/api-reference.md",
    "docs/technical/README.md",
    "docs/architecture/README.md",
  ];

  let totalIssues = 0;

  docsToValidate.forEach((docPath) => {
    if (!validateFileExists(docPath)) {
      log(`❌ File not found: ${docPath}`, "red");
      totalIssues++;
      return;
    }

    log(`\n📄 Validating ${docPath}...`, "blue");

    // Validate markdown structure
    const structureIssues = validateMarkdownStructure(docPath);
    if (structureIssues.length > 0) {
      log(`  Structure issues:`, "yellow");
      structureIssues.forEach((issue) => {
        log(`    - ${issue}`, "red");
        totalIssues++;
      });
    }

    // Validate code examples
    const codeIssues = validateCodeExamples(docPath);
    if (codeIssues.length > 0) {
      log(`  Code issues:`, "yellow");
      codeIssues.forEach((issue) => {
        log(`    - ${issue}`, "red");
        totalIssues++;
      });
    }

    if (structureIssues.length === 0 && codeIssues.length === 0) {
      log(`  ✅ No issues found`, "green");
    }
  });

  // Check for required architecture files
  log(`\n🏗️ Validating architecture documentation...`, "blue");
  const archFiles = [
    "docs/architecture/system-overview.md",
    "docs/architecture/component-hierarchy.md",
    "docs/architecture/caching-strategy.md",
    "docs/architecture/performance-monitoring.md",
    "docs/architecture/app-component-structure-analysis.md",
  ];

  archFiles.forEach((archFile) => {
    if (!validateFileExists(archFile)) {
      log(`❌ Missing architecture file: ${archFile}`, "red");
      totalIssues++;
    } else {
      log(`✅ Found: ${archFile}`, "green");
    }
  });

  // Summary
  log(`\n📊 Validation Summary:`, "blue");
  if (totalIssues === 0) {
    log(`✅ All documentation validation checks passed!`, "green");
    process.exit(0);
  } else {
    log(`❌ Found ${totalIssues} issue(s) in documentation`, "red");
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  validateFileExists,
  validateMarkdownStructure,
  validateCodeExamples,
};

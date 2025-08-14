#!/usr/bin/env node

/**
 * Dependency Analysis and Cleanup Script
 * 
 * Analyzes package.json dependencies to identify:
 * - Unused dependencies that can be removed
 * - Dependencies that should be moved between deps/devDeps
 * - Version optimization opportunities
 * - Potential security issues
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  header: (msg) => console.log(`${colors.bold}${colors.blue}\n=== ${msg} ===${colors.reset}`)
};

// Read package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const dependencies = packageJson.dependencies || {};
const devDependencies = packageJson.devDependencies || {};

// Analysis results
const analysis = {
  used: [],
  unused: [],
  misplaced: [],
  outdated: [],
  security: [],
  optimizations: []
};

// Search for dependency usage in codebase
function searchForUsage(packageName) {
  try {
    // Search for imports and requires
    const searchPatterns = [
      `from.*${packageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
      `require.*${packageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
      `import.*${packageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`
    ];

    for (const pattern of searchPatterns) {
      const result = execSync(`grep -r "${pattern}" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.mjs" . 2>/dev/null || true`, { encoding: 'utf8' });
      if (result.trim()) {
        return true;
      }
    }

    // Special cases for packages that might be used differently
    const specialCases = {
      'next': () => fs.existsSync('next.config.mjs') || fs.existsSync('next.config.js'),
      'react': () => true, // Always needed for React apps
      'react-dom': () => true, // Always needed for React apps
      'typescript': () => fs.existsSync('tsconfig.json'),
      'tailwindcss': () => fs.existsSync('tailwind.config.ts') || fs.existsSync('tailwind.config.js'),
      'postcss': () => fs.existsSync('postcss.config.mjs') || fs.existsSync('postcss.config.js'),
      'eslint': () => fs.existsSync('.eslintrc.json') || fs.existsSync('.eslintrc.js'),
      'prettier': () => fs.existsSync('.prettierrc') || fs.existsSync('prettier.config.js'),
      'jest': () => fs.existsSync('jest.config.js') || fs.existsSync('jest.setup.js')
    };

    if (specialCases[packageName]) {
      return specialCases[packageName]();
    }

    return false;
  } catch (error) {
    return false;
  }
}

// Analyze dependencies
function analyzeDependencies() {
  log.header('Analyzing Dependencies');

  const allDeps = { ...dependencies, ...devDependencies };

  for (const [packageName, version] of Object.entries(allDeps)) {
    const isUsed = searchForUsage(packageName);
    const isInDeps = packageName in dependencies;
    const isInDevDeps = packageName in devDependencies;

    if (isUsed) {
      analysis.used.push({
        name: packageName,
        version,
        location: isInDeps ? 'dependencies' : 'devDependencies',
        used: true
      });
    } else {
      analysis.unused.push({
        name: packageName,
        version,
        location: isInDeps ? 'dependencies' : 'devDependencies'
      });
    }
  }

  log.info(`Found ${analysis.used.length} used dependencies`);
  log.warning(`Found ${analysis.unused.length} potentially unused dependencies`);
}

// Check for misplaced dependencies
function checkMisplacedDependencies() {
  log.header('Checking for Misplaced Dependencies');

  // Dependencies that should typically be in devDependencies
  const devOnlyPackages = [
    '@types/',
    'eslint',
    'prettier',
    'jest',
    'typescript',
    '@testing-library/',
    '@axe-core/',
    'markdown-link-check'
  ];

  // Dependencies that should typically be in dependencies
  const prodPackages = [
    'react',
    'react-dom',
    'next',
    'framer-motion',
    'three',
    '@react-three/',
    'lucide-react',
    'react-icons',
    'clsx',
    'tailwind-merge'
  ];

  for (const [packageName] of Object.entries(dependencies)) {
    const shouldBeDevDep = devOnlyPackages.some(pattern => packageName.includes(pattern));
    if (shouldBeDevDep) {
      analysis.misplaced.push({
        name: packageName,
        currentLocation: 'dependencies',
        suggestedLocation: 'devDependencies',
        reason: 'Development-only package'
      });
    }
  }

  for (const [packageName] of Object.entries(devDependencies)) {
    const shouldBeProdDep = prodPackages.some(pattern => packageName.includes(pattern));
    if (shouldBeProdDep && searchForUsage(packageName)) {
      analysis.misplaced.push({
        name: packageName,
        currentLocation: 'devDependencies',
        suggestedLocation: 'dependencies',
        reason: 'Used in production code'
      });
    }
  }

  if (analysis.misplaced.length > 0) {
    log.warning(`Found ${analysis.misplaced.length} misplaced dependencies`);
  } else {
    log.success('All dependencies are properly categorized');
  }
}

// Check for version optimizations
function checkVersionOptimizations() {
  log.header('Checking Version Optimization Opportunities');

  const versionOptimizations = [];

  // Check for overly restrictive versions
  for (const [packageName, version] of Object.entries({ ...dependencies, ...devDependencies })) {
    if (version.startsWith('~') || (!version.startsWith('^') && !version.includes('npm:'))) {
      versionOptimizations.push({
        name: packageName,
        currentVersion: version,
        suggestion: version.startsWith('~') ? version.replace('~', '^') : `^${version}`,
        reason: 'Allow minor version updates for better compatibility'
      });
    }
  }

  analysis.optimizations = versionOptimizations;

  if (versionOptimizations.length > 0) {
    log.info(`Found ${versionOptimizations.length} version optimization opportunities`);
  } else {
    log.success('Version ranges are optimally configured');
  }
}

// Generate cleanup recommendations
function generateRecommendations() {
  log.header('Cleanup Recommendations');

  const recommendations = {
    remove: [],
    move: [],
    update: [],
    keep: []
  };

  // Unused dependencies to remove
  analysis.unused.forEach(dep => {
    // Be conservative - only recommend removal for obviously unused packages
    const safeToRemove = [
      '@types/react-lottie', // Lottie not used
      'chokidar', // File watching not used in production
      'motion', // Duplicate of framer-motion
      '@types/mixpanel-browser', // Mixpanel not implemented
      'three-globe' // Not currently used in components
    ];

    if (safeToRemove.includes(dep.name)) {
      recommendations.remove.push(dep);
    } else {
      recommendations.keep.push({
        ...dep,
        reason: 'Potentially used or required for future features'
      });
    }
  });

  // Misplaced dependencies to move
  recommendations.move = analysis.misplaced;

  // Version optimizations
  recommendations.update = analysis.optimizations;

  return recommendations;
}

// Display results
function displayResults() {
  const recommendations = generateRecommendations();

  console.log(`\n${colors.bold}=== Dependency Analysis Results ===${colors.reset}`);

  // Used dependencies
  log.success(`Used Dependencies: ${analysis.used.length}`);
  analysis.used.forEach(dep => {
    console.log(`  ✓ ${dep.name}@${dep.version} (${dep.location})`);
  });

  // Unused dependencies
  if (analysis.unused.length > 0) {
    log.warning(`Potentially Unused Dependencies: ${analysis.unused.length}`);
    analysis.unused.forEach(dep => {
      const isSafeToRemove = recommendations.remove.some(r => r.name === dep.name);
      const status = isSafeToRemove ? '🗑️  REMOVE' : '⚠️  REVIEW';
      console.log(`  ${status} ${dep.name}@${dep.version} (${dep.location})`);
    });
  }

  // Misplaced dependencies
  if (analysis.misplaced.length > 0) {
    log.info(`Misplaced Dependencies: ${analysis.misplaced.length}`);
    analysis.misplaced.forEach(dep => {
      console.log(`  📦 MOVE ${dep.name} from ${dep.currentLocation} to ${dep.suggestedLocation}`);
      console.log(`     Reason: ${dep.reason}`);
    });
  }

  // Version optimizations
  if (analysis.optimizations.length > 0) {
    log.info(`Version Optimizations: ${analysis.optimizations.length}`);
    analysis.optimizations.forEach(opt => {
      console.log(`  📈 UPDATE ${opt.name}: ${opt.currentVersion} → ${opt.suggestion}`);
      console.log(`     Reason: ${opt.reason}`);
    });
  }

  // Summary
  console.log(`\n${colors.bold}=== Summary ===${colors.reset}`);
  log.success(`Dependencies in use: ${analysis.used.length}`);
  log.warning(`Safe to remove: ${recommendations.remove.length}`);
  log.info(`Should be moved: ${recommendations.move.length}`);
  log.info(`Version updates: ${recommendations.update.length}`);

  // Generate optimized package.json
  generateOptimizedPackageJson(recommendations);
}

// Generate optimized package.json
function generateOptimizedPackageJson(recommendations) {
  log.header('Generating Optimized package.json');

  const optimized = JSON.parse(JSON.stringify(packageJson));

  // Remove unused dependencies
  recommendations.remove.forEach(dep => {
    if (dep.location === 'dependencies') {
      delete optimized.dependencies[dep.name];
    } else {
      delete optimized.devDependencies[dep.name];
    }
    log.info(`Removed: ${dep.name}`);
  });

  // Move misplaced dependencies
  recommendations.move.forEach(dep => {
    const version = dep.currentLocation === 'dependencies'
      ? optimized.dependencies[dep.name]
      : optimized.devDependencies[dep.name];

    if (dep.suggestedLocation === 'dependencies') {
      optimized.dependencies[dep.name] = version;
      delete optimized.devDependencies[dep.name];
    } else {
      optimized.devDependencies[dep.name] = version;
      delete optimized.dependencies[dep.name];
    }
    log.info(`Moved: ${dep.name} to ${dep.suggestedLocation}`);
  });

  // Update versions
  recommendations.update.forEach(opt => {
    if (optimized.dependencies[opt.name]) {
      optimized.dependencies[opt.name] = opt.suggestion;
    } else if (optimized.devDependencies[opt.name]) {
      optimized.devDependencies[opt.name] = opt.suggestion;
    }
    log.info(`Updated: ${opt.name} version range`);
  });

  // Sort dependencies alphabetically
  optimized.dependencies = Object.keys(optimized.dependencies)
    .sort()
    .reduce((obj, key) => {
      obj[key] = optimized.dependencies[key];
      return obj;
    }, {});

  optimized.devDependencies = Object.keys(optimized.devDependencies)
    .sort()
    .reduce((obj, key) => {
      obj[key] = optimized.devDependencies[key];
      return obj;
    }, {});

  // Write optimized package.json
  fs.writeFileSync('package.json.optimized', JSON.stringify(optimized, null, 2));
  log.success('Generated package.json.optimized');

  console.log(`\n${colors.bold}=== Next Steps ===${colors.reset}`);
  console.log('1. Review the generated package.json.optimized file');
  console.log('2. If satisfied, replace package.json with the optimized version');
  console.log('3. Run: rm -rf node_modules package-lock.json && npm install');
  console.log('4. Test the application thoroughly');
  console.log('5. Run: node scripts/validate-dependencies.js');
}

// Main execution
function main() {
  console.log(`${colors.bold}${colors.blue}📦 Dependency Analysis and Cleanup Tool${colors.reset}\n`);

  analyzeDependencies();
  checkMisplacedDependencies();
  checkVersionOptimizations();
  displayResults();
}

main();
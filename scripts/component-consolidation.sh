#!/bin/bash

# Component Consolidation Script
# Automates the process of consolidating similar components

set -e

echo "🚀 Starting Component Consolidation Process..."
echo "Current component count: $(find components/ -name "*.tsx" | wc -l)"

# Phase 1: Analyze current usage
echo "📊 Phase 1: Analyzing component usage..."

# Create analysis directory
mkdir -p analysis/component-usage

# Find all component imports
echo "Finding component imports..."
grep -r "import.*from.*@/components" app/ --include="*.tsx" > analysis/component-usage/imports.txt

# Count usage frequency
echo "Analyzing usage frequency..."
grep -r "import.*from.*@/components" app/ --include="*.tsx" | \
  sed 's/.*from.*@\/components\///g' | \
  sed 's/['"'"'"].*//g' | \
  sort | uniq -c | sort -nr > analysis/component-usage/frequency.txt

echo "📈 Top 10 most used components:"
head -10 analysis/component-usage/frequency.txt

# Phase 2: Identify consolidation candidates
echo "🔍 Phase 2: Identifying consolidation candidates..."

# Find domain-specific hero components
echo "Domain Hero Components:"
find components/domain-specific/ -name "*Hero.tsx" | tee analysis/component-usage/domain-heroes.txt

# Find service components
echo "Service Components:"
find components/domain-specific/ -name "*Services.tsx" | tee analysis/component-usage/service-components.txt

# Find button variants
echo "Button Components:"
find components/ -name "*Button*.tsx" | tee analysis/component-usage/button-components.txt

# Find demo/showcase components
echo "Demo/Showcase Components:"
find components/ -name "*Demo*.tsx" -o -name "*Showcase*.tsx" -o -name "*Example*.tsx" | \
  tee analysis/component-usage/demo-components.txt

# Phase 3: Create consolidation plan
echo "📋 Phase 3: Creating consolidation plan..."

cat > analysis/CONSOLIDATION_PLAN.md << 'EOF'
# Component Consolidation Plan

## High Priority Consolidations

### 1. Domain Hero Components
**Files to consolidate:**
EOF

cat analysis/component-usage/domain-heroes.txt >> analysis/CONSOLIDATION_PLAN.md

cat >> analysis/CONSOLIDATION_PLAN.md << 'EOF'

**Target:** Create single `DomainHero.tsx` component
**Savings:** 4 components
**Risk:** Low (similar patterns)

### 2. Service Components
**Files to consolidate:**
EOF

cat analysis/component-usage/service-components.txt >> analysis/CONSOLIDATION_PLAN.md

cat >> analysis/CONSOLIDATION_PLAN.md << 'EOF'

**Target:** Create single `ServiceGrid.tsx` component
**Savings:** 10+ components
**Risk:** Medium (different layouts)

### 3. Button Components
**Files to consolidate:**
EOF

cat analysis/component-usage/button-components.txt >> analysis/CONSOLIDATION_PLAN.md

cat >> analysis/CONSOLIDATION_PLAN.md << 'EOF'

**Target:** Create single `UniversalButton.tsx` component
**Savings:** 4+ components
**Risk:** Medium (different behaviors)

## Low Priority (Remove/Merge)

### Demo/Showcase Components
**Files to remove/merge:**
EOF

cat analysis/component-usage/demo-components.txt >> analysis/CONSOLIDATION_PLAN.md

echo "✅ Analysis complete! Check analysis/ directory for detailed results."
echo ""
echo "📊 Summary:"
echo "- Total components: $(find components/ -name "*.tsx" | wc -l)"
echo "- Domain heroes: $(cat analysis/component-usage/domain-heroes.txt | wc -l)"
echo "- Service components: $(cat analysis/component-usage/service-components.txt | wc -l)"
echo "- Button variants: $(cat analysis/component-usage/button-components.txt | wc -l)"
echo "- Demo components: $(cat analysis/component-usage/demo-components.txt | wc -l)"
echo ""
echo "🎯 Potential savings: ~25 components (11% reduction)"
echo ""
echo "Next steps:"
echo "1. Review analysis/CONSOLIDATION_PLAN.md"
echo "2. Run: ./scripts/consolidate-domain-heroes.sh"
echo "3. Run: ./scripts/consolidate-service-components.sh"
echo "4. Run: ./scripts/remove-demo-components.sh"
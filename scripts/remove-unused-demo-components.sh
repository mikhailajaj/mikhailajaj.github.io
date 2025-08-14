#!/bin/bash

# Remove Unused Demo Components Script
# Removes only demo components that are not referenced anywhere

set -e

echo "🧹 Removing Unused Demo Components..."
echo "Strategy: Remove components with zero usage, handle showcase pages separately"

# Create backup directory
mkdir -p analysis/demo-removal-backup

# List of demo components that are NOT used in app/ pages
unused_demos=(
    "components/ui/ThemeButtonDemo.tsx"
    "components/ui/QuickIntegrationExample.tsx" 
    "components/ui/DomainAnimationShowcase.tsx"
    "components/ui/AnimationDemoLink.tsx"
    "components/ShipShowcase.tsx"
    "components/LazyThreeDDemo.tsx"
    "components/features/conversion/CaseStudyShowcase.tsx"
    "components/features/ui-showcase/ComponentShowcase.tsx"
    "components/features/ui-showcase/IntegrationExamples.tsx"
    "components/UXDesignShowcase.tsx"
    "components/examples/AnimationIntegrationExamples.tsx"
    "components/interactive/ProjectDemo.tsx"
    "components/interactive/DatabaseDemo.tsx"
    "components/ScrollAnimationDemo.tsx"
)

# Components used by showcase pages (handle separately)
showcase_components=(
    "components/features/sally-showcase/SallyAdvancedDemo.tsx"
    "components/examples/ErrorHandlingExample.tsx"
    "components/examples/ButtonShowcase.tsx"
    "components/accessibility/AccessibilityDemo.tsx"
)

echo "🗑️  Removing unused demo components..."
removed_count=0

for component in "${unused_demos[@]}"; do
    if [ -f "$component" ]; then
        component_name=$(basename "$component")
        echo "📦 Backing up: $component_name"
        cp "$component" "analysis/demo-removal-backup/"
        
        echo "🗑️  Removing: $component"
        rm "$component"
        removed_count=$((removed_count + 1))
    else
        echo "⚠️  Not found: $component"
    fi
done

echo ""
echo "🎯 Handling showcase page components..."

# Option 1: Keep showcase components but mark them clearly
echo "📝 Updating showcase components with clear documentation..."

for component in "${showcase_components[@]}"; do
    if [ -f "$component" ]; then
        component_name=$(basename "$component")
        echo "📝 Documenting: $component_name as showcase-only"
        
        # Add comment to top of file indicating it's showcase-only
        temp_file=$(mktemp)
        echo "/**" > "$temp_file"
        echo " * SHOWCASE COMPONENT - Development/Demo Only" >> "$temp_file"
        echo " * This component is used only for demonstration purposes" >> "$temp_file"
        echo " * in showcase pages and can be removed in production builds" >> "$temp_file"
        echo " */" >> "$temp_file"
        echo "" >> "$temp_file"
        cat "$component" >> "$temp_file"
        mv "$temp_file" "$component"
    fi
done

echo ""
echo "✅ Demo component cleanup complete!"
echo ""
echo "📊 RESULTS:"
echo "• Unused components removed: $removed_count"
echo "• Showcase components documented: ${#showcase_components[@]}"
echo "• Backup location: analysis/demo-removal-backup/"
echo "• Bundle size reduction: ~30KB estimated"

echo ""
echo "📈 Component count update:"
current_count=$(find components/ -name "*.tsx" | wc -l)
echo "• Current components: $current_count"
echo "• Original count: 229"
echo "• Total reduction: $((229 - current_count)) components"

echo ""
echo "🎯 SHOWCASE PAGES STATUS:"
echo "The following pages contain demo components:"
echo "• /sally-showcase - SallyAdvancedDemo"
echo "• /error-handling-showcase - ErrorHandlingExample" 
echo "• /button-showcase - ButtonShowcase"
echo "• /accessibility - AccessibilityDemo"
echo ""
echo "💡 OPTIONS FOR SHOWCASE PAGES:"
echo "1. Keep as-is (documented as demo-only)"
echo "2. Remove showcase pages entirely"
echo "3. Convert to documentation examples"

echo ""
echo "🚀 NEXT CONSOLIDATION TARGETS:"
echo "1. Service components: 5 → 1 (-4 components)"
echo "2. Button consolidation: 12 → 1 (-11 components)" 
echo "3. Remove showcase pages: -4 more components"
echo ""
echo "💰 TOTAL POTENTIAL REMAINING: ~19 components (8% more reduction)"
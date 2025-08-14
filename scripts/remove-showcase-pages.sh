#!/bin/bash

# Remove Showcase Pages Script
# Removes development-only showcase pages and their components

set -e

echo "🗑️ Removing Showcase Pages..."
echo "Target: Remove 4 showcase pages and their components (zero risk)"

# Create backup directory
mkdir -p analysis/showcase-removal-backup
echo "📁 Created backup directory: analysis/showcase-removal-backup"

# List showcase pages and components to remove
showcase_pages=(
    "app/sally-showcase"
    "app/error-handling-showcase" 
    "app/button-showcase"
    "app/accessibility"
)

showcase_components=(
    "components/features/sally-showcase/SallyAdvancedDemo.tsx"
    "components/examples/ErrorHandlingExample.tsx"
    "components/examples/ButtonShowcase.tsx"
    "components/accessibility/AccessibilityDemo.tsx"
)

echo "🔍 Showcase pages to remove:"
for page in "${showcase_pages[@]}"; do
    if [ -d "$page" ]; then
        echo "  • $page (exists)"
    else
        echo "  • $page (not found)"
    fi
done

echo ""
echo "🔍 Showcase components to remove:"
for component in "${showcase_components[@]}"; do
    if [ -f "$component" ]; then
        echo "  • $component (exists)"
    else
        echo "  • $component (not found)"
    fi
done

echo ""
echo "📦 Backing up showcase pages and components..."

# Backup and remove showcase pages
removed_pages=0
for page in "${showcase_pages[@]}"; do
    if [ -d "$page" ]; then
        page_name=$(basename "$page")
        echo "📦 Backing up page: $page_name"
        cp -r "$page" "analysis/showcase-removal-backup/"
        
        echo "🗑️  Removing page: $page"
        rm -rf "$page"
        removed_pages=$((removed_pages + 1))
    fi
done

# Backup and remove showcase components
removed_components=0
for component in "${showcase_components[@]}"; do
    if [ -f "$component" ]; then
        component_name=$(basename "$component")
        echo "📦 Backing up component: $component_name"
        cp "$component" "analysis/showcase-removal-backup/"
        
        echo "🗑️  Removing component: $component"
        rm "$component"
        removed_components=$((removed_components + 1))
    fi
done

# Remove empty directories
echo "🧹 Cleaning up empty directories..."
find components/ -type d -empty -delete 2>/dev/null || true

echo ""
echo "✅ Showcase page removal complete!"
echo ""
echo "📊 REMOVAL RESULTS:"
echo "• Showcase pages removed: $removed_pages"
echo "• Showcase components removed: $removed_components"
echo "• Total items removed: $((removed_pages + removed_components))"
echo "• Backup location: analysis/showcase-removal-backup/"
echo "• Bundle size reduction: ~20KB estimated"

echo ""
echo "📈 Component count update:"
current_count=$(find components/ -name "*.tsx" | wc -l)
echo "• Current components: $current_count"
echo "• Previous count: 202 (estimated)"
echo "• Reduction this phase: $removed_components components"

echo ""
echo "🎯 PROGRESS TO GOAL:"
total_removed=$((27 + removed_components))
remaining=$((229 - current_count))
target_remaining=$((current_count - 188))
echo "• Total components removed: $remaining"
echo "• Components remaining to target (188): $target_remaining"
echo "• Progress to goal: $(( (remaining * 100) / 41 ))%"

echo ""
echo "🚀 NEXT CONSOLIDATION OPPORTUNITIES:"
echo "1. 🔄 Complete Service Migration (-4 components)"
echo "2. 🧹 Duplicate Utilities Cleanup (-6 components)"
echo "3. 🗂️ Additional optimizations"
echo ""
echo "🏁 Getting closer to the 188-component finish line!"
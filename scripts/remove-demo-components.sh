#!/bin/bash

# Remove Demo Components Script
# Safely removes development-only demo and showcase components

set -e

echo "🧹 Starting Demo Component Removal Process..."
echo "Target: Remove 19 demo/showcase components (development-only)"

# Create backup directory
mkdir -p analysis/demo-removal-backup
echo "📁 Created backup directory: analysis/demo-removal-backup"

# List all demo components found in analysis
echo "🔍 Demo components to remove:"
cat analysis/component-usage/demo-components.txt

echo ""
echo "📋 Analyzing demo component usage..."

# Check if demo components are imported in app/ pages
echo "🔍 Checking for demo component usage in app/ pages..."
demo_usage_count=0

while IFS= read -r component_file; do
    if [ -f "$component_file" ]; then
        component_name=$(basename "$component_file" .tsx)
        usage_count=$(grep -r "import.*$component_name" app/ --include="*.tsx" 2>/dev/null | wc -l || echo "0")
        if [ "$usage_count" -gt 0 ]; then
            echo "⚠️  $component_name is used in $usage_count app/ files"
            demo_usage_count=$((demo_usage_count + 1))
        fi
    fi
done < analysis/component-usage/demo-components.txt

echo ""
if [ "$demo_usage_count" -eq 0 ]; then
    echo "✅ Safe to remove: No demo components are used in app/ pages"
    echo ""
    echo "🗑️  Removing demo components..."
    
    # Backup and remove demo components
    removed_count=0
    while IFS= read -r component_file; do
        if [ -f "$component_file" ]; then
            component_name=$(basename "$component_file")
            echo "📦 Backing up: $component_name"
            cp "$component_file" "analysis/demo-removal-backup/"
            
            echo "🗑️  Removing: $component_file"
            rm "$component_file"
            removed_count=$((removed_count + 1))
        fi
    done < analysis/component-usage/demo-components.txt
    
    echo ""
    echo "✅ Demo component removal complete!"
    echo "📊 Results:"
    echo "• Components removed: $removed_count"
    echo "• Backup location: analysis/demo-removal-backup/"
    echo "• Bundle size reduction: ~50KB estimated"
    
else
    echo "⚠️  Cannot safely remove demo components"
    echo "   $demo_usage_count demo components are still in use"
    echo ""
    echo "🔍 Manual review required for:"
    while IFS= read -r component_file; do
        if [ -f "$component_file" ]; then
            component_name=$(basename "$component_file" .tsx)
            usage_count=$(grep -r "import.*$component_name" app/ --include="*.tsx" 2>/dev/null | wc -l || echo "0")
            if [ "$usage_count" -gt 0 ]; then
                echo "   • $component_name (used in $usage_count files)"
                grep -r "import.*$component_name" app/ --include="*.tsx" 2>/dev/null | head -2
            fi
        fi
    done < analysis/component-usage/demo-components.txt
fi

echo ""
echo "📈 Component count after removal:"
current_count=$(find components/ -name "*.tsx" | wc -l)
echo "• Current components: $current_count"
echo "• Original count: 229"
echo "• Total reduction so far: $((229 - current_count)) components"

echo ""
echo "🎯 Next consolidation opportunities:"
echo "1. Service components: 5 → 1 (-4 components)"
echo "2. Button consolidation: 12 → 1 (-11 components)"
echo "3. Duplicate utilities: ~6 components"
echo ""
echo "💡 Potential remaining: ~21 more components (9% additional reduction)"
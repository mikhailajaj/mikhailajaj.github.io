#!/bin/bash

# Cleanup Duplicate Utilities Script
# Identifies and removes duplicate utility components

set -e

echo "🧹 Cleaning Up Duplicate Utilities..."
echo "Target: Remove 6 duplicate utility components (30-minute quick win)"

# Create backup directory
mkdir -p analysis/duplicate-cleanup-backup
echo "📁 Created backup directory: analysis/duplicate-cleanup-backup"

echo ""
echo "🔍 Scanning for duplicate utilities..."

# Find ErrorBoundary duplicates
echo "📋 ErrorBoundary components:"
find . -name "*ErrorBoundary*" -type f | grep -v node_modules | grep -v .git

# Find Font provider duplicates  
echo ""
echo "📋 Font provider components:"
find . -name "*Font*" -type f | grep -v node_modules | grep -v .git | grep -E "\.(tsx|ts)$"

# Find Dynamic loader duplicates
echo ""
echo "📋 Dynamic loader components:"
find . -name "*Dynamic*" -o -name "*Loader*" | grep -v node_modules | grep -v .git | grep -E "\.(tsx|ts)$"

echo ""
echo "🎯 Identifying specific duplicates to remove..."

# Define duplicates to remove (keep the best version)
duplicates_to_remove=(
    # ErrorBoundary duplicates - keep lib/error/ErrorBoundary.tsx
    "components/ui/ErrorBoundary.tsx"
    
    # Font provider duplicates - keep components/ui/SmartFontProvider.tsx
    "components/ui/ClientFontOptimizer.tsx"
    "components/ui/FontErrorBoundary.tsx"
    "components/ui/FontLoadingIndicator.tsx"
    
    # Dynamic loader duplicates - keep components/ui/DynamicLoader.tsx
    "components/ui/ClientDynamicLoader.tsx"
)

echo "🗑️ Duplicates to remove:"
removed_count=0
for duplicate in "${duplicates_to_remove[@]}"; do
    if [ -f "$duplicate" ]; then
        echo "  • $duplicate (exists)"
        
        # Backup the file
        filename=$(basename "$duplicate")
        echo "📦 Backing up: $filename"
        cp "$duplicate" "analysis/duplicate-cleanup-backup/"
        
        # Remove the duplicate
        echo "🗑️  Removing: $duplicate"
        rm "$duplicate"
        removed_count=$((removed_count + 1))
    else
        echo "  • $duplicate (not found)"
    fi
done

echo ""
echo "🔧 Updating import statements..."

# Update imports to use the canonical versions
echo "📝 Updating ErrorBoundary imports..."
find app/ components/ -name "*.tsx" -type f -exec grep -l "components/ui/ErrorBoundary" {} \; | while read file; do
    if [ -f "$file" ]; then
        echo "  Updating: $file"
        sed -i.bak 's|@/components/ui/ErrorBoundary|@/lib/error/ErrorBoundary|g' "$file"
    fi
done

echo "📝 Updating font provider imports..."
find app/ components/ -name "*.tsx" -type f -exec grep -l "ClientFontOptimizer\|FontErrorBoundary\|FontLoadingIndicator" {} \; | while read file; do
    if [ -f "$file" ]; then
        echo "  Updating: $file"
        sed -i.bak 's/ClientFontOptimizer/SmartFontProvider/g' "$file"
        sed -i.bak 's/FontErrorBoundary/SmartFontProvider/g' "$file"
        sed -i.bak 's/FontLoadingIndicator/SmartFontProvider/g' "$file"
    fi
done

echo "📝 Updating dynamic loader imports..."
find app/ components/ -name "*.tsx" -type f -exec grep -l "ClientDynamicLoader" {} \; | while read file; do
    if [ -f "$file" ]; then
        echo "  Updating: $file"
        sed -i.bak 's/ClientDynamicLoader/DynamicLoader/g' "$file"
    fi
done

# Clean up empty directories
echo "🧹 Cleaning up empty directories..."
find components/ -type d -empty -delete 2>/dev/null || true

echo ""
echo "✅ Duplicate utilities cleanup complete!"
echo ""
echo "📊 CLEANUP RESULTS:"
echo "• Duplicate components removed: $removed_count"
echo "• Import statements updated automatically"
echo "• Backup location: analysis/duplicate-cleanup-backup/"
echo "• Bundle size reduction: ~15KB estimated"

echo ""
echo "📈 Component count update:"
current_count=$(find components/ -name "*.tsx" | wc -l)
echo "• Current components: $current_count"
echo "• Previous count: 214"
echo "• Reduction this phase: $removed_count components"

echo ""
echo "🎯 PROGRESS TO GOAL:"
remaining_to_target=$((current_count - 188))
total_removed=$((229 - current_count))
progress_percent=$(( (total_removed * 100) / 41 ))
echo "• Total components removed: $total_removed"
echo "• Components remaining to target (188): $remaining_to_target"
echo "• Progress to goal: $progress_percent%"

echo ""
echo "🚀 NEXT OPPORTUNITIES:"
if [ "$remaining_to_target" -le 20 ]; then
    echo "🎉 EXCELLENT! Only $remaining_to_target components left to reach 188!"
    echo "1. 🔄 Complete Service Migration (-4 components)"
    echo "2. 🗂️ Final optimizations (-$((remaining_to_target - 4)) components)"
    echo ""
    echo "🏁 FINISH LINE IS VERY CLOSE!"
else
    echo "1. 🔄 Complete Service Migration (-4 components)"
    echo "2. 🧹 Additional cleanup opportunities"
    echo "3. 🗂️ Layout and navigation consolidation"
fi
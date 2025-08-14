#!/bin/bash

# Manual Search Script - Efficient information retrieval from technical manual
# Usage: ./scripts/manual-search.sh [search-term] [--type=component|troubleshooting|framework] [--format=json|summary]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Default values
SEARCH_TERM=""
TYPE="all"
FORMAT="summary"
MANUAL_DIR="manual"
FRAMEWORK_DIR="manual/framework"

# Help function
show_help() {
    echo -e "${CYAN}Manual Search Script${NC}"
    echo -e "${YELLOW}Usage:${NC} ./scripts/manual-search.sh [search-term] [options]"
    echo ""
    echo -e "${YELLOW}Options:${NC}"
    echo "  --type=TYPE        Search type: component, troubleshooting, framework, data, all (default: all)"
    echo "  --format=FORMAT    Output format: json, summary, detailed (default: summary)"
    echo "  --help            Show this help message"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo "  ./scripts/manual-search.sh AnimatedButton"
    echo "  ./scripts/manual-search.sh \"build error\" --type=troubleshooting"
    echo "  ./scripts/manual-search.sh React --type=framework --format=json"
    echo "  ./scripts/manual-search.sh useEffect --format=detailed"
    echo ""
    echo -e "${YELLOW}Search Types:${NC}"
    echo "  component         Search component documentation"
    echo "  troubleshooting   Search known issues and solutions"
    echo "  framework         Search technology stack and decisions"
    echo "  data              Search data structures and schemas"
    echo "  all               Search all documentation (default)"
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --type=*)
            TYPE="${1#*=}"
            shift
            ;;
        --format=*)
            FORMAT="${1#*=}"
            shift
            ;;
        --help|-h)
            show_help
            exit 0
            ;;
        -*)
            echo -e "${RED}Unknown option $1${NC}"
            show_help
            exit 1
            ;;
        *)
            SEARCH_TERM="$1"
            shift
            ;;
    esac
done

# Validate search term
if [[ -z "$SEARCH_TERM" ]]; then
    echo -e "${RED}Error: Search term is required${NC}"
    show_help
    exit 1
fi

# Validate manual directory
if [[ ! -d "$MANUAL_DIR" ]]; then
    echo -e "${RED}Error: Manual directory not found: $MANUAL_DIR${NC}"
    exit 1
fi

# Search function for JSON files
search_json() {
    local file="$1"
    local term="$2"
    local results=""
    
    if command -v jq >/dev/null 2>&1; then
        # Use jq for structured search
        results=$(jq -r --arg term "$term" '
            def search_recursive(obj; path):
                if obj | type == "object" then
                    obj | to_entries[] | 
                    if (.value | tostring | test($term; "i")) then
                        {path: (path + [.key]), value: .value, key: .key}
                    else
                        search_recursive(.value; path + [.key])
                    end
                elif obj | type == "array" then
                    obj | to_entries[] | search_recursive(.value; path + [.key])
                else
                    if (obj | tostring | test($term; "i")) then
                        {path: path, value: obj}
                    else
                        empty
                    end
                end;
            search_recursive(.; [])
        ' "$file" 2>/dev/null || echo "")
    else
        # Fallback to grep
        results=$(grep -i "$term" "$file" 2>/dev/null || echo "")
    fi
    
    echo "$results"
}

# Format output based on type
format_output() {
    local file="$1"
    local results="$2"
    local filename=$(basename "$file")
    
    if [[ -z "$results" ]]; then
        return
    fi
    
    case $FORMAT in
        "json")
            echo -e "${BLUE}=== $filename ===${NC}"
            echo "$results" | jq '.' 2>/dev/null || echo "$results"
            echo ""
            ;;
        "summary")
            echo -e "${GREEN}📄 Found in: ${YELLOW}$filename${NC}"
            if command -v jq >/dev/null 2>&1 && echo "$results" | jq -e . >/dev/null 2>&1; then
                echo "$results" | jq -r '.path | join(" > ")' 2>/dev/null | head -3 | sed 's/^/  ├─ /'
            else
                echo "$results" | head -3 | sed 's/^/  ├─ /'
            fi
            echo ""
            ;;
        "detailed")
            echo -e "${BLUE}=== $filename ===${NC}"
            if command -v jq >/dev/null 2>&1 && echo "$results" | jq -e . >/dev/null 2>&1; then
                echo "$results" | jq -r '
                    "Path: " + (.path | join(" > ")) + "\n" +
                    "Key: " + (.key // "N/A") + "\n" +
                    "Value: " + (.value | tostring) + "\n" +
                    "---"
                ' 2>/dev/null
            else
                echo "$results"
            fi
            echo ""
            ;;
    esac
}

# Main search function
perform_search() {
    local search_pattern="$1"
    local search_type="$2"
    local found_results=false
    
    echo -e "${CYAN}🔍 Searching for: ${YELLOW}\"$search_pattern\"${NC}"
    echo -e "${CYAN}📂 Search type: ${YELLOW}$search_type${NC}"
    echo -e "${CYAN}📋 Format: ${YELLOW}$FORMAT${NC}"
    echo ""
    
    # Define search paths based on type
    case $search_type in
        "component")
            search_files=("$MANUAL_DIR/components.json")
            ;;
        "troubleshooting")
            search_files=("$MANUAL_DIR/troubleshooting.json")
            ;;
        "framework")
            search_files=("$FRAMEWORK_DIR"/*.json)
            ;;
        "data")
            search_files=("$MANUAL_DIR/data.json" "$MANUAL_DIR/utilities.json")
            ;;
        "all")
            search_files=("$MANUAL_DIR"/*.json "$FRAMEWORK_DIR"/*.json)
            ;;
        *)
            echo -e "${RED}Error: Invalid search type: $search_type${NC}"
            exit 1
            ;;
    esac
    
    # Perform search
    for file_pattern in "${search_files[@]}"; do
        for file in $file_pattern; do
            if [[ -f "$file" ]]; then
                results=$(search_json "$file" "$search_pattern")
                if [[ -n "$results" ]]; then
                    format_output "$file" "$results"
                    found_results=true
                fi
            fi
        done
    done
    
    # Search README files
    if [[ "$search_type" == "all" || "$search_type" == "framework" ]]; then
        for readme in "$MANUAL_DIR/README.md" "$FRAMEWORK_DIR/README.md"; do
            if [[ -f "$readme" ]]; then
                results=$(grep -i "$search_pattern" "$readme" 2>/dev/null || echo "")
                if [[ -n "$results" ]]; then
                    echo -e "${GREEN}📄 Found in: ${YELLOW}$(basename "$readme")${NC}"
                    echo "$results" | head -3 | sed 's/^/  ├─ /'
                    echo ""
                    found_results=true
                fi
            fi
        done
    fi
    
    if [[ "$found_results" == false ]]; then
        echo -e "${YELLOW}⚠️  No results found for \"$search_pattern\"${NC}"
        echo ""
        echo -e "${CYAN}💡 Suggestions:${NC}"
        echo "  • Try a broader search term"
        echo "  • Check spelling"
        echo "  • Use --type=all to search all documentation"
        echo "  • Try searching for related terms"
    else
        echo -e "${GREEN}✅ Search completed${NC}"
    fi
}

# Quick reference function
show_quick_reference() {
    echo -e "${PURPLE}📚 Quick Reference:${NC}"
    echo ""
    echo -e "${YELLOW}Common Searches:${NC}"
    echo "  Components: AnimatedButton, InteractiveHero, DomainThemeButton"
    echo "  Issues: \"build error\", \"import error\", \"syntax error\""
    echo "  Framework: React, Next.js, Tailwind, TypeScript"
    echo "  Performance: \"bundle size\", \"optimization\", \"performance\""
    echo ""
    echo -e "${YELLOW}Available Documentation:${NC}"
    if [[ -d "$MANUAL_DIR" ]]; then
        ls "$MANUAL_DIR"/*.json 2>/dev/null | xargs -I {} basename {} .json | sed 's/^/  • /'
    fi
    if [[ -d "$FRAMEWORK_DIR" ]]; then
        echo -e "${YELLOW}Framework:${NC}"
        ls "$FRAMEWORK_DIR"/*.json 2>/dev/null | xargs -I {} basename {} .json | sed 's/^/  • /'
    fi
}

# Main execution
echo -e "${CYAN}🔧 Manual Search Tool${NC}"
echo ""

# Show quick reference if no search term
if [[ -z "$SEARCH_TERM" ]]; then
    show_quick_reference
    echo ""
fi

# Perform the search
perform_search "$SEARCH_TERM" "$TYPE"

echo ""
echo -e "${CYAN}💡 Tip: Use --help for more options${NC}"
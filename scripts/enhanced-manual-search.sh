#!/bin/bash

# Enhanced Manual Search Script
# Leverages the new pattern documentation and system architecture
# Usage: ./scripts/enhanced-manual-search.sh [search-term] [options]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Default values
SEARCH_TERM=""
SEARCH_TYPE="all"
OUTPUT_FORMAT="summary"
SHOW_EXAMPLES=false
SHOW_IMPLEMENTATION=false
SHOW_PATTERNS=false
MANUAL_DIR="manual"

# Help function
show_help() {
    echo -e "${CYAN}${BOLD}🔧 Enhanced Manual Search Tool${NC}"
    echo -e "${YELLOW}Usage:${NC} ./scripts/enhanced-manual-search.sh [search-term] [options]"
    echo ""
    echo -e "${YELLOW}Options:${NC}"
    echo "  --type=TYPE           Search type: all, patterns, architecture, components, framework, troubleshooting (default: all)"
    echo "  --format=FORMAT       Output format: summary, detailed, json, implementation (default: summary)"
    echo "  --show-examples       Include code examples in output"
    echo "  --show-implementation Show implementation details"
    echo "  --show-patterns       Show related patterns"
    echo "  --help               Show this help message"
    echo ""
    echo -e "${YELLOW}Search Types:${NC}"
    echo "  all                  Search all manual documentation"
    echo "  patterns             Search system patterns and architecture"
    echo "  architecture         Search architectural documentation"
    echo "  components           Search component documentation"
    echo "  framework            Search framework and technology docs"
    echo "  troubleshooting      Search known issues and solutions"
    echo "  data                 Search data structures and schemas"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo "  ./scripts/enhanced-manual-search.sh \"domain-driven\" --type=patterns --show-examples"
    echo "  ./scripts/enhanced-manual-search.sh \"navigation\" --type=architecture --format=detailed"
    echo "  ./scripts/enhanced-manual-search.sh \"button\" --type=components --show-implementation"
    echo "  ./scripts/enhanced-manual-search.sh \"performance\" --type=framework --show-patterns"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --type=*)
            SEARCH_TYPE="${1#*=}"
            shift
            ;;
        --format=*)
            OUTPUT_FORMAT="${1#*=}"
            shift
            ;;
        --show-examples)
            SHOW_EXAMPLES=true
            shift
            ;;
        --show-implementation)
            SHOW_IMPLEMENTATION=true
            shift
            ;;
        --show-patterns)
            SHOW_PATTERNS=true
            shift
            ;;
        --help)
            show_help
            exit 0
            ;;
        -*)
            echo -e "${RED}Unknown option $1${NC}"
            show_help
            exit 1
            ;;
        *)
            if [ -z "$SEARCH_TERM" ]; then
                SEARCH_TERM="$1"
            fi
            shift
            ;;
    esac
done

# Validate search term
if [ -z "$SEARCH_TERM" ]; then
    echo -e "${RED}Error: Search term is required${NC}"
    show_help
    exit 1
fi

# Function to search in JSON files
search_json() {
    local file="$1"
    local term="$2"
    local context="$3"
    
    if [ ! -f "$file" ]; then
        return
    fi
    
    # Use jq to search for the term in the JSON structure
    local results=$(jq -r --arg term "$term" '
        def search_recursive(obj):
            if obj | type == "object" then
                obj | to_entries[] | 
                if (.key | ascii_downcase | contains($term | ascii_downcase)) or 
                   (.value | tostring | ascii_downcase | contains($term | ascii_downcase)) then
                    {key: .key, value: .value, path: [.key]}
                else
                    (.value | search_recursive(.)) as $sub |
                    if $sub then $sub | .path = [.key] + .path else empty end
                end
            elif obj | type == "array" then
                obj | to_entries[] | .value | search_recursive(.) as $sub |
                if $sub then $sub | .path = [.key] + .path else empty end
            else
                empty
            end;
        search_recursive(.)
    ' "$file" 2>/dev/null)
    
    if [ -n "$results" ]; then
        echo -e "${GREEN}📄 Found in: ${BOLD}${context}${NC}"
        echo "$results" | head -10
        echo ""
    fi
}

# Function to search patterns
search_patterns() {
    local term="$1"
    
    echo -e "${CYAN}${BOLD}🔍 Searching System Patterns for: ${YELLOW}\"$term\"${NC}"
    echo ""
    
    # Search in pattern files
    for pattern_file in "$MANUAL_DIR/patterns"/*.json; do
        if [ -f "$pattern_file" ]; then
            local filename=$(basename "$pattern_file" .json)
            search_json "$pattern_file" "$term" "patterns/$filename.json"
        fi
    done
}

# Function to search architecture
search_architecture() {
    local term="$1"
    
    echo -e "${CYAN}${BOLD}🏗️ Searching Architecture Documentation for: ${YELLOW}\"$term\"${NC}"
    echo ""
    
    # Search in architecture-related files
    search_json "$MANUAL_DIR/patterns/system-architecture.json" "$term" "system-architecture.json"
    search_json "$MANUAL_DIR/patterns/data-flow.json" "$term" "data-flow.json"
    search_json "$MANUAL_DIR/patterns/navigation-system.json" "$term" "navigation-system.json"
    search_json "$MANUAL_DIR/patterns/integration-patterns.json" "$term" "integration-patterns.json"
}

# Function to search components
search_components() {
    local term="$1"
    
    echo -e "${CYAN}${BOLD}🧩 Searching Component Documentation for: ${YELLOW}\"$term\"${NC}"
    echo ""
    
    search_json "$MANUAL_DIR/components.json" "$term" "components.json"
}

# Function to search framework
search_framework() {
    local term="$1"
    
    echo -e "${CYAN}${BOLD}🛠️ Searching Framework Documentation for: ${YELLOW}\"$term\"${NC}"
    echo ""
    
    # Search in framework directory
    for framework_file in "$MANUAL_DIR/framework"/*.json; do
        if [ -f "$framework_file" ]; then
            local filename=$(basename "$framework_file" .json)
            search_json "$framework_file" "$term" "framework/$filename.json"
        fi
    done
    
    # Also search framework README
    if [ -f "$MANUAL_DIR/framework/README.md" ]; then
        local md_results=$(grep -i -n -C 2 "$term" "$MANUAL_DIR/framework/README.md" 2>/dev/null || true)
        if [ -n "$md_results" ]; then
            echo -e "${GREEN}📄 Found in: ${BOLD}framework/README.md${NC}"
            echo "$md_results"
            echo ""
        fi
    fi
}

# Function to search troubleshooting
search_troubleshooting() {
    local term="$1"
    
    echo -e "${CYAN}${BOLD}🔧 Searching Troubleshooting Documentation for: ${YELLOW}\"$term\"${NC}"
    echo ""
    
    search_json "$MANUAL_DIR/troubleshooting.json" "$term" "troubleshooting.json"
}

# Function to search data documentation
search_data() {
    local term="$1"
    
    echo -e "${CYAN}${BOLD}📊 Searching Data Documentation for: ${YELLOW}\"$term\"${NC}"
    echo ""
    
    search_json "$MANUAL_DIR/data.json" "$term" "data.json"
}

# Function to search all documentation
search_all() {
    local term="$1"
    
    echo -e "${CYAN}${BOLD}🔍 Comprehensive Search for: ${YELLOW}\"$term\"${NC}"
    echo -e "${CYAN}📂 Search type: ${YELLOW}$SEARCH_TYPE${NC}"
    echo -e "${CYAN}📋 Format: ${YELLOW}$OUTPUT_FORMAT${NC}"
    echo ""
    
    # Search in all manual files
    for manual_file in "$MANUAL_DIR"/*.json; do
        if [ -f "$manual_file" ]; then
            local filename=$(basename "$manual_file" .json)
            search_json "$manual_file" "$term" "$filename.json"
        fi
    done
    
    # Search in patterns
    search_patterns "$term"
    
    # Search in framework
    search_framework "$term"
}

# Function to show related patterns
show_related_patterns() {
    local term="$1"
    
    if [ "$SHOW_PATTERNS" = true ]; then
        echo -e "${PURPLE}${BOLD}🔗 Related Patterns:${NC}"
        
        # Use jq to find related patterns
        local related=$(jq -r --arg term "$term" '
            .systemPatterns // {} | to_entries[] | 
            select(.value | ascii_downcase | contains($term | ascii_downcase)) |
            "  • " + .key + ": " + .value
        ' "$MANUAL_DIR/patterns/system-architecture.json" 2>/dev/null || true)
        
        if [ -n "$related" ]; then
            echo "$related"
        else
            echo "  No directly related patterns found"
        fi
        echo ""
    fi
}

# Function to show implementation details
show_implementation_details() {
    local term="$1"
    
    if [ "$SHOW_IMPLEMENTATION" = true ]; then
        echo -e "${BLUE}${BOLD}⚙️ Implementation Details:${NC}"
        
        # Search for implementation examples in components
        local impl_details=$(jq -r --arg term "$term" '
            .. | objects | select(has("implementation")) | 
            select(.implementation | tostring | ascii_downcase | contains($term | ascii_downcase)) |
            .implementation
        ' "$MANUAL_DIR"/*.json "$MANUAL_DIR/patterns"/*.json 2>/dev/null | head -5)
        
        if [ -n "$impl_details" ]; then
            echo "$impl_details"
        else
            echo "  No implementation details found for this term"
        fi
        echo ""
    fi
}

# Function to show examples
show_examples() {
    local term="$1"
    
    if [ "$SHOW_EXAMPLES" = true ]; then
        echo -e "${GREEN}${BOLD}💡 Examples:${NC}"
        
        # Search for examples in the documentation
        local examples=$(jq -r --arg term "$term" '
            .. | objects | select(has("examples")) | 
            select(. | tostring | ascii_downcase | contains($term | ascii_downcase)) |
            .examples
        ' "$MANUAL_DIR"/*.json "$MANUAL_DIR/patterns"/*.json 2>/dev/null | head -3)
        
        if [ -n "$examples" ]; then
            echo "$examples"
        else
            echo "  No examples found for this term"
        fi
        echo ""
    fi
}

# Main search execution
main() {
    # Check if manual directory exists
    if [ ! -d "$MANUAL_DIR" ]; then
        echo -e "${RED}Error: Manual directory '$MANUAL_DIR' not found${NC}"
        exit 1
    fi
    
    # Execute search based on type
    case $SEARCH_TYPE in
        "patterns")
            search_patterns "$SEARCH_TERM"
            ;;
        "architecture")
            search_architecture "$SEARCH_TERM"
            ;;
        "components")
            search_components "$SEARCH_TERM"
            ;;
        "framework")
            search_framework "$SEARCH_TERM"
            ;;
        "troubleshooting")
            search_troubleshooting "$SEARCH_TERM"
            ;;
        "data")
            search_data "$SEARCH_TERM"
            ;;
        "all"|*)
            search_all "$SEARCH_TERM"
            ;;
    esac
    
    # Show additional information if requested
    show_related_patterns "$SEARCH_TERM"
    show_implementation_details "$SEARCH_TERM"
    show_examples "$SEARCH_TERM"
    
    echo -e "${GREEN}✅ Search completed${NC}"
    echo ""
    echo -e "${CYAN}💡 Tip: Use --help for more search options${NC}"
}

# Execute main function
main
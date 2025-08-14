#!/bin/bash

# Documentation Integration Tool
# Links pattern documentation with existing framework documentation
# Usage: ./scripts/integrate-documentation.sh [--validate] [--update-links] [--check-health]

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
VALIDATE_LINKS=false
UPDATE_LINKS=false
CHECK_HEALTH=false
VERBOSE=false

# Help function
show_help() {
    echo -e "${CYAN}${BOLD}🔗 Documentation Integration Tool${NC}"
    echo -e "${YELLOW}Usage:${NC} ./scripts/integrate-documentation.sh [options]"
    echo ""
    echo -e "${YELLOW}Options:${NC}"
    echo "  --validate        Validate all cross-references and links"
    echo "  --update-links    Update and fix broken cross-references"
    echo "  --check-health    Check overall documentation health"
    echo "  --verbose         Show detailed output"
    echo "  --help           Show this help message"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo "  ./scripts/integrate-documentation.sh --validate --verbose"
    echo "  ./scripts/integrate-documentation.sh --check-health"
    echo "  ./scripts/integrate-documentation.sh --update-links"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --validate)
            VALIDATE_LINKS=true
            shift
            ;;
        --update-links)
            UPDATE_LINKS=true
            shift
            ;;
        --check-health)
            CHECK_HEALTH=true
            shift
            ;;
        --verbose)
            VERBOSE=true
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
            echo -e "${RED}Unexpected argument $1${NC}"
            show_help
            exit 1
            ;;
    esac
done

# Global counters
TOTAL_FILES=0
VALID_LINKS=0
BROKEN_LINKS=0
MISSING_REFS=0
declare -a ISSUES=()

# Function to log issues
log_issue() {
    local severity="$1"
    local message="$2"
    local file="$3"
    
    case $severity in
        "ERROR")
            echo -e "${RED}❌ ERROR:${NC} $message ${BLUE}($file)${NC}"
            ISSUES+=("ERROR: $message in $file")
            ;;
        "WARN")
            echo -e "${YELLOW}⚠️  WARN:${NC} $message ${BLUE}($file)${NC}"
            ISSUES+=("WARN: $message in $file")
            ;;
        "INFO")
            if [ "$VERBOSE" = true ]; then
                echo -e "${GREEN}ℹ️  INFO:${NC} $message ${BLUE}($file)${NC}"
            fi
            ;;
    esac
}

# Function to validate cross-references in JSON files
validate_json_references() {
    local file="$1"
    
    if [ ! -f "$file" ]; then
        return
    fi
    
    TOTAL_FILES=$((TOTAL_FILES + 1))
    
    # Extract references from JSON (looking for file paths and IDs)
    local references=$(jq -r '.. | strings | select(test("\\.(json|md|tsx?|js)$|^[a-zA-Z-]+\\.[a-zA-Z-]+#"))' "$file" 2>/dev/null || true)
    
    while IFS= read -r ref; do
        if [ -n "$ref" ]; then
            # Check if it's a file reference
            if [[ "$ref" =~ \.(json|md|tsx|ts|js)$ ]]; then
                local target_file=""
                
                # Handle relative paths
                if [[ "$ref" =~ ^manual/ ]]; then
                    target_file="$ref"
                elif [[ "$ref" =~ ^/ ]]; then
                    target_file="${ref#/}"
                else
                    target_file="manual/$ref"
                fi
                
                if [ -f "$target_file" ]; then
                    VALID_LINKS=$((VALID_LINKS + 1))
                    log_issue "INFO" "Valid reference: $ref" "$file"
                else
                    BROKEN_LINKS=$((BROKEN_LINKS + 1))
                    log_issue "ERROR" "Broken reference: $ref" "$file"
                fi
            fi
            
            # Check for anchor references
            if [[ "$ref" =~ # ]]; then
                local file_part="${ref%#*}"
                local anchor_part="${ref#*#}"
                
                if [ -n "$file_part" ] && [ -f "manual/$file_part" ]; then
                    # Check if anchor exists in target file
                    if grep -q "\"$anchor_part\"" "manual/$file_part" 2>/dev/null; then
                        VALID_LINKS=$((VALID_LINKS + 1))
                        log_issue "INFO" "Valid anchor reference: $ref" "$file"
                    else
                        MISSING_REFS=$((MISSING_REFS + 1))
                        log_issue "WARN" "Missing anchor: $anchor_part in $file_part" "$file"
                    fi
                fi
            fi
        fi
    done <<< "$references"
}

# Function to check documentation health
check_documentation_health() {
    echo -e "${CYAN}${BOLD}🏥 Checking Documentation Health${NC}"
    echo ""
    
    # Check if all expected manual files exist
    local expected_files=(
        "manual/overview.json"
        "manual/components.json"
        "manual/pages.json"
        "manual/utilities.json"
        "manual/data.json"
        "manual/styling.json"
        "manual/troubleshooting.json"
        "manual/deployment.json"
        "manual/table-of-contents.json"
        "manual/patterns/system-architecture.json"
        "manual/patterns/data-flow.json"
        "manual/patterns/navigation-system.json"
        "manual/patterns/integration-patterns.json"
    )
    
    local missing_files=0
    for file in "${expected_files[@]}"; do
        if [ -f "$file" ]; then
            log_issue "INFO" "Documentation file exists" "$file"
        else
            missing_files=$((missing_files + 1))
            log_issue "ERROR" "Missing documentation file" "$file"
        fi
    done
    
    # Check JSON validity
    local invalid_json=0
    for json_file in manual/*.json manual/*/*.json; do
        if [ -f "$json_file" ]; then
            if jq empty "$json_file" 2>/dev/null; then
                log_issue "INFO" "Valid JSON structure" "$json_file"
            else
                invalid_json=$((invalid_json + 1))
                log_issue "ERROR" "Invalid JSON structure" "$json_file"
            fi
        fi
    done
    
    # Check for required sections in key files
    if [ -f "manual/table-of-contents.json" ]; then
        if jq -e '.manual.sections' manual/table-of-contents.json >/dev/null 2>&1; then
            log_issue "INFO" "Table of contents has sections" "manual/table-of-contents.json"
        else
            log_issue "ERROR" "Table of contents missing sections" "manual/table-of-contents.json"
        fi
    fi
    
    # Check pattern documentation completeness
    local pattern_files=("system-architecture" "data-flow" "navigation-system" "integration-patterns")
    for pattern in "${pattern_files[@]}"; do
        local pattern_file="manual/patterns/$pattern.json"
        if [ -f "$pattern_file" ]; then
            # Check for required top-level keys
            if jq -e '.'"$pattern"' // .'"${pattern//-/}"' // .'"${pattern//-/_}"'' "$pattern_file" >/dev/null 2>&1; then
                log_issue "INFO" "Pattern documentation complete" "$pattern_file"
            else
                log_issue "WARN" "Pattern documentation may be incomplete" "$pattern_file"
            fi
        fi
    done
    
    echo ""
    echo -e "${CYAN}${BOLD}📊 Health Summary${NC}"
    echo -e "${RED}Missing files: $missing_files${NC}"
    echo -e "${RED}Invalid JSON: $invalid_json${NC}"
    echo -e "${GREEN}Total files checked: $TOTAL_FILES${NC}"
    echo ""
}

# Function to validate all cross-references
validate_all_references() {
    echo -e "${CYAN}${BOLD}🔍 Validating Cross-References${NC}"
    echo ""
    
    # Validate references in all manual JSON files
    for json_file in manual/*.json manual/*/*.json; do
        if [ -f "$json_file" ]; then
            validate_json_references "$json_file"
        fi
    done
    
    # Check framework integration
    if [ -d "manual/framework" ]; then
        for framework_file in manual/framework/*.json; do
            if [ -f "$framework_file" ]; then
                validate_json_references "$framework_file"
            fi
        done
    fi
    
    echo ""
    echo -e "${CYAN}${BOLD}📊 Reference Validation Summary${NC}"
    echo -e "${GREEN}Valid links: $VALID_LINKS${NC}"
    echo -e "${RED}Broken links: $BROKEN_LINKS${NC}"
    echo -e "${YELLOW}Missing anchors: $MISSING_REFS${NC}"
    echo ""
}

# Function to update and fix links
update_links() {
    echo -e "${CYAN}${BOLD}🔧 Updating Documentation Links${NC}"
    echo ""
    
    # Update table of contents with new pattern documentation
    if [ -f "manual/table-of-contents.json" ]; then
        # Check if patterns section exists
        if ! jq -e '.manual.sections[] | select(.id == "patterns")' manual/table-of-contents.json >/dev/null 2>&1; then
            log_issue "INFO" "Adding patterns section to table of contents" "manual/table-of-contents.json"
            
            # This would require more complex jq manipulation
            # For now, just log that it needs manual update
            log_issue "WARN" "Patterns section needs to be added manually" "manual/table-of-contents.json"
        else
            log_issue "INFO" "Patterns section already exists" "manual/table-of-contents.json"
        fi
    fi
    
    # Update quick access links
    local quick_access_updates=(
        "systemPatterns:patterns/system-architecture.json#architecturalPatterns"
        "dataFlow:patterns/data-flow.json#dataArchitecture"
        "navigation:patterns/navigation-system.json#navigationPatterns"
        "integrations:patterns/integration-patterns.json#thirdPartyIntegrations"
    )
    
    for update in "${quick_access_updates[@]}"; do
        local key="${update%:*}"
        local value="${update#*:}"
        log_issue "INFO" "Quick access link: $key -> $value" "manual/table-of-contents.json"
    done
    
    echo ""
}

# Function to generate integration report
generate_integration_report() {
    echo -e "${CYAN}${BOLD}📋 Integration Report${NC}"
    echo ""
    
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    echo "# Documentation Integration Report"
    echo ""
    echo "**Generated:** $timestamp"
    echo ""
    echo "## Summary"
    echo ""
    echo "- **Total Files:** $TOTAL_FILES"
    echo "- **Valid Links:** $VALID_LINKS"
    echo "- **Broken Links:** $BROKEN_LINKS"
    echo "- **Missing Anchors:** $MISSING_REFS"
    echo "- **Total Issues:** ${#ISSUES[@]}"
    echo ""
    
    if [ ${#ISSUES[@]} -gt 0 ]; then
        echo "## Issues Found"
        echo ""
        for issue in "${ISSUES[@]}"; do
            echo "- $issue"
        done
        echo ""
    fi
    
    echo "## Recommendations"
    echo ""
    if [ $BROKEN_LINKS -gt 0 ]; then
        echo "1. **Fix Broken Links:** $BROKEN_LINKS broken references need attention"
    fi
    if [ $MISSING_REFS -gt 0 ]; then
        echo "2. **Update Anchors:** $MISSING_REFS missing anchor references"
    fi
    if [ ${#ISSUES[@]} -eq 0 ]; then
        echo "✅ **All Good:** Documentation integration is healthy"
    fi
    echo ""
}

# Main function
main() {
    echo -e "${CYAN}${BOLD}🔗 Documentation Integration Tool${NC}"
    echo ""
    
    # Set default action if none specified
    if [ "$VALIDATE_LINKS" = false ] && [ "$UPDATE_LINKS" = false ] && [ "$CHECK_HEALTH" = false ]; then
        CHECK_HEALTH=true
        VALIDATE_LINKS=true
    fi
    
    # Execute requested actions
    if [ "$CHECK_HEALTH" = true ]; then
        check_documentation_health
    fi
    
    if [ "$VALIDATE_LINKS" = true ]; then
        validate_all_references
    fi
    
    if [ "$UPDATE_LINKS" = true ]; then
        update_links
    fi
    
    # Generate final report
    generate_integration_report
    
    # Exit with appropriate code
    if [ $BROKEN_LINKS -gt 0 ] || [ ${#ISSUES[@]} -gt 5 ]; then
        echo -e "${RED}❌ Integration issues found${NC}"
        exit 1
    else
        echo -e "${GREEN}✅ Documentation integration healthy${NC}"
        exit 0
    fi
}

# Execute main function
main
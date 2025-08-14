#!/bin/bash

# Pattern Validation Script
# Validates architectural patterns and compliance with documented standards
# Usage: ./scripts/validate-patterns.sh [--check=pattern-type] [--fix] [--report]

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
CHECK_TYPE="all"
FIX_ISSUES=false
GENERATE_REPORT=false
VERBOSE=false
OUTPUT_FILE=""

# Help function
show_help() {
    echo -e "${CYAN}${BOLD}🔍 Pattern Validation Tool${NC}"
    echo -e "${YELLOW}Usage:${NC} ./scripts/validate-patterns.sh [options]"
    echo ""
    echo -e "${YELLOW}Options:${NC}"
    echo "  --check=TYPE       Validation type: all, domain-structure, component-hierarchy, data-flow, navigation, accessibility (default: all)"
    echo "  --fix             Attempt to auto-fix violations where possible"
    echo "  --report          Generate detailed validation report"
    echo "  --verbose         Show detailed output"
    echo "  --output=FILE     Save report to specified file"
    echo "  --help           Show this help message"
    echo ""
    echo -e "${YELLOW}Validation Types:${NC}"
    echo "  all                    Validate all patterns"
    echo "  domain-structure       Check domain-driven design compliance"
    echo "  component-hierarchy    Validate atomic design hierarchy"
    echo "  data-flow             Check unidirectional data flow patterns"
    echo "  navigation            Validate navigation accessibility and structure"
    echo "  accessibility         Check WCAG compliance patterns"
    echo "  integration           Validate integration patterns"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo "  ./scripts/validate-patterns.sh --check=domain-structure --verbose"
    echo "  ./scripts/validate-patterns.sh --check=accessibility --report --output=accessibility-report.md"
    echo "  ./scripts/validate-patterns.sh --fix --report"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --check=*)
            CHECK_TYPE="${1#*=}"
            shift
            ;;
        --fix)
            FIX_ISSUES=true
            shift
            ;;
        --report)
            GENERATE_REPORT=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --output=*)
            OUTPUT_FILE="${1#*=}"
            GENERATE_REPORT=true
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

# Global validation results
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNINGS=0
declare -a VIOLATIONS=()
declare -a SUGGESTIONS=()

# Function to log validation results
log_result() {
    local status="$1"
    local message="$2"
    local details="$3"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    case $status in
        "PASS")
            PASSED_CHECKS=$((PASSED_CHECKS + 1))
            if [ "$VERBOSE" = true ]; then
                echo -e "${GREEN}✅ PASS:${NC} $message"
            fi
            ;;
        "FAIL")
            FAILED_CHECKS=$((FAILED_CHECKS + 1))
            echo -e "${RED}❌ FAIL:${NC} $message"
            if [ -n "$details" ]; then
                echo -e "${RED}   Details:${NC} $details"
            fi
            VIOLATIONS+=("$message: $details")
            ;;
        "WARN")
            WARNINGS=$((WARNINGS + 1))
            echo -e "${YELLOW}⚠️  WARN:${NC} $message"
            if [ -n "$details" ]; then
                echo -e "${YELLOW}   Details:${NC} $details"
            fi
            SUGGESTIONS+=("$message: $details")
            ;;
    esac
}

# Function to validate domain structure
validate_domain_structure() {
    echo -e "${CYAN}${BOLD}🏗️ Validating Domain Structure${NC}"
    echo ""
    
    # Check if domain directories exist
    local domains=("full-stack" "cloud-engineering" "data-analytics" "ux-ui-design" "technical-consulting")
    
    for domain in "${domains[@]}"; do
        # Check app route exists
        if [ -f "app/$domain/page.tsx" ]; then
            log_result "PASS" "Domain route exists for $domain"
        else
            log_result "FAIL" "Missing domain route for $domain" "Expected: app/$domain/page.tsx"
        fi
        
        # Check domain-specific components
        if [ -d "components/domain-specific" ]; then
            local domain_component_dir=""
            case $domain in
                "full-stack") domain_component_dir="full-stack" ;;
                "cloud-engineering") domain_component_dir="cloud" ;;
                "data-analytics") domain_component_dir="data" ;;
                "ux-ui-design") domain_component_dir="ux-ui" ;;
                "technical-consulting") domain_component_dir="consulting" ;;
            esac
            
            if [ -d "components/domain-specific/$domain_component_dir" ]; then
                log_result "PASS" "Domain components exist for $domain"
            else
                log_result "WARN" "No domain-specific components for $domain" "Consider: components/domain-specific/$domain_component_dir/"
            fi
        fi
        
        # Check domain data exists
        local data_file=""
        case $domain in
            "full-stack") data_file="data/projects/full-stack.ts" ;;
            "cloud-engineering") data_file="data/projects/cloud.ts" ;;
            "data-analytics") data_file="data/projects/data-analytics.ts" ;;
            "ux-ui-design") data_file="data/projects/ux-ui-design.ts" ;;
            "technical-consulting") data_file="data/projects/technical-consulting.ts" ;;
        esac
        
        if [ -f "$data_file" ]; then
            log_result "PASS" "Domain data exists for $domain"
        else
            log_result "WARN" "No domain-specific data for $domain" "Consider: $data_file"
        fi
    done
    
    # Check domain constants
    if grep -q "export const DOMAINS" lib/constants/domains.ts 2>/dev/null; then
        log_result "PASS" "Domain constants are properly exported"
    else
        log_result "FAIL" "Domain constants not found" "Check: lib/constants/domains.ts"
    fi
    
    echo ""
}

# Function to validate component hierarchy
validate_component_hierarchy() {
    echo -e "${CYAN}${BOLD}🧩 Validating Component Hierarchy${NC}"
    echo ""
    
    # Check atomic design structure
    local expected_dirs=("ui/base" "ui" "features" "domain-specific" "layouts")
    
    for dir in "${expected_dirs[@]}"; do
        if [ -d "components/$dir" ]; then
            log_result "PASS" "Component directory exists: $dir"
        else
            log_result "WARN" "Missing component directory: $dir" "Consider creating: components/$dir"
        fi
    done
    
    # Check for proper component naming
    local component_files=$(find components -name "*.tsx" -type f 2>/dev/null || true)
    local naming_violations=0
    
    while IFS= read -r file; do
        if [ -n "$file" ]; then
            local filename=$(basename "$file" .tsx)
            # Check if component name starts with capital letter
            if [[ ! "$filename" =~ ^[A-Z] ]]; then
                log_result "FAIL" "Component naming violation: $file" "Component names should start with capital letter"
                naming_violations=$((naming_violations + 1))
            fi
        fi
    done <<< "$component_files"
    
    if [ $naming_violations -eq 0 ]; then
        log_result "PASS" "All components follow naming conventions"
    fi
    
    # Check for index files in component directories
    local dirs_with_index=0
    local total_component_dirs=0
    
    while IFS= read -r dir; do
        if [ -n "$dir" ]; then
            total_component_dirs=$((total_component_dirs + 1))
            if [ -f "$dir/index.ts" ] || [ -f "$dir/index.tsx" ]; then
                dirs_with_index=$((dirs_with_index + 1))
            fi
        fi
    done <<< "$(find components -type d -mindepth 1 2>/dev/null || true)"
    
    if [ $total_component_dirs -gt 0 ]; then
        local index_percentage=$((dirs_with_index * 100 / total_component_dirs))
        if [ $index_percentage -gt 80 ]; then
            log_result "PASS" "Good index file coverage ($index_percentage%)"
        elif [ $index_percentage -gt 50 ]; then
            log_result "WARN" "Moderate index file coverage ($index_percentage%)" "Consider adding index files for easier imports"
        else
            log_result "FAIL" "Low index file coverage ($index_percentage%)" "Add index files to component directories"
        fi
    fi
    
    echo ""
}

# Function to validate data flow patterns
validate_data_flow() {
    echo -e "${CYAN}${BOLD}📊 Validating Data Flow Patterns${NC}"
    echo ""
    
    # Check for context providers
    if [ -f "lib/contexts/ProductionProviders.tsx" ]; then
        log_result "PASS" "Production providers exist"
    else
        log_result "FAIL" "Missing production providers" "Expected: lib/contexts/ProductionProviders.tsx"
    fi
    
    # Check for proper context usage
    local context_files=$(find lib/contexts -name "*Context.tsx" 2>/dev/null || true)
    local context_count=0
    
    while IFS= read -r file; do
        if [ -n "$file" ]; then
            context_count=$((context_count + 1))
            # Check if context has proper exports
            if grep -q "createContext" "$file" && grep -q "export.*Provider" "$file"; then
                log_result "PASS" "Context properly structured: $(basename "$file")"
            else
                log_result "WARN" "Context may be missing proper structure: $file" "Check for createContext and Provider export"
            fi
        fi
    done <<< "$context_files"
    
    if [ $context_count -eq 0 ]; then
        log_result "WARN" "No React contexts found" "Consider using contexts for global state management"
    fi
    
    # Check for data validation schemas
    if [ -d "data/schemas" ]; then
        log_result "PASS" "Data schemas directory exists"
        
        local schema_files=$(find data/schemas -name "*.ts" 2>/dev/null | wc -l)
        if [ $schema_files -gt 0 ]; then
            log_result "PASS" "Data validation schemas found ($schema_files files)"
        else
            log_result "WARN" "No schema files found in data/schemas" "Consider adding Zod schemas for data validation"
        fi
    else
        log_result "WARN" "No data schemas directory" "Consider: data/schemas/ for type-safe data validation"
    fi
    
    echo ""
}

# Function to validate navigation patterns
validate_navigation() {
    echo -e "${CYAN}${BOLD}🧭 Validating Navigation Patterns${NC}"
    echo ""
    
    # Check for navigation components
    if [ -f "components/ui/navigation/DomainAwareNavigation.tsx" ]; then
        log_result "PASS" "Domain-aware navigation component exists"
    else
        log_result "FAIL" "Missing domain-aware navigation" "Expected: components/ui/navigation/DomainAwareNavigation.tsx"
    fi
    
    # Check for mobile navigation
    if [ -f "components/ui/navigation/MobileBottomNav.tsx" ]; then
        log_result "PASS" "Mobile navigation component exists"
    else
        log_result "WARN" "No mobile navigation component" "Consider: components/ui/navigation/MobileBottomNav.tsx"
    fi
    
    # Check for accessibility utilities
    if [ -f "lib/utils/accessibility.ts" ]; then
        log_result "PASS" "Accessibility utilities exist"
        
        # Check for key accessibility functions
        if grep -q "announceUtils\|focusUtils\|keyboardUtils" lib/utils/accessibility.ts; then
            log_result "PASS" "Core accessibility utilities implemented"
        else
            log_result "WARN" "Accessibility utilities may be incomplete" "Check for announceUtils, focusUtils, keyboardUtils"
        fi
    else
        log_result "FAIL" "Missing accessibility utilities" "Expected: lib/utils/accessibility.ts"
    fi
    
    echo ""
}

# Function to validate accessibility patterns
validate_accessibility() {
    echo -e "${CYAN}${BOLD}♿ Validating Accessibility Patterns${NC}"
    echo ""
    
    # Check for accessibility testing
    if grep -q "@axe-core/react" package.json 2>/dev/null; then
        log_result "PASS" "Accessibility testing library installed"
    else
        log_result "WARN" "No accessibility testing library" "Consider: npm install @axe-core/react"
    fi
    
    # Check for accessibility components
    if [ -f "components/ui/AccessibilityToolbar.tsx" ]; then
        log_result "PASS" "Accessibility toolbar component exists"
    else
        log_result "WARN" "No accessibility toolbar" "Consider: components/ui/AccessibilityToolbar.tsx"
    fi
    
    # Check for ARIA usage in components
    local aria_usage=$(grep -r "aria-" components/ --include="*.tsx" 2>/dev/null | wc -l)
    if [ $aria_usage -gt 10 ]; then
        log_result "PASS" "Good ARIA attribute usage ($aria_usage instances)"
    elif [ $aria_usage -gt 5 ]; then
        log_result "WARN" "Moderate ARIA usage ($aria_usage instances)" "Consider adding more ARIA attributes for better accessibility"
    else
        log_result "FAIL" "Low ARIA usage ($aria_usage instances)" "Add ARIA attributes to improve accessibility"
    fi
    
    # Check for semantic HTML usage
    local semantic_tags=$(grep -r "<main\|<nav\|<section\|<article\|<aside\|<header\|<footer" components/ --include="*.tsx" 2>/dev/null | wc -l)
    if [ $semantic_tags -gt 5 ]; then
        log_result "PASS" "Good semantic HTML usage ($semantic_tags instances)"
    else
        log_result "WARN" "Limited semantic HTML usage ($semantic_tags instances)" "Use more semantic HTML elements"
    fi
    
    echo ""
}

# Function to validate integration patterns
validate_integration() {
    echo -e "${CYAN}${BOLD}🔗 Validating Integration Patterns${NC}"
    echo ""
    
    # Check for third-party integrations
    local integrations=("framer-motion" "next-themes" "@react-three/fiber" "@react-three/drei")
    
    for integration in "${integrations[@]}"; do
        if grep -q "\"$integration\"" package.json 2>/dev/null; then
            log_result "PASS" "Integration library installed: $integration"
        else
            log_result "WARN" "Integration library not found: $integration" "May not be needed for current features"
        fi
    done
    
    # Check for proper error boundaries
    local error_boundaries=$(find components -name "*ErrorBoundary*" -o -name "*Error*" 2>/dev/null | wc -l)
    if [ $error_boundaries -gt 0 ]; then
        log_result "PASS" "Error boundary components found ($error_boundaries)"
    else
        log_result "WARN" "No error boundary components" "Consider adding error boundaries for better error handling"
    fi
    
    # Check for performance monitoring
    if [ -f "lib/services/performance.ts" ]; then
        log_result "PASS" "Performance monitoring service exists"
    else
        log_result "WARN" "No performance monitoring" "Consider: lib/services/performance.ts"
    fi
    
    echo ""
}

# Function to generate validation report
generate_report() {
    local report_content=""
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    report_content+="# Pattern Validation Report\n\n"
    report_content+="**Generated:** $timestamp\n"
    report_content+="**Validation Type:** $CHECK_TYPE\n\n"
    
    report_content+="## Summary\n\n"
    report_content+="- **Total Checks:** $TOTAL_CHECKS\n"
    report_content+="- **Passed:** $PASSED_CHECKS\n"
    report_content+="- **Failed:** $FAILED_CHECKS\n"
    report_content+="- **Warnings:** $WARNINGS\n"
    
    local success_rate=0
    if [ $TOTAL_CHECKS -gt 0 ]; then
        success_rate=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
    fi
    report_content+="- **Success Rate:** ${success_rate}%\n\n"
    
    if [ ${#VIOLATIONS[@]} -gt 0 ]; then
        report_content+="## Violations\n\n"
        for violation in "${VIOLATIONS[@]}"; do
            report_content+="- ❌ $violation\n"
        done
        report_content+="\n"
    fi
    
    if [ ${#SUGGESTIONS[@]} -gt 0 ]; then
        report_content+="## Suggestions\n\n"
        for suggestion in "${SUGGESTIONS[@]}"; do
            report_content+="- ⚠️ $suggestion\n"
        done
        report_content+="\n"
    fi
    
    report_content+="## Recommendations\n\n"
    if [ $FAILED_CHECKS -gt 0 ]; then
        report_content+="1. **Address Critical Issues:** Fix the $FAILED_CHECKS failed checks to ensure pattern compliance\n"
    fi
    if [ $WARNINGS -gt 0 ]; then
        report_content+="2. **Consider Improvements:** Review the $WARNINGS warnings for potential enhancements\n"
    fi
    if [ $success_rate -lt 80 ]; then
        report_content+="3. **Pattern Compliance:** Current success rate is ${success_rate}%. Aim for 90%+ compliance\n"
    fi
    
    if [ -n "$OUTPUT_FILE" ]; then
        echo -e "$report_content" > "$OUTPUT_FILE"
        echo -e "${GREEN}📄 Report saved to: $OUTPUT_FILE${NC}"
    else
        echo -e "\n${CYAN}${BOLD}📊 Validation Report${NC}"
        echo -e "$report_content"
    fi
}

# Main validation function
main() {
    echo -e "${CYAN}${BOLD}🔍 Pattern Validation Tool${NC}"
    echo -e "${CYAN}📂 Validation type: ${YELLOW}$CHECK_TYPE${NC}"
    if [ "$FIX_ISSUES" = true ]; then
        echo -e "${CYAN}🔧 Auto-fix: ${GREEN}enabled${NC}"
    fi
    if [ "$GENERATE_REPORT" = true ]; then
        echo -e "${CYAN}📋 Report generation: ${GREEN}enabled${NC}"
    fi
    echo ""
    
    # Execute validation based on type
    case $CHECK_TYPE in
        "domain-structure")
            validate_domain_structure
            ;;
        "component-hierarchy")
            validate_component_hierarchy
            ;;
        "data-flow")
            validate_data_flow
            ;;
        "navigation")
            validate_navigation
            ;;
        "accessibility")
            validate_accessibility
            ;;
        "integration")
            validate_integration
            ;;
        "all"|*)
            validate_domain_structure
            validate_component_hierarchy
            validate_data_flow
            validate_navigation
            validate_accessibility
            validate_integration
            ;;
    esac
    
    # Show summary
    echo -e "${CYAN}${BOLD}📊 Validation Summary${NC}"
    echo -e "${GREEN}✅ Passed: $PASSED_CHECKS${NC}"
    echo -e "${RED}❌ Failed: $FAILED_CHECKS${NC}"
    echo -e "${YELLOW}⚠️  Warnings: $WARNINGS${NC}"
    echo -e "${BLUE}📋 Total: $TOTAL_CHECKS${NC}"
    
    local success_rate=0
    if [ $TOTAL_CHECKS -gt 0 ]; then
        success_rate=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
    fi
    echo -e "${PURPLE}📈 Success Rate: ${success_rate}%${NC}"
    echo ""
    
    # Generate report if requested
    if [ "$GENERATE_REPORT" = true ]; then
        generate_report
    fi
    
    # Exit with appropriate code
    if [ $FAILED_CHECKS -gt 0 ]; then
        echo -e "${RED}❌ Validation completed with failures${NC}"
        exit 1
    elif [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Validation completed with warnings${NC}"
        exit 0
    else
        echo -e "${GREEN}✅ All validations passed${NC}"
        exit 0
    fi
}

# Execute main function
main
#!/bin/bash

# Philosophical Decision Framework Script
# Helps evaluate complex decisions through philosophical perspectives
# Usage: ./scripts/philosophical-decision.sh [situation] [--mode=analysis|compare|values]

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
SITUATION=""
MODE="analysis"
PHILOSOPHERS_DIR="scripts/philosophers"

# Create philosophers directory if it doesn't exist
mkdir -p "$PHILOSOPHERS_DIR"

# Help function
show_help() {
    echo -e "${CYAN}${BOLD}Philosophical Decision Framework${NC}"
    echo -e "${YELLOW}Usage:${NC} ./scripts/philosophical-decision.sh [situation] [options]"
    echo ""
    echo -e "${YELLOW}Options:${NC}"
    echo "  --mode=MODE       Analysis mode: analysis, compare, values, setup (default: analysis)"
    echo "  --help           Show this help message"
    echo ""
    echo -e "${YELLOW}Modes:${NC}"
    echo "  analysis         Analyze situation through your philosophical lens"
    echo "  compare          Compare with contrasting philosophical perspectives"
    echo "  values           Evaluate against your core values"
    echo "  setup            Set up your philosophical profile"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo "  ./scripts/philosophical-decision.sh \"Should I help a colleague who isn't helping themselves?\""
    echo "  ./scripts/philosophical-decision.sh \"Ethical concerns about new feature\" --mode=values"
    echo "  ./scripts/philosophical-decision.sh \"Team conflict resolution\" --mode=compare"
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --mode=*)
            MODE="${1#*=}"
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
            SITUATION="$1"
            shift
            ;;
    esac
done

# Philosophical framework data
create_philosophical_profile() {
    cat > "$PHILOSOPHERS_DIR/profile.json" << 'EOF'
{
  "personalPhilosophy": {
    "coreValues": [
      "Autonomy and self-determination",
      "Rational decision-making",
      "Helping others while respecting boundaries",
      "Ethical consistency",
      "Personal growth and learning",
      "Practical wisdom over abstract ideals"
    ],
    "alignedPhilosophers": [
      {
        "name": "Aristotle",
        "school": "Virtue Ethics",
        "keyPrinciples": [
          "Practical wisdom (phronesis)",
          "Golden mean - balance between extremes",
          "Character development through practice",
          "Eudaimonia - human flourishing"
        ],
        "relevantQuotes": [
          "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
          "The whole is greater than the sum of its parts.",
          "Knowing yourself is the beginning of all wisdom."
        ],
        "applicationAreas": [
          "Balancing help vs. enabling others",
          "Character-based decision making",
          "Finding middle ground in conflicts"
        ]
      },
      {
        "name": "John Stuart Mill",
        "school": "Utilitarianism",
        "keyPrinciples": [
          "Greatest good for greatest number",
          "Individual liberty and autonomy",
          "Harm principle",
          "Quality of pleasures over quantity"
        ],
        "relevantQuotes": [
          "The only way in which a human being can make some approach to knowing the whole of a subject is by hearing what can be said about it by persons of every variety of opinion.",
          "Over himself, over his own body and mind, the individual is sovereign."
        ],
        "applicationAreas": [
          "Weighing collective vs individual benefits",
          "Respecting others' autonomy",
          "Evaluating consequences of actions"
        ]
      },
      {
        "name": "Immanuel Kant",
        "school": "Deontological Ethics",
        "keyPrinciples": [
          "Categorical imperative",
          "Duty-based ethics",
          "Treating people as ends, not means",
          "Universal moral laws"
        ],
        "relevantQuotes": [
          "Act only according to that maxim whereby you can at the same time will that it should become a universal law.",
          "Treat humanity, whether in your own person or that of any other, always as an end and never merely as a means."
        ],
        "applicationAreas": [
          "Establishing ethical boundaries",
          "Consistent moral principles",
          "Respecting human dignity"
        ]
      }
    ],
    "contrastingPhilosophers": [
      {
        "name": "Niccolò Machiavelli",
        "school": "Political Realism",
        "keyPrinciples": [
          "Ends justify means",
          "Pragmatic power dynamics",
          "Situational ethics"
        ],
        "perspective": "Would prioritize outcomes over principles"
      },
      {
        "name": "Friedrich Nietzsche",
        "school": "Existentialism",
        "keyPrinciples": [
          "Will to power",
          "Self-creation of values",
          "Rejection of universal morality"
        ],
        "perspective": "Would emphasize individual strength and self-determination"
      },
      {
        "name": "Peter Singer",
        "school": "Effective Altruism",
        "keyPrinciples": [
          "Maximum utility calculation",
          "Obligation to help others",
          "Rational altruism"
        ],
        "perspective": "Would emphasize duty to help regardless of recipient's effort"
      }
    ]
  },
  "decisionFramework": {
    "steps": [
      "Identify the core ethical dilemma",
      "Apply virtue ethics lens (Aristotle)",
      "Consider utilitarian consequences (Mill)",
      "Check against categorical imperative (Kant)",
      "Examine contrasting perspectives",
      "Evaluate against personal values",
      "Make decision with clear rationale"
    ]
  }
}
EOF
    echo -e "${GREEN}✅ Philosophical profile created at $PHILOSOPHERS_DIR/profile.json${NC}"
}

# Load philosophical profile
load_profile() {
    if [[ ! -f "$PHILOSOPHERS_DIR/profile.json" ]]; then
        echo -e "${YELLOW}⚠️  Philosophical profile not found. Creating default profile...${NC}"
        create_philosophical_profile
    fi
}

# Analyze situation through philosophical lens
analyze_situation() {
    local situation="$1"
    
    echo -e "${CYAN}${BOLD}🤔 Philosophical Analysis${NC}"
    echo -e "${YELLOW}Situation:${NC} $situation"
    echo ""
    
    echo -e "${PURPLE}${BOLD}📚 Your Aligned Philosophers' Perspectives:${NC}"
    echo ""
    
    # Aristotelian Analysis
    echo -e "${BLUE}🏛️  Aristotelian Virtue Ethics:${NC}"
    echo "• What would practical wisdom (phronesis) suggest?"
    echo "• What's the balanced middle path between extremes?"
    echo "• How does this decision contribute to character development?"
    echo "• What action promotes human flourishing (eudaimonia)?"
    echo ""
    
    # Utilitarian Analysis
    echo -e "${GREEN}⚖️  Utilitarian Analysis (Mill):${NC}"
    echo "• What produces the greatest good for the greatest number?"
    echo "• How does this respect individual autonomy?"
    echo "• What are the long-term consequences?"
    echo "• Does this follow the harm principle?"
    echo ""
    
    # Kantian Analysis
    echo -e "${YELLOW}📏 Kantian Duty Ethics:${NC}"
    echo "• Can this action be universalized?"
    echo "• Am I treating people as ends in themselves?"
    echo "• What does duty require regardless of consequences?"
    echo "• Is this consistent with moral law?"
    echo ""
    
    echo -e "${CYAN}${BOLD}💭 Reflection Questions:${NC}"
    echo "1. Which philosophical approach resonates most with this situation?"
    echo "2. Where do these perspectives align or conflict?"
    echo "3. What would you do if emotions weren't influencing the decision?"
    echo "4. How does this align with your core values?"
    echo "5. What would you advise someone else in this situation?"
}

# Compare with contrasting perspectives
compare_perspectives() {
    local situation="$1"
    
    echo -e "${CYAN}${BOLD}🔄 Contrasting Perspectives${NC}"
    echo -e "${YELLOW}Situation:${NC} $situation"
    echo ""
    
    echo -e "${RED}${BOLD}🎭 Alternative Philosophical Views:${NC}"
    echo ""
    
    echo -e "${RED}⚔️  Machiavellian Approach:${NC}"
    echo "• Focus on practical outcomes over moral principles"
    echo "• Consider power dynamics and strategic advantages"
    echo "• Ask: What achieves the desired result most effectively?"
    echo ""
    
    echo -e "${PURPLE}💪 Nietzschean Perspective:${NC}"
    echo "• Emphasize self-creation and personal strength"
    echo "• Question conventional moral assumptions"
    echo "• Ask: What expresses your authentic will and values?"
    echo ""
    
    echo -e "${GREEN}🌍 Effective Altruist View (Singer):${NC}"
    echo "• Calculate maximum utility and benefit"
    echo "• Consider obligation to help regardless of circumstances"
    echo "• Ask: What produces the most good in the world?"
    echo ""
    
    echo -e "${CYAN}${BOLD}🤝 Integration Questions:${NC}"
    echo "1. What valid points do these contrasting views raise?"
    echo "2. How might they challenge your initial thinking?"
    echo "3. Is there wisdom in any of these approaches for this situation?"
    echo "4. How do you respond to their critiques of your preferred approach?"
}

# Evaluate against core values
evaluate_values() {
    local situation="$1"
    
    echo -e "${CYAN}${BOLD}💎 Core Values Evaluation${NC}"
    echo -e "${YELLOW}Situation:${NC} $situation"
    echo ""
    
    echo -e "${PURPLE}${BOLD}🎯 Your Core Values Assessment:${NC}"
    echo ""
    
    echo -e "${BLUE}1. Autonomy and Self-Determination:${NC}"
    echo "   • Does this respect others' right to make their own choices?"
    echo "   • Am I imposing my will or supporting their agency?"
    echo ""
    
    echo -e "${GREEN}2. Rational Decision-Making:${NC}"
    echo "   • Am I thinking clearly or being driven by emotion?"
    echo "   • What would I decide with complete information?"
    echo ""
    
    echo -e "${YELLOW}3. Helping Others While Respecting Boundaries:${NC}"
    echo "   • Where's the line between helping and enabling?"
    echo "   • Am I respecting healthy boundaries?"
    echo ""
    
    echo -e "${PURPLE}4. Ethical Consistency:${NC}"
    echo "   • Is this consistent with my other moral decisions?"
    echo "   • Would I make the same choice in similar circumstances?"
    echo ""
    
    echo -e "${CYAN}5. Personal Growth and Learning:${NC}"
    echo "   • What can I learn from this situation?"
    echo "   • How does this contribute to my development?"
    echo ""
    
    echo -e "${RED}6. Practical Wisdom Over Abstract Ideals:${NC}"
    echo "   • What's the practical, wise course of action?"
    echo "   • How do I balance ideals with reality?"
    echo ""
    
    echo -e "${CYAN}${BOLD}📊 Values Alignment Check:${NC}"
    echo "Rate how well each potential action aligns with your values (1-10):"
    echo "• Option A: ___/10"
    echo "• Option B: ___/10"
    echo "• Option C: ___/10"
}

# Setup mode
setup_profile() {
    echo -e "${CYAN}${BOLD}🛠️  Philosophical Profile Setup${NC}"
    echo ""
    echo "This will help you create a personalized philosophical framework."
    echo ""
    
    read -p "$(echo -e ${YELLOW}Would you like to create a custom profile? [y/N]: ${NC})" -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${GREEN}Creating custom philosophical profile...${NC}"
        echo "This feature will be expanded to include interactive setup."
        echo "For now, you can edit $PHILOSOPHERS_DIR/profile.json directly."
    fi
    
    create_philosophical_profile
    
    echo ""
    echo -e "${CYAN}${BOLD}📖 How to Use This Framework:${NC}"
    echo ""
    echo "1. ${BOLD}For Complex Decisions:${NC}"
    echo "   ./scripts/philosophical-decision.sh \"Your situation\" --mode=analysis"
    echo ""
    echo "2. ${BOLD}When Emotions Are High:${NC}"
    echo "   ./scripts/philosophical-decision.sh \"Your situation\" --mode=values"
    echo ""
    echo "3. ${BOLD}To Challenge Your Thinking:${NC}"
    echo "   ./scripts/philosophical-decision.sh \"Your situation\" --mode=compare"
    echo ""
    echo "4. ${BOLD}Regular Practice:${NC}"
    echo "   Use this framework for small decisions to build confidence"
    echo "   Review past decisions to refine your philosophical approach"
}

# Main execution
main() {
    echo -e "${CYAN}${BOLD}🧠 Philosophical Decision Framework${NC}"
    echo ""
    
    # Load profile
    load_profile
    
    # Handle different modes
    case $MODE in
        "setup")
            setup_profile
            ;;
        "analysis")
            if [[ -z "$SITUATION" ]]; then
                echo -e "${RED}Error: Situation description required for analysis${NC}"
                show_help
                exit 1
            fi
            analyze_situation "$SITUATION"
            ;;
        "compare")
            if [[ -z "$SITUATION" ]]; then
                echo -e "${RED}Error: Situation description required for comparison${NC}"
                show_help
                exit 1
            fi
            compare_perspectives "$SITUATION"
            ;;
        "values")
            if [[ -z "$SITUATION" ]]; then
                echo -e "${RED}Error: Situation description required for values evaluation${NC}"
                show_help
                exit 1
            fi
            evaluate_values "$SITUATION"
            ;;
        *)
            echo -e "${RED}Error: Invalid mode: $MODE${NC}"
            show_help
            exit 1
            ;;
    esac
    
    echo ""
    echo -e "${CYAN}💡 Remember: This framework helps clarify your thinking, but the decision is ultimately yours.${NC}"
    echo -e "${CYAN}   Trust your judgment while staying true to your values.${NC}"
}

# Run main function
main
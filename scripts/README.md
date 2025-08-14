# Scripts Documentation

## 🔧 Utility Scripts for Efficient Information Retrieval and Decision Making

This directory contains powerful scripts for searching technical documentation and making complex decisions through philosophical frameworks.

## 📋 Available Scripts

### 1. Manual Search Script (`manual-search.sh`)

**Purpose**: Efficiently search and retrieve information from your technical manual

**Usage**:
```bash
./scripts/manual-search.sh [search-term] [options]
```

**Examples**:
```bash
# Search for a component
./scripts/manual-search.sh AnimatedButton

# Search for troubleshooting info
./scripts/manual-search.sh "build error" --type=troubleshooting

# Search framework documentation with JSON output
./scripts/manual-search.sh React --type=framework --format=json

# Detailed search across all documentation
./scripts/manual-search.sh useEffect --format=detailed
```

**Features**:
- 🔍 **Smart Search**: Uses `jq` for structured JSON searching when available
- 📂 **Type Filtering**: Search specific documentation types (component, troubleshooting, framework, data, all)
- 📊 **Multiple Formats**: Summary, detailed, or raw JSON output
- 🎨 **Color-coded Output**: Easy-to-read results with syntax highlighting
- ⚡ **Fast Performance**: Optimized search algorithms for quick results

**Search Types**:
- `component` - Search component documentation
- `troubleshooting` - Search known issues and solutions  
- `framework` - Search technology stack and decisions
- `data` - Search data structures and schemas
- `all` - Search all documentation (default)

### 2. Philosophical Decision Framework (`philosophical-decision.sh`)

**Purpose**: Evaluate complex decisions through philosophical perspectives and personal values

**Usage**:
```bash
./scripts/philosophical-decision.sh [situation] [options]
```

**Examples**:
```bash
# Analyze a complex situation
./scripts/philosophical-decision.sh "Should I help a colleague who isn't helping themselves?"

# Evaluate against your core values
./scripts/philosophical-decision.sh "Ethical concerns about new feature" --mode=values

# Compare with contrasting perspectives
./scripts/philosophical-decision.sh "Team conflict resolution" --mode=compare

# Set up your philosophical profile
./scripts/philosophical-decision.sh --mode=setup
```

**Modes**:
- `analysis` - Analyze through your aligned philosophical lens (Aristotle, Mill, Kant)
- `compare` - Compare with contrasting perspectives (Machiavelli, Nietzsche, Singer)
- `values` - Evaluate against your core values framework
- `setup` - Create and customize your philosophical profile

**Features**:
- 🧠 **Three Aligned Philosophers**: Aristotle (Virtue Ethics), Mill (Utilitarianism), Kant (Duty Ethics)
- 🎭 **Contrasting Perspectives**: Machiavelli, Nietzsche, Singer for challenging your thinking
- 💎 **Core Values Framework**: Autonomy, rational decision-making, ethical consistency
- 📊 **Structured Analysis**: Step-by-step evaluation process
- 🎯 **Practical Application**: Real-world decision-making support

## 🚀 Quick Start

### Setup
```bash
# Make scripts executable (already done)
chmod +x scripts/*.sh

# Test manual search
./scripts/manual-search.sh --help

# Set up philosophical profile
./scripts/philosophical-decision.sh --mode=setup
```

### Common Use Cases

#### Technical Problem Solving
```bash
# Find component documentation
./scripts/manual-search.sh "AnimatedButton" --type=component

# Debug build issues
./scripts/manual-search.sh "import error" --type=troubleshooting

# Check framework decisions
./scripts/manual-search.sh "bundle size" --type=framework
```

#### Decision Making
```bash
# Complex technical decision
./scripts/philosophical-decision.sh "Should we add this new library?" --mode=analysis

# Team management issue
./scripts/philosophical-decision.sh "How to handle underperforming team member?" --mode=values

# Ethical considerations
./scripts/philosophical-decision.sh "User privacy vs. feature functionality" --mode=compare
```

## 🎯 Benefits

### Manual Search Script
- **Time Saving**: Find information instantly instead of browsing files
- **Comprehensive**: Search across all documentation types simultaneously
- **Flexible**: Multiple output formats for different use cases
- **Accurate**: Structured JSON searching for precise results

### Philosophical Decision Framework
- **Clarity**: Break down complex decisions into manageable components
- **Confidence**: Make decisions aligned with your values and principles
- **Perspective**: Consider multiple philosophical viewpoints
- **Consistency**: Apply the same framework across different situations
- **Growth**: Develop better decision-making skills over time

## 🔧 Technical Details

### Dependencies
- **Required**: `bash`, `grep`, `jq` (recommended for JSON searching)
- **Optional**: Color terminal support for enhanced output

### File Structure
```
scripts/
├── manual-search.sh           # Technical documentation search
├── philosophical-decision.sh  # Decision-making framework
├── philosophers/              # Philosophical profiles (auto-created)
│   └── profile.json          # Your philosophical framework
└── README.md                 # This documentation
```

### Performance
- **Manual Search**: Optimized for large JSON files with structured searching
- **Philosophical Framework**: Lightweight with instant analysis generation
- **Memory Usage**: Minimal - scripts process data on-demand

## 📈 Advanced Usage

### Combining Scripts
```bash
# Search for technical solution, then evaluate decision
./scripts/manual-search.sh "performance optimization" --type=framework
./scripts/philosophical-decision.sh "Should we prioritize performance over features?" --mode=analysis
```

### Customization
- **Manual Search**: Modify search paths in script variables
- **Philosophical Framework**: Edit `scripts/philosophers/profile.json` to customize your philosophical profile

### Integration
- **CI/CD**: Use manual search in automated documentation checks
- **Team Decisions**: Use philosophical framework for team decision-making processes
- **Documentation**: Generate reports using JSON output format

## 🎓 Philosophical Framework Details

### Your Aligned Philosophers
1. **Aristotle (Virtue Ethics)**
   - Practical wisdom and character development
   - Finding balance between extremes
   - Focus on human flourishing

2. **John Stuart Mill (Utilitarianism)**
   - Greatest good for greatest number
   - Individual liberty and autonomy
   - Harm principle

3. **Immanuel Kant (Duty Ethics)**
   - Categorical imperative
   - Treating people as ends, not means
   - Universal moral principles

### Contrasting Perspectives
1. **Machiavelli**: Pragmatic outcomes over principles
2. **Nietzsche**: Individual strength and self-creation
3. **Singer**: Effective altruism and maximum utility

### Core Values Framework
- Autonomy and self-determination
- Rational decision-making
- Helping others while respecting boundaries
- Ethical consistency
- Personal growth and learning
- Practical wisdom over abstract ideals

---

**Version**: 1.0.0  
**Created**: 2024-12-19  
**Compatibility**: Bash 4.0+, macOS/Linux
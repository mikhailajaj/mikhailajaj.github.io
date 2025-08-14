#!/bin/bash

# Development Workflow Enhancement Setup
# Integrates pattern validation and component generation into development workflow
# Usage: ./scripts/setup-dev-workflow.sh [--install-hooks] [--setup-vscode] [--configure-ci]

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
INSTALL_HOOKS=false
SETUP_VSCODE=false
CONFIGURE_CI=false
VERBOSE=false

# Help function
show_help() {
    echo -e "${CYAN}${BOLD}⚙️ Development Workflow Enhancement Setup${NC}"
    echo -e "${YELLOW}Usage:${NC} ./scripts/setup-dev-workflow.sh [options]"
    echo ""
    echo -e "${YELLOW}Options:${NC}"
    echo "  --install-hooks    Install Git hooks for pattern validation"
    echo "  --setup-vscode     Configure VS Code settings and extensions"
    echo "  --configure-ci     Setup CI/CD integration"
    echo "  --verbose          Show detailed output"
    echo "  --help            Show this help message"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo "  ./scripts/setup-dev-workflow.sh --install-hooks --setup-vscode"
    echo "  ./scripts/setup-dev-workflow.sh --configure-ci --verbose"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --install-hooks)
            INSTALL_HOOKS=true
            shift
            ;;
        --setup-vscode)
            SETUP_VSCODE=true
            shift
            ;;
        --configure-ci)
            CONFIGURE_CI=true
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

# Function to install Git hooks
install_git_hooks() {
    echo -e "${CYAN}${BOLD}🪝 Installing Git Hooks${NC}"
    echo ""
    
    # Create hooks directory if it doesn't exist
    mkdir -p .git/hooks
    
    # Pre-commit hook for pattern validation
    cat << 'EOF' > .git/hooks/pre-commit
#!/bin/bash

# Pre-commit hook for pattern validation
# Runs pattern validation on staged files

echo "🔍 Running pattern validation..."

# Check if validation script exists
if [ ! -f "./scripts/validate-patterns.sh" ]; then
    echo "❌ Pattern validation script not found"
    exit 1
fi

# Run pattern validation
if ! ./scripts/validate-patterns.sh --check=all; then
    echo ""
    echo "❌ Pattern validation failed!"
    echo "💡 Fix the issues above or use 'git commit --no-verify' to skip validation"
    exit 1
fi

echo "✅ Pattern validation passed"

# Check for component naming violations
staged_files=$(git diff --cached --name-only --diff-filter=A | grep -E '\.(tsx|ts)$' || true)

if [ -n "$staged_files" ]; then
    echo "🔍 Checking component naming..."
    
    for file in $staged_files; do
        if [[ "$file" =~ components/ ]]; then
            filename=$(basename "$file" .tsx)
            filename=$(basename "$filename" .ts)
            
            # Check if component name starts with capital letter
            if [[ ! "$filename" =~ ^[A-Z] ]]; then
                echo "❌ Component naming violation: $file"
                echo "   Component names should start with capital letter"
                exit 1
            fi
            
            # Check for "Enhanced" prefix (from namespace removal)
            if [[ "$filename" =~ ^Enhanced ]]; then
                echo "❌ Component naming violation: $file"
                echo "   Remove 'Enhanced' prefix - use semantic naming instead"
                exit 1
            fi
        fi
    done
    
    echo "✅ Component naming validation passed"
fi

echo "🎉 All pre-commit checks passed!"
EOF

    chmod +x .git/hooks/pre-commit
    echo -e "${GREEN}✅ Pre-commit hook installed${NC}"
    
    # Pre-push hook for comprehensive validation
    cat << 'EOF' > .git/hooks/pre-push
#!/bin/bash

# Pre-push hook for comprehensive validation
# Runs full test suite and pattern validation

echo "🚀 Running pre-push validation..."

# Run tests
echo "🧪 Running tests..."
if ! npm test -- --passWithNoTests; then
    echo "❌ Tests failed!"
    exit 1
fi

# Run comprehensive pattern validation
echo "🔍 Running comprehensive pattern validation..."
if ! ./scripts/validate-patterns.sh --check=all --report; then
    echo "❌ Pattern validation failed!"
    exit 1
fi

# Check documentation health
echo "📚 Checking documentation health..."
if ! ./scripts/integrate-documentation.sh --check-health; then
    echo "⚠️ Documentation health issues detected"
    echo "💡 Consider running: ./scripts/integrate-documentation.sh --update-links"
fi

echo "🎉 All pre-push checks passed!"
EOF

    chmod +x .git/hooks/pre-push
    echo -e "${GREEN}✅ Pre-push hook installed${NC}"
    
    # Commit message hook for pattern compliance
    cat << 'EOF' > .git/hooks/commit-msg
#!/bin/bash

# Commit message hook for pattern compliance
# Validates commit message format

commit_regex='^(feat|fix|docs|style|refactor|test|chore|perf|ci|build)(\(.+\))?: .{1,50}'

if ! grep -qE "$commit_regex" "$1"; then
    echo "❌ Invalid commit message format!"
    echo ""
    echo "📋 Commit message should follow conventional commits:"
    echo "   <type>[optional scope]: <description>"
    echo ""
    echo "🏷️ Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build"
    echo ""
    echo "💡 Examples:"
    echo "   feat(components): add StatusIndicator atom component"
    echo "   fix(navigation): resolve accessibility focus issue"
    echo "   docs(manual): update pattern documentation"
    exit 1
fi

echo "✅ Commit message format valid"
EOF

    chmod +x .git/hooks/commit-msg
    echo -e "${GREEN}✅ Commit message hook installed${NC}"
    
    echo ""
}

# Function to setup VS Code configuration
setup_vscode() {
    echo -e "${CYAN}${BOLD}🔧 Setting up VS Code Configuration${NC}"
    echo ""
    
    # Create .vscode directory
    mkdir -p .vscode
    
    # VS Code settings
    cat << 'EOF' > .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "eslint.options": {
    "configFile": ".eslintrc.portfolio.js"
  },
  
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  
  "files.associations": {
    "*.mdx": "markdown"
  },
  
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.next": true,
    "**/out": true
  },
  
  "typescript.preferences.includePackageJsonAutoImports": "on",
  
  "tailwindCSS.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
EOF

    echo -e "${GREEN}✅ VS Code settings configured${NC}"
    
    # VS Code extensions recommendations
    cat << 'EOF' > .vscode/extensions.json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json",
    "yzhang.markdown-all-in-one",
    "unifiedjs.vscode-mdx",
    "bradlc.vscode-tailwindcss",
    "steoates.autoimport-es6-ts",
    "usernamehw.errorlens",
    "gruntfuggly.todo-tree",
    "ms-vscode.vscode-jest",
    "orta.vscode-jest"
  ]
}
EOF

    echo -e "${GREEN}✅ VS Code extensions recommendations configured${NC}"
    
    # VS Code tasks for component generation
    cat << 'EOF' > .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Generate UI Atom Component",
      "type": "shell",
      "command": "./scripts/generate-component.sh",
      "args": [
        "--type=ui-atom",
        "--name=${input:componentName}"
      ],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      },
      "problemMatcher": []
    },
    {
      "label": "Generate Feature Component",
      "type": "shell",
      "command": "./scripts/generate-component.sh",
      "args": [
        "--type=feature",
        "--feature=${input:featureArea}",
        "--name=${input:componentName}"
      ],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      },
      "problemMatcher": []
    },
    {
      "label": "Generate Domain Component",
      "type": "shell",
      "command": "./scripts/generate-component.sh",
      "args": [
        "--type=domain",
        "--domain=${input:domainName}",
        "--name=${input:componentName}"
      ],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      },
      "problemMatcher": []
    },
    {
      "label": "Validate Patterns",
      "type": "shell",
      "command": "./scripts/validate-patterns.sh",
      "args": ["--check=all", "--verbose"],
      "group": "test",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      },
      "problemMatcher": []
    },
    {
      "label": "Search Manual",
      "type": "shell",
      "command": "./scripts/enhanced-manual-search.sh",
      "args": ["${input:searchTerm}", "--type=all", "--show-examples"],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      },
      "problemMatcher": []
    }
  ],
  "inputs": [
    {
      "id": "componentName",
      "description": "Component name (PascalCase)",
      "default": "MyComponent",
      "type": "promptString"
    },
    {
      "id": "featureArea",
      "description": "Feature area",
      "default": "homepage",
      "type": "pickString",
      "options": [
        "homepage",
        "accessibility",
        "projects",
        "achievements",
        "education",
        "testimonials"
      ]
    },
    {
      "id": "domainName",
      "description": "Domain name",
      "default": "cloud",
      "type": "pickString",
      "options": [
        "full-stack",
        "cloud",
        "data",
        "ux-ui",
        "consulting"
      ]
    },
    {
      "id": "searchTerm",
      "description": "Search term for manual",
      "default": "component",
      "type": "promptString"
    }
  ]
}
EOF

    echo -e "${GREEN}✅ VS Code tasks configured${NC}"
    
    # VS Code snippets for component patterns
    mkdir -p .vscode/snippets
    cat << 'EOF' > .vscode/snippets/typescript.json
{
  "Portfolio UI Atom Component": {
    "prefix": "portfolio-atom",
    "body": [
      "/**",
      " * ${1:ComponentName} Component",
      " * ",
      " * Atomic Design - Atom (Base UI component with single responsibility)",
      " */",
      "",
      "import React from 'react';",
      "import { cn } from '@/lib/utils/cn';",
      "import { cva, type VariantProps } from 'class-variance-authority';",
      "",
      "const ${1/(.*)/${1:/downcase}/}Variants = cva(",
      "  // Base classes",
      "  'inline-flex items-center justify-center',",
      "  {",
      "    variants: {",
      "      variant: {",
      "        default: 'bg-primary text-primary-foreground',",
      "        secondary: 'bg-secondary text-secondary-foreground',",
      "      },",
      "      size: {",
      "        default: 'h-9 px-4 py-2',",
      "        sm: 'h-8 px-3 text-xs',",
      "        lg: 'h-10 px-8',",
      "      },",
      "    },",
      "    defaultVariants: {",
      "      variant: 'default',",
      "      size: 'default',",
      "    },",
      "  }",
      ");",
      "",
      "interface ${1:ComponentName}Props",
      "  extends React.HTMLAttributes<HTMLDivElement>,",
      "    VariantProps<typeof ${1/(.*)/${1:/downcase}/}Variants> {",
      "  children?: React.ReactNode;",
      "}",
      "",
      "const ${1:ComponentName} = React.forwardRef<HTMLDivElement, ${1:ComponentName}Props>(",
      "  ({ className, variant, size, children, ...props }, ref) => {",
      "    return (",
      "      <div",
      "        ref={ref}",
      "        className={cn(${1/(.*)/${1:/downcase}/}Variants({ variant, size, className }))}",
      "        {...props}",
      "      >",
      "        {children}",
      "      </div>",
      "    );",
      "  }",
      ");",
      "",
      "${1:ComponentName}.displayName = '${1:ComponentName}';",
      "",
      "export { ${1:ComponentName} };",
      "export type { ${1:ComponentName}Props };"
    ],
    "description": "Generate a Portfolio UI Atom component following documented patterns"
  },
  
  "Portfolio Domain Component": {
    "prefix": "portfolio-domain",
    "body": [
      "/**",
      " * ${1:ComponentName} Component",
      " * ",
      " * Domain-Driven Design - ${2:Domain}-specific component",
      " */",
      "",
      "import React from 'react';",
      "import { cn } from '@/lib/utils/cn';",
      "import { useDomainTheme } from '@/lib/contexts/DomainThemeContext';",
      "",
      "interface ${1:ComponentName}Props {",
      "  className?: string;",
      "  domain?: string;",
      "  children?: React.ReactNode;",
      "  // Add domain-specific props here",
      "}",
      "",
      "const ${1:ComponentName}: React.FC<${1:ComponentName}Props> = ({",
      "  className,",
      "  domain,",
      "  children,",
      "  ...props",
      "}) => {",
      "  const { theme } = useDomainTheme(domain);",
      "  ",
      "  return (",
      "    <div",
      "      className={cn('domain-component', className)}",
      "      style={{",
      "        '--domain-primary': theme.primaryColor,",
      "        '--domain-secondary': theme.secondaryColor,",
      "      } as React.CSSProperties}",
      "      {...props}",
      "    >",
      "      {children}",
      "    </div>",
      "  );",
      "};",
      "",
      "${1:ComponentName}.displayName = '${1:ComponentName}';",
      "",
      "export { ${1:ComponentName} };",
      "export type { ${1:ComponentName}Props };"
    ],
    "description": "Generate a Portfolio Domain component following documented patterns"
  }
}
EOF

    echo -e "${GREEN}✅ VS Code snippets configured${NC}"
    
    echo ""
}

# Function to configure CI/CD integration
configure_ci() {
    echo -e "${CYAN}${BOLD}🚀 Configuring CI/CD Integration${NC}"
    echo ""
    
    # Create GitHub Actions workflow
    mkdir -p .github/workflows
    
    cat << 'EOF' > .github/workflows/pattern-validation.yml
name: Pattern Validation

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  validate-patterns:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run TypeScript check
      run: npm run type-check
      
    - name: Run ESLint
      run: npm run lint
      
    - name: Run tests
      run: npm test -- --coverage --passWithNoTests
      
    - name: Validate architectural patterns
      run: ./scripts/validate-patterns.sh --check=all --report --output=pattern-validation-report.md
      
    - name: Check documentation health
      run: ./scripts/integrate-documentation.sh --check-health --validate
      
    - name: Upload pattern validation report
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: pattern-validation-report
        path: pattern-validation-report.md
        
    - name: Comment PR with validation results
      if: github.event_name == 'pull_request'
      uses: actions/github-script@v6
      with:
        script: |
          const fs = require('fs');
          if (fs.existsSync('pattern-validation-report.md')) {
            const report = fs.readFileSync('pattern-validation-report.md', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## Pattern Validation Report\n\n${report}`
            });
          }
EOF

    echo -e "${GREEN}✅ GitHub Actions workflow configured${NC}"
    
    # Create PR template
    mkdir -p .github/pull_request_template
    cat << 'EOF' > .github/pull_request_template/default.md
## Description
Brief description of the changes in this PR.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)

## Pattern Compliance Checklist
- [ ] Follows documented architectural patterns
- [ ] Component follows atomic design hierarchy
- [ ] Accessibility requirements met (WCAG 2.1 AA)
- [ ] Domain-specific theming implemented (if applicable)
- [ ] Tests added/updated with 70%+ coverage
- [ ] Documentation updated

## Component Generation (if applicable)
- [ ] Used component generation CLI: `./scripts/generate-component.sh`
- [ ] Followed naming conventions (PascalCase, no "Enhanced" prefix)
- [ ] Proper directory structure (atomic design levels)

## Validation Results
- [ ] Pattern validation passes: `./scripts/validate-patterns.sh --check=all`
- [ ] Manual search works: `./scripts/enhanced-manual-search.sh "[component-name]"`
- [ ] Documentation health check passes: `./scripts/integrate-documentation.sh --check-health`

## Testing
- [ ] All tests pass locally
- [ ] New tests added for new functionality
- [ ] Accessibility tests included
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots or GIFs demonstrating the changes.

## Additional Notes
Any additional information that reviewers should know.
EOF

    echo -e "${GREEN}✅ PR template configured${NC}"
    
    echo ""
}

# Function to create development scripts
create_dev_scripts() {
    echo -e "${CYAN}${BOLD}📝 Creating Development Scripts${NC}"
    echo ""
    
    # Create quick development script
    cat << 'EOF' > scripts/dev-quick.sh
#!/bin/bash

# Quick development helper script
# Provides shortcuts for common development tasks

case "$1" in
  "component")
    shift
    ./scripts/generate-component.sh "$@"
    ;;
  "validate")
    ./scripts/validate-patterns.sh --check=all --verbose
    ;;
  "search")
    shift
    ./scripts/enhanced-manual-search.sh "$@"
    ;;
  "docs")
    ./scripts/integrate-documentation.sh --check-health
    ;;
  "test")
    npm test -- --passWithNoTests
    ;;
  "lint")
    npm run lint
    ;;
  "build")
    npm run build
    ;;
  *)
    echo "Usage: $0 {component|validate|search|docs|test|lint|build}"
    echo ""
    echo "Examples:"
    echo "  $0 component --type=ui-atom --name=MyButton"
    echo "  $0 validate"
    echo "  $0 search 'navigation' --type=patterns"
    echo "  $0 docs"
    ;;
esac
EOF

    chmod +x scripts/dev-quick.sh
    echo -e "${GREEN}✅ Quick development script created${NC}"
    
    echo ""
}

# Main function
main() {
    echo -e "${CYAN}${BOLD}⚙️ Development Workflow Enhancement Setup${NC}"
    echo ""
    
    # Set default actions if none specified
    if [ "$INSTALL_HOOKS" = false ] && [ "$SETUP_VSCODE" = false ] && [ "$CONFIGURE_CI" = false ]; then
        INSTALL_HOOKS=true
        SETUP_VSCODE=true
    fi
    
    # Execute requested setups
    if [ "$INSTALL_HOOKS" = true ]; then
        install_git_hooks
    fi
    
    if [ "$SETUP_VSCODE" = true ]; then
        setup_vscode
    fi
    
    if [ "$CONFIGURE_CI" = true ]; then
        configure_ci
    fi
    
    # Always create development scripts
    create_dev_scripts
    
    echo -e "${GREEN}${BOLD}🎉 Development Workflow Enhancement Complete!${NC}"
    echo ""
    echo -e "${CYAN}📋 What's been configured:${NC}"
    
    if [ "$INSTALL_HOOKS" = true ]; then
        echo -e "${GREEN}✅ Git hooks for pattern validation${NC}"
    fi
    
    if [ "$SETUP_VSCODE" = true ]; then
        echo -e "${GREEN}✅ VS Code settings, extensions, tasks, and snippets${NC}"
    fi
    
    if [ "$CONFIGURE_CI" = true ]; then
        echo -e "${GREEN}✅ GitHub Actions workflow and PR templates${NC}"
    fi
    
    echo -e "${GREEN}✅ Quick development scripts${NC}"
    
    echo ""
    echo -e "${CYAN}🚀 Quick start commands:${NC}"
    echo -e "${YELLOW}• Generate component:${NC} ./scripts/dev-quick.sh component --type=ui-atom --name=MyButton"
    echo -e "${YELLOW}• Validate patterns:${NC} ./scripts/dev-quick.sh validate"
    echo -e "${YELLOW}• Search manual:${NC} ./scripts/dev-quick.sh search 'navigation'"
    echo -e "${YELLOW}• Check docs health:${NC} ./scripts/dev-quick.sh docs"
    echo ""
    echo -e "${CYAN}💡 VS Code users:${NC} Use Ctrl+Shift+P → 'Tasks: Run Task' to access component generation and validation tasks"
}

# Execute main function
main
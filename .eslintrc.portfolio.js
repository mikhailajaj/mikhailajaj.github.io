/**
 * Portfolio-specific ESLint rules for architectural pattern enforcement
 * 
 * These rules enforce the documented patterns from our manual system:
 * - Domain-driven design compliance
 * - Component hierarchy validation
 * - Accessibility requirements
 * - Performance guidelines
 */

module.exports = {
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y'],
  rules: {
    // Domain Structure Rules
    'portfolio/domain-structure': 'error',
    'portfolio/component-hierarchy': 'warn',
    'portfolio/import-structure': 'error',
    
    // Accessibility Rules (Enhanced)
    'portfolio/accessibility-required': 'error',
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/aria-unsupported-elements': 'error',
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/role-supports-aria-props': 'error',
    'jsx-a11y/tabindex-no-positive': 'error',
    'jsx-a11y/heading-has-content': 'error',
    'jsx-a11y/html-has-lang': 'error',
    'jsx-a11y/lang': 'error',
    'jsx-a11y/no-distracting-elements': 'error',
    'jsx-a11y/no-redundant-roles': 'error',
    'jsx-a11y/scope': 'error',
    
    // Performance Rules
    'portfolio/performance-budget': 'warn',
    'portfolio/lazy-loading-required': 'warn',
    'react/jsx-no-bind': 'warn',
    'react/jsx-no-literals': 'off', // Allow literals for better readability
    
    // Component Pattern Rules
    'portfolio/component-naming': 'error',
    'portfolio/props-interface': 'error',
    'portfolio/forward-ref-required': 'warn',
    'react/display-name': 'error',
    'react/prop-types': 'off', // Using TypeScript instead
    
    // TypeScript Rules
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/prefer-const': 'error',
    
    // React Hooks Rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // Import/Export Rules
    'portfolio/import-order': 'error',
    'import/no-default-export': 'off', // Next.js pages need default exports
    'import/prefer-default-export': 'off',
    
    // File Structure Rules
    'portfolio/file-naming': 'error',
    'portfolio/directory-structure': 'error',
  },
  
  // Custom rule implementations
  overrides: [
    {
      files: ['components/ui/base/**/*.tsx'],
      rules: {
        'portfolio/atomic-design-atom': 'error',
        'portfolio/variant-props-required': 'error',
        'portfolio/forward-ref-required': 'error',
      }
    },
    {
      files: ['components/ui/**/*.tsx'],
      rules: {
        'portfolio/atomic-design-molecule': 'warn',
        'portfolio/composition-pattern': 'warn',
      }
    },
    {
      files: ['components/features/**/*.tsx'],
      rules: {
        'portfolio/feature-organization': 'error',
        'portfolio/business-logic-separation': 'warn',
      }
    },
    {
      files: ['components/domain-specific/**/*.tsx'],
      rules: {
        'portfolio/domain-theming-required': 'error',
        'portfolio/domain-context-usage': 'warn',
      }
    },
    {
      files: ['app/**/*.tsx'],
      rules: {
        'portfolio/page-structure': 'error',
        'portfolio/metadata-required': 'warn',
        'portfolio/seo-optimization': 'warn',
      }
    },
    {
      files: ['lib/contexts/**/*.tsx'],
      rules: {
        'portfolio/context-pattern': 'error',
        'portfolio/provider-optimization': 'warn',
      }
    },
    {
      files: ['**/*.test.tsx', '**/*.test.ts'],
      rules: {
        'portfolio/test-coverage': 'warn',
        'portfolio/accessibility-testing': 'error',
      }
    }
  ],
  
  settings: {
    react: {
      version: 'detect'
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json'
      }
    }
  }
};

/**
 * Custom Rule Definitions
 * 
 * These would be implemented as ESLint plugins in a real-world scenario.
 * For now, they serve as documentation of the rules we want to enforce.
 */

const customRules = {
  'portfolio/domain-structure': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Enforce domain-driven design structure',
        category: 'Architecture',
        recommended: true
      },
      schema: []
    },
    create(context) {
      return {
        // Rule implementation would go here
        // Check for proper domain organization
        // Validate domain-specific file placement
        // Ensure domain constants are used correctly
      };
    }
  },
  
  'portfolio/component-hierarchy': {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Enforce atomic design component hierarchy',
        category: 'Architecture',
        recommended: true
      },
      schema: []
    },
    create(context) {
      return {
        // Check component placement in correct atomic design level
        // Validate component dependencies follow hierarchy
        // Ensure proper abstraction levels
      };
    }
  },
  
  'portfolio/accessibility-required': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Require accessibility attributes for interactive elements',
        category: 'Accessibility',
        recommended: true
      },
      schema: []
    },
    create(context) {
      return {
        // Check for ARIA labels on interactive elements
        // Validate semantic HTML usage
        // Ensure keyboard navigation support
        // Require alt text for images
      };
    }
  },
  
  'portfolio/performance-budget': {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Warn about potential performance issues',
        category: 'Performance',
        recommended: true
      },
      schema: []
    },
    create(context) {
      return {
        // Check for large bundle imports
        // Warn about missing lazy loading
        // Validate memoization usage
        // Check for performance anti-patterns
      };
    }
  },
  
  'portfolio/import-order': {
    meta: {
      type: 'layout',
      docs: {
        description: 'Enforce documented import order',
        category: 'Style',
        recommended: true
      },
      schema: []
    },
    create(context) {
      return {
        // Enforce import order:
        // 1. React imports
        // 2. External libraries
        // 3. Internal absolute imports (@/)
        // 4. Internal relative imports
      };
    }
  },
  
  'portfolio/component-naming': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Enforce component naming conventions',
        category: 'Naming',
        recommended: true
      },
      schema: []
    },
    create(context) {
      return {
        // Check PascalCase for components
        // Validate descriptive names
        // Ensure no "Enhanced" prefix (from namespace removal)
        // Check for domain-specific naming patterns
      };
    }
  },
  
  'portfolio/atomic-design-atom': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Enforce atomic design patterns for atoms',
        category: 'Architecture',
        recommended: true
      },
      schema: []
    },
    create(context) {
      return {
        // Check single responsibility
        // Validate no business logic
        // Ensure proper variant props
        // Check for forwardRef usage
      };
    }
  },
  
  'portfolio/domain-theming-required': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Require domain theming for domain-specific components',
        category: 'Architecture',
        recommended: true
      },
      schema: []
    },
    create(context) {
      return {
        // Check for domain theme context usage
        // Validate domain-specific styling
        // Ensure proper CSS variable usage
      };
    }
  }
};

// Export custom rules for potential plugin development
module.exports.customRules = customRules;
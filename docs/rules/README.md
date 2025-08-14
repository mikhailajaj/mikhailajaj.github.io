# Mikhail Ajaj Portfolio - Rules and Guidelines

This directory contains comprehensive rules, guidelines, and best practices for the **Mikhail Ajaj Portfolio** project. Following these guidelines ensures consistent, high-quality code and design across the entire portfolio application, maintaining professional standards that reflect the multi-domain expertise showcased.

## 🎯 **Core Principles**

- **Professional Excellence**: Every implementation demonstrates technical competency
- **Accessibility First**: WCAG 2.1 AA compliance as a minimum standard
- **Performance Focused**: Core Web Vitals and user experience optimization
- **Domain-Aware**: Architecture reflects multi-domain expertise
- **Mobile-First**: Responsive design for all devices and contexts
- **Type-Safe**: Comprehensive TypeScript implementation
- **Test-Driven**: Quality assurance through automated testing

## Quick Reference Guide

| Category | Description | Key Documents |
|----------|-------------|---------------|
| [File Structure](./file-structure/) | Guidelines for organizing files and directories | [README.md](./file-structure/README.md) |
| [React](./react/) | Best practices for React development | [README.md](./react/README.md), [Components](./components/README.md) |
| [Hooks](./hooks/) | Custom hook patterns and best practices | [README.md](./hooks/README.md), [Hook Patterns](./hooks/hook-patterns.md), [Hook Anti-patterns](./hooks/hook-anti-patterns.md) |
| [Next.js](./nextjs/) | Guidelines specific to Next.js framework | [README.md](./nextjs/README.md), [Server Components](./nextjs/server-components.md), [Client Components](./nextjs/client-components.md) |
| [TypeScript](./typescript/) | TypeScript coding standards and patterns | [README.md](./typescript/README.md), [Type Safety](./typescript/type-safety.md) |
| [Software Engineering](./software-engineering/) | General software engineering principles | [README.md](./software-engineering/README.md), [SOLID Principles](./software-engineering/solid-principles.md) |
| [Design Patterns](./design-patterns/) | Recommended design patterns and implementation | [README.md](./design-patterns/README.md), [Patterns Catalog](./design-patterns/patterns-catalog.md) |
| [UI](./ui/) | User interface design principles and standards | [README.md](./ui/README.md), [UI Components](./ui-components.md) |
| [Domains](./domains/) | Domain-specific guidelines for portfolio specializations | [README.md](./domains/README.md), [Full-Stack](./domains/full-stack.md), [Cloud Engineering](./domains/cloud-engineering.md) |
| [Testing](./testing/) | Testing strategies and standards | [README.md](./testing/README.md), [Unit Testing](./testing/unit-testing.md) |
| [Performance](./performance/) | Performance optimization guidelines | [README.md](./performance/README.md), [Optimization Techniques](./performance/optimization-techniques.md) |
| [Accessibility](./accessibility/) | Accessibility standards and implementation | [README.md](./accessibility/README.md), [WCAG Compliance](./accessibility/wcag-compliance.md) |
| [Security](./security/) | Security best practices | [README.md](./security/README.md), [OWASP Guidelines](./security/owasp-guidelines.md) |

## Existing Guidelines

- [Feature-First Organization](./feature-first-organization.md): Guidelines for organizing code by feature
- [Marketing Menu Components](./marketing-menu-components.md): Guidelines for marketing menu components
- [Mermaid Diagrams](./mermaid-diagrams.md): Rules for creating Mermaid diagrams
- [Mermaid Tools Usage](./mermaid-tools-usage.md): Guidelines for using Mermaid tools
- [UI Components](./ui-components.md): Guidelines for UI component implementation

## 🚀 **Quick Start Guide**

### **For New Contributors**
1. Read [PORTFOLIO_RULES_IMPLEMENTATION.md](./PORTFOLIO_RULES_IMPLEMENTATION.md) for comprehensive overview
2. Review [File Structure Guidelines](./file-structure/README.md) for project organization
3. Understand [Component Structure](./components/component-structure.md) for consistent development
4. Check [Import Structure](./file-structure/import-structure.md) for proper dependencies

### **For Active Development**
1. **Before Coding**: Review domain-specific guidelines and performance targets
2. **During Development**: Follow accessibility and performance best practices
3. **Before Committing**: Run quality checks and validate against standards
4. **Code Reviews**: Use these guidelines as evaluation criteria

### **For Quality Assurance**
1. **Accessibility**: Validate WCAG 2.1 AA compliance
2. **Performance**: Check Core Web Vitals and loading times
3. **Mobile**: Test responsive design and touch interactions
4. **SEO**: Ensure proper meta tags and semantic structure

## Rule Enforcement

Some rules are automatically enforced through:

- ESLint configuration
- TypeScript compiler settings
- Prettier formatting rules
- Pre-commit hooks
- CI/CD pipeline checks

However, many guidelines require human judgment and cannot be automatically enforced. Team members are expected to follow these guidelines and help others do the same through code reviews and pair programming.

## Contributing to Rules

These rules are not set in stone. As the project evolves, we may need to update our guidelines. To propose changes:

1. Discuss the proposed change with the team
2. Create a pull request with the updated rule documentation
3. Include examples and rationale for the change
4. Get approval from at least two senior team members

## Rule Precedence

When rules conflict, follow this order of precedence:

1. Project-specific rules in this directory
2. Industry standard best practices
3. Framework recommendations (Next.js, React, etc.)
4. Team consensus during code review

## Getting Help

If you're unsure about how to apply a specific rule or guideline, you can:

1. Ask in the team chat channel
2. Discuss during daily standups
3. Request a pair programming session
4. Add a comment in your code and request specific feedback during review

Remember, the purpose of these rules is to improve quality and consistency, not to restrict creativity or innovation. If a rule seems counterproductive in a specific context, it's worth discussing with the team.

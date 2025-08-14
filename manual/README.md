# Technical Manual - Mikhail Ajaj Portfolio

## 📚 Overview

This manual provides comprehensive technical documentation for the Mikhail Ajaj Portfolio codebase. All documentation is structured in JSON format for easy parsing and integration with development tools.

## 🗂️ Manual Structure

### Core Documentation Files

- **[table-of-contents.json](./table-of-contents.json)** - Main navigation and quick access links
- **[overview.json](./overview.json)** - Project architecture and technology stack
- **[components.json](./components.json)** - Detailed component documentation and API reference
- **[pages.json](./pages.json)** - Next.js pages, routing, and layout documentation
- **[utilities.json](./utilities.json)** - Hooks, libraries, and utility functions
- **[data.json](./data.json)** - Data structures, schemas, and content management
- **[styling.json](./styling.json)** - CSS, Tailwind, and theme system documentation
- **[troubleshooting.json](./troubleshooting.json)** - Common issues and solutions
- **[deployment.json](./deployment.json)** - Build, deployment, and configuration

## 🚀 Quick Start

### Finding Information

1. **Start with** `table-of-contents.json` for navigation
2. **For component issues** → `components.json` + `troubleshooting.json`
3. **For build errors** → `troubleshooting.json#build-errors`
4. **For styling questions** → `styling.json#theme-system`
5. **For deployment issues** → `deployment.json`

### Common Use Cases

```bash
# Find component documentation
grep -r "ComponentName" manual/components.json

# Check recent changes
grep -r "recentChanges" manual/

# Find troubleshooting for specific error
grep -r "error-message" manual/troubleshooting.json
```

## 🔧 Recent Updates

### Enhanced Namespace Removal (2024-12-19)
- ✅ Renamed 13 components from "Enhanced*" to meaningful names
- ✅ Updated 15+ import statements across the codebase
- ✅ Updated component documentation in `components.json`
- ⚠️ Some syntax errors remain (documented in `troubleshooting.json`)

### Key Changes
- `EnhancedBentoGrid` → `AnimatedBentoGrid`
- `EnhancedMagicButton` → `InteractiveMagicButton`
- `EnhancedThemeButton` → `DomainThemeButton`
- `EnhancedContactForm` → `MultiStepContactForm`
- `projects-enhanced.ts` → `project-case-studies.ts`

## 🛠️ Maintenance

### Updating Documentation

When making code changes, update the relevant JSON files:

1. **Component changes** → Update `components.json`
2. **New pages** → Update `pages.json`
3. **Data structure changes** → Update `data.json`
4. **Bug fixes** → Update `troubleshooting.json`
5. **Deployment changes** → Update `deployment.json`

### JSON Structure Guidelines

```json
{
  "section": {
    "lastUpdated": "YYYY-MM-DD",
    "description": "Clear description",
    "items": {
      "itemName": {
        "file": "path/to/file.tsx",
        "description": "What it does",
        "props": "API documentation",
        "usage": "How to use it",
        "status": "stable | experimental | deprecated",
        "recentChanges": "What changed recently"
      }
    }
  }
}
```

## 🔍 Search and Navigation

### JSON Query Examples

```bash
# Find all stable components
jq '.components.categories[].components[] | select(.status == "stable")' manual/components.json

# Get all recent changes
jq '.. | .recentChanges? // empty' manual/*.json

# Find components by dependency
jq '.components.categories[].components[] | select(.dependencies[]? == "framer-motion")' manual/components.json
```

### Quick Reference

| Need | File | Section |
|------|------|---------|
| Component API | `components.json` | `categories.*.components.*` |
| Build errors | `troubleshooting.json` | `commonIssues.buildErrors` |
| Page routing | `pages.json` | `structure.app.routes` |
| Theme system | `styling.json` | `themeSystem` |
| Data schemas | `data.json` | `structure.*.schema` |

## 📋 Status Tracking

### Current Issues (as of 2024-12-19)

1. **Syntax Errors** - Component tag mismatches in UI showcase
2. **Import Errors** - Some service pages still reference old names
3. **Build Warnings** - Non-critical import warnings

See `troubleshooting.json` for detailed solutions.

### Health Check

```bash
# Quick health check
npm run build 2>&1 | grep -E "(Error|Warning)" | wc -l

# Component reference check
grep -r "Enhanced" app/ components/ --include="*.tsx" | wc -l
```

## 🎯 Best Practices

### Documentation
- Update JSON files when making code changes
- Include `recentChanges` for significant updates
- Use semantic versioning for major updates
- Keep `lastUpdated` fields current

### Code Quality
- Follow naming conventions documented in `components.json`
- Use TypeScript interfaces from `data.json` schemas
- Test builds before committing
- Update troubleshooting guide for new issues

## 📞 Support

For technical issues:
1. Check `troubleshooting.json` first
2. Search manual files for relevant keywords
3. Review recent changes in documentation
4. Create new entries in troubleshooting guide for novel issues

---

**Manual Version**: 1.0.0  
**Last Updated**: 2024-12-19  
**Maintainer**: Development Team
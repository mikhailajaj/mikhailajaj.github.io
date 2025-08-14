# Documentation Hub

A consolidated, maintainable entry point for all documentation. This hub reduces duplication and points to a single source of truth where possible.

## Structure and Sources of Truth

- Human-friendly guides and references live in this `docs/` directory
- Machine-readable, developer-tool-integrated documentation lives in `manual/` (JSON)
- The manual is the single source of truth for structured data (components, pages, utilities, data, styling, deployment)

Quick links:

- Architecture: ./architecture/README.md (System hub)
- API Reference: ./api-reference.md
- Technical Docs: ./technical/README.md
- Development Guides: ./guides/README.md
- Rules and Standards: ./rules/README.md
- Project Management: ./project-management/README.md
- Theme System: ./theme-system/README.md
- Manual (JSON): ../manual/README.md (source of truth for structured docs)

## How to Update Docs

- Update manual JSON for structured content:
  - Components: manual/components.json
  - Pages & Routing: manual/pages.json
  - Utilities & Hooks: manual/utilities.json
  - Data & Schemas: manual/data.json, manual/schemas/*
  - Styling & Theming: manual/styling.json
  - Deployment: manual/deployment.json
  - Troubleshooting: manual/troubleshooting.json

- Update `docs/` when:
  - You need human-friendly explanations, guides, or architecture overviews
  - You want to add examples, rationale, or narratives
  - You create a new category of content for developers

## Navigation

- Architecture Overview: ./architecture/README.md
- System Overview: ./architecture/system-overview.md
- Component Hierarchy: ./architecture/component-hierarchy.md
- Caching Strategy: ./architecture/caching-strategy.md
- Performance Monitoring: ./architecture/performance-monitoring.md
- App Component Structure Analysis: ./architecture/app-component-structure-analysis.md

## Validation

Run documentation checks:

```bash
npm run docs:validate
```

If the validation fails, check:
- Missing files or broken links in main docs
- Update scripts/validate-docs.js if you reorganize folders
- Keep this README up to date with major structure changes

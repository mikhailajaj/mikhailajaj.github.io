# File Structure Rules

This document outlines the rules and guidelines for organizing files and directories in the Mikhail Ajaj Portfolio project.

## Table of Contents

1. [Core Principles](#core-principles)
2. [Directory Structure](#directory-structure)
3. [File Naming Conventions](#file-naming-conventions)
4. [Import Rules](#import-rules)
5. [Special Files](#special-files)
6. [Examples](#examples)

## Core Principles

- **Feature-First Organization**: Group files by feature rather than by type
- **Clear Boundaries**: Maintain clear boundaries between features and shared code
- **Predictable Locations**: Files should be in predictable, consistent locations
- **Minimal Nesting**: Avoid deep nesting of directories
- **Self-Contained Features**: Features should be self-contained with minimal dependencies

## Directory Structure

### Root-Level Directories

```
constructit/
├── app/                  # Next.js app router pages
├── shared/               # Shared code across platforms
├── features/             # Domain modules
├── core/                 # Cross-platform code
├── documentation/        # Project documentation
├── docs/                 # Development documentation
├── public/               # Static assets
└── scripts/              # Utility scripts
```

### App Directory Structure

The `app` directory follows Next.js app router conventions:

```
app/
├── (webapp)/             # Route group for web application
│   ├── dashboard/        # Dashboard routes
│   ├── client/           # Client-specific routes
│   ├── admin/            # Admin-specific routes
│   └── layout.tsx        # Root layout for webapp
├── (marketing)/          # Route group for marketing pages
│   ├── about/            # About page
│   ├── services/         # Services pages
│   ├── contact/          # Contact page
│   └── layout.tsx        # Root layout for marketing
├── api/                  # API routes
│   └── [...]             # API endpoints
├── layout.tsx            # Root layout
└── page.tsx              # Home page
```

### Features Directory Structure

Each feature follows this structure:

```
features/
├── feature-name/
│   ├── components/       # UI components
│   │   └── index.ts      # Re-export components
│   ├── hooks/            # React hooks
│   │   └── index.ts      # Re-export hooks
│   ├── server/           # Server-side code
│   │   ├── actions/      # Server actions
│   │   └── db/           # Database access
│   ├── store/            # State management
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   └── index.ts          # Public API
└── [...]                 # Other features
```

### Shared Directory Structure

```
shared/
├── components/           # Shared UI components
│   └── ui/               # Base UI components
├── hooks/                # Shared hooks
├── lib/                  # Shared libraries
├── server/               # Shared server code
│   ├── actions/          # Shared server actions
│   └── db/               # Shared database access
├── store/                # Shared state management
├── types/                # Shared TypeScript types
└── utils/                # Shared utility functions
```

### Core Directory Structure

```
core/
├── business/             # Business logic
├── validation/           # Validation logic
├── api/                  # API client code
└── types/                # Core type definitions
```

## File Naming Conventions

### General Rules

- Use **kebab-case** for directories and files
- Use **PascalCase** for React components
- Use **camelCase** for hooks, utilities, and other functions
- Use **.tsx** extension for files with JSX
- Use **.ts** extension for files without JSX
- Use **.mjs** extension for ESM modules when needed
- Use **.d.ts** extension for type declaration files

### Special Files

- **index.ts**: Used for re-exporting from a directory
- **layout.tsx**: Next.js layout component
- **page.tsx**: Next.js page component
- **loading.tsx**: Next.js loading component
- **error.tsx**: Next.js error component
- **not-found.tsx**: Next.js 404 component
- **route.ts**: Next.js API route handler

### Component Files

- Component files should be named after the component they export
- Each component should be in its own file
- Component directories can use **_components** prefix to indicate private components

Example:
```
features/projects/components/
├── ProjectCard.tsx       # Exports ProjectCard component
├── ProjectList.tsx       # Exports ProjectList component
├── _components/          # Private components
│   ├── ProjectBadge.tsx  # Internal component used by ProjectCard
│   └── ProjectActions.tsx # Internal component used by ProjectList
└── index.ts              # Re-exports public components
```

## Import Rules

### Boundary Rules

- **Shared modules** can only import other shared modules
- **Feature modules** can import shared modules and their own feature modules
- **App modules** can import shared modules and feature modules
- **Core modules** can only import other core modules

### Import Order

1. External dependencies
2. Core imports
3. Shared imports
4. Feature imports (same feature)
5. Relative imports

Example:
```typescript
// External dependencies
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

// Core imports
import { validateProject } from '@/core/validation/project-validation';

// Shared imports
import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/hooks/use-toast';

// Feature imports (same feature)
import { useProjects } from '@/features/projects/hooks';
import { ProjectStatus } from '@/features/projects/types';

// Relative imports
import { ProjectBadge } from './_components/ProjectBadge';
```

### Path Aliases

Use path aliases to avoid deep relative imports:

- `@/app/*` for app directory imports
- `@/shared/*` for shared directory imports
- `@/features/*` for features directory imports
- `@/core/*` for core directory imports

## Special Files

### Private Files and Directories

- Use underscore prefix (`_filename.ts`, `_directory/`) for private files and directories
- Private files should not be imported outside their parent directory

### Route Groups

- Use parentheses around directory names (`(group-name)/`) to create route groups in Next.js
- Route groups do not affect the URL path

### Parallel Routes

- Use @ prefix (`@dashboard/`) for parallel routes in Next.js

## Examples

### Feature Implementation Example

```
features/projects/
├── components/
│   ├── ProjectCard.tsx
│   ├── ProjectList.tsx
│   ├── ProjectDetails.tsx
│   ├── _components/
│   │   ├── ProjectBadge.tsx
│   │   └── ProjectActions.tsx
│   └── index.ts
├── hooks/
│   ├── use-projects.ts
│   ├── use-project-details.ts
│   └── index.ts
├── server/
│   ├── actions/
│   │   ├── project-actions.ts
│   │   └── index.ts
│   └── db/
│       ├── project-repository.ts
│       └── index.ts
├── store/
│   ├── projects-store.ts
│   └── index.ts
├── types/
│   ├── project.ts
│   └── index.ts
├── utils/
│   ├── project-utils.ts
│   └── index.ts
└── index.ts
```

### Page Implementation Example

```
app/(webapp)/projects/
├── page.tsx              # Projects list page
├── loading.tsx           # Loading state
├── error.tsx             # Error state
├── [projectId]/
│   ├── page.tsx          # Project details page
│   ├── edit/
│   │   └── page.tsx      # Project edit page
│   ├── tasks/
│   │   └── page.tsx      # Project tasks page
│   └── documents/
│       └── page.tsx      # Project documents page
└── create/
    └── page.tsx          # Create project page
```

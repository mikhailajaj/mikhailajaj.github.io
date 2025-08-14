# Import Structure Guidelines

Consistent organization of import statements at the top of files improves readability and maintainability. This document outlines the standard structure and best practices for imports in the **Mikhail Ajaj Portfolio** project.

## Ordering Convention

Group and order imports as follows:

1.  **React Imports**: `import React, { useState, ... } from 'react';`
2.  **External/Third-Party Libraries**: Imports from `node_modules` (e.g., `date-fns`, `zod`, `framer-motion`).
3.  **Internal Absolute Imports (using path aliases like `@/`)**:
    *   Group by type or source directory for clarity. **Portfolio-specific order**:
        *   `@/lib/config/...` (Configuration and constants)
        *   `@/lib/utils/...` (Shared utilities like `cn`, `hydration`)
        *   `@/lib/types/...` (TypeScript type definitions)
        *   `@/lib/hooks/...` (Custom React hooks)
        *   `@/lib/contexts/...` (React context providers)
        *   `@/data/...` (Static data, schemas, project data)
        *   `@/hooks/...` (Global custom hooks)
        *   `@/components/ui/base/...` (Base UI components like Button, Card)
        *   `@/components/ui/...` (Other UI components)
        *   `@/components/core/...` (Core layout and structural components)
        *   `@/components/features/...` (Feature-specific components)
        *   `@/components/...` (Legacy and other shared components)
        *   `@/app/...` (Next.js App Router imports - use cautiously)
4.  **Internal Relative Imports**: Imports from the current feature module or directory (`./`, `../`).
    *   Group by type if helpful (e.g., `./components`, `./hooks`, `./types`, `./utils`).
5.  **Type Imports**: Use `import type { ... } from '...'` for imports that are only used for type annotations. These can be grouped separately or placed alongside their corresponding value imports. TypeScript tooling often handles this separation.
6.  **Stylesheets**: CSS, CSS Modules, styled-components imports (`import styles from './Component.module.css';`). Place these last.

Separate groups with a blank line. Within each group, sort imports alphabetically by the module path.

## Example

```typescript
// 1. React Imports
import React, { useState, useEffect, useCallback, useContext } from 'react';

// 2. External Libraries
import { motion } from 'framer-motion';
import { z } from 'zod';
import Link from 'next/link';

// 3. Internal Absolute Imports (@/) - Portfolio Structure
import { cn } from '@/lib/utils/cn';                               // Core utilities
import { hydrationSafeUseEffect } from '@/lib/utils/hydration';    // Hydration utilities
import type { Domain, Project } from '@/data/schemas/project';      // Data schemas
import { projectsData } from '@/data/projects/projects-enhanced';   // Static data
import { useScrollAnimation } from '@/hooks/useScrollAnimation';    // Custom hooks
import { ProductionDataProviders } from '@/lib/contexts/ProductionProviders'; // Context providers
import { Button } from '@/components/ui/base/Button';              // Base UI components
import { Card } from '@/components/ui/base/Card';                  // Base UI components
import { DomainAwareNavigation } from '@/components/ui/navigation/DomainAwareNavigation'; // UI components
import { MainLayout } from '@/components/core/Layout/MainLayout';   // Core layout components
import { EnhancedHero } from '@/components/features/homepage/EnhancedHero'; // Feature components
import { SkillsOverview } from '@/components/features/homepage/SkillsOverview'; // Feature components

// 4. Internal Relative Imports
import { ProjectCard } from './components/ProjectCard';            // Local component
import { useProjectFilter } from './hooks/useProjectFilter';       // Local hook
import { formatProjectDate } from './utils/dateFormatting';        // Local util
import type { ProjectCardProps, FilterState } from './types';       // Local type

// 5. Type Imports (Alternative grouping)
// import type { Domain, Project } from '@/data/schemas/project';
// import type { ProjectCardProps, FilterState } from './types';

// 6. Stylesheets
import './component-styles.css';
```

## Best Practices

### **Portfolio-Specific Guidelines**

*   **Use Path Aliases**: Utilize configured path aliases (`@/*` pointing to project root) for absolute imports. This avoids long relative paths (`../../../../`) and makes refactoring easier. The portfolio uses these key aliases:
    ```typescript
    // tsconfig.json paths configuration
    "@/*": ["./*"]
    "@/components/*": ["components/*"]
    "@/lib/*": ["lib/*"]
    "@/data/*": ["data/*"]
    "@/hooks/*": ["hooks/*"]
    ```

*   **Critical Utility Imports**: Always import core utilities with full paths to avoid runtime errors:
    ```typescript
    // ✅ Correct - Full path prevents "Cannot read properties of undefined" errors
    import { cn } from '@/lib/utils/cn';
    import { hydrationSafeUseEffect } from '@/lib/utils/hydration';
    
    // ❌ Avoid - Can cause runtime errors
    import { cn } from '@/lib/utils';
    ```

*   **Domain-Aware Component Imports**: Follow the domain-specific architecture:
    ```typescript
    // ✅ Base components first
    import { Button } from '@/components/ui/base/Button';
    import { Card } from '@/components/ui/base/Card';
    
    // ✅ Then UI components
    import { DomainAwareNavigation } from '@/components/ui/navigation/DomainAwareNavigation';
    
    // ✅ Then core layout components
    import { MainLayout } from '@/components/core/Layout/MainLayout';
    
    // ✅ Finally feature-specific components
    import { EnhancedHero } from '@/components/features/homepage/EnhancedHero';
    ```

### **General Best Practices**

*   **Import Specific Members**: Prefer importing only the specific functions, components, or values needed:
    ```typescript
    // ✅ Good - Specific imports
    import { Button } from '@/components/ui/base/Button';
    import { motion } from 'framer-motion';
    
    // ❌ Avoid unless necessary
    import * as UI from '@/components/ui';
    import * as Motion from 'framer-motion';
    ```

*   **Type-Only Imports**: Use `import type` for TypeScript types to improve build performance:
    ```typescript
    // ✅ Type-only imports
    import type { Domain, Project } from '@/data/schemas/project';
    import type { ComponentProps } from 'react';
    
    // ✅ Mixed imports when needed
    import { projectsData, type Project } from '@/data/projects/projects-enhanced';
    ```

*   **Next.js Specific Imports**: Handle Next.js imports properly:
    ```typescript
    // ✅ Next.js components and utilities
    import Link from 'next/link';
    import Image from 'next/image';
    import { useRouter } from 'next/navigation';
    import type { Metadata } from 'next';
    
    // ✅ Default exports for pages/layouts
    export default function HomePage() { /* ... */ }
    ```

*   **Performance-Critical Imports**: For performance-sensitive components, consider dynamic imports:
    ```typescript
    // ✅ Dynamic imports for heavy components
    const ThreeDDemo = dynamic(() => import('@/components/3d/ThreeDDemo'), {
      ssr: false,
      loading: () => <div>Loading 3D scene...</div>
    });
    ```

*   **Hydration-Safe Imports**: Use hydration utilities for client-side only code:
    ```typescript
    // ✅ Hydration-safe patterns
    import { hydrationSafeUseEffect } from '@/lib/utils/hydration';
    import { ClientOnlyComponent } from '@/components/ui/ClientOnlyComponent';
    ```

## Common Patterns & Anti-Patterns

### **✅ Recommended Patterns**

```typescript
// Homepage component with proper import structure
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { cn } from '@/lib/utils/cn';
import type { Domain } from '@/data/schemas/project';
import { MainLayout } from '@/components/core/Layout/MainLayout';
import { Button } from '@/components/ui/base/Button';
import { EnhancedHero } from '@/components/features/homepage/EnhancedHero';

export default function HomePage() {
  // Component implementation
}
```

```typescript
// Feature component with local imports
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/base/Button';
import { Card } from '@/components/ui/base/Card';

import { ProjectCard } from './components/ProjectCard';
import { useProjectFilter } from './hooks/useProjectFilter';
import type { ProjectListProps } from './types';

export function ProjectList({ projects }: ProjectListProps) {
  // Component implementation
}
```

### **❌ Anti-Patterns to Avoid**

```typescript
// ❌ Wrong utility import (causes runtime errors)
import { cn } from '@/lib/utils'; // This path doesn't exist

// ❌ Mixed import order
import { Button } from '@/components/ui/base/Button';
import React from 'react'; // React should be first
import { motion } from 'framer-motion';

// ❌ Importing from wrong MainLayout
import { MainLayout } from '@/components/layouts/MainLayout'; // Use core/Layout instead

// ❌ Deep relative imports
import { ProjectCard } from '../../../components/features/projects/ProjectCard';
// Use: import { ProjectCard } from '@/components/features/projects/ProjectCard';
```

## Portfolio-Specific Import Checklist

When creating or reviewing components, ensure:

- [ ] **React imports first**: `import React, { ... } from 'react';`
- [ ] **External libraries grouped**: All `node_modules` imports together
- [ ] **Utilities imported correctly**: `@/lib/utils/cn` not `@/lib/utils`
- [ ] **Component hierarchy respected**: Base → UI → Core → Features
- [ ] **Types imported with `import type`**: When only used for typing
- [ ] **Relative imports last**: Local components, hooks, utils, types
- [ ] **CSS imports at the end**: Stylesheets come last
- [ ] **Alphabetical within groups**: Imports sorted alphabetically

## Troubleshooting Import Issues

### **"Cannot read properties of undefined" Errors**
Usually caused by incorrect utility imports:
```typescript
// ❌ Causes runtime error
import { cn } from '@/lib/utils';

// ✅ Correct import
import { cn } from '@/lib/utils/cn';
```

### **Hydration Mismatches**
Use hydration-safe patterns:
```typescript
// ✅ Hydration-safe client-side code
import { hydrationSafeUseEffect } from '@/lib/utils/hydration';

export function ClientComponent() {
  hydrationSafeUseEffect(() => {
    // Client-side only code
  }, []);
}
```

### **Build Errors with Dynamic Imports**
Ensure proper dynamic import syntax:
```typescript
// ✅ Correct dynamic import
const HeavyComponent = dynamic(
  () => import('@/components/heavy/HeavyComponent'),
  { ssr: false }
);
```

Consistent import structuring significantly improves code clarity, prevents runtime errors, and enhances the developer experience in the Mikhail Ajaj Portfolio project.
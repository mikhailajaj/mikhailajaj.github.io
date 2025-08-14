# Component Structure Guidelines

A consistent internal structure for component files enhances readability and maintainability. This document outlines the recommended structure for React components in the **Mikhail Ajaj Portfolio** project, following the domain-aware architecture and professional standards.

## Recommended File Structure (Functional Components with Hooks)

Organize the content within a component file (`.tsx`) in the following order:

1.  **Imports** (Following Portfolio Import Structure):
    *   React imports (`import React, { useState, useEffect } from 'react';`).
    *   External/Third-party library imports (Next.js, Framer Motion, React Icons, etc.).
    *   Internal absolute imports following portfolio hierarchy:
        *   `@/lib/utils/...` (Core utilities like `cn`, `hydration`)
        *   `@/lib/contexts/...` (Context providers)
        *   `@/data/...` (Schemas, project data)
        *   `@/hooks/...` (Custom hooks)
        *   `@/components/ui/base/...` (Base components like Button, Card)
        *   `@/components/ui/...` (UI components)
        *   `@/components/core/...` (Core layout components)
        *   `@/components/features/...` (Feature-specific components)
        *   `@/components/...` (Legacy components)
    *   Internal relative imports (local components, hooks, utils)
    *   Type imports (`import type { ... }`)
    *   CSS/Style imports (placed last)

2.  **Type/Interface Definitions**:
    *   Define TypeScript interfaces or types for the component's props (`interface MyComponentProps { ... }`).
    *   Define any other local types needed by the component.

3.  **Constants**:
    *   Define any constants used within the component (e.g., `const DEFAULT_TITLE = 'Default Title';`).

4.  **Component Definition**:
    *   Define the functional component (`const MyComponent: React.FC<MyComponentProps> = ({ prop1, prop2 }) => { ... };`).

5.  **Hooks**:
    *   State hooks (`useState`).
    *   Effect hooks (`useEffect`).
    *   Context hooks (`useContext`).
    *   Ref hooks (`useRef`).
    *   Custom hooks. Group related hooks if it improves clarity.

6.  **Helper Functions / Event Handlers**:
    *   Define internal helper functions or memoized callbacks (`useCallback`) used only within this component.
    *   Keep these close to where they are used if possible, or group them before the return statement.

7.  **Return Statement (JSX)**:
    *   The main JSX structure returned by the component.
    *   Keep JSX clean and readable. Extract complex conditional rendering or mapped lists into variables or helper functions if needed.

8.  **Default Props / Prop Types (Less common with TypeScript)**:
    *   Define `defaultProps` if needed (though often handled by default parameter values in functional components with TypeScript).

9.  **Exports**:
    *   Export the component (`export default MyComponent;` or `export { MyComponent };`).
    *   Export related types or constants if they need to be used externally.

## Example Structure

```typescript
/**
 * Project Card Component
 * 
 * Displays individual project information with domain-aware styling
 * and interactive features for the portfolio showcase.
 * 
 * @fileoverview Project card with domain theming and accessibility features
 */

"use client";

// 1. Imports - Following Portfolio Structure
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaCode } from 'react-icons/fa';

import { cn } from '@/lib/utils/cn';
import { hydrationSafeUseEffect } from '@/lib/utils/hydration';
import type { Project, Domain } from '@/data/schemas/project';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Button } from '@/components/ui/base/Button';
import { Card } from '@/components/ui/base/Card';

import { ProjectTechStack } from './components/ProjectTechStack';
import { useDomainTheme } from './hooks/useDomainTheme';
import type { ProjectCardProps } from './types';

import './ProjectCard.css';

// 2. Type/Interface Definitions
interface ProjectCardProps {
  project: Project;
  domain?: Domain;
  featured?: boolean;
  onViewDetails?: (projectId: string) => void;
}

// 3. Constants
const ANIMATION_DURATION = 0.6;
const HOVER_SCALE = 1.02;

// 4. Component Definition
const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  domain, 
  featured = false,
  onViewDetails 
}) => {
  // 5. Hooks
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { scrollY } = useScrollAnimation();
  const { themeColors, gradientClass } = useDomainTheme(domain);

  hydrationSafeUseEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = project.image;
  }, [project.image]);

  // 6. Helper Functions / Event Handlers
  const handleViewDetails = useCallback(() => {
    if (onViewDetails) {
      onViewDetails(project.id);
    }
  }, [project.id, onViewDetails]);

  const handleExternalLink = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  // 7. Return Statement (JSX)
  if (!isVisible) {
    return <div className="project-card-skeleton" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ANIMATION_DURATION }}
      whileHover={{ scale: HOVER_SCALE }}
      className={cn(
        "project-card-container",
        featured && "featured",
        gradientClass
      )}
    >
      <Card variant="elevated" className="project-card">
        {/* Project Image */}
        <div className="project-image-container">
          {imageLoaded ? (
            <img 
              src={project.image} 
              alt={project.title}
              className="project-image"
            />
          ) : (
            <div className="image-placeholder">
              <FaCode className="placeholder-icon" />
            </div>
          )}
        </div>

        {/* Project Content */}
        <div className="project-content">
          <h3 className="project-title">{project.title}</h3>
          <p className="project-description">{project.description}</p>
          
          <ProjectTechStack technologies={project.technologies} />
          
          {/* Action Buttons */}
          <div className="project-actions">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FaGithub />}
              onClick={() => handleExternalLink(project.githubUrl)}
            >
              Code
            </Button>
            
            {project.liveUrl && (
              <Button
                variant="gradient"
                size="sm"
                leftIcon={<FaExternalLinkAlt />}
                onClick={() => handleExternalLink(project.liveUrl)}
              >
                Live Demo
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewDetails}
            >
              View Details
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// 8. Display Name for Debugging
ProjectCard.displayName = 'ProjectCard';

// 9. Exports
export { ProjectCard };
export type { ProjectCardProps };
```

## Rationale

This structure promotes:

-   **Discoverability**: Easily find imports, types, state logic, rendering logic, and exports.
-   **Consistency**: All components follow a similar layout, making them easier to navigate.
-   **Readability**: Logical grouping of related code sections.

Adhering to this structure will help maintain a clean and understandable codebase as the application grows.
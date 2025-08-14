# Portfolio-Specific Accessibility Guidelines

## 🎯 **Accessibility as Professional Standard**

The Mikhail Ajaj Portfolio must demonstrate expertise in accessible design and development, as this is a critical skill for modern web professionals. Accessibility compliance showcases technical competency and inclusive design thinking.

## 📋 **WCAG 2.1 AA Compliance Targets**

### **Level AA Requirements**
- **Color Contrast**: 4.5:1 for normal text, 3:1 for large text
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Reader Support**: Proper semantic markup and ARIA labels
- **Focus Management**: Visible focus indicators and logical tab order
- **Responsive Design**: Accessible at all viewport sizes and zoom levels up to 200%

## 🎨 **Visual Accessibility**

### **Color and Contrast**
```css
/* ✅ Portfolio color system with accessibility */
:root {
  /* High contrast color pairs */
  --text-primary: #ffffff;     /* White text */
  --bg-primary: #000000;       /* Black background */
  --contrast-ratio: 21:1;      /* Exceeds WCAG AAA */
  
  /* Domain-specific accessible colors */
  --full-stack: #1e40af;       /* Blue - 4.8:1 contrast */
  --cloud: #0369a1;            /* Sky blue - 5.2:1 contrast */
  --data: #059669;             /* Green - 4.6:1 contrast */
  --ux-ui: #7c3aed;            /* Purple - 4.7:1 contrast */
  --consulting: #ea580c;       /* Orange - 4.5:1 contrast */
}

/* ✅ Focus indicators */
.focus-visible {
  outline: 2px solid var(--focus-color);
  outline-offset: 2px;
  border-radius: 4px;
}

/* ✅ High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --text-primary: #ffffff;
    --bg-primary: #000000;
    --border-color: #ffffff;
  }
}
```

### **Typography Accessibility**
```typescript
// ✅ Accessible typography system
const typography = {
  // Minimum 16px base font size
  base: '1rem', // 16px
  
  // Clear hierarchy with sufficient size differences
  h1: '2.5rem',   // 40px - Hero headings
  h2: '2rem',     // 32px - Section headings
  h3: '1.5rem',   // 24px - Subsection headings
  h4: '1.25rem',  // 20px - Card titles
  
  // Line height for readability
  lineHeight: {
    tight: 1.25,   // Headings
    normal: 1.5,   // Body text
    relaxed: 1.75  // Long-form content
  },
  
  // Font weights with sufficient contrast
  weight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  }
};
```

## ⌨️ **Keyboard Navigation**

### **Focus Management**
```typescript
// ✅ Portfolio navigation with keyboard support
const DomainAwareNavigation = () => {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < navItems.length - 1 ? prev + 1 : 0
        );
        break;
        
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : navItems.length - 1
        );
        break;
        
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
        
      case 'End':
        e.preventDefault();
        setFocusedIndex(navItems.length - 1);
        break;
        
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };
  
  return (
    <nav 
      role="navigation" 
      aria-label="Main navigation"
      onKeyDown={handleKeyDown}
    >
      {/* Navigation items */}
    </nav>
  );
};
```

### **Skip Links**
```typescript
// ✅ Skip navigation for screen readers
const SkipLinks = () => (
  <div className="skip-links">
    <a 
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
    >
      Skip to main content
    </a>
    <a 
      href="#navigation"
      className="sr-only focus:not-sr-only"
    >
      Skip to navigation
    </a>
    <a 
      href="#footer"
      className="sr-only focus:not-sr-only"
    >
      Skip to footer
    </a>
  </div>
);
```

## 🔊 **Screen Reader Support**

### **Semantic HTML Structure**
```typescript
// ✅ Proper semantic structure
const PortfolioPage = () => (
  <div>
    <header role="banner">
      <nav role="navigation" aria-label="Main navigation">
        {/* Navigation */}
      </nav>
    </header>
    
    <main id="main-content" role="main" tabIndex={-1}>
      <section aria-labelledby="hero-heading">
        <h1 id="hero-heading">Mikhail Ajaj - Full-Stack Developer</h1>
        {/* Hero content */}
      </section>
      
      <section aria-labelledby="projects-heading">
        <h2 id="projects-heading">Featured Projects</h2>
        <div role="list" aria-label="Project showcase">
          {projects.map(project => (
            <article 
              key={project.id}
              role="listitem"
              aria-labelledby={`project-${project.id}-title`}
            >
              <h3 id={`project-${project.id}-title`}>
                {project.title}
              </h3>
              {/* Project content */}
            </article>
          ))}
        </div>
      </section>
    </main>
    
    <footer role="contentinfo">
      {/* Footer content */}
    </footer>
  </div>
);
```

### **ARIA Labels and Descriptions**
```typescript
// ✅ Comprehensive ARIA implementation
const ProjectCard = ({ project }: ProjectCardProps) => (
  <article
    role="article"
    aria-labelledby={`project-${project.id}-title`}
    aria-describedby={`project-${project.id}-description`}
  >
    <img
      src={project.image}
      alt={`Screenshot of ${project.title} showing ${project.imageDescription}`}
      role="img"
    />
    
    <h3 id={`project-${project.id}-title`}>
      {project.title}
    </h3>
    
    <p id={`project-${project.id}-description`}>
      {project.description}
    </p>
    
    <div role="list" aria-label="Technologies used">
      {project.technologies.map(tech => (
        <span 
          key={tech}
          role="listitem"
          aria-label={`Technology: ${tech}`}
        >
          {tech}
        </span>
      ))}
    </div>
    
    <div role="group" aria-label="Project actions">
      <a
        href={project.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${project.title} source code on GitHub (opens in new tab)`}
      >
        View Code
      </a>
      
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${project.title} live demo (opens in new tab)`}
        >
          Live Demo
        </a>
      )}
    </div>
  </article>
);
```

## 🎭 **Animation and Motion Accessibility**

### **Reduced Motion Support**
```typescript
// ✅ Respect user motion preferences
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return prefersReducedMotion;
};

// ✅ Conditional animations
const AnimatedComponent = ({ children }: PropsWithChildren) => {
  const prefersReducedMotion = useReducedMotion();
  
  const animationProps = prefersReducedMotion
    ? {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        transition: { duration: 0 }
      }
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
      };
  
  return (
    <motion.div {...animationProps}>
      {children}
    </motion.div>
  );
};
```

### **3D Accessibility**
```typescript
// ✅ Accessible 3D components
const ThreeDShowcase = () => {
  const prefersReducedMotion = useReducedMotion();
  const [showFallback, setShowFallback] = useState(false);
  
  return (
    <div>
      {/* Accessible fallback option */}
      <button
        onClick={() => setShowFallback(!showFallback)}
        aria-label="Toggle between 3D interactive view and static image"
      >
        {showFallback ? 'Show Interactive 3D' : 'Show Static View'}
      </button>
      
      {showFallback ? (
        <img
          src="/3d-fallback.jpg"
          alt="Static view of 3D portfolio showcase showing technical projects"
          className="w-full h-auto"
        />
      ) : (
        <Canvas
          aria-label="Interactive 3D portfolio showcase"
          role="img"
          tabIndex={prefersReducedMotion ? -1 : 0}
        >
          <Suspense fallback={<Loader />}>
            <Scene autoRotate={!prefersReducedMotion} />
          </Suspense>
        </Canvas>
      )}
      
      {/* Screen reader description */}
      <div className="sr-only">
        Interactive 3D showcase displaying portfolio projects in a rotating carousel. 
        Use arrow keys to navigate between projects. Press Enter to view project details.
      </div>
    </div>
  );
};
```

## 📱 **Mobile Accessibility**

### **Touch Target Sizes**
```css
/* ✅ Minimum touch target sizes */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  padding: 12px;
}

/* ✅ Spacing between touch targets */
.touch-targets-container > * + * {
  margin-left: 8px;
}

/* ✅ Mobile-specific accessibility */
@media (max-width: 768px) {
  .mobile-nav-item {
    min-height: 48px; /* Larger on mobile */
    font-size: 1.125rem; /* 18px minimum */
  }
}
```

### **Mobile Screen Reader Support**
```typescript
// ✅ Mobile-optimized navigation
const MobileBottomNav = () => (
  <nav
    role="navigation"
    aria-label="Mobile bottom navigation"
    className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10"
  >
    <div role="list" className="flex justify-around">
      {navItems.map((item, index) => (
        <Link
          key={item.href}
          href={item.href}
          role="listitem"
          className="flex flex-col items-center p-3 min-h-[60px] min-w-[60px]"
          aria-label={`${item.name}${isActive(item.href) ? ' (current page)' : ''}`}
          aria-current={isActive(item.href) ? 'page' : undefined}
        >
          <span aria-hidden="true">{item.icon}</span>
          <span className="text-xs mt-1">{item.name}</span>
        </Link>
      ))}
    </div>
  </nav>
);
```

## 🔧 **Accessibility Testing Tools**

### **Automated Testing**
```typescript
// ✅ Accessibility testing in components
import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';

expect.extend(toHaveNoViolations);

describe('ProjectCard Accessibility', () => {
  test('should not have accessibility violations', async () => {
    const { container } = render(
      <ProjectCard project={mockProject} />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  test('should be keyboard navigable', () => {
    const { getByRole } = render(
      <ProjectCard project={mockProject} />
    );
    
    const card = getByRole('article');
    const links = getAllByRole('link');
    
    // Test tab order
    links.forEach(link => {
      expect(link).toHaveAttribute('tabIndex', '0');
    });
  });
});
```

### **Manual Testing Checklist**
```markdown
## Accessibility Testing Checklist

### Keyboard Navigation
- [ ] All interactive elements reachable via Tab
- [ ] Logical tab order throughout the page
- [ ] Visible focus indicators on all focusable elements
- [ ] Skip links work correctly
- [ ] Escape key closes modals/dropdowns

### Screen Reader Testing
- [ ] Page structure makes sense when read aloud
- [ ] All images have appropriate alt text
- [ ] Form labels are properly associated
- [ ] ARIA labels provide context
- [ ] Live regions announce dynamic content

### Visual Accessibility
- [ ] Text contrast meets WCAG AA standards (4.5:1)
- [ ] Large text contrast meets standards (3:1)
- [ ] Color is not the only way to convey information
- [ ] Text remains readable at 200% zoom
- [ ] Focus indicators are clearly visible

### Mobile Accessibility
- [ ] Touch targets are at least 44px
- [ ] Content reflows properly on small screens
- [ ] Pinch-to-zoom is not disabled
- [ ] Orientation changes work correctly
```

## 🏆 **Accessibility as Professional Showcase**

Your portfolio's accessibility demonstrates:

- **Technical Excellence**: Understanding of modern web standards
- **Inclusive Design**: Commitment to serving all users
- **Legal Compliance**: Knowledge of accessibility requirements
- **Professional Standards**: Attention to detail and quality
- **User-Centric Approach**: Prioritizing user experience for everyone

Excellent accessibility is a competitive advantage that sets you apart as a thoughtful, skilled developer who understands the full spectrum of web development challenges.
# 0005-hydration-safe-animation-pattern

**Status:** Accepted

**Context:**
During the implementation of the universal DomainHero component, we encountered hydration mismatches between server-rendered HTML and client-side React. The issue manifested as:

```
A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.
```

Specific problems:
- Framer Motion animation properties differed between server and client
- CSS custom properties had different formats (string vs number)
- Animation states caused opacity and transform mismatches
- Server rendered static content while client expected animated content

This is a common issue with animation libraries in SSR environments where:
- Server renders components without animation state
- Client expects components to start with animation properties
- Hydration fails due to attribute mismatches

Alternative approaches considered:
- Disable SSR for animated components (poor SEO)
- Use CSS-only animations (limited functionality)
- Suppress hydration warnings (masks real issues)
- Dynamic imports for all animated components (performance impact)

**Decision:**
We will implement a hydration-safe animation pattern using conditional animation based on client mount state:

1. **Mount State Tracking**: Use `useState` and `useEffect` to track when component has mounted on client
2. **Conditional Animation**: Only apply animation properties after client mount
3. **Server Safety**: Server renders static content without animation attributes
4. **Progressive Enhancement**: Animations activate seamlessly after hydration

**Implementation Pattern:**
```typescript
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);

return (
  <motion.div
    initial={isMounted ? { opacity: 0, y: 20 } : false}
    animate={isMounted ? { opacity: 1, y: 0 } : false}
    transition={{ duration: 0.6 }}
  >
    {content}
  </motion.div>
);
```

**Consequences:**

**Positive:**
- **Eliminated Hydration Errors**: No more server/client mismatches
- **Preserved Animations**: Full animation functionality maintained
- **SEO Compatibility**: Server renders complete, indexable content
- **Performance**: No impact on initial render performance
- **User Experience**: Smooth animations after page load
- **Maintainability**: Clear pattern for all animated components

**Negative:**
- **Slight Animation Delay**: Animations start after mount (typically <100ms)
- **Code Overhead**: Additional state management in animated components
- **Pattern Consistency**: Requires discipline to apply pattern consistently
- **Bundle Size**: Minimal increase due to additional hooks

**Implementation Guidelines:**
1. Apply pattern to all Framer Motion components
2. Use `isMounted` state for conditional animation
3. Set `initial` and `animate` to `false` when not mounted
4. Maintain original animation timing and easing
5. Test both SSR and client-side rendering

**Validation:**
- No hydration warnings in browser console
- Animations work correctly after page load
- Server-rendered HTML is valid and complete
- Performance metrics remain within targets

This pattern will be applied to all existing and future animated components to ensure consistent hydration safety across the application.
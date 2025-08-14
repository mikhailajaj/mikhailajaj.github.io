# Context7 MCP Integration Guide

## Overview

Context7 MCP (Model Context Protocol) provides access to comprehensive library documentation and code examples. This guide demonstrates how to use Context7 MCP effectively with Turbopack for optimal development experience.

## Turbopack Configuration

### 1. Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev --turbo",
    "dev:turbo": "next dev --turbo",
    "dev:webpack": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

### 2. Next.js Configuration

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack configuration (stable)
  turbopack: {
    // Resolve alias for better module resolution
    resolveAlias: {
      '@': './src',
      '@/components': './components',
      '@/lib': './lib',
      '@/hooks': './hooks',
      '@/data': './data',
      '@/app': './app',
    },
    // Module resolution extensions
    resolveExtensions: [
      '.mdx',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.mjs',
      '.json',
    ],
  },
  
  experimental: {
    // Package imports optimization
    optimizePackageImports: [
      "framer-motion",
      "react-icons",
      "@radix-ui/react-slot"
    ],
  },
};

export default nextConfig;
```

## Context7 MCP Usage Examples

### 1. Resolving Library IDs

```typescript
// Resolve library ID for documentation access
const libraryId = await resolveLibraryId('turbopack');
// Returns: /context7/makerkit_dev-docs-next-supabase-turbo
```

### 2. Getting Library Documentation

```typescript
// Get comprehensive documentation
const docs = await getLibraryDocs({
  context7CompatibleLibraryID: '/context7/makerkit_dev-docs-next-supabase-turbo',
  topic: 'turbopack configuration',
  tokens: 8000
});
```

### 3. Available Context7 Libraries for Turbopack

| Library | Context7 ID | Description |
|---------|-------------|-------------|
| Makerkit Turbo | `/context7/makerkit_dev-docs-next-supabase-turbo` | Next.js and Supabase SaaS kit with Turbo |
| Turbopuffer | `/context7/turbopuffer_com-docs` | Fast vector search engine |
| Next Fast Turbo | `/cording12/next-fast-turbo` | Turborepo with Next.js and FastAPI |

## Turbopack Benefits

### Performance Improvements

1. **10x Faster Builds**: Significantly faster than Webpack for development
2. **Instant HMR**: Near-instant hot module replacement
3. **Better Caching**: Intelligent caching for improved performance
4. **Zero Config**: Works out of the box with minimal setup

### Development Experience

```bash
# Start development with Turbopack
npm run dev:turbo

# Fallback to Webpack if needed
npm run dev:webpack

# Build for production
npm run build
```

## Context7 MCP Integration Patterns

### 1. Library Research Pattern

```typescript
// Research a new library
const libraryId = await resolveLibraryId('library-name');
const docs = await getLibraryDocs({
  context7CompatibleLibraryID: libraryId,
  topic: 'getting started',
  tokens: 5000
});
```

### 2. Configuration Pattern

```typescript
// Get configuration examples
const configDocs = await getLibraryDocs({
  context7CompatibleLibraryID: '/context7/makerkit_dev-docs-next-supabase-turbo',
  topic: 'configuration',
  tokens: 3000
});
```

### 3. Troubleshooting Pattern

```typescript
// Get troubleshooting information
const troubleshootDocs = await getLibraryDocs({
  context7CompatibleLibraryID: libraryId,
  topic: 'common issues',
  tokens: 4000
});
```

## Best Practices

### 1. Turbopack Optimization

- Use `--turbo` flag for development
- Configure proper resolve aliases
- Optimize package imports in next.config.mjs
- Use stable Turbopack configuration syntax

### 2. Context7 MCP Usage

- Always resolve library IDs before getting docs
- Use specific topics for targeted documentation
- Limit tokens based on your needs (1000-10000)
- Cache frequently accessed documentation

### 3. Development Workflow

```bash
# 1. Start with Turbopack
npm run dev:turbo

# 2. Research libraries with Context7 MCP
# Use the demo page at /context7-demo

# 3. Implement features with fast feedback
# Turbopack provides instant updates

# 4. Build and test
npm run build
```

## Demo Page

Visit `/context7-demo` to see a live demonstration of:

- Context7 MCP library resolution
- Documentation retrieval
- Code examples
- Turbopack integration benefits

## Troubleshooting

### Common Issues

1. **MDX Loader Error**: Ensure MDX configuration is compatible with Turbopack
2. **Alias Resolution**: Use the stable `turbopack.resolveAlias` configuration
3. **Package Optimization**: Add frequently used packages to `optimizePackageImports`

### Solutions

```javascript
// Fix for MDX compatibility
const nextConfig = {
  turbopack: {
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js'],
  },
  // Ensure MDX is properly configured
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
};
```

## Resources

- [Turbopack Documentation](https://turbo.build/pack)
- [Next.js Turbopack Guide](https://nextjs.org/docs/architecture/turbopack)
- [Context7 MCP Documentation](https://context7.ai)
- [Demo Page](/context7-demo)

## Conclusion

Combining Context7 MCP with Turbopack provides a powerful development experience:

- **Fast Development**: Turbopack's 10x faster builds
- **Rich Documentation**: Context7 MCP's comprehensive library access
- **Seamless Integration**: Optimized configuration for both tools
- **Enhanced Productivity**: Instant feedback and comprehensive resources
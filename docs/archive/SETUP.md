# Setup Guide

This comprehensive guide will help you set up the Mikhail Ajaj Portfolio project for development, testing, and deployment.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Development Environment](#development-environment)
- [Configuration](#configuration)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

## 🚀 Quick Start

Get up and running in under 5 minutes:

```bash
# 1. Clone the repository
git clone https://github.com/mikhailajaj/mikhailajaj.github.io.git
cd mikhailajaj.github.io

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# 4. Start development server
npm run dev

# 5. Open browser to http://localhost:3000
```

## 🛠️ Detailed Setup

### Prerequisites

#### Required Software

| Software    | Minimum Version | Recommended | Installation                        |
| ----------- | --------------- | ----------- | ----------------------------------- |
| **Node.js** | 18.0.0          | 20.x LTS    | [nodejs.org](https://nodejs.org/)   |
| **npm**     | 9.0.0           | Latest      | Included with Node.js               |
| **Git**     | 2.0.0           | Latest      | [git-scm.com](https://git-scm.com/) |

#### Optional Tools

| Tool           | Purpose          | Installation                                            |
| -------------- | ---------------- | ------------------------------------------------------- |
| **VS Code**    | Recommended IDE  | [code.visualstudio.com](https://code.visualstudio.com/) |
| **GitHub CLI** | Git operations   | [cli.github.com](https://cli.github.com/)               |
| **Docker**     | Containerization | [docker.com](https://www.docker.com/)                   |

### System Requirements

- **Operating System**: Windows 10+, macOS 10.15+, or Linux
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space for dependencies
- **Network**: Internet connection for package installation

### Installation Steps

#### 1. Verify Prerequisites

```bash
# Check Node.js version
node --version
# Expected: v18.0.0 or higher

# Check npm version
npm --version
# Expected: 9.0.0 or higher

# Check Git version
git --version
# Expected: 2.0.0 or higher
```

#### 2. Clone Repository

```bash
# Using HTTPS
git clone https://github.com/mikhailajaj/mikhailajaj.github.io.git

# Or using SSH (if configured)
git clone git@github.com:mikhailajaj/mikhailajaj.github.io.git

# Navigate to project directory
cd mikhailajaj.github.io
```

#### 3. Install Dependencies

```bash
# Install all dependencies
npm install

# Verify installation
npm list --depth=0
```

#### 4. Environment Configuration

```bash
# Copy environment template
cp .env.example .env.local

# Edit environment variables
# Use your preferred editor (VS Code, nano, vim, etc.)
code .env.local  # VS Code
nano .env.local  # Nano
vim .env.local   # Vim
```

**Required Environment Variables:**

```env
# Analytics (required for full functionality)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token

# Contact Form (required)
NEXT_PUBLIC_CONTACT_EMAIL=your-email@domain.com

# Feature Flags (optional)
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

#### 5. Start Development Server

```bash
# Start development server
npm run dev

# Server will start on http://localhost:3000
# Hot reloading is enabled for development
```

## 💻 Development Environment

### VS Code Setup

#### Recommended Extensions

Install these extensions for optimal development experience:

```bash
# Install VS Code extensions via command line
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension formulahendry.auto-rename-tag
code --install-extension christian-kohler.path-intellisense
```

#### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\\\"\\'\\`]([^\\\"\\'\\`]*).*?[\\\"\\'\\`]"],
    ["cx\\(([^)]*)\\)", "(?:\\'|\\\"|\\`)([^\\']*)(?:\\'|\\\"|\\`)"]
  ],
  "files.associations": {
    "*.mdx": "markdown"
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

#### VS Code Tasks

Create `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "dev",
      "type": "npm",
      "script": "dev",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      },
      "problemMatcher": []
    },
    {
      "label": "build",
      "type": "npm",
      "script": "build",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "label": "lint",
      "type": "npm",
      "script": "lint",
      "group": "test",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    }
  ]
}
```

### Git Configuration

```bash
# Configure Git (if not already done)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set up Git hooks (optional)
npx husky install
```

### Package Scripts

Available npm scripts for development:

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run export       # Export static files

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # TypeScript type checking
npm run format       # Format code with Prettier

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Analysis
npm run analyze      # Analyze bundle size
npm run lighthouse   # Run Lighthouse audit
```

## ⚙️ Configuration

### Next.js Configuration

The project uses `next.config.mjs` for configuration:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for GitHub Pages
  output: "export",
  trailingSlash: true,

  // Image optimization
  images: {
    unoptimized: true, // Required for static export
  },

  // Performance optimizations
  experimental: {
    optimizeCss: true,
  },

  // Remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};
```

### TypeScript Configuration

The project uses strict TypeScript configuration in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Tailwind CSS Configuration

Custom design system in `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette
        primary: {
          50: "#eff6ff",
          500: "#3b82f6",
          900: "#1e3a8a",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

## ✅ Verification

### Development Server Verification

After starting the development server, verify everything is working:

```bash
# 1. Check server is running
curl http://localhost:3000

# 2. Check API routes
curl http://localhost:3000/api/projects
curl http://localhost:3000/api/technologies

# 3. Check static assets
curl http://localhost:3000/favicon.ico
```

### Build Verification

Test the production build:

```bash
# Build the application
npm run build

# Check build output
ls -la out/

# Serve static files locally
npx serve out/

# Test production build
curl http://localhost:3000
```

### Code Quality Verification

Run all quality checks:

```bash
# TypeScript compilation
npm run type-check

# Linting
npm run lint

# Code formatting
npm run format

# Tests (if available)
npm run test

# Bundle analysis
npm run analyze
```

### Performance Verification

Check performance metrics:

```bash
# Lighthouse audit
npm run lighthouse

# Bundle size analysis
npm run analyze

# Core Web Vitals check
# Open browser dev tools and check Performance tab
```

## 🔧 Troubleshooting

### Common Issues

#### Node.js Version Issues

```bash
# Error: Node.js version too old
# Solution: Update Node.js

# Using nvm (recommended)
nvm install 20
nvm use 20

# Or download from nodejs.org
```

#### Dependency Installation Issues

```bash
# Error: npm install fails
# Solution: Clear cache and reinstall

rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

#### Port Already in Use

```bash
# Error: Port 3000 already in use
# Solution: Use different port

npm run dev -- --port 3001

# Or kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

#### Environment Variables Not Loading

```bash
# Error: Environment variables undefined
# Solution: Check file name and location

# Ensure file is named .env.local (not .env.example)
ls -la .env.local

# Check file contents
cat .env.local

# Restart development server
npm run dev
```

#### TypeScript Errors

```bash
# Error: TypeScript compilation errors
# Solution: Check and fix type issues

npm run type-check

# Common fixes:
# 1. Add missing type definitions
# 2. Fix import paths
# 3. Update component prop types
```

#### Build Failures

```bash
# Error: Build fails
# Solution: Debug build process

# Check for TypeScript errors
npm run type-check

# Check for linting errors
npm run lint

# Check for missing dependencies
npm install

# Clear Next.js cache
rm -rf .next
npm run build
```

### Debug Mode

Enable debug mode for additional logging:

```bash
# Set debug mode in .env.local
NEXT_PUBLIC_DEBUG_MODE=true

# Or run with debug flag
DEBUG=* npm run dev
```

### Getting Help

If you encounter issues not covered here:

1. **Check Documentation**: Review `/docs` directory
2. **Search Issues**: Check GitHub Issues for similar problems
3. **Create Issue**: Open a new GitHub Issue with details
4. **Community**: Join discussions in GitHub Discussions

## 🎯 Next Steps

After successful setup:

### Development Workflow

1. **Create Feature Branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**: Follow coding standards in [CONTRIBUTING.md](../CONTRIBUTING.md)

3. **Test Changes**:

   ```bash
   npm run lint
   npm run type-check
   npm run build
   ```

4. **Commit Changes**:

   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push and Create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```

### Learn the Codebase

1. **Architecture**: Review `/docs/architecture/system-overview.md`
2. **Components**: Explore `/components` directory structure
3. **Data Flow**: Understand `/lib/contexts` and `/data` organization
4. **Styling**: Learn the Tailwind CSS patterns used

### Customize for Your Use

1. **Content**: Update project data in `/data` directory
2. **Styling**: Modify `tailwind.config.ts` for your brand
3. **Components**: Customize components in `/components`
4. **Analytics**: Configure your analytics in environment variables

---

## 📞 Support

### Resources

- **Documentation**: `/docs` directory
- **API Reference**: `/docs/API.md`
- **Contributing**: `/CONTRIBUTING.md`
- **Security**: `/SECURITY.md`

### Contact

- **Issues**: GitHub Issues for bugs and feature requests
- **Discussions**: GitHub Discussions for questions
- **Security**: security@mikhailajaj.com for security issues

---

_This setup guide ensures you can quickly get the portfolio project running locally and understand the development workflow. For advanced configuration and deployment, refer to the specialized documentation files._

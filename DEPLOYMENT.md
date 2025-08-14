# Deployment Guide

This file provides a minimal pointer to the deployment source of truth and a quick start.

## Source of Truth

- manual/deployment.json (canonical, structured documentation)

## Prerequisites

- Node.js 18+
- Vercel CLI (optional) `npm i -g vercel`

## Quick Start

```bash
# Build
npm run build

# Static export (if configured)
npm run export

# Preview locally (if needed)
vercel dev
```

## Environment

- See .env.example for required variables
- Update vercel.json for headers and static export configuration

## Troubleshooting

- See manual/troubleshooting.json#build-errors

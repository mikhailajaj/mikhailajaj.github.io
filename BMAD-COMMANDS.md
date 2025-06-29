# BMAD Custom Commands Reference

## Quick Start
```bash
bmad              # Start BMAD orchestrator (same as bmad-start)
bmad-status       # Show system status and available resources
```

## Core Commands

### 🎭 Orchestration
```bash
bmad-start        # Start BMAD orchestrator in portfolio project
bmad-agent        # List all available agents
bmad-agent <name> # Transform to specific agent (e.g., bmad-agent architect)
bmad-workflow     # List all available workflows  
bmad-workflow <name> # Start specific workflow (e.g., bmad-workflow greenfield-fullstack)
bmad-status       # Show BMAD system status and project info
```

### 🚀 Quick Navigation
```bash
bmad-core         # Navigate to .ai/.bmad-core directory
bmad-docs         # Navigate to docs directory
```

## Available Agents
- **orchestrator** - Master coordinator & workflow manager
- **master** - Universal task executor
- **architect** - System design & architecture (Winston)
- **dev** - Code implementation & testing (James)
- **po** - Product owner & backlog management (Sarah)
- **pm** - Project management & coordination
- **analyst** - Research & requirements gathering
- **ux-expert** - UI/UX design & user research
- **qa** - Quality assurance & testing
- **sm** - Scrum master & process management

## Available Workflows

### 🌱 Greenfield (New Projects)
- **greenfield-fullstack** - Full-stack app from concept to dev
- **greenfield-service** - Backend service development
- **greenfield-ui** - Frontend/UI development

### 🏗️ Brownfield (Existing Projects)
- **brownfield-fullstack** - Enhance existing full-stack app
- **brownfield-service** - Enhance existing service
- **brownfield-ui** - Enhance existing UI

## Usage Examples

```bash
# Start a new full-stack project workflow
bmad-workflow greenfield-fullstack

# Transform to architect for system design
bmad-agent architect

# Check current BMAD system status
bmad-status

# Quick start BMAD session
bmad
```

## Important Notes
- All BMAD commands automatically navigate to your portfolio project
- Remember to use `*` prefix for actual BMAD commands (e.g., `*help`, `*agent architect`)
- These shell commands prepare the environment; actual BMAD interaction uses the `*` syntax
- Use `*exit` to return from agent mode to orchestrator mode

## Project Path
Your BMAD portfolio project is located at:
`/Users/mikha2il3ajaj/Development/mikhailajaj.github.io`
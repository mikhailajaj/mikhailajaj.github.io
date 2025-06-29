# BMAD Multi-Agent System Guide

## Overview

The BMAD (Breakthrough Method of Agile AI-driven Development) Multi-Agent System is an advanced framework integrated into your portfolio website project. It provides specialized AI agents that work together to assist with different aspects of web development, design, and planning.

## Key Components

### Orchestrator

The BMAD Orchestrator is the entry point to the multi-agent system. It coordinates between different specialized agents and helps you select the right agent or workflow for your task.

- **Access**: Use the command `*help` to see available commands
- **Agent Selection**: Use `*agent [name]` to switch to a specific agent
- **Workflow Guidance**: Use `*workflow-guidance` to get help selecting the right workflow

### Available Agents

1. **BMad Orchestrator** (Master Coordinator)
   - Coordinates between agents and workflows
   - Provides guidance on which agent to use
   - Manages transitions between agents

2. **Sally (UX Expert)**
   - Specializes in UI/UX design and user experience
   - Creates wireframes, prototypes, and front-end specifications
   - Generates AI UI prompts for tools like v0 or Lovable
   - Commands: `*generate-ui-prompt`, `*research`, `*execute-checklist`

3. **James (Full Stack Developer)**
   - Implements code, debugs issues, and follows best practices
   - Works with stories and tasks sequentially
   - Maintains comprehensive testing
   - Commands: `*run-tests`, `*debug-log`, `*complete-story`

4. **Winston (Architect)**
   - Designs system architecture and technology selection
   - Creates architecture documents and API designs
   - Plans infrastructure and technical specifications
   - Commands: `*execute-checklist`, `*research`

5. **Mary (Business Analyst)**
   - Conducts market research and competitive analysis
   - Facilitates brainstorming and project discovery
   - Creates project briefs and initial requirements
   - Commands: `*brainstorm`, `*research`, `*elicit`

6. **John (Product Manager)**
   - Creates PRDs and product strategy
   - Prioritizes features and plans roadmaps
   - Manages stakeholder communication
   - Commands: `*create-doc`, `*correct-course`

7. **Sarah (Product Owner)**
   - Manages backlog and refines stories
   - Creates acceptance criteria and sprint planning
   - Makes prioritization decisions
   - Commands: `*execute-checklist`, `*shard-doc`, `*create-epic`, `*create-story`

8. **Quinn (QA Test Architect)**
   - Plans testing strategies and creates test cases
   - Ensures quality assurance and reports bugs
   - Designs automation frameworks
   - Commands: `*create-doc`

9. **Bob (Scrum Master)**
   - Creates stories and manages epics
   - Facilitates retrospectives and provides agile guidance
   - Prepares detailed, actionable stories for AI developers
   - Commands: `*create|draft`, `*pivot`, `*checklist`

## Using the Multi-Agent System

### Basic Commands

All commands must start with an asterisk (`*`):

- `*help`: Show available commands for the current agent
- `*agent [name]`: Switch to a specific agent
- `*exit`: Exit the current agent
- `*chat-mode`: Start conversational mode with the current agent
- `*status`: Show current context and progress

### Workflow Commands

- `*workflow [name]`: Start a specific workflow
- `*workflow-guidance`: Get help selecting the right workflow
- `*task [name]`: Run a specific task
- `*checklist [name]`: Execute a checklist

### Advanced Commands

- `*kb-mode`: Access the full BMAD knowledge base
- `*party-mode`: Group chat with all agents
- `*yolo`: Toggle skip confirmations mode
- `*doc-out`: Output full document

## Workflows

The BMAD system includes several predefined workflows for different project types:

1. **Greenfield Full-Stack Application Development**
   - Complete workflow for building full-stack applications from concept to development
   - Includes project brief, PRD, UI/UX spec, architecture, and validation

2. **Brownfield Full-Stack Enhancement**
   - Workflow for enhancing existing full-stack applications
   - Analyzes current state and plans enhancements

3. **UI-Focused Development**
   - Specialized workflow for UI-centric projects
   - Emphasizes UX design and front-end development

4. **Service-Focused Development**
   - Workflow for backend services and APIs
   - Focuses on architecture and API design

## Best Practices

1. **Start with the Orchestrator**
   - Begin by using `*help` to see available options
   - Let the Orchestrator guide you to the right agent

2. **Use Specialized Agents for Specific Tasks**
   - Switch to the UX Expert for design tasks
   - Use the Developer for implementation
   - Consult the Architect for technical decisions

3. **Follow Workflows for Complex Projects**
   - Use `*workflow-guidance` to select the appropriate workflow
   - Follow the recommended sequence of agents and deliverables

4. **Document Management**
   - Save important documents in the docs/ folder
   - Follow the naming conventions suggested by agents

5. **Switching Between Agents**
   - Use `*exit` to return to the Orchestrator
   - Then use `*agent [name]` to switch to another agent

## Example Usage

1. **Starting a New Project**:
   ```
   *workflow-guidance
   # Select "Greenfield Full-Stack Application Development"
   *agent analyst
   # Work with analyst to create project brief
   *exit
   *agent pm
   # Work with PM to create PRD
   ```

2. **Getting UI/UX Help**:
   ```
   *agent ux-expert
   *chat-mode
   # Discuss UI/UX needs
   *generate-ui-prompt
   # Get AI-generated UI prompt
   ```

3. **Implementing Code**:
   ```
   *agent dev
   *run-tests
   # Review test results
   *complete-story
   # Mark story as complete
   ```

## Troubleshooting

- If an agent doesn't respond as expected, return to the Orchestrator with `*exit`
- If you're unsure which agent to use, ask the Orchestrator with `*help`
- If a workflow gets stuck, use `*status` to check progress and `*exit` to reset

Remember that all commands must start with an asterisk (`*`) to be recognized by the BMAD system.
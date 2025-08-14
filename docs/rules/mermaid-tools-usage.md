# Mermaid Tools Usage Guidelines

## Overview

This document outlines the guidelines for using Mermaid diagramming tools within the Mikhail Ajaj Portfolio project. These guidelines ensure consistency, maintainability, and accessibility across all diagrams while aligning with software engineering best practices.

## Tools and Resources

### Recommended Tools

1. **Mermaid Live Editor**
   - Primary tool for creating and editing diagrams
   - URL: [https://mermaid.live/](https://mermaid.live/)
   - Features: Real-time preview, syntax highlighting, theme customization, export options

2. **VS Code with Mermaid Extension**
   - For integrated development workflow
   - Recommended extensions:
     - "Markdown Preview Mermaid Support"
     - "Mermaid Markdown Syntax Highlighting"

3. **GitHub/GitLab Markdown Preview**
   - For viewing diagrams directly in repository documentation

### Project Resources

1. **Templates Directory**
   - Location: `/mermaid/templates/`
   - Purpose: Starting points for common diagram types
   - Usage: Copy appropriate template when creating new diagrams

2. **Examples Directory**
   - Location: `/mermaid/examples/`
   - Purpose: Reference implementations for different diagram types
   - Usage: Consult for syntax and styling examples

3. **High Contrast Style Guide**
   - Location: `/documentation/guides/high-contrast-mermaid-style-guide.md`
   - Purpose: Accessibility standards for diagrams
   - Usage: Apply these styles to all diagrams

## Workflow Guidelines

### Diagram Creation Process

1. **Planning Phase**
   - Determine diagram purpose and target audience
   - Select appropriate diagram type based on information to be conveyed
   - Identify key elements and relationships to include
   - Consider diagram complexity and potential need for decomposition

2. **Development Phase**
   - Start with appropriate template from `/mermaid/templates/`
   - Develop diagram incrementally, testing syntax at each step
   - Apply high contrast styling according to accessibility guidelines
   - Validate diagram against software engineering best practices

3. **Review Phase**
   - Test diagram in grayscale to ensure accessibility
   - Verify that diagram follows project conventions
   - Ensure diagram effectively communicates intended information
   - Validate technical accuracy with relevant stakeholders

4. **Integration Phase**
   - Save diagram as `.mmd` file in appropriate location
   - Update documentation to reference or include the diagram
   - Commit diagram source to version control
   - Export image versions if needed for external documentation

### Version Control Integration

1. **Storage**
   - Store all diagram source files (`.mmd`) in version control
   - Place diagrams in the `/documentation/diagrams/` directory
   - Use appropriate subdirectories for organization when necessary

2. **Naming Convention**
   - Use descriptive, kebab-case names: `feature-name-diagram-type.mmd`
   - For numbered diagrams, follow established numbering convention
   - Include diagram type in filename for clarity

3. **Change Management**
   - Include diagram changes in relevant feature branches
   - Document significant diagram changes in commit messages
   - Update related documentation when diagrams change

## Diagram Selection Guide

Select the appropriate diagram type based on what you need to communicate:

| What You Need to Show | Recommended Diagram Type | Template Location |
|------------------------|--------------------------|-------------------|
| System overview and context | Context Diagram | `/mermaid/templates/architecture.mmd` |
| Component relationships | Component Diagram | `/mermaid/templates/architecture.mmd` |
| Process flows and decisions | Flowchart | `/mermaid/templates/user-flow.mmd` |
| Sequential interactions | Sequence Diagram | `/mermaid/templates/api-flow.mmd` |
| Data structures and relationships | Class/ER Diagram | `/mermaid/templates/data-model.mmd` |
| System architecture | C4 Model | `/mermaid/templates/c4-model.mmd` |
| Detailed process flows | ZenUML | `/mermaid/templates/zenuml.mmd` |

## Integration with Task Management

### Task Documentation Structure

1. **Task JSON Structure**
   - Add diagram references in the `details` field of tasks.json
   - Include diagram requirements as part of the documentation section
   - For diagram-related work, use the following structure in the `details` field:
     ```
     details: "... other task details ...

## Documentation [pending]
- Add README.md file to the feature directory
- Document the component architecture and usage patterns
- Create/Update [diagram type] diagram including:
  - [Component/relationship 1]
  - [Component/relationship 2]
  - [Component/relationship 3]
- Store diagram at: documentation/diagrams/[filename].mmd"
     ```

2. **Acceptance Criteria Integration**
   - Include diagram requirements in the `acceptanceCriteria` field
   - Specify quality standards for diagrams
   - Example acceptance criteria:
     ```
     "acceptanceCriteria": "- Feature is fully documented with usage examples
- Architecture diagrams show component relationships
- Diagrams follow high contrast accessibility guidelines
- All diagram files are stored in the documentation/diagrams directory
- Diagrams are referenced in relevant documentation"
     ```

### Task Documentation

1. **Task Requirements**
   - Include references to relevant diagrams in task descriptions
   - Link to existing diagrams that provide context for the task
   - Specify when new diagrams should be created as part of a task
   - Use the format `See diagram: documentation/diagrams/[filename].mmd` for references

2. **Definition of Done**
   - Include diagram creation/updates as part of the documentation requirements
   - Add diagram verification to the testing strategy when applicable
   - Example testing strategy that includes diagram verification:
     ```
     "testStrategy": "- Verify component functionality through unit tests
- Ensure documentation is complete and accurate
- Review diagrams for technical accuracy and adherence to project standards
- Validate that diagrams follow accessibility guidelines"
     ```
   - Verify diagrams are accessible and follow project standards
   - Ensure diagrams are properly integrated with documentation

### Task Types

1. **Diagram as Part of Documentation Tasks**
   - Include diagram requirements as part of documentation tasks
   - Add diagram creation as a specific bullet point in the task details
   - Example approach in existing task structure:
     ```
     {
       "id": 52,
       "title": "Create Marketing Feature Index and Barrel Exports",
       "description": "Implement a proper index file for the marketing feature to export all components and utilities.",
       "status": "pending",
       "dependencies": [50],
       "priority": "medium",
       "details": "Create a comprehensive index file for the marketing feature to improve code organization and imports:\n\n## 1. Create Main Index File [pending]\n...\n\n## 4. Documentation [pending]\n- Add README.md file to the marketing feature directory\n- Document the component architecture and usage patterns\n- Include examples of how to use the components\n- Document available configuration options\n- Add diagrams if necessary\n\n## 5. Testing [pending]\n..."
     }
     ```

2. **Creating Dedicated Diagram Tasks**
   - When significant diagramming work is needed, create a dedicated subtask
   - Include clear acceptance criteria for diagram deliverables
   - Allocate appropriate time for diagram creation and review
   - Example subtask structure:
     ```
     {
       "id": 4,
       "title": "Create Architecture Diagrams",
       "description": "Design and implement the core architecture diagrams for the system.",
       "status": "pending",
       "dependencies": [],
       "acceptanceCriteria": "- System Context Diagram includes all external systems and actors\n- Container Diagram shows all major system components\n- Component Diagram details internal structure of key containers\n- All diagrams follow the C4 model approach\n- Diagrams adhere to high contrast accessibility guidelines"
     }
     ```

3. **Documentation Tasks**
   - Include diagram requirements in documentation tasks
   - Specify which aspects of the system should be visualized
   - Reference software engineering principles that should be reflected
   - Link diagrams to specific documentation sections

## Software Engineering Alignment

### Graph Structure Best Practices

1. **Hierarchical Organization**
   - Organize nodes in a clear hierarchical structure
   - Use top-down flow for process and architecture diagrams
   - Use left-right flow for timeline and sequence diagrams
   - Example structure:
     ```
     graph TD
         SystemLevel[System] --> SubsystemA[Subsystem A]
         SystemLevel --> SubsystemB[Subsystem B]
         SubsystemA --> ComponentA1[Component A1]
         SubsystemA --> ComponentA2[Component A2]
         SubsystemB --> ComponentB1[Component B1]
     ```

2. **Logical Grouping with Subgraphs**
   - Group related elements using subgraphs
   - Use meaningful subgraph titles that describe the group's purpose
   - Nest subgraphs to represent containment relationships
   - Example structure:
     ```
     graph TD
         subgraph "Frontend Layer"
             UI[User Interface]
             State[State Management]
         end

         subgraph "Backend Layer"
             API[API Controllers]
             Service[Service Layer]
             subgraph "Data Access"
                 Repository[Repositories]
                 ORM[ORM]
             end
         end

         UI --> API
         API --> Service
         Service --> Repository
     ```

3. **Relationship Clarity**
   - Use appropriate arrow types to indicate relationship types
   - Label relationships to describe their nature
   - Maintain consistent relationship notation across diagrams
   - Example structure:
     ```
     graph TD
         User -->|"uses"| Interface
         Interface -->|"calls"| Service
         Service -.->|"depends on"| Repository
         Repository ==>|"reads/writes"| Database
     ```

4. **Balanced Complexity**
   - Limit diagrams to 7±2 major elements per level
   - Use consistent node shapes based on element types
   - Balance detail with clarity - avoid overly complex or simplistic diagrams

### Architectural Principles

1. **Separation of Concerns**
   - Create separate diagrams for different aspects of the system
   - Use subgraphs to group related components
   - Maintain clear boundaries between system layers
   - Example structure:
     ```
     graph TD
         subgraph "Presentation Layer"
             UI[User Interface]
             Components[UI Components]
         end

         subgraph "Business Logic Layer"
             Services[Services]
             Domain[Domain Model]
         end

         subgraph "Data Access Layer"
             Repositories[Repositories]
             DataSources[Data Sources]
         end

         UI --> Components
         Components --> Services
         Services --> Domain
         Domain --> Repositories
         Repositories --> DataSources
     ```

2. **Single Responsibility**
   - Focus each diagram on a single concept or view
   - Avoid mixing different levels of abstraction
   - Create multiple diagrams rather than overloading a single diagram
   - Example approach:
     - Create separate diagrams for system context, components, and data flow
     - Link related diagrams with references
     - Use consistent naming conventions across diagram sets

3. **Abstraction Levels**
   - Provide overview diagrams with links to detailed diagrams
   - Use consistent abstraction levels within each diagram
   - Follow the C4 model approach: Context, Container, Component, Code
   - Example C4 structure:
     ```
     %% Context Diagram (Level 1)
     graph TD
         User((User)) -->|Uses| System[System]
         System -->|Uses| Database[(Database)]
         System -->|Calls| ExternalAPI[External API]

     %% Container Diagram (Level 2) would be in a separate file
     %% Component Diagram (Level 3) would be in a separate file
     %% Code Diagram (Level 4) would be in a separate file
     ```

### Documentation Integration

1. **Living Documentation**
   - Keep diagrams synchronized with code changes
   - Update diagrams when architecture or processes change
   - Include diagram review in code review process

2. **Knowledge Sharing**
   - Use diagrams to onboard new team members
   - Reference diagrams in technical discussions
   - Include diagrams in architectural decision records

## Accessibility and Usability

### Accessibility Requirements

1. **Color Contrast**
   - Follow WCAG AA standards (4.5:1 contrast ratio)
   - Use the project's high contrast color palette
   - Test diagrams in grayscale

2. **Text Readability**
   - Use concise, clear text labels
   - Maintain appropriate text size
   - Avoid overloading diagrams with text

### Usability Considerations

1. **Cognitive Load**
   - Limit diagram complexity (7±2 elements per diagram)
   - Use consistent layouts and patterns
   - Provide clear entry points and flow direction

2. **Consistency**
   - Use consistent symbols across related diagrams
   - Maintain consistent terminology with code and documentation
   - Apply consistent styling according to project standards

## Maintenance and Evolution

### Diagram Lifecycle

1. **Creation**: Initial development following project standards
2. **Validation**: Review for accuracy, clarity, and compliance
3. **Integration**: Incorporation into project documentation
4. **Maintenance**: Regular updates to reflect system changes
5. **Archiving**: Proper versioning of outdated diagrams

### Continuous Improvement

1. **Regular Reviews**
   - Schedule periodic reviews of key diagrams
   - Update diagrams during architectural reviews
   - Refactor complex diagrams when needed

2. **Feedback Integration**
   - Collect feedback on diagram clarity and usefulness
   - Refine diagram standards based on team experience
   - Incorporate new Mermaid features when beneficial

## Conclusion

These guidelines provide a framework for effective use of Mermaid diagramming tools within the Mikhail Ajaj Portfolio project. By following these practices, we ensure that diagrams serve as valuable, accessible, and maintainable documentation that aligns with our software engineering principles.

# Mermaid Diagrams Rules

## File Structure

1. **File Content**: Each diagram file should contain only the Mermaid diagram code without any markdown formatting, titles, or descriptions.

2. **File Extension**: Use `.mmd` extension for all Mermaid diagram files.

3. **File Naming**:
   - Use descriptive names for diagram files
   - For numbered diagrams, follow this convention:
     - Main diagrams: Use whole numbers (e.g., `10-sequence-diagram.mmd`)
     - Sub-diagrams: Use decimal notation (e.g., `10.1-project-creation-sequence.mmd`)

4. **File Organization**:
   - If a diagram has multiple sub-diagrams, extract each into its own file with appropriate numbering
   - Store all diagrams in the `documentation/diagrams/` directory

## Syntax Rules

1. **General Syntax**:
   - Do not use semicolons at the end of statements
   - Use proper indentation for readability
   - Use spaces after commas and colons

2. **Graph Declaration**:
   - For flowcharts: `graph TD` (top-down) or `graph LR` (left-right)
   - For sequence diagrams: `sequenceDiagram`
   - For state diagrams: `stateDiagram-v2`
   - For class diagrams: `classDiagram`
   - For entity-relationship diagrams: `erDiagram`

3. **Node Definitions**:
   - Use descriptive IDs for nodes
   - Use square brackets for node labels: `Node1[Label Text]`
   - For special shapes:
     - Rounded rectangles: `Node1(Text)`
     - Circles: `Node1((Text))`
     - Databases: `Node1[(Text)]`

4. **Connections**:
   - Basic connection: `NodeA --> NodeB`
   - With text: `NodeA -->|Text| NodeB`
   - Dotted line: `NodeA -.-> NodeB`
   - Thick line: `NodeA ==> NodeB`

5. **Subgraphs**:
   - Define subgraphs with descriptive names:
     ```
     subgraph "Group Name"
         Node1[Label 1]
         Node2[Label 2]
     end
     ```

6. **Comments**:
   - Use `%%` for comments
   - Group related sections with comment headers

7. **Styling**:
   - Define classes for styling: `classDef className fill:#color,stroke:#color,stroke-width:Npx,color:#textColor`
   - Apply classes to nodes: `class Node1,Node2 className`
   - Always include text color (`color:#textColor`) to ensure readability
   - Follow the high contrast color palette defined in the Accessibility section

## Diagram-Specific Rules

### Sequence Diagrams

1. **Actors and Participants**:
   ```
   actor User
   participant System
   ```

2. **Messages**:
   - Solid arrow: `User->>System: Action`
   - Dashed arrow (response): `System-->>User: Response`

3. **Alternative Flows**:
   ```
   alt Condition
       Source->>Target: Message
   else Alternative
       Source->>Target: Different Message
   end
   ```

### State Machine Diagrams

1. **States and Transitions**:
   ```
   [*] --> FirstState: Initial Action
   FirstState --> SecondState: Trigger
   SecondState --> [*]: End Action
   ```

2. **Notes**:
   ```
   note right of State
       Note text here
       can be multiline
   end note
   ```

### Class Diagrams

1. **Class Definition**:
   ```
   class ClassName {
       +publicMethod(): ReturnType
       -privateProperty: Type
   }
   ```

2. **Relationships**:
   - Inheritance: `ClassA --|> ClassB`
   - Composition: `ClassA *-- ClassB`
   - Aggregation: `ClassA o-- ClassB`

### Data Flow Diagrams

1. **Entity Types**:
   - External entities: `Entity((Name))`
   - Processes: `Process[Name]`
   - Data stores: `Store[(Name)]`

2. **Data Flows**:
   - Label all flows: `Source -->|Data| Target`

## Best Practices

1. **Simplicity**:
   - Keep diagrams focused on a single concept
   - Break complex diagrams into multiple simpler ones

2. **Consistency**:
   - Use consistent naming conventions
   - Use consistent styling across related diagrams
   - Use consistent direction (TD or LR) for related diagrams

3. **Readability**:
   - Limit the number of nodes in a single diagram
   - Use meaningful labels
   - Group related elements using subgraphs
   - Use comments to explain complex parts

4. **Organization**:
   - Use a numbering system for related diagrams
   - Create overview diagrams that link to more detailed ones

5. **Styling**:
   - Use colors consistently to represent different types of elements
   - Don't overuse colors or styles
   - Ensure sufficient contrast for readability

## Accessibility Guidelines

1. **Color Contrast**:
   - Maintain a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text (WCAG AA standard)
   - Avoid using pure white (#FFFFFF) and pure black (#000000) to reduce eye strain
   - Use off-white (#F5F5F5) and dark gray (#222222) instead

2. **Standard High Contrast Color Palette**:

   | Element Type | Fill Color | Stroke Color | Text Color | Description |
   |--------------|------------|--------------|------------|--------------|
   | Container    | #0057b8 (Blue) | #222222 | #FFFFFF | Main containers and primary elements |
   | Context      | #006e3c (Green) | #222222 | #FFFFFF | Context providers and environmental elements |
   | Step         | #6a1b9a (Purple) | #222222 | #FFFFFF | Process steps and workflow stages |
   | Component    | #d0004b (Red) | #222222 | #FFFFFF | UI components and interactive elements |
   | Shared       | #00796b (Teal) | #222222 | #FFFFFF | Shared utilities and common elements |
   | Hooks        | #00838f (Cyan) | #222222 | #FFFFFF | Hooks and state management |
   | Server       | #c2185b (Magenta) | #222222 | #FFFFFF | Server-side actions and API endpoints |

3. **Flowchart-Specific Colors**:

   | Element Type | Fill Color | Stroke Color | Text Color | Description |
   |--------------|------------|--------------|------------|--------------|
   | Process      | #f5f5f5 (Light Gray) | #222222 | #222222 | Process steps in flowcharts |
   | Decision     | #0057b8 (Blue) | #222222 | #FFFFFF | Decision points in flowcharts |
   | Terminator   | #006e3c (Green) | #222222 | #FFFFFF | Start/end points in flowcharts |
   | Subgraph     | #f8f8f8 (Off-White) | #222222 | #222222 | Subgraphs and groupings |

4. **Implementation Example**:
   ```
   classDef container fill:#0057b8,stroke:#222,stroke-width:2px,color:#fff
   classDef context fill:#006e3c,stroke:#222,stroke-width:2px,color:#fff
   classDef step fill:#6a1b9a,stroke:#222,stroke-width:2px,color:#fff
   classDef component fill:#d0004b,stroke:#222,stroke-width:1px,color:#fff
   classDef shared fill:#00796b,stroke:#222,stroke-width:1px,color:#fff
   classDef hooks fill:#00838f,stroke:#222,stroke-width:1px,color:#fff
   classDef server fill:#c2185b,stroke:#222,stroke-width:1px,color:#fff
   ```

5. **Additional Accessibility Considerations**:
   - Use both color and shape/border to distinguish elements
   - Test diagrams in grayscale to ensure they remain understandable without color
   - Keep visual hierarchy clear with limited color palette
   - Ensure text size is appropriate for readability

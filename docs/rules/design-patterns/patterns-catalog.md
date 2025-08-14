# Design Patterns Catalog

This catalog provides a quick reference to all design patterns recommended for use in the Mikhail Ajaj Portfolio project, organized by category.

## Table of Contents

1. [Creational Patterns](#creational-patterns)
2. [Structural Patterns](#structural-patterns)
3. [Behavioral Patterns](#behavioral-patterns)
4. [Architectural Patterns](#architectural-patterns)
5. [React Patterns](#react-patterns)
6. [Pattern Selection Guide](#pattern-selection-guide)

## Creational Patterns

Patterns that deal with object creation mechanisms.

| Pattern | Intent | When to Use | Key Benefits |
|---------|--------|-------------|--------------|
| [Factory Method](./creational/factory-method.md) | Define an interface for creating an object, but let subclasses decide which class to instantiate | When a class can't anticipate the type of objects it must create | Decouples object creation from its use |
| [Abstract Factory](./creational/abstract-factory.md) | Provide an interface for creating families of related objects | When a system needs to be independent from how its products are created | Ensures compatibility between created objects |
| [Builder](./creational/builder.md) | Separate the construction of a complex object from its representation | When an object has a complex construction process | Makes creating complex objects step-by-step |
| [Singleton](./creational/singleton.md) | Ensure a class has only one instance and provide a global point of access to it | When exactly one instance of a class is needed | Provides controlled access to the sole instance |
| [Prototype](./creational/prototype.md) | Create new objects by copying an existing object | When creating an object is more efficient by copying an existing one | Reduces subclassing and hides complex creation |

## Structural Patterns

Patterns that deal with object composition and relationships.

| Pattern | Intent | When to Use | Key Benefits |
|---------|--------|-------------|--------------|
| [Adapter](./structural/adapter.md) | Convert the interface of a class into another interface clients expect | When you need to use an existing class with an incompatible interface | Makes incompatible interfaces work together |
| [Bridge](./structural/bridge.md) | Separate an abstraction from its implementation so both can vary independently | When you want to avoid a permanent binding between an abstraction and its implementation | Decouples interface from implementation |
| [Composite](./structural/composite.md) | Compose objects into tree structures to represent part-whole hierarchies | When clients should treat individual objects and compositions uniformly | Simplifies client code that deals with hierarchies |
| [Decorator](./structural/decorator.md) | Attach additional responsibilities to an object dynamically | When you need to add responsibilities to objects without subclassing | Provides a flexible alternative to subclassing |
| [Facade](./structural/facade.md) | Provide a unified interface to a set of interfaces in a subsystem | When you need a simple interface to a complex subsystem | Simplifies a complex system with a single interface |
| [Flyweight](./structural/flyweight.md) | Use sharing to support large numbers of fine-grained objects efficiently | When you need to use a large number of similar objects | Reduces memory usage by sharing common state |
| [Proxy](./structural/proxy.md) | Provide a surrogate or placeholder for another object to control access to it | When you need to control access to an object | Adds a level of indirection for object access |

## Behavioral Patterns

Patterns that deal with object interaction and responsibility.

| Pattern | Intent | When to Use | Key Benefits |
|---------|--------|-------------|--------------|
| [Chain of Responsibility](./behavioral/chain-of-responsibility.md) | Pass a request along a chain of handlers | When more than one object may handle a request | Decouples sender and receiver of a request |
| [Command](./behavioral/command.md) | Encapsulate a request as an object | When you want to parameterize objects with operations | Decouples the object that invokes the operation |
| [Interpreter](./behavioral/interpreter.md) | Define a grammar for a language and an interpreter for the grammar | When you need to interpret a language | Implements a specialized language |
| [Iterator](./behavioral/iterator.md) | Provide a way to access elements of a collection sequentially | When you need to traverse a collection without exposing its structure | Simplifies collection traversal |
| [Mediator](./behavioral/mediator.md) | Define an object that encapsulates how a set of objects interact | When object communication is complex | Reduces coupling between communicating objects |
| [Memento](./behavioral/memento.md) | Capture and externalize an object's internal state | When you need to save and restore an object's state | Preserves encapsulation while allowing state capture |
| [Observer](./behavioral/observer.md) | Define a one-to-many dependency between objects | When a change to one object requires changing others | Supports loose coupling between related objects |
| [State](./behavioral/state.md) | Allow an object to alter its behavior when its internal state changes | When an object's behavior depends on its state | Localizes state-specific behavior |
| [Strategy](./behavioral/strategy.md) | Define a family of algorithms, encapsulate each one, and make them interchangeable | When you need different variants of an algorithm | Makes algorithms interchangeable within a family |
| [Template Method](./behavioral/template-method.md) | Define the skeleton of an algorithm, deferring some steps to subclasses | When you want to define the structure of an algorithm but allow steps to vary | Reuses algorithm structure while allowing customization |
| [Visitor](./behavioral/visitor.md) | Represent an operation to be performed on elements of an object structure | When you need to perform operations across a disparate object structure | Separates an algorithm from the objects it operates on |

## Architectural Patterns

Patterns that address system-level design concerns.

| Pattern | Intent | When to Use | Key Benefits |
|---------|--------|-------------|--------------|
| [Repository](./architectural/repository.md) | Mediate between the domain and data mapping layers | When you need to abstract data access from business logic | Centralizes data access logic |
| [Service](./architectural/service.md) | Provide operations that aren't a natural part of a domain object | When an operation doesn't belong to any specific domain object | Keeps domain objects focused and cohesive |
| [Unit of Work](./architectural/unit-of-work.md) | Maintain a list of objects affected by a business transaction | When you need to coordinate the writing of changes | Ensures consistency and manages transactions |
| [Dependency Injection](./architectural/dependency-injection.md) | Pass the dependencies of an object to its constructor or methods | When you want to decouple object creation from its use | Improves testability and flexibility |
| [CQRS](./architectural/cqrs.md) | Separate read and update operations for a data store | When read and write requirements are significantly different | Optimizes for both reading and writing |
| [Event Sourcing](./architectural/event-sourcing.md) | Capture all changes to an application state as a sequence of events | When you need a complete history of state changes | Provides audit trail and temporal queries |

## React Patterns

Patterns specific to React development.

| Pattern | Intent | When to Use | Key Benefits |
|---------|--------|-------------|--------------|
| [Compound Components](./react/compound-components.md) | Create components that work together to form a complete UI | When components are tightly coupled in functionality | Provides a more declarative and flexible API |
| [Render Props](./react/render-props.md) | Share code between components using a prop whose value is a function | When you need to share behavior between components | Enables component composition with shared behavior |
| [Higher-Order Components](./react/higher-order-components.md) | A function that takes a component and returns a new component | When you need to reuse component logic | Composes behavior onto existing components |
| [Custom Hooks](./react/custom-hooks.md) | Extract stateful logic from components into reusable functions | When you need to reuse stateful logic | Simplifies components and promotes code reuse |
| [Context](./react/context.md) | Provide a way to pass data through the component tree without props | When data needs to be accessible by many components | Avoids prop drilling through intermediate components |
| [State Machines](./react/state-machines.md) | Manage component state transitions | When a component has complex state logic | Makes state transitions explicit and predictable |

## Pattern Selection Guide

Choosing the right pattern for a specific situation is crucial. Here's a decision tree to help you select the appropriate pattern:

### Problem: Object Creation

- **Need to create objects without specifying exact class?**
  - **Creating families of related objects?** → [Abstract Factory](./creational/abstract-factory.md)
  - **Letting subclasses decide what to create?** → [Factory Method](./creational/factory-method.md)
  - **Creating objects by copying existing ones?** → [Prototype](./creational/prototype.md)

- **Need to control the creation process?**
  - **Complex object with many optional parameters?** → [Builder](./creational/builder.md)
  - **Need exactly one instance?** → [Singleton](./creational/singleton.md)

### Problem: Object Structure

- **Need to adapt interfaces?**
  - **Making incompatible interfaces work together?** → [Adapter](./structural/adapter.md)
  - **Simplifying complex subsystem?** → [Facade](./structural/facade.md)

- **Need to compose objects?**
  - **Treating individual objects and compositions uniformly?** → [Composite](./structural/composite.md)
  - **Separating abstraction from implementation?** → [Bridge](./structural/bridge.md)

- **Need to modify object behavior?**
  - **Adding responsibilities dynamically?** → [Decorator](./structural/decorator.md)
  - **Controlling access to an object?** → [Proxy](./structural/proxy.md)

- **Need to optimize memory usage?**
  - **Many similar objects consuming too much memory?** → [Flyweight](./structural/flyweight.md)

### Problem: Object Behavior

- **Need to define how objects interact?**
  - **One-to-many dependencies between objects?** → [Observer](./behavioral/observer.md)
  - **Complex communication between objects?** → [Mediator](./behavioral/mediator.md)

- **Need to encapsulate behavior?**
  - **Parameterizing objects with operations?** → [Command](./behavioral/command.md)
  - **Family of interchangeable algorithms?** → [Strategy](./behavioral/strategy.md)
  - **Behavior dependent on object state?** → [State](./behavioral/state.md)

- **Need to traverse or operate on structures?**
  - **Accessing collection elements sequentially?** → [Iterator](./behavioral/iterator.md)
  - **Operations on elements of an object structure?** → [Visitor](./behavioral/visitor.md)

- **Need to handle requests?**
  - **Multiple objects may handle a request?** → [Chain of Responsibility](./behavioral/chain-of-responsibility.md)

- **Need to define algorithm structure?**
  - **Algorithm skeleton with some steps deferred?** → [Template Method](./behavioral/template-method.md)

- **Need to capture object state?**
  - **Saving and restoring object state?** → [Memento](./behavioral/memento.md)

- **Need to interpret a language?**
  - **Grammar for a simple language?** → [Interpreter](./behavioral/interpreter.md)

### Problem: Architecture

- **Need to abstract data access?**
  - **Centralizing data access logic?** → [Repository](./architectural/repository.md)
  - **Coordinating changes to multiple objects?** → [Unit of Work](./architectural/unit-of-work.md)

- **Need to organize business logic?**
  - **Operations that don't belong to domain objects?** → [Service](./architectural/service.md)
  - **Decoupling object creation from use?** → [Dependency Injection](./architectural/dependency-injection.md)

- **Need to optimize for different access patterns?**
  - **Different requirements for reads and writes?** → [CQRS](./architectural/cqrs.md)
  - **Complete history of state changes?** → [Event Sourcing](./architectural/event-sourcing.md)

### Problem: React Component Design

- **Need to share component logic?**
  - **Stateful logic reuse between components?** → [Custom Hooks](./react/custom-hooks.md)
  - **Enhancing components with additional behavior?** → [Higher-Order Components](./react/higher-order-components.md)
  - **Sharing rendering logic?** → [Render Props](./react/render-props.md)

- **Need to manage component relationships?**
  - **Components that work together as a unit?** → [Compound Components](./react/compound-components.md)
  - **Data needed by many components?** → [Context](./react/context.md)

- **Need to manage complex state?**
  - **Complex state transitions?** → [State Machines](./react/state-machines.md)

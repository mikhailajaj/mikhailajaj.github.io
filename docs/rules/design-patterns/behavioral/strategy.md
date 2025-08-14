# Strategy Pattern

## Overview

The Strategy pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable. It lets the algorithm vary independently from clients that use it. This pattern is particularly useful when you have multiple ways to perform an operation and need to select the appropriate implementation at runtime.

## Table of Contents

1. [Purpose](#purpose)
2. [Structure](#structure)
3. [Implementation in Mikhail Ajaj Portfolio](#implementation-in-constructit)
4. [Benefits](#benefits)
5. [Considerations](#considerations)
6. [Examples](#examples)
7. [Related Patterns](#related-patterns)

## Purpose

The Strategy pattern serves several purposes:

- **Algorithm Encapsulation**: Encapsulates algorithms in separate classes
- **Runtime Selection**: Allows selecting the appropriate algorithm at runtime
- **Eliminates Conditional Logic**: Replaces complex conditional statements with polymorphism
- **Open/Closed Principle**: Makes it easy to add new strategies without modifying existing code
- **Separation of Concerns**: Separates the algorithm from the context that uses it

## Structure

A typical Strategy implementation includes:

1. **Strategy Interface**: Defines the common interface for all concrete strategies
2. **Concrete Strategies**: Implement the strategy interface with specific algorithms
3. **Context**: Maintains a reference to a strategy object and delegates to it

```
┌───────────────┐       ┌───────────────┐
│               │       │               │
│    Context    │◆─────▶│    Strategy   │
│               │       │   Interface   │
└───────────────┘       └───────────────┘
                                ▲
                                │
                 ┌──────────────┼──────────────┐
                 │              │              │
        ┌────────┴─────┐ ┌──────┴───────┐ ┌────┴────────┐
        │              │ │              │ │             │
        │  Concrete    │ │  Concrete    │ │  Concrete   │
        │  Strategy A  │ │  Strategy B  │ │  Strategy C │
        │              │ │              │ │             │
        └──────────────┘ └──────────────┘ └─────────────┘
```

## Implementation in Mikhail Ajaj Portfolio

In the Mikhail Ajaj Portfolio project, the Strategy pattern should be implemented following these guidelines:

### Strategy Interface

```typescript
// features/estimator/types/pricing-strategy.ts
import { Material } from './material';

export interface PricingStrategy {
  calculatePrice(material: Material, quantity: number): Promise<number>;
  getName(): string;
  getDescription(): string;
}
```

### Concrete Strategies

```typescript
// features/estimator/services/pricing/home-depot-pricing-strategy.ts
import { PricingStrategy } from '../../types/pricing-strategy';
import { Material } from '../../types/material';
import { homeDepotApiClient } from '../api/home-depot-api-client';

export class HomeDepotPricingStrategy implements PricingStrategy {
  async calculatePrice(material: Material, quantity: number): Promise<number> {
    const productInfo = await homeDepotApiClient.searchProduct(material.name, material.specifications);
    
    if (!productInfo || productInfo.length === 0) {
      throw new Error(`No pricing information found for ${material.name}`);
    }
    
    // Get the best match
    const bestMatch = productInfo[0];
    
    // Calculate total price
    return bestMatch.price * quantity;
  }
  
  getName(): string {
    return 'Home Depot';
  }
  
  getDescription(): string {
    return 'Calculates prices based on Home Depot product catalog';
  }
}
```

```typescript
// features/estimator/services/pricing/lowes-pricing-strategy.ts
import { PricingStrategy } from '../../types/pricing-strategy';
import { Material } from '../../types/material';
import { lowesApiClient } from '../api/lowes-api-client';

export class LowesPricingStrategy implements PricingStrategy {
  async calculatePrice(material: Material, quantity: number): Promise<number> {
    const productInfo = await lowesApiClient.findProduct(material.name, material.specifications);
    
    if (!productInfo || productInfo.length === 0) {
      throw new Error(`No pricing information found for ${material.name}`);
    }
    
    // Get the best match
    const bestMatch = productInfo[0];
    
    // Calculate total price
    return bestMatch.price * quantity;
  }
  
  getName(): string {
    return 'Lowes';
  }
  
  getDescription(): string {
    return 'Calculates prices based on Lowes product catalog';
  }
}
```

```typescript
// features/estimator/services/pricing/custom-pricing-strategy.ts
import { PricingStrategy } from '../../types/pricing-strategy';
import { Material } from '../../types/material';
import { customPriceRepository } from '../db/custom-price-repository';

export class CustomPricingStrategy implements PricingStrategy {
  async calculatePrice(material: Material, quantity: number): Promise<number> {
    const customPrice = await customPriceRepository.getPriceForMaterial(material.id);
    
    if (!customPrice) {
      throw new Error(`No custom price defined for ${material.name}`);
    }
    
    // Calculate total price
    return customPrice * quantity;
  }
  
  getName(): string {
    return 'Custom Pricing';
  }
  
  getDescription(): string {
    return 'Calculates prices based on custom-defined price list';
  }
}
```

### Context

```typescript
// features/estimator/services/material-pricing-service.ts
import { PricingStrategy } from '../types/pricing-strategy';
import { Material } from '../types/material';
import { HomeDepotPricingStrategy } from './pricing/home-depot-pricing-strategy';
import { LowesPricingStrategy } from './pricing/lowes-pricing-strategy';
import { CustomPricingStrategy } from './pricing/custom-pricing-strategy';

export class MaterialPricingService {
  private strategy: PricingStrategy;
  private strategies: Map<string, PricingStrategy> = new Map();
  
  constructor(defaultStrategyName: string = 'homeDepot') {
    // Register available strategies
    this.registerStrategy('homeDepot', new HomeDepotPricingStrategy());
    this.registerStrategy('lowes', new LowesPricingStrategy());
    this.registerStrategy('custom', new CustomPricingStrategy());
    
    // Set default strategy
    const defaultStrategy = this.strategies.get(defaultStrategyName);
    
    if (!defaultStrategy) {
      throw new Error(`Strategy ${defaultStrategyName} not found`);
    }
    
    this.strategy = defaultStrategy;
  }
  
  registerStrategy(name: string, strategy: PricingStrategy): void {
    this.strategies.set(name, strategy);
  }
  
  setStrategy(name: string): void {
    const strategy = this.strategies.get(name);
    
    if (!strategy) {
      throw new Error(`Strategy ${name} not found`);
    }
    
    this.strategy = strategy;
  }
  
  getAvailableStrategies(): { name: string; description: string }[] {
    return Array.from(this.strategies.entries()).map(([name, strategy]) => ({
      name,
      description: strategy.getDescription()
    }));
  }
  
  async calculateMaterialPrice(material: Material, quantity: number): Promise<number> {
    return this.strategy.calculatePrice(material, quantity);
  }
  
  async calculateMaterialsPrices(materials: Array<{ material: Material; quantity: number }>): Promise<number> {
    let totalPrice = 0;
    
    for (const { material, quantity } of materials) {
      const price = await this.calculateMaterialPrice(material, quantity);
      totalPrice += price;
    }
    
    return totalPrice;
  }
}
```

### Usage

```typescript
// features/estimator/server/actions/estimation-actions.ts
'use server';

import { MaterialPricingService } from '../../services/material-pricing-service';
import { materialRepository } from '../db/material-repository';

export async function calculateEstimateAction(
  materialIds: string[],
  quantities: number[],
  pricingStrategy: string = 'homeDepot'
) {
  try {
    // Validate input
    if (materialIds.length !== quantities.length) {
      return {
        success: false,
        error: 'Material IDs and quantities must have the same length'
      };
    }
    
    // Get materials from repository
    const materials = await Promise.all(
      materialIds.map(id => materialRepository.getMaterial(id))
    );
    
    // Check if all materials were found
    if (materials.some(m => m === null)) {
      return {
        success: false,
        error: 'One or more materials not found'
      };
    }
    
    // Create pricing service with selected strategy
    const pricingService = new MaterialPricingService(pricingStrategy);
    
    // Calculate prices
    const materialsWithQuantities = materials.map((material, index) => ({
      material: material!,
      quantity: quantities[index]
    }));
    
    const totalPrice = await pricingService.calculateMaterialsPrices(materialsWithQuantities);
    
    // Return result
    return {
      success: true,
      data: {
        totalPrice,
        breakdown: await Promise.all(
          materialsWithQuantities.map(async ({ material, quantity }) => ({
            materialId: material.id,
            materialName: material.name,
            quantity,
            unitPrice: await pricingService.calculateMaterialPrice(material, 1),
            totalPrice: await pricingService.calculateMaterialPrice(material, quantity)
          }))
        ),
        pricingStrategy
      }
    };
  } catch (error) {
    console.error('Error calculating estimate:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
```

## Benefits

Using the Strategy pattern in the Mikhail Ajaj Portfolio project provides several benefits:

1. **Flexibility**: Easily switch between different pricing strategies based on user preferences or availability

2. **Extensibility**: Add new pricing strategies without modifying existing code

3. **Testability**: Test each strategy in isolation with mock dependencies

4. **Readability**: Replace complex conditional logic with clean, object-oriented code

5. **Maintainability**: Each strategy has a single responsibility and can be maintained independently

6. **Runtime Configuration**: Change strategies at runtime based on user input or system conditions

## Considerations

When implementing the Strategy pattern, consider the following:

1. **Overhead**: The pattern introduces additional classes, which might be overkill for simple algorithms

2. **Client Knowledge**: Clients need to be aware of different strategies to select the appropriate one

3. **Strategy Creation**: Consider using a factory to create strategies and hide implementation details

4. **Shared State**: Determine how strategies will share state, if needed

5. **Default Strategy**: Provide a sensible default strategy for cases where the client doesn't specify one

6. **Strategy Parameters**: Decide whether strategies should receive parameters through the constructor or method calls

## Examples

### UI Component with Rendering Strategies

```tsx
// Example of Strategy pattern in UI components

// Strategy interface
interface CardRenderStrategy {
  renderHeader(title: string, subtitle?: string): React.ReactNode;
  renderContent(content: React.ReactNode): React.ReactNode;
  renderFooter(actions: React.ReactNode[]): React.ReactNode;
}

// Concrete strategies
class SimpleCardStrategy implements CardRenderStrategy {
  renderHeader(title: string, subtitle?: string): React.ReactNode {
    return (
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    );
  }
  
  renderContent(content: React.ReactNode): React.ReactNode {
    return <div className="p-4">{content}</div>;
  }
  
  renderFooter(actions: React.ReactNode[]): React.ReactNode {
    return (
      <div className="p-4 border-t flex justify-end space-x-2">
        {actions}
      </div>
    );
  }
}

class CompactCardStrategy implements CardRenderStrategy {
  renderHeader(title: string, subtitle?: string): React.ReactNode {
    return (
      <div className="p-2 border-b">
        <h3 className="text-md font-medium">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    );
  }
  
  renderContent(content: React.ReactNode): React.ReactNode {
    return <div className="p-2">{content}</div>;
  }
  
  renderFooter(actions: React.ReactNode[]): React.ReactNode {
    return (
      <div className="p-2 border-t flex justify-end space-x-1">
        {actions}
      </div>
    );
  }
}

class FancyCardStrategy implements CardRenderStrategy {
  renderHeader(title: string, subtitle?: string): React.ReactNode {
    return (
      <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="text-xl font-bold text-indigo-700">{title}</h3>
        {subtitle && <p className="text-sm text-indigo-500 mt-1">{subtitle}</p>}
      </div>
    );
  }
  
  renderContent(content: React.ReactNode): React.ReactNode {
    return <div className="p-6">{content}</div>;
  }
  
  renderFooter(actions: React.ReactNode[]): React.ReactNode {
    return (
      <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
        {actions}
      </div>
    );
  }
}

// Context component
interface CardProps {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  actions?: React.ReactNode[];
  variant?: 'simple' | 'compact' | 'fancy';
}

export function Card({
  title,
  subtitle,
  content,
  actions = [],
  variant = 'simple'
}: CardProps) {
  // Select strategy based on variant
  let strategy: CardRenderStrategy;
  
  switch (variant) {
    case 'compact':
      strategy = new CompactCardStrategy();
      break;
    case 'fancy':
      strategy = new FancyCardStrategy();
      break;
    case 'simple':
    default:
      strategy = new SimpleCardStrategy();
      break;
  }
  
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      {strategy.renderHeader(title, subtitle)}
      {strategy.renderContent(content)}
      {actions.length > 0 && strategy.renderFooter(actions)}
    </div>
  );
}
```

### Data Fetching Strategies

```typescript
// Example of Strategy pattern for data fetching

// Strategy interface
interface DataFetchStrategy<T> {
  fetchData(endpoint: string, params?: Record<string, any>): Promise<T>;
}

// Concrete strategies
class RestApiStrategy<T> implements DataFetchStrategy<T> {
  async fetchData(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(endpoint);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }
}

class GraphQLStrategy<T> implements DataFetchStrategy<T> {
  private readonly graphqlEndpoint: string;
  
  constructor(graphqlEndpoint: string) {
    this.graphqlEndpoint = graphqlEndpoint;
  }
  
  async fetchData(query: string, variables?: Record<string, any>): Promise<T> {
    const response = await fetch(this.graphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables
      })
    });
    
    if (!response.ok) {
      throw new Error(`GraphQL error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }
    
    return result.data;
  }
}

class MockDataStrategy<T> implements DataFetchStrategy<T> {
  private mockData: Record<string, T>;
  
  constructor(mockData: Record<string, T>) {
    this.mockData = mockData;
  }
  
  async fetchData(endpoint: string): Promise<T> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const key = endpoint.replace(/^\/|\/$/g, '');
    
    if (!(key in this.mockData)) {
      throw new Error(`Mock data not found for endpoint: ${endpoint}`);
    }
    
    return this.mockData[key];
  }
}

// Context class
class DataService<T> {
  private strategy: DataFetchStrategy<T>;
  
  constructor(strategy: DataFetchStrategy<T>) {
    this.strategy = strategy;
  }
  
  setStrategy(strategy: DataFetchStrategy<T>): void {
    this.strategy = strategy;
  }
  
  async fetchData(endpoint: string, params?: Record<string, any>): Promise<T> {
    return this.strategy.fetchData(endpoint, params);
  }
}

// Usage
const projectsService = new DataService<Project[]>(
  new RestApiStrategy<Project[]>()
);

// In production
const projects = await projectsService.fetchData('/api/projects', { status: 'active' });

// For testing, switch to mock data
projectsService.setStrategy(
  new MockDataStrategy<Project[]>({
    'api/projects': [
      { id: '1', title: 'Project 1', status: 'active' },
      { id: '2', title: 'Project 2', status: 'completed' }
    ]
  })
);

// Now using mock data
const testProjects = await projectsService.fetchData('/api/projects');
```

## Related Patterns

The Strategy pattern is often used in conjunction with other patterns:

- **Factory Method**: Creates strategy objects
- **Decorator**: Adds responsibilities to strategies
- **Composite**: Implements strategies that are composed of other strategies
- **State**: Similar to Strategy, but focuses on state transitions
- **Template Method**: Defines the skeleton of an algorithm with some steps deferred to subclasses

For more information on these related patterns, see:

- [Factory Method](../creational/factory-method.md)
- [Decorator](../structural/decorator.md)
- [Composite](../structural/composite.md)
- [State](./state.md)
- [Template Method](./template-method.md)

# Repository Pattern

## Overview

The Repository pattern mediates between the domain and data mapping layers, acting like an in-memory collection of domain objects. It provides a way to abstract the data access logic from the business logic, making the application more maintainable and testable.

## Table of Contents

1. [Purpose](#purpose)
2. [Structure](#structure)
3. [Implementation in Mikhail Ajaj Portfolio](#implementation-in-constructit)
4. [Benefits](#benefits)
5. [Considerations](#considerations)
6. [Examples](#examples)
7. [Related Patterns](#related-patterns)

## Purpose

The Repository pattern serves several purposes:

- **Abstraction of Data Access**: Hides the details of data access from the business logic
- **Centralization of Data Logic**: Centralizes data access logic in one place
- **Testability**: Makes it easier to unit test business logic by mocking repositories
- **Separation of Concerns**: Separates domain logic from data access logic
- **Flexibility**: Makes it easier to change the underlying data storage mechanism

## Structure

A typical Repository implementation includes:

1. **Repository Interface**: Defines the operations that can be performed on the domain objects
2. **Repository Implementation**: Implements the interface with specific data access logic
3. **Domain Objects**: The entities that the repository manages

```
┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
│                   │     │                   │     │                   │
│  Business Logic   │────▶│    Repository     │────▶│   Data Source     │
│                   │     │    Interface      │     │                   │
└───────────────────┘     └───────────────────┘     └───────────────────┘
                                   ▲
                                   │
                          ┌────────┴──────────┐
                          │                   │
                          │    Repository     │
                          │  Implementation   │
                          │                   │
                          └───────────────────┘
```

## Implementation in Mikhail Ajaj Portfolio

In the Mikhail Ajaj Portfolio project, repositories should be implemented following these guidelines:

### Repository Interface

```typescript
// features/projects/types/repository.ts
import { Project, ProjectFilters, ProjectSortOptions, ProjectPaginationOptions, ProjectListResponse } from './project';

export interface ProjectRepository {
  // Read operations
  getProjects(filters?: ProjectFilters, sort?: ProjectSortOptions, pagination?: ProjectPaginationOptions): Promise<ProjectListResponse>;
  getProject(id: string): Promise<Project | null>;
  
  // Write operations
  createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project>;
  updateProject(id: string, data: Partial<Project>): Promise<Project>;
  deleteProject(id: string): Promise<boolean>;
}
```

### Repository Implementation

```typescript
// features/projects/server/db/project-repository.ts
import { D1Database } from '@cloudflare/workers-types';
import { Project, ProjectFilters, ProjectSortOptions, ProjectPaginationOptions, ProjectListResponse, ProjectStatus } from '../../types/project';
import { ProjectRepository } from '../../types/repository';

export class CloudflareD1ProjectRepository implements ProjectRepository {
  constructor(private db: D1Database) {}
  
  async getProjects(
    filters?: ProjectFilters,
    sort?: ProjectSortOptions,
    pagination?: ProjectPaginationOptions
  ): Promise<ProjectListResponse> {
    // Implementation using Cloudflare D1
    // ...
  }
  
  async getProject(id: string): Promise<Project | null> {
    // Implementation using Cloudflare D1
    // ...
  }
  
  async createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    // Implementation using Cloudflare D1
    // ...
  }
  
  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    // Implementation using Cloudflare D1
    // ...
  }
  
  async deleteProject(id: string): Promise<boolean> {
    // Implementation using Cloudflare D1
    // ...
  }
}
```

### Repository Factory

```typescript
// features/projects/server/db/repository-factory.ts
import { D1Database } from '@cloudflare/workers-types';
import { ProjectRepository } from '../../types/repository';
import { CloudflareD1ProjectRepository } from './project-repository';

export function createProjectRepository(db: D1Database): ProjectRepository {
  return new CloudflareD1ProjectRepository(db);
}
```

### Usage in Server Actions

```typescript
// features/projects/server/actions/project-actions.ts
'use server';

import { cookies } from 'next/headers';
import { createProjectRepository } from '../db/repository-factory';
import { getD1Database } from '@/shared/server/db/cloudflare';

export async function getProjectAction(id: string) {
  const db = getD1Database();
  const projectRepository = createProjectRepository(db);
  
  try {
    const project = await projectRepository.getProject(id);
    
    if (!project) {
      return { success: false, error: 'Project not found' };
    }
    
    return { success: true, data: project };
  } catch (error) {
    console.error('Error fetching project:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
```

## Benefits

Using the Repository pattern in the Mikhail Ajaj Portfolio project provides several benefits:

1. **Abstraction of Data Storage**: The business logic doesn't need to know about the underlying data storage mechanism (Cloudflare D1, KV, etc.)

2. **Centralized Data Access Logic**: All data access logic is centralized in repository implementations, making it easier to maintain and update

3. **Improved Testability**: Business logic can be tested with mock repositories, without needing to set up actual databases

4. **Consistent Error Handling**: Repositories can implement consistent error handling for data access operations

5. **Simplified Business Logic**: Business logic can focus on domain operations without being cluttered with data access code

6. **Flexibility to Change**: The underlying data storage can be changed with minimal impact on the rest of the application

## Considerations

When implementing the Repository pattern, consider the following:

1. **Repository Scope**: Repositories should typically be scoped to aggregate roots in the domain model

2. **Transaction Handling**: Consider how transactions will be handled across multiple repositories

3. **Caching Strategy**: Determine if and how repositories will implement caching

4. **Error Handling**: Define a consistent approach to error handling in repositories

5. **Performance**: Be mindful of performance implications, especially for complex queries

6. **Repository Composition**: Consider whether repositories should be composed of other repositories

## Examples

### Basic Repository Example

```typescript
// Example implementation for a simple repository
export class InMemoryProjectRepository implements ProjectRepository {
  private projects: Map<string, Project> = new Map();
  
  async getProjects(): Promise<ProjectListResponse> {
    const projects = Array.from(this.projects.values());
    return {
      items: projects,
      total: projects.length,
      page: 1,
      limit: projects.length,
      totalPages: 1
    };
  }
  
  async getProject(id: string): Promise<Project | null> {
    return this.projects.get(id) || null;
  }
  
  async createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const id = crypto.randomUUID();
    const now = new Date();
    
    const project: Project = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
      teamMembers: [],
      documents: [],
      tasks: []
    };
    
    this.projects.set(id, project);
    return project;
  }
  
  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const project = this.projects.get(id);
    
    if (!project) {
      throw new Error(`Project with id ${id} not found`);
    }
    
    const updatedProject: Project = {
      ...project,
      ...data,
      updatedAt: new Date()
    };
    
    this.projects.set(id, updatedProject);
    return updatedProject;
  }
  
  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }
}
```

### Repository with Filtering and Pagination

```typescript
// Example implementation with filtering and pagination
export class CloudflareD1ProjectRepository implements ProjectRepository {
  constructor(private db: D1Database) {}
  
  async getProjects(
    filters?: ProjectFilters,
    sort?: ProjectSortOptions,
    pagination?: ProjectPaginationOptions
  ): Promise<ProjectListResponse> {
    // Start building the query
    let query = 'SELECT * FROM projects WHERE 1=1';
    const params: any[] = [];
    
    // Apply filters
    if (filters) {
      if (filters.status) {
        query += ' AND status = ?';
        params.push(filters.status);
      }
      
      if (filters.clientId) {
        query += ' AND client_id = ?';
        params.push(filters.clientId);
      }
      
      if (filters.search) {
        query += ' AND (title LIKE ? OR description LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm);
      }
      
      // Add more filters as needed
    }
    
    // Count total results for pagination
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as count');
    const countResult = await this.db.prepare(countQuery).bind(...params).first();
    const total = countResult ? (countResult.count as number) : 0;
    
    // Apply sorting
    if (sort) {
      const direction = sort.direction === 'desc' ? 'DESC' : 'ASC';
      query += ` ORDER BY ${this.mapSortField(sort.field)} ${direction}`;
    } else {
      query += ' ORDER BY created_at DESC';
    }
    
    // Apply pagination
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const offset = (page - 1) * limit;
    
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    // Execute the query
    const result = await this.db.prepare(query).bind(...params).all();
    const projects = result.results as any[];
    
    // Map database results to domain objects
    const items = projects.map(this.mapProjectFromDb);
    
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
  
  // Other methods...
  
  private mapSortField(field: string): string {
    // Map domain sort fields to database column names
    const fieldMap: Record<string, string> = {
      title: 'title',
      status: 'status',
      priority: 'priority',
      dueDate: 'due_date',
      createdAt: 'created_at'
    };
    
    return fieldMap[field] || 'created_at';
  }
  
  private mapProjectFromDb(dbProject: any): Project {
    // Map database record to domain object
    return {
      id: dbProject.id,
      title: dbProject.title,
      description: dbProject.description,
      status: dbProject.status,
      priority: dbProject.priority,
      client: JSON.parse(dbProject.client),
      budget: dbProject.budget,
      startDate: new Date(dbProject.start_date),
      dueDate: new Date(dbProject.due_date),
      completedAt: dbProject.completed_at ? new Date(dbProject.completed_at) : undefined,
      teamMembers: JSON.parse(dbProject.team_members),
      documents: JSON.parse(dbProject.documents),
      tasks: JSON.parse(dbProject.tasks),
      createdAt: new Date(dbProject.created_at),
      updatedAt: new Date(dbProject.updated_at)
    };
  }
}
```

## Related Patterns

The Repository pattern is often used in conjunction with other patterns:

- **Unit of Work**: Tracks changes to objects loaded through repositories and coordinates writing those changes
- **Factory**: Creates repository instances
- **Specification**: Encapsulates query criteria for repositories
- **Aggregate**: Defines the boundaries of a repository's responsibility
- **Data Mapper**: Maps between domain objects and database records
- **Service**: Uses repositories to implement business operations

For more information on these related patterns, see:

- [Unit of Work](./unit-of-work.md)
- [Factory Method](../creational/factory-method.md)
- [Specification](./specification.md)
- [Service](./service.md)

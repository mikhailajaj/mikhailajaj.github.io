# TypeScript Development Rules

This document outlines the rules and guidelines for TypeScript development in the Mikhail Ajaj Portfolio project.

## Table of Contents

1. [Core Principles](#core-principles)
2. [Type Definitions](#type-definitions)
3. [Interfaces vs Types](#interfaces-vs-types)
4. [Type Safety](#type-safety)
5. [Generics](#generics)
6. [Enums and Unions](#enums-and-unions)
7. [Type Assertions](#type-assertions)
8. [Utility Types](#utility-types)
9. [Type Organization](#type-organization)
10. [Error Handling](#error-handling)
11. [Best Practices](#best-practices)
12. [Examples](#examples)

## Core Principles

- **Type Safety**: Prioritize type safety over convenience
- **Explicit Types**: Use explicit types for function parameters and return values
- **Inference**: Leverage type inference for local variables
- **Documentation**: Use TypeScript to document code through types
- **Consistency**: Follow consistent patterns for type definitions
- **Progressive Refinement**: Start with basic types and refine as needed

## Type Definitions

### Basic Types

Use TypeScript's basic types appropriately:

- `string`: For text values
- `number`: For numeric values
- `boolean`: For true/false values
- `null` and `undefined`: Be explicit about nullable values
- `any`: Avoid using `any` whenever possible
- `unknown`: Use instead of `any` when type is truly unknown
- `never`: Use for functions that never return (throw errors or infinite loops)
- `void`: Use for functions that don't return a value

### Object Types

Define object types with interfaces or type aliases:

```typescript
// Good: Explicit property types
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
  roles: string[];
  metadata?: Record<string, unknown>;
}

// Bad: Using any
interface BadUser {
  id: any;
  name: any;
  // ...
}
```

### Array Types

Use consistent array type notation:

```typescript
// Preferred: Array<T> for complex types
type ComplexArray = Array<{ id: string; value: number }>;

// Preferred: T[] for simple types
type StringArray = string[];
type NumberArray = number[];
```

### Function Types

Define function types explicitly:

```typescript
// Function type with named parameters
type FetchUserFn = (userId: string) => Promise<User | null>;

// Function type with optional parameters
type UpdateUserFn = (userId: string, updates: Partial<User>) => Promise<User>;

// Function type with overloads
interface StringOrNumberFunction {
  (input: string): string;
  (input: number): number;
}
```

## Interfaces vs Types

### When to Use Interfaces

- For object shapes that might be extended
- For classes that need to implement a contract
- For public API definitions
- When you need declaration merging

```typescript
// Interface for a class to implement
interface Repository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: Omit<T, 'id'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
}

// Class implementing the interface
class UserRepository implements Repository<User> {
  async findAll(): Promise<User[]> {
    // Implementation
    return [];
  }
  
  async findById(id: string): Promise<User | null> {
    // Implementation
    return null;
  }
  
  // Other methods...
}
```

### When to Use Type Aliases

- For union or intersection types
- For tuple types
- For function types
- For types that won't be extended
- For mapped types

```typescript
// Union type
type Status = 'pending' | 'in-progress' | 'completed' | 'cancelled';

// Intersection type
type AdminUser = User & { permissions: string[] };

// Tuple type
type Coordinates = [number, number];

// Function type
type EventHandler = (event: Event) => void;

// Mapped type
type Readonly<T> = { readonly [P in keyof T]: T[P] };
```

## Type Safety

### Strict Mode

- Enable `strict` mode in `tsconfig.json`
- Enable `noImplicitAny` to prevent implicit any types
- Enable `strictNullChecks` to prevent null/undefined errors
- Enable `strictFunctionTypes` for stricter function type checking
- Enable `strictPropertyInitialization` for class property initialization

### Null and Undefined Handling

- Be explicit about nullable values
- Use optional chaining (`?.`) for potentially undefined properties
- Use nullish coalescing (`??`) for default values
- Use non-null assertion (`!`) only when you're absolutely certain a value isn't null

```typescript
// Good: Explicit handling of nullable values
function getUserName(user: User | null): string {
  return user?.name ?? 'Guest';
}

// Bad: Using non-null assertion without certainty
function badGetUserName(user: User | null): string {
  return user!.name; // Might throw if user is null
}
```

### Type Guards

Use type guards to narrow types:

```typescript
// Type guard function
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'email' in value
  );
}

// Using type guard
function processValue(value: unknown): void {
  if (isUser(value)) {
    // value is now typed as User
    console.log(value.name);
  } else {
    console.log('Not a user');
  }
}

// Using instanceof type guard
function isError(error: unknown): error is Error {
  return error instanceof Error;
}

// Using discriminated union type guard
type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

function handleResult<T>(result: Result<T>): void {
  if (result.success) {
    // result is now typed as { success: true; data: T }
    console.log(result.data);
  } else {
    // result is now typed as { success: false; error: string }
    console.log(result.error);
  }
}
```

## Generics

### Basic Generic Usage

Use generics to create reusable components:

```typescript
// Generic function
function getFirst<T>(array: T[]): T | undefined {
  return array[0];
}

// Generic interface
interface Result<T> {
  data: T;
  error: string | null;
}

// Generic class
class Repository<T> {
  private items: T[] = [];
  
  add(item: T): void {
    this.items.push(item);
  }
  
  getAll(): T[] {
    return this.items;
  }
}
```

### Constraining Generics

Use constraints to limit generic types:

```typescript
// Generic constrained to objects with an id property
function findById<T extends { id: string }>(
  items: T[],
  id: string
): T | undefined {
  return items.find(item => item.id === id);
}

// Generic constrained to a specific interface
interface Entity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

function updateEntity<T extends Entity>(entity: T, updates: Partial<T>): T {
  return { ...entity, ...updates, updatedAt: new Date() };
}
```

### Default Generic Types

Provide default types for generics:

```typescript
// Generic with default type
interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message: string;
}

// Using the default
const response: ApiResponse = { data: {}, status: 200, message: 'OK' };

// Specifying a type
const userResponse: ApiResponse<User> = {
  data: { id: '1', name: 'John', email: 'john@example.com', age: 30, isActive: true, roles: [] },
  status: 200,
  message: 'OK',
};
```

## Enums and Unions

### String Literal Unions

Use string literal unions for finite sets of string values:

```typescript
// String literal union
type ProjectStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

// Using the union type
function updateStatus(status: ProjectStatus): void {
  console.log(`Status updated to ${status}`);
}

// This will cause a type error
updateStatus('invalid'); // Error: Argument of type '"invalid"' is not assignable to parameter of type 'ProjectStatus'
```

### Enums

Use enums for related constants:

```typescript
// String enum (preferred for better runtime values)
enum Role {
  Admin = 'ADMIN',
  User = 'USER',
  Guest = 'GUEST',
}

// Numeric enum
enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  ServerError = 500,
}

// Using enums
function checkAccess(role: Role): boolean {
  return role === Role.Admin;
}
```

### Discriminated Unions

Use discriminated unions for type-safe handling of different cases:

```typescript
// Discriminated union for API responses
type ApiResponse<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
  | { status: 'loading' };

// Function using discriminated union
function handleResponse<T>(response: ApiResponse<T>): void {
  switch (response.status) {
    case 'success':
      // response is now typed as { status: 'success'; data: T }
      console.log(response.data);
      break;
    case 'error':
      // response is now typed as { status: 'error'; error: string }
      console.error(response.error);
      break;
    case 'loading':
      // response is now typed as { status: 'loading' }
      console.log('Loading...');
      break;
  }
}
```

## Type Assertions

### When to Use Type Assertions

- When you know more about a type than TypeScript does
- When working with DOM elements
- When integrating with untyped libraries
- When migrating from JavaScript to TypeScript

### Type Assertion Best Practices

- Use `as` syntax instead of angle brackets (`<>`)
- Avoid using `as any`
- Use `as unknown` followed by a more specific assertion
- Create type guard functions instead of assertions when possible

```typescript
// Good: Specific type assertion
const input = document.getElementById('username') as HTMLInputElement;

// Better: Check before asserting
const element = document.getElementById('username');
if (element instanceof HTMLInputElement) {
  const input = element; // No assertion needed
  console.log(input.value);
}

// Bad: Using as any
const data = JSON.parse(response) as any; // Avoid this

// Better: Using as unknown with a more specific assertion
const data = JSON.parse(response) as unknown as User;

// Best: Validate the data
const rawData = JSON.parse(response) as unknown;
if (isUser(rawData)) {
  const user = rawData; // No assertion needed
  console.log(user.name);
}
```

## Utility Types

### Built-in Utility Types

Use TypeScript's built-in utility types:

- `Partial<T>`: Makes all properties in T optional
- `Required<T>`: Makes all properties in T required
- `Readonly<T>`: Makes all properties in T readonly
- `Record<K, T>`: Creates a type with properties of type K and values of type T
- `Pick<T, K>`: Picks a subset of properties K from T
- `Omit<T, K>`: Omits a subset of properties K from T
- `Exclude<T, U>`: Excludes types in U from T
- `Extract<T, U>`: Extracts types in U from T
- `NonNullable<T>`: Removes null and undefined from T
- `ReturnType<T>`: Gets the return type of a function type T
- `Parameters<T>`: Gets the parameter types of a function type T

```typescript
// Using Partial for updates
function updateUser(userId: string, updates: Partial<User>): Promise<User> {
  // Implementation
  return Promise.resolve({} as User);
}

// Using Pick for form data
type UserFormData = Pick<User, 'name' | 'email' | 'age'>;

// Using Omit for creating data
type CreateUserData = Omit<User, 'id' | 'createdAt'>;

// Using Record for dynamic properties
type UserMetadata = Record<string, string | number | boolean>;

// Using ReturnType
type GetUserResult = ReturnType<typeof getUser>;
```

### Custom Utility Types

Create custom utility types for project-specific needs:

```typescript
// Custom utility type for nullable fields
type Nullable<T> = { [P in keyof T]: T[P] | null };

// Custom utility type for async function results
type AsyncResult<T> = Promise<Result<T>>;

// Custom utility type for form errors
type FormErrors<T> = {
  [P in keyof T]?: string[];
} & {
  _form?: string[];
};
```

## Type Organization

### Type File Structure

- Place shared types in `shared/types/` directory
- Place feature-specific types in `features/feature-name/types/` directory
- Use index files to re-export types
- Group related types in the same file
- Name type files descriptively

```
shared/
├── types/
│   ├── index.ts          # Re-exports all shared types
│   ├── common.ts         # Common utility types
│   ├── api.ts            # API-related types
│   ├── forms.ts          # Form-related types
│   └── entities.ts       # Core entity types

features/
├── projects/
│   ├── types/
│   │   ├── index.ts      # Re-exports all project types
│   │   ├── project.ts    # Project entity types
│   │   ├── forms.ts      # Project form types
│   │   └── api.ts        # Project API types
```

### Type Naming Conventions

- Use PascalCase for type names, interfaces, and enums
- Use descriptive names that indicate the purpose
- Use consistent suffixes for related types
- Prefix interfaces implemented by classes with "I" (optional)

```typescript
// Entity types
interface User { /* ... */ }
interface Project { /* ... */ }

// DTO types
interface UserDTO { /* ... */ }
interface ProjectDTO { /* ... */ }

// Form types
interface UserFormData { /* ... */ }
interface ProjectFormData { /* ... */ }

// Props types
interface ButtonProps { /* ... */ }
interface CardProps { /* ... */ }

// State types
interface AuthState { /* ... */ }
interface ProjectState { /* ... */ }

// Action types
type AuthAction = { /* ... */ }
type ProjectAction = { /* ... */ }
```

### Type Documentation

Document types with JSDoc comments:

```typescript
/**
 * Represents a user in the system
 */
interface User {
  /** Unique identifier for the user */
  id: string;
  
  /** User's full name */
  name: string;
  
  /** User's email address */
  email: string;
  
  /** User's age in years */
  age: number;
  
  /** Whether the user account is active */
  isActive: boolean;
  
  /** List of roles assigned to the user */
  roles: string[];
  
  /** Optional metadata as key-value pairs */
  metadata?: Record<string, unknown>;
}
```

## Error Handling

### Error Types

Define specific error types:

```typescript
// Base error class
class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppError';
  }
}

// Specific error types
class ValidationError extends AppError {
  constructor(
    message: string,
    public readonly errors: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`);
    this.name = 'NotFoundError';
  }
}

class AuthorizationError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
  }
}
```

### Result Types

Use result types for functions that might fail:

```typescript
// Result type for operations that might fail
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// Async result function
async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    
    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch user: ${response.statusText}`,
      };
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Using the result type
async function displayUser(id: string): Promise<void> {
  const result = await fetchUser(id);
  
  if (result.success) {
    console.log(result.data.name);
  } else {
    console.error(result.error);
  }
}
```

## Best Practices

### Type Inference

- Let TypeScript infer types when it's clear
- Explicitly type function parameters and return values
- Explicitly type complex object literals
- Use type inference for simple variables

```typescript
// Good: Let TypeScript infer simple types
const name = 'John'; // inferred as string
const age = 30; // inferred as number
const isActive = true; // inferred as boolean

// Good: Explicitly type function parameters and return values
function formatUser(user: User): string {
  return `${user.name} (${user.email})`;
}

// Good: Explicitly type complex objects
const defaultUser: User = {
  id: '0',
  name: 'Guest',
  email: 'guest@example.com',
  age: 0,
  isActive: false,
  roles: ['guest'],
};
```

### Type Narrowing

Use type narrowing to handle different types:

```typescript
// Type narrowing with typeof
function formatValue(value: string | number): string {
  if (typeof value === 'string') {
    return value.toUpperCase();
  } else {
    return value.toFixed(2);
  }
}

// Type narrowing with instanceof
function handleError(error: unknown): string {
  if (error instanceof Error) {
    return `Error: ${error.message}`;
  } else if (typeof error === 'string') {
    return `Error: ${error}`;
  } else {
    return 'Unknown error';
  }
}

// Type narrowing with in operator
function processEntity(entity: User | Project): void {
  if ('email' in entity) {
    // entity is now typed as User
    console.log(`User: ${entity.name} (${entity.email})`);
  } else {
    // entity is now typed as Project
    console.log(`Project: ${entity.title}`);
  }
}
```

### Avoiding Type Casting

Minimize type casting by using proper types:

```typescript
// Bad: Using type casting
const element = document.getElementById('username') as HTMLInputElement;
element.value = 'John';

// Good: Check before using
const element = document.getElementById('username');
if (element instanceof HTMLInputElement) {
  element.value = 'John';
}

// Bad: Casting unknown data
const data = JSON.parse(response) as User;

// Good: Validate data
const data = JSON.parse(response) as unknown;
if (isUser(data)) {
  console.log(data.name);
}
```

### Readonly Properties

Use readonly for immutable properties:

```typescript
// Interface with readonly properties
interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
  readonly retries: number;
}

// Class with readonly properties
class UserService {
  readonly baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  
  // Methods...
}
```

## Examples

### Complete Type Definition Example

```typescript
// features/projects/types/project.ts

/**
 * Project status enum
 */
export enum ProjectStatus {
  Pending = 'pending',
  InProgress = 'in-progress',
  OnHold = 'on-hold',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

/**
 * Project priority enum
 */
export enum ProjectPriority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Urgent = 'urgent',
}

/**
 * Client information
 */
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
}

/**
 * Project team member
 */
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedAt: Date;
}

/**
 * Project document
 */
export interface ProjectDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
}

/**
 * Project task
 */
export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  assignedTo?: string;
  dueDate?: Date;
  completedAt?: Date;
}

/**
 * Project entity
 */
export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  client: Client;
  budget: number;
  startDate: Date;
  dueDate: Date;
  completedAt?: Date;
  teamMembers: TeamMember[];
  documents: ProjectDocument[];
  tasks: ProjectTask[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Project creation data
 */
export type CreateProjectData = Omit<
  Project,
  'id' | 'teamMembers' | 'documents' | 'tasks' | 'createdAt' | 'updatedAt' | 'completedAt'
>;

/**
 * Project update data
 */
export type UpdateProjectData = Partial<
  Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
>;

/**
 * Project list item (simplified project for lists)
 */
export type ProjectListItem = Pick<
  Project,
  'id' | 'title' | 'status' | 'priority' | 'client' | 'dueDate' | 'completedAt'
>;

/**
 * Project filter options
 */
export interface ProjectFilters {
  status?: ProjectStatus;
  priority?: ProjectPriority;
  clientId?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

/**
 * Project sort options
 */
export type ProjectSortField = 'title' | 'status' | 'priority' | 'dueDate' | 'createdAt';

export interface ProjectSortOptions {
  field: ProjectSortField;
  direction: 'asc' | 'desc';
}

/**
 * Project pagination options
 */
export interface ProjectPaginationOptions {
  page: number;
  limit: number;
}

/**
 * Project query options
 */
export interface ProjectQueryOptions {
  filters?: ProjectFilters;
  sort?: ProjectSortOptions;
  pagination?: ProjectPaginationOptions;
}

/**
 * Project list response
 */
export interface ProjectListResponse {
  items: ProjectListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Project API response
 */
export type ProjectResponse = 
  | { success: true; data: Project }
  | { success: false; error: string };

/**
 * Project list API response
 */
export type ProjectListApiResponse = 
  | { success: true; data: ProjectListResponse }
  | { success: false; error: string };
```

### Type Guard Example

```typescript
// features/projects/utils/type-guards.ts

import { Project, ProjectStatus, ProjectPriority } from '../types/project';

/**
 * Type guard for ProjectStatus enum
 */
export function isProjectStatus(value: unknown): value is ProjectStatus {
  return (
    typeof value === 'string' &&
    Object.values(ProjectStatus).includes(value as ProjectStatus)
  );
}

/**
 * Type guard for ProjectPriority enum
 */
export function isProjectPriority(value: unknown): value is ProjectPriority {
  return (
    typeof value === 'string' &&
    Object.values(ProjectPriority).includes(value as ProjectPriority)
  );
}

/**
 * Type guard for Project
 */
export function isProject(value: unknown): value is Project {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  
  const project = value as Partial<Project>;
  
  return (
    typeof project.id === 'string' &&
    typeof project.title === 'string' &&
    typeof project.description === 'string' &&
    isProjectStatus(project.status) &&
    isProjectPriority(project.priority) &&
    typeof project.budget === 'number' &&
    project.startDate instanceof Date &&
    project.dueDate instanceof Date &&
    (project.completedAt === undefined || project.completedAt instanceof Date) &&
    Array.isArray(project.teamMembers) &&
    Array.isArray(project.documents) &&
    Array.isArray(project.tasks) &&
    project.createdAt instanceof Date &&
    project.updatedAt instanceof Date
  );
}

/**
 * Type guard for API response
 */
export function isSuccessResponse<T>(
  response: { success: boolean; data?: T; error?: string }
): response is { success: true; data: T } {
  return response.success === true && 'data' in response;
}
```

### Utility Types Example

```typescript
// shared/types/common.ts

/**
 * Makes all properties in T nullable
 */
export type Nullable<T> = { [P in keyof T]: T[P] | null };

/**
 * Makes all nested properties in T optional
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Extracts the type of an array element
 */
export type ArrayElement<T extends readonly unknown[]> = T extends readonly (infer U)[] ? U : never;

/**
 * Creates a type with only the specified keys from T
 */
export type PickByKeys<T, K extends keyof T> = Pick<T, K>;

/**
 * Creates a type with all keys from T except those specified
 */
export type OmitByKeys<T, K extends keyof T> = Omit<T, K>;

/**
 * Creates a type with only the methods from T
 */
export type Methods<T> = {
  [P in keyof T as T[P] extends Function ? P : never]: T[P];
};

/**
 * Creates a type with only the properties (non-methods) from T
 */
export type Properties<T> = {
  [P in keyof T as T[P] extends Function ? never : P]: T[P];
};

/**
 * Creates a type with all properties of T set to readonly
 */
export type Immutable<T> = {
  readonly [P in keyof T]: T[P] extends object ? Immutable<T[P]> : T[P];
};

/**
 * Creates a discriminated union type based on a property
 */
export type DiscriminateUnion<T, K extends keyof T, V extends T[K]> = 
  T extends { [key in K]: V } ? T : never;

/**
 * Creates a type for form errors
 */
export type FormErrors<T> = {
  [P in keyof T]?: string[];
} & {
  _form?: string[];
};

/**
 * Creates a type for API responses
 */
export type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Creates a type for paginated responses
 */
export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
```

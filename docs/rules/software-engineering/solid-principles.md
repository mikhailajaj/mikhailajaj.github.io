# SOLID Principles

This document provides detailed guidelines for applying SOLID principles in the Mikhail Ajaj Portfolio project.

## Table of Contents

1. [Introduction](#introduction)
2. [Single Responsibility Principle (SRP)](#single-responsibility-principle-srp)
3. [Open/Closed Principle (OCP)](#openclosed-principle-ocp)
4. [Liskov Substitution Principle (LSP)](#liskov-substitution-principle-lsp)
5. [Interface Segregation Principle (ISP)](#interface-segregation-principle-isp)
6. [Dependency Inversion Principle (DIP)](#dependency-inversion-principle-dip)
7. [Applying SOLID in React](#applying-solid-in-react)
8. [References](#references)

## Introduction

SOLID is an acronym for five design principles intended to make software designs more understandable, flexible, and maintainable. These principles were introduced by Robert C. Martin (Uncle Bob) and have become fundamental guidelines for good object-oriented design.

## Single Responsibility Principle (SRP)

> A class should have only one reason to change.

### Key Concepts

- Each module, class, or function should have responsibility over a single part of the functionality
- "Responsibility" is defined as a "reason to change"
- When a class has multiple responsibilities, changes to one responsibility may affect the others

### Examples

#### Bad Example

```typescript
// Bad: Class with multiple responsibilities
class User {
  private name: string;
  private email: string;
  private password: string;
  
  constructor(name: string, email: string, password: string) {
    this.name = name;
    this.email = email;
    this.password = password;
  }
  
  // User data responsibility
  getName(): string {
    return this.name;
  }
  
  getEmail(): string {
    return this.email;
  }
  
  // Authentication responsibility
  validatePassword(inputPassword: string): boolean {
    return this.password === inputPassword; // Simplified for example
  }
  
  // Database responsibility
  saveToDatabase(): void {
    // Code to save user to database
    console.log(`Saving user ${this.name} to database`);
  }
  
  // Email responsibility
  sendWelcomeEmail(): void {
    // Code to send welcome email
    console.log(`Sending welcome email to ${this.email}`);
  }
}
```

#### Good Example

```typescript
// Good: Separate classes with single responsibilities

// User entity - responsible for user data
class User {
  constructor(
    private name: string,
    private email: string,
    private passwordHash: string
  ) {}
  
  getName(): string {
    return this.name;
  }
  
  getEmail(): string {
    return this.email;
  }
  
  getPasswordHash(): string {
    return this.passwordHash;
  }
}

// Authentication service - responsible for authentication
class AuthService {
  validatePassword(user: User, inputPassword: string): boolean {
    // Code to hash input password and compare with stored hash
    return user.getPasswordHash() === inputPassword; // Simplified for example
  }
}

// User repository - responsible for database operations
class UserRepository {
  saveUser(user: User): void {
    // Code to save user to database
    console.log(`Saving user ${user.getName()} to database`);
  }
  
  findUserByEmail(email: string): User | null {
    // Code to find user by email
    return null; // Simplified for example
  }
}

// Email service - responsible for sending emails
class EmailService {
  sendWelcomeEmail(user: User): void {
    // Code to send welcome email
    console.log(`Sending welcome email to ${user.getEmail()}`);
  }
}
```

### Guidelines

1. **Identify Responsibilities**: Look for different reasons a class might change and separate them
2. **Create Focused Classes**: Each class should focus on a single responsibility
3. **Use Composition**: Compose functionality from multiple single-responsibility classes
4. **Watch for Code Smells**: Large classes, methods with many parameters, or methods that don't use class properties are signs of SRP violations
5. **Consider Cohesion**: Methods in a class should be related and work with the same data

## Open/Closed Principle (OCP)

> Software entities (classes, modules, functions, etc.) should be open for extension but closed for modification.

### Key Concepts

- "Open for extension" means that the behavior of the module can be extended
- "Closed for modification" means that the source code of the module is not changed
- Use abstractions and polymorphism to enable extension without modification
- Design interfaces that can accommodate new functionality without changing existing code

### Examples

#### Bad Example

```typescript
// Bad: Violates OCP
class PaymentProcessor {
  processPayment(paymentType: string, amount: number): void {
    if (paymentType === 'credit_card') {
      // Process credit card payment
      console.log(`Processing credit card payment of $${amount}`);
    } else if (paymentType === 'paypal') {
      // Process PayPal payment
      console.log(`Processing PayPal payment of $${amount}`);
    } else if (paymentType === 'bank_transfer') {
      // Process bank transfer
      console.log(`Processing bank transfer of $${amount}`);
    }
    // To add a new payment type, we need to modify this class
  }
}
```

#### Good Example

```typescript
// Good: Follows OCP
interface PaymentMethod {
  process(amount: number): void;
}

class CreditCardPayment implements PaymentMethod {
  process(amount: number): void {
    // Process credit card payment
    console.log(`Processing credit card payment of $${amount}`);
  }
}

class PayPalPayment implements PaymentMethod {
  process(amount: number): void {
    // Process PayPal payment
    console.log(`Processing PayPal payment of $${amount}`);
  }
}

class BankTransferPayment implements PaymentMethod {
  process(amount: number): void {
    // Process bank transfer
    console.log(`Processing bank transfer of $${amount}`);
  }
}

// To add a new payment method, we create a new class without modifying existing code
class CryptoPayment implements PaymentMethod {
  process(amount: number): void {
    // Process cryptocurrency payment
    console.log(`Processing cryptocurrency payment of $${amount}`);
  }
}

class PaymentProcessor {
  processPayment(paymentMethod: PaymentMethod, amount: number): void {
    paymentMethod.process(amount);
  }
}
```

### Guidelines

1. **Use Abstractions**: Define interfaces or abstract classes that encapsulate the core functionality
2. **Implement Strategy Pattern**: Use the Strategy pattern to encapsulate different algorithms or behaviors
3. **Prefer Composition**: Compose behavior from smaller, focused components rather than inheritance
4. **Use Factory Methods**: Create factory methods to instantiate the appropriate implementation
5. **Design for Extension**: Anticipate future changes and design interfaces that can accommodate them

## Liskov Substitution Principle (LSP)

> Subtypes must be substitutable for their base types.

### Key Concepts

- Objects of a superclass should be replaceable with objects of a subclass without affecting the correctness of the program
- Subclasses should extend the behavior of the base class without changing it
- Subclasses should not strengthen preconditions or weaken postconditions
- Subclasses should not throw exceptions that are not expected from the base class

### Examples

#### Bad Example

```typescript
// Bad: Violates LSP
class Rectangle {
  constructor(
    protected width: number,
    protected height: number
  ) {}
  
  setWidth(width: number): void {
    this.width = width;
  }
  
  setHeight(height: number): void {
    this.height = height;
  }
  
  getArea(): number {
    return this.width * this.height;
  }
}

class Square extends Rectangle {
  constructor(size: number) {
    super(size, size);
  }
  
  // Violates LSP because it changes the behavior of setWidth
  setWidth(width: number): void {
    this.width = width;
    this.height = width; // Square must maintain equal sides
  }
  
  // Violates LSP because it changes the behavior of setHeight
  setHeight(height: number): void {
    this.width = height; // Square must maintain equal sides
    this.height = height;
  }
}

// This function works with Rectangle but breaks with Square
function resizeRectangle(rectangle: Rectangle): void {
  rectangle.setWidth(10);
  rectangle.setHeight(20);
  
  // For a Rectangle, area should be 200
  // For a Square, area will be 400, which is unexpected
  console.log(rectangle.getArea());
}
```

#### Good Example

```typescript
// Good: Follows LSP
interface Shape {
  getArea(): number;
}

class Rectangle implements Shape {
  constructor(
    private width: number,
    private height: number
  ) {}
  
  setWidth(width: number): void {
    this.width = width;
  }
  
  setHeight(height: number): void {
    this.height = height;
  }
  
  getArea(): number {
    return this.width * this.height;
  }
}

class Square implements Shape {
  constructor(
    private size: number
  ) {}
  
  setSize(size: number): void {
    this.size = size;
  }
  
  getArea(): number {
    return this.size * this.size;
  }
}

// Now we have separate functions for each shape
function resizeRectangle(rectangle: Rectangle): void {
  rectangle.setWidth(10);
  rectangle.setHeight(20);
  console.log(rectangle.getArea()); // 200
}

function resizeSquare(square: Square): void {
  square.setSize(10);
  console.log(square.getArea()); // 100
}
```

### Guidelines

1. **Respect Contracts**: Ensure that subclasses respect the contracts (preconditions and postconditions) of the base class
2. **Use Interface Segregation**: Create specific interfaces for different behaviors rather than forcing inheritance
3. **Favor Composition**: Use composition over inheritance when behavior differs significantly
4. **Test Substitutability**: Verify that subclasses can be used in place of their base classes without issues
5. **Document Expectations**: Clearly document the expected behavior of base classes and their methods

## Interface Segregation Principle (ISP)

> Clients should not be forced to depend on methods they do not use.

### Key Concepts

- Create fine-grained interfaces that are client-specific
- Many client-specific interfaces are better than one general-purpose interface
- Avoid "fat" interfaces that force clients to implement methods they don't need
- Keep interfaces focused and cohesive

### Examples

#### Bad Example

```typescript
// Bad: Violates ISP with a "fat" interface
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
}

// Human worker needs to implement all methods
class HumanWorker implements Worker {
  work(): void {
    console.log('Human working');
  }
  
  eat(): void {
    console.log('Human eating');
  }
  
  sleep(): void {
    console.log('Human sleeping');
  }
}

// Robot worker is forced to implement eat() and sleep() even though it doesn't need them
class RobotWorker implements Worker {
  work(): void {
    console.log('Robot working');
  }
  
  eat(): void {
    // Robots don't eat, but forced to implement this method
    throw new Error('Robots do not eat');
  }
  
  sleep(): void {
    // Robots don't sleep, but forced to implement this method
    throw new Error('Robots do not sleep');
  }
}
```

#### Good Example

```typescript
// Good: Follows ISP with segregated interfaces
interface Workable {
  work(): void;
}

interface Eatable {
  eat(): void;
}

interface Sleepable {
  sleep(): void;
}

// Human worker implements all interfaces
class HumanWorker implements Workable, Eatable, Sleepable {
  work(): void {
    console.log('Human working');
  }
  
  eat(): void {
    console.log('Human eating');
  }
  
  sleep(): void {
    console.log('Human sleeping');
  }
}

// Robot worker only implements the interface it needs
class RobotWorker implements Workable {
  work(): void {
    console.log('Robot working');
  }
}

// Functions can depend only on the interfaces they need
function makeWork(worker: Workable): void {
  worker.work();
}

function feedWorker(worker: Eatable): void {
  worker.eat();
}

function letWorkerSleep(worker: Sleepable): void {
  worker.sleep();
}
```

### Guidelines

1. **Create Focused Interfaces**: Design interfaces that serve a specific purpose
2. **Split Large Interfaces**: Break down large interfaces into smaller, more specific ones
3. **Depend on Minimal Interfaces**: Client code should depend only on the methods it actually uses
4. **Use Role Interfaces**: Design interfaces around roles or behaviors rather than entities
5. **Consider Client Needs**: Design interfaces based on how clients will use them, not on the implementations

## Dependency Inversion Principle (DIP)

> High-level modules should not depend on low-level modules. Both should depend on abstractions. Abstractions should not depend on details. Details should depend on abstractions.

### Key Concepts

- High-level modules define policy and contain the core business logic
- Low-level modules implement operations and contain implementation details
- Both should depend on abstractions (interfaces or abstract classes)
- This principle enables loose coupling and easier testing
- Dependency injection is a technique to implement this principle

### Examples

#### Bad Example

```typescript
// Bad: Violates DIP with direct dependencies on concrete implementations
class EmailNotifier {
  sendNotification(email: string, message: string): void {
    console.log(`Sending email to ${email}: ${message}`);
    // Implementation details for sending an email
  }
}

class UserService {
  private emailNotifier: EmailNotifier;
  
  constructor() {
    // Direct dependency on concrete implementation
    this.emailNotifier = new EmailNotifier();
  }
  
  registerUser(email: string, password: string): void {
    // Register user logic
    console.log(`Registering user with email: ${email}`);
    
    // Direct dependency on EmailNotifier implementation
    this.emailNotifier.sendNotification(
      email,
      'Welcome to our platform!'
    );
  }
}
```

#### Good Example

```typescript
// Good: Follows DIP with abstractions and dependency injection
interface NotificationService {
  sendNotification(recipient: string, message: string): void;
}

class EmailNotifier implements NotificationService {
  sendNotification(email: string, message: string): void {
    console.log(`Sending email to ${email}: ${message}`);
    // Implementation details for sending an email
  }
}

class SMSNotifier implements NotificationService {
  sendNotification(phoneNumber: string, message: string): void {
    console.log(`Sending SMS to ${phoneNumber}: ${message}`);
    // Implementation details for sending an SMS
  }
}

class UserService {
  // Depends on abstraction, not concrete implementation
  constructor(private notificationService: NotificationService) {}
  
  registerUser(email: string, password: string): void {
    // Register user logic
    console.log(`Registering user with email: ${email}`);
    
    // Uses the abstraction, not a specific implementation
    this.notificationService.sendNotification(
      email,
      'Welcome to our platform!'
    );
  }
}

// Dependency injection
const emailNotifier = new EmailNotifier();
const userService = new UserService(emailNotifier);

// We can easily switch to a different notification service
const smsNotifier = new SMSNotifier();
const userServiceWithSMS = new UserService(smsNotifier);
```

### Guidelines

1. **Define Abstractions**: Create interfaces or abstract classes that define the contract
2. **Use Dependency Injection**: Inject dependencies rather than creating them directly
3. **Invert Dependencies**: Make high-level modules depend on abstractions, not concrete implementations
4. **Create Factories**: Use factory methods or dependency injection containers to create instances
5. **Design for Testability**: Abstractions make it easier to mock dependencies for testing

## Applying SOLID in React

### Single Responsibility Principle (SRP)

- **Components**: Each component should have a single responsibility
- **Custom Hooks**: Extract complex logic into custom hooks
- **Context Providers**: Separate different concerns into different context providers

```tsx
// Bad: Component with multiple responsibilities
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Fetch user data
    fetchUser(userId)
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [userId]);
  
  // Handle form submission
  const handleSubmit = async (formData) => {
    try {
      await updateUser(userId, formData);
      // Show success message
    } catch (err) {
      // Show error message
    }
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <UserForm user={user} onSubmit={handleSubmit} />
    </div>
  );
}

// Good: Separate responsibilities
// Custom hook for data fetching
function useUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchUser(userId)
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [userId]);
  
  return { user, loading, error };
}

// Component focused on rendering
function UserProfile({ userId }) {
  const { user, loading, error } = useUser(userId);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <UserFormContainer userId={userId} user={user} />
    </div>
  );
}

// Container component for form logic
function UserFormContainer({ userId, user }) {
  const handleSubmit = async (formData) => {
    try {
      await updateUser(userId, formData);
      // Show success message
    } catch (err) {
      // Show error message
    }
  };
  
  return <UserForm user={user} onSubmit={handleSubmit} />;
}

// Presentational component for form UI
function UserForm({ user, onSubmit }) {
  // Form rendering logic
  return (
    <form onSubmit={/* form submission logic */}>
      {/* Form fields */}
    </form>
  );
}
```

### Open/Closed Principle (OCP)

- **Component Composition**: Use composition to extend component behavior
- **Render Props**: Use render props to allow customization without modification
- **Higher-Order Components**: Use HOCs to add functionality to existing components

```tsx
// Bad: Component that needs modification for different button types
function Button({ type, onClick, children }) {
  let className = 'btn';
  
  if (type === 'primary') {
    className += ' btn-primary';
  } else if (type === 'secondary') {
    className += ' btn-secondary';
  } else if (type === 'danger') {
    className += ' btn-danger';
  }
  // Adding a new button type requires modifying this component
  
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}

// Good: Component that's open for extension
function Button({ className, onClick, children, ...props }) {
  return (
    <button className={`btn ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  );
}

// Extending with composition
function PrimaryButton(props) {
  return <Button className="btn-primary" {...props} />;
}

function SecondaryButton(props) {
  return <Button className="btn-secondary" {...props} />;
}

function DangerButton(props) {
  return <Button className="btn-danger" {...props} />;
}

// Adding a new button type doesn't require modifying the Button component
function SuccessButton(props) {
  return <Button className="btn-success" {...props} />;
}
```

### Liskov Substitution Principle (LSP)

- **Component Props**: Ensure that components with similar props behave consistently
- **Context Providers**: Ensure that different implementations of context providers maintain the same contract
- **Custom Hooks**: Ensure that similar hooks maintain consistent behavior

```tsx
// Bad: Violates LSP with inconsistent behavior
function TextInput({ value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
}

function NumberInput({ value, onChange }) {
  return (
    <input
      type="number"
      value={value}
      // Inconsistent: Returns a number instead of an event or string
      onChange={e => onChange(parseInt(e.target.value, 10))}
    />
  );
}

// Good: Consistent behavior across components
function TextInput({ value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
}

function NumberInput({ value, onChange }) {
  return (
    <input
      type="number"
      value={value}
      // Consistent: Returns a string like TextInput
      onChange={e => onChange(e.target.value)}
    />
  );
}

// Consumer can process the value as needed
function Form() {
  const [text, setText] = useState('');
  const [number, setNumber] = useState('');
  
  const handleNumberChange = (value) => {
    // Convert to number here, not in the component
    setNumber(value === '' ? '' : parseInt(value, 10));
  };
  
  return (
    <form>
      <TextInput value={text} onChange={setText} />
      <NumberInput value={number} onChange={handleNumberChange} />
    </form>
  );
}
```

### Interface Segregation Principle (ISP)

- **Component Props**: Define focused prop interfaces for components
- **Context Providers**: Create specific contexts for different concerns
- **Custom Hooks**: Design hooks with specific, focused functionality

```tsx
// Bad: Component with too many props
interface TableProps {
  data: any[];
  columns: Column[];
  loading: boolean;
  error: Error | null;
  pagination: boolean;
  pageSize: number;
  currentPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  sortable: boolean;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  onSort: (column: string, direction: 'asc' | 'desc') => void;
  selectable: boolean;
  selectedRows: string[];
  onRowSelect: (rowId: string) => void;
  onRowClick: (row: any) => void;
  // Many more props...
}

// Good: Segregated interfaces
interface TableDataProps {
  data: any[];
  columns: Column[];
  loading?: boolean;
  error?: Error | null;
}

interface TablePaginationProps {
  pagination?: boolean;
  pageSize?: number;
  currentPage?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

interface TableSortProps {
  sortable?: boolean;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
}

interface TableSelectionProps {
  selectable?: boolean;
  selectedRows?: string[];
  onRowSelect?: (rowId: string) => void;
}

interface TableEventProps {
  onRowClick?: (row: any) => void;
}

// Combine interfaces as needed
type DataTableProps = TableDataProps & 
  Partial<TablePaginationProps> & 
  Partial<TableSortProps> & 
  Partial<TableSelectionProps> & 
  Partial<TableEventProps>;

// Components can use only the interfaces they need
function SimpleTable(props: TableDataProps) {
  // Implementation for a simple table without pagination, sorting, etc.
}

function PaginatedTable(props: TableDataProps & TablePaginationProps) {
  // Implementation for a table with pagination
}

function SortableTable(props: TableDataProps & TableSortProps) {
  // Implementation for a table with sorting
}

function DataTable(props: DataTableProps) {
  // Full-featured table implementation
}
```

### Dependency Inversion Principle (DIP)

- **Context Providers**: Use context to provide abstractions for services
- **Custom Hooks**: Design hooks that depend on abstractions, not concrete implementations
- **Component Props**: Pass callbacks and services through props rather than importing directly

```tsx
// Bad: Direct dependency on concrete implementation
function UserList() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    // Direct dependency on API implementation
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// Good: Dependency on abstraction via context
// Define service interface
interface UserService {
  getUsers(): Promise<User[]>;
}

// Create context for the service
const UserServiceContext = createContext<UserService | null>(null);

// Provider component
function UserServiceProvider({ children, service }) {
  return (
    <UserServiceContext.Provider value={service}>
      {children}
    </UserServiceContext.Provider>
  );
}

// Custom hook to use the service
function useUserService() {
  const service = useContext(UserServiceContext);
  if (!service) {
    throw new Error('useUserService must be used within a UserServiceProvider');
  }
  return service;
}

// Component depends on abstraction, not concrete implementation
function UserList() {
  const userService = useUserService();
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    userService.getUsers().then(setUsers);
  }, [userService]);
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// Concrete implementation
class ApiUserService implements UserService {
  async getUsers(): Promise<User[]> {
    const response = await fetch('/api/users');
    return response.json();
  }
}

// Usage
function App() {
  const userService = new ApiUserService();
  
  return (
    <UserServiceProvider service={userService}>
      <UserList />
    </UserServiceProvider>
  );
}

// For testing, we can use a mock implementation
class MockUserService implements UserService {
  async getUsers(): Promise<User[]> {
    return [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' }
    ];
  }
}
```

## References

- [SOLID Principles by Robert C. Martin](https://web.archive.org/web/20150906155800/http://www.objectmentor.com/resources/articles/Principles_and_Patterns.pdf)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles in TypeScript](https://khalilstemmler.com/articles/solid-principles/solid-typescript/)
- [SOLID Principles in React](https://medium.com/dailyjs/applying-solid-principles-in-react-14905d9c5377)
- [React Patterns](https://reactpatterns.com/)

## Table of Contents

1. [Big O Notation & Complexity Analysis](#big-o-notation)
2. [Linear Data Structures](#linear-data-structures)
   - [Arrays](#arrays)
   - [Linked Lists](#linked-lists)
   - [Stacks](#stacks)
   - [Queues](#queues)
3. [Non-Linear Data Structures](#non-linear-data-structures)
   - [Hash Tables](#hash-tables)
   - [Trees](#trees)
   - [Graphs](#graphs)
4. [Essential Algorithms](#essential-algorithms)
   - [Depth-First Search (DFS)](#depth-first-search)
   - [Breadth-First Search (BFS)](#breadth-first-search)
   - [Binary Search](#binary-search)
   - [Two Pointers](#two-pointers)
   - [Sliding Window](#sliding-window)
5. [Advanced Topics](#advanced-topics)
6. [Practice Problems & Applications](#practice-problems)
7. [When to Use What](#when-to-use-what)

---

## Big O Notation & Complexity Analysis

Understanding algorithm complexity is fundamental to choosing the right data structure for your problem.

### Big O Fundamentals


### Rules of Thumb
- **Drop constants and lower-order terms**: O(2n) becomes O(n)
- **Worst-case analysis** unless stated otherwise
- **Amortized analysis** for dynamic arrays and hash tables

### Common Complexity Classes
```
O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)
```

| Complexity | Name | Example Operations |
|------------|------|-------------------|
| O(1) | Constant | Array access, hash table lookup |
| O(log n) | Logarithmic | Binary search, balanced tree operations |
| O(n) | Linear | Array traversal, linear search |
| O(n log n) | Linearithmic | Merge sort, heap sort |
| O(n²) | Quadratic | Bubble sort, nested loops |
| O(2ⁿ) | Exponential | Recursive fibonacci (naive) |


---

## Linear Data Structures

Linear data structures organize elements in a sequential manner, where each element has a predecessor and successor (except for the first and last elements).

### Arrays

### Arrays - Contiguous Memory with O(1) Access


**Overview**: Contiguous memory allocation with O(1) random access by index. Middle insert/delete operations are O(n).

#### Arrays: Key Operations & Complexity
- **Access**: O(1) - Direct index access
- **Search**: O(n) linear, O(log n) if sorted + binary search
- **Insert (middle)**: O(n) - Requires shifting elements
- **Delete (middle)**: O(n) - Requires shifting elements
- **Append**: O(1) amortized for dynamic arrays

#### Arrays: TypeScript Example
```typescript
const arr: number[] = [1, 2, 3];
arr.push(4);              // O(1) amortized
arr.splice(1, 0, 9);      // O(n) - insert at index 1
const element = arr[2];    // O(1) - access by index
```

#### Arrays: Use Cases
- **Iteration-heavy workloads** - Cache-friendly sequential access
- **Random access reads** - When you need to access elements by index
- **Backing storage** for stacks/queues using dynamic arrays
- **Mathematical computations** - Matrices, vectors

#### Arrays: Pros & Cons
✅ **Pros**: Fast access, cache-friendly, simple implementation  
❌ **Cons**: Fixed size (static), expensive insertions/deletions in middle


### Linked Lists

### Linked Lists - Dynamic Node-Based Structure


**Overview**: Nodes connected by pointers. O(1) insert/delete at known positions, but O(n) for index-based access.

#### Linked Lists: Key Operations & Complexity
- **Access by index**: O(n) - Must traverse from head
- **Insert/delete at known node**: O(1) - Just update pointers
- **Search**: O(n) - Linear traversal required
- **Insert/delete at head**: O(1) - Direct pointer manipulation

#### Linked Lists: TypeScript Implementation
```typescript
interface ListNode<T> {
  value: T;
  next: ListNode<T> | null;
}

class LinkedList<T> {
  private head: ListNode<T> | null = null;
  
  prepend(value: T): void {
    this.head = { value, next: this.head };
  }
  
  find(value: T): ListNode<T> | null {
    let current = this.head;
    while (current && current.value !== value) {
      current = current.next;
    }
    return current;
  }
}
```

#### Linked Lists: Variants
- **Singly Linked**: One pointer per node (next)
- **Doubly Linked**: Two pointers per node (next, prev)
- **Circular Linked**: Last node points back to first

#### Linked Lists: Use Cases
- **Frequent insertions/deletions** at list ends
- **Implementing other structures** - Stacks, queues, deques
- **Undo/redo functionality** - Easy to add/remove operations
- **Memory-constrained environments** - No need to pre-allocate


### Stacks

### Stacks - Last In, First Out (LIFO)


**Overview**: LIFO (Last In, First Out) structure. All primary operations (push, pop, peek) are O(1).

#### Stacks: Key Operations & Complexity
- **Push**: O(1) - Add element to top
- **Pop**: O(1) - Remove element from top
- **Peek/Top**: O(1) - View top element without removing
- **IsEmpty**: O(1) - Check if stack is empty

#### Stacks: TypeScript Implementation
```typescript
class Stack<T> {
  private items: T[] = [];
  
  push(item: T): void {
    this.items.push(item);
  }
  
  pop(): T | undefined {
    return this.items.pop();
  }
  
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }
  
  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

// Simple array-based stack
const stack: number[] = [];
stack.push(1);           // [1]
stack.push(2);           // [1, 2]
const top = stack.pop(); // returns 2, stack becomes [1]
```

#### Stacks: Use Cases
- **Expression evaluation** - Parsing mathematical expressions (RPN)
- **Function call management** - Call stack in programming languages
- **DFS traversal** - Depth-first search algorithms
- **Backtracking algorithms** - Maze solving, N-Queens problem
- **Undo/Redo operations** - Text editors, image editing
- **Browser history** - Back button functionality


### Queues

### Queues - First In, First Out (FIFO)


**Overview**: FIFO (First In, First Out) structure. Enqueue and dequeue operations should be O(1) with proper implementation.

#### Queues: Key Operations & Complexity
- **Enqueue**: O(1) - Add element to rear
- **Dequeue**: O(1) - Remove element from front
- **Front/Peek**: O(1) - View front element
- **IsEmpty**: O(1) - Check if queue is empty

#### Queues: TypeScript Implementation
```typescript
class Queue<T> {
  private items: T[] = [];
  private front = 0;
  
  enqueue(item: T): void {
    this.items.push(item);
  }
  
  dequeue(): T | undefined {
    if (this.isEmpty()) return undefined;
    const item = this.items[this.front];
    this.front++;
    
    // Reset when queue becomes empty to prevent memory leak
    if (this.front === this.items.length) {
      this.items = [];
      this.front = 0;
    }
    
    return item;
  }
  
  peek(): T | undefined {
    return this.isEmpty() ? undefined : this.items[this.front];
  }
  
  isEmpty(): boolean {
    return this.front === this.items.length;
  }
}
```

#### Queues: Use Cases
- **BFS traversal** - Breadth-first search algorithms
- **Task scheduling** - Operating systems, job queues
- **Buffer for data streams** - IO operations, network packets
- **Level-order tree traversal** - Processing tree nodes level by level
- **Rate limiting** - API request throttling


---

## Non-Linear Data Structures

Non-linear data structures don't organize elements sequentially. They're ideal for representing hierarchical relationships and complex data connections.

### Hash Tables

### Hash Tables - Average O(1) Operations


**Overview**: Key-value pairs with average O(1) insert, lookup, and delete operations. Performance depends on load factor and hash function quality.

#### Hash Tables: Key Operations & Complexity
- **Insert**: O(1) average, O(n) worst case
- **Lookup**: O(1) average, O(n) worst case
- **Delete**: O(1) average, O(n) worst case
- **Space**: O(n)

#### Hash Tables: Collision Handling Strategies
- **Chaining**: Store collisions in linked lists/buckets
- **Open Addressing**: Linear probing, quadratic probing, double hashing

#### Hash Tables: TypeScript Implementation
```typescript
class HashTable<T> {
  private buckets: Array<Array<[string, T]>>;
  private size: number;
  
  constructor(initialSize = 16) {
    this.size = initialSize;
    this.buckets = new Array(this.size).fill(null).map(() => []);
  }
  
  private hash(key: string): number {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) % this.size;
    }
    return hash;
  }
  
  set(key: string, value: T): void {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    
    // Update existing key
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket[i][1] = value;
        return;
      }
    }
    
    // Add new key-value pair
    bucket.push([key, value]);
  }
  
  get(key: string): T | undefined {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    
    for (const [k, v] of bucket) {
      if (k === key) return v;
    }
    
    return undefined;
  }
}

// JavaScript Map (built-in hash table)
const map = new Map<string, number>();
map.set("apple", 5);
map.set("banana", 3);
console.log(map.get("apple")); // 5
```

#### Hash Tables: Use Cases
- **Frequency counters** - Count occurrences of elements
- **Fast membership checks** - Set operations
- **Caching/Memoization** - Store computed results
- **Database indexing** - Quick record lookup
- **Two-sum problems** - Find pairs that sum to target


### Trees

### Trees - Hierarchical Data Organization


**Overview**: Hierarchical structures with nodes connected by edges. No cycles allowed. Root node at top, leaves at bottom.

#### Trees: Variants & Complexities

| Tree Type | Search | Insert | Delete | Use Case |
|-----------|--------|--------|--------|----------|
| Binary Search Tree | O(log n) avg, O(n) worst | O(log n) avg, O(n) worst | O(log n) avg, O(n) worst | Ordered data |
| AVL Tree | O(log n) | O(log n) | O(log n) | Self-balancing BST |
| Red-Black Tree | O(log n) | O(log n) | O(log n) | Balanced BST (used in maps) |
| Binary Heap | O(n) | O(log n) | O(log n) | Priority queues |
| Trie | O(m) | O(m) | O(m) | String prefix matching |

*m = length of string for Trie operations*

#### Trees: Binary Search Tree Implementation
```typescript
class TreeNode {
  value: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  
  constructor(value: number) {
    this.value = value;
  }
}

class BinarySearchTree {
  root: TreeNode | null = null;
  
  insert(value: number): void {
    this.root = this.insertNode(this.root, value);
  }
  
  private insertNode(node: TreeNode | null, value: number): TreeNode {
    if (!node) return new TreeNode(value);
    
    if (value < node.value) {
      node.left = this.insertNode(node.left, value);
    } else if (value > node.value) {
      node.right = this.insertNode(node.right, value);
    }
    
    return node;
  }
  
  search(value: number): boolean {
    return this.searchNode(this.root, value);
  }
  
  private searchNode(node: TreeNode | null, value: number): boolean {
    if (!node) return false;
    if (value === node.value) return true;
    
    return value < node.value 
      ? this.searchNode(node.left, value)
      : this.searchNode(node.right, value);
  }
}
```

#### Trees: Traversal Methods
```typescript
// Inorder: Left → Root → Right (gives sorted order for BST)
function inorderTraversal(root: TreeNode | null): number[] {
  if (!root) return [];
  return [
    ...inorderTraversal(root.left),
    root.value,
    ...inorderTraversal(root.right)
  ];
}

// Preorder: Root → Left → Right
function preorderTraversal(root: TreeNode | null): number[] {
  if (!root) return [];
  return [
    root.value,
    ...preorderTraversal(root.left),
    ...preorderTraversal(root.right)
  ];
}

// Postorder: Left → Right → Root
function postorderTraversal(root: TreeNode | null): number[] {
  if (!root) return [];
  return [
    ...postorderTraversal(root.left),
    ...postorderTraversal(root.right),
    root.value
  ];
}
```

#### Trees: Use Cases
- **File systems** - Directory hierarchies
- **Expression parsing** - Abstract syntax trees
- **Database indexing** - B-trees for efficient queries
- **Decision making** - Decision trees in ML
- **Autocomplete** - Trie for prefix matching


### Graphs

### Graphs - Complex Relationship Modeling


**Overview**: Collections of nodes (vertices) connected by edges. Can be directed/undirected, weighted/unweighted, cyclic/acyclic.

#### Graphs: Representations

**Adjacency List** (Most Common)
```typescript
// Adjacency List - Space: O(V + E)
type Graph = Map<number, number[]>;

const graph: Graph = new Map([
  [0, [1, 2]],
  [1, [0, 3]],
  [2, [0, 3]],
  [3, [1, 2]]
]);
```

**Adjacency Matrix**
```typescript
// Adjacency Matrix - Space: O(V²)
const matrix: number[][] = [
  [0, 1, 1, 0],
  [1, 0, 0, 1],
  [1, 0, 0, 1],
  [0, 1, 1, 0]
];
```

#### Graphs: Core Algorithms
- **Traversal**: BFS O(V+E), DFS O(V+E)
- **Shortest Path**: Dijkstra O((V+E)log V), Bellman-Ford O(VE)
- **Minimum Spanning Tree**: Kruskal O(E log E), Prim O((V+E)log V)
- **Topological Sort**: O(V+E) for DAGs
- **Cycle Detection**: O(V+E)

#### Graphs: Use Cases
- **Social networks** - Friend connections, influence mapping
- **Navigation systems** - Road networks, shortest paths
- **Web crawling** - Page links, site structure
- **Dependency resolution** - Package managers, build systems
- **Network topology** - Computer networks, routing protocols
- **Recommendation systems** - User-item relationships


---

## Essential Algorithms

Core algorithms that every developer should master, with practical implementations and use cases.

### Depth-First Search (DFS)

### DFS - Deep Exploration Strategy


**Overview**: Explores as far as possible along each branch before backtracking. Uses stack (explicit or recursion stack).

#### DFS: Time & Space Complexity
- **Time**: O(V + E) for graphs, O(n) for trees
- **Space**: O(h) where h is maximum depth (recursion stack)

#### Recursive Template
```typescript
function dfs(node: number, graph: Map<number, number[]>, visited = new Set<number>()): void {
  if (visited.has(node)) return;
  
  visited.add(node);
  console.log(node); // Process current node
  
  for (const neighbor of graph.get(node) || []) {
    dfs(neighbor, graph, visited);
  }
}
```

#### Iterative Implementation
```typescript
function dfsIterative(start: number, graph: Map<number, number[]>): number[] {
  const visited = new Set<number>();
  const stack = [start];
  const result: number[] = [];
  
  while (stack.length > 0) {
    const node = stack.pop()!;
    
    if (!visited.has(node)) {
      visited.add(node);
      result.push(node);
      
      // Add neighbors to stack (reverse order for left-to-right traversal)
      const neighbors = graph.get(node) || [];
      for (let i = neighbors.length - 1; i >= 0; i--) {
        if (!visited.has(neighbors[i])) {
          stack.push(neighbors[i]);
        }
      }
    }
  }
  
  return result;
}
```

#### Use Cases
- **Topological sorting** - Task scheduling with dependencies
- **Connected components** - Find isolated groups in graphs
- **Cycle detection** - Detect circular dependencies
- **Path finding** - Find any path between two nodes
- **Maze solving** - Explore all possible paths


### Breadth-First Search (BFS)

### BFS - Level-by-Level Exploration


**Overview**: Explores all neighbors at current depth before moving to next depth level. Uses queue for implementation.

#### BFS: Time & Space Complexity
- **Time**: O(V + E) for graphs, O(n) for trees
- **Space**: O(w) where w is maximum width of graph/tree

#### BFS: Implementation
```typescript
function bfs(start: number, graph: Map<number, number[]>): number[] {
  const visited = new Set<number>();
  const queue = [start];
  const result: number[] = [];
  
  visited.add(start);
  
  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node);
    
    for (const neighbor of graph.get(node) || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return result;
}
```

#### Shortest Path in Unweighted Graph
```typescript
function shortestPath(start: number, end: number, graph: Map<number, number[]>): number[] {
  const queue: Array<{node: number, path: number[]}> = [{node: start, path: [start]}];
  const visited = new Set([start]);
  
  while (queue.length > 0) {
    const {node, path} = queue.shift()!;
    
    if (node === end) return path;
    
    for (const neighbor of graph.get(node) || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push({node: neighbor, path: [...path, neighbor]});
      }
    }
  }
  
  return []; // No path found
}
```

#### Use Cases
- **Shortest path** - Unweighted graphs (minimum hops)
- **Level-order traversal** - Process tree/graph by levels
- **Web crawling** - Explore web pages by distance from start
- **Social networks** - Find degrees of separation
- **Game AI** - Find shortest moves to goal state


### Binary Search

### Binary Search - Divide and Conquer


**Overview**: Efficiently search sorted arrays by repeatedly dividing search space in half.

#### Binary Search: Time & Space Complexity
- **Time**: O(log n)
- **Space**: O(1) iterative, O(log n) recursive

#### Binary Search: Classic Implementation
```typescript
function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1; // Not found
}
```

#### Template for "Find First/Last" Problems
```typescript
// Find first occurrence of target
function findFirst(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;
  let result = -1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      result = mid;
      right = mid - 1; // Continue searching left
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return result;
}

// Find insertion point
function searchInsert(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length;
  
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  
  return left;
}
```

#### Use Cases
- **Database queries** - Index searches
- **Search suggestions** - Autocomplete systems
- **Version control** - Find first bad commit (git bisect)
- **Resource allocation** - Find optimal capacity
- **Game development** - AI decision trees


### Two Pointers Technique

### Two Pointers - Efficient Array Processing


**Overview**: Use two pointers moving towards each other or in same direction to solve array problems efficiently.

#### Two Pointers: Time & Space Complexity
- **Time**: O(n) typically
- **Space**: O(1) - In-place processing

#### Opposite Direction Pattern
```typescript
// Two Sum in sorted array
function twoSumSorted(arr: number[], target: number): number[] {
  let left = 0;
  let right = arr.length - 1;
  
  while (left < right) {
    const sum = arr[left] + arr[right];
    
    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  
  return [-1, -1];
}

// Valid palindrome
function isPalindrome(s: string): boolean {
  let left = 0;
  let right = s.length - 1;
  
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  
  return true;
}
```

#### Same Direction Pattern
```typescript
// Remove duplicates from sorted array
function removeDuplicates(nums: number[]): number {
  if (nums.length === 0) return 0;
  
  let slow = 0;
  
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }
  
  return slow + 1;
}
```

#### Use Cases
- **Array deduplication** - Remove duplicates in-place
- **Palindrome checking** - String/array validation
- **Merge operations** - Combine sorted arrays
- **Partitioning** - Separate elements by criteria
- **Cycle detection** - Floyd's algorithm (fast/slow pointers)


### Sliding Window

### Sliding Window - Subarray Optimization


**Overview**: Maintain a window of elements and slide it across the array to find optimal subarrays.

#### Sliding Window: Time & Space Complexity
- **Time**: O(n) - Each element visited at most twice
- **Space**: O(1) to O(k) depending on window constraints

#### Fixed Size Window
```typescript
// Maximum sum of k consecutive elements
function maxSumSubarray(arr: number[], k: number): number {
  if (arr.length < k) return -1;
  
  // Calculate sum of first window
  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  
  let maxSum = windowSum;
  
  // Slide the window
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }
  
  return maxSum;
}
```

#### Variable Size Window
```typescript
// Longest substring without repeating characters
function lengthOfLongestSubstring(s: string): number {
  const seen = new Set<string>();
  let left = 0;
  let maxLength = 0;
  
  for (let right = 0; right < s.length; right++) {
    // Shrink window until no duplicates
    while (seen.has(s[right])) {
      seen.delete(s[left]);
      left++;
    }
    
    seen.add(s[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  
  return maxLength;
}

// Minimum window substring
function minWindow(s: string, t: string): string {
  const need = new Map<string, number>();
  const window = new Map<string, number>();
  
  // Count characters in t
  for (const char of t) {
    need.set(char, (need.get(char) || 0) + 1);
  }
  
  let left = 0;
  let right = 0;
  let valid = 0;
  let start = 0;
  let len = Infinity;
  
  while (right < s.length) {
    // Expand window
    const c = s[right];
    right++;
    
    if (need.has(c)) {
      window.set(c, (window.get(c) || 0) + 1);
      if (window.get(c) === need.get(c)) {
        valid++;
      }
    }
    
    // Contract window
    while (valid === need.size) {
      if (right - left < len) {
        start = left;
        len = right - left;
      }
      
      const d = s[left];
      left++;
      
      if (need.has(d)) {
        if (window.get(d) === need.get(d)) {
          valid--;
        }
        window.set(d, window.get(d)! - 1);
      }
    }
  }
  
  return len === Infinity ? "" : s.substring(start, start + len);
}
```

#### Use Cases
- **Subarray problems** - Maximum/minimum sum subarrays
- **String matching** - Pattern finding in text
- **Network monitoring** - Analyze data streams
- **Performance optimization** - Cache management
- **Data analysis** - Moving averages, trend analysis


---

## Advanced Topics

### Advanced Data Structures & Algorithms


### Priority Queues & Heaps
- **Binary Heap**: Complete binary tree with heap property
- **Use Cases**: Task scheduling, Dijkstra's algorithm, top-K problems
- **Operations**: Insert O(log n), Extract-min/max O(log n), Peek O(1)

### Advanced Tree Structures
- **Trie (Prefix Tree)**: Efficient string storage and prefix matching
- **Segment Tree**: Range queries and updates in O(log n)
- **Fenwick Tree (BIT)**: Prefix sums and range updates

### String Algorithms
- **KMP Algorithm**: Pattern matching in O(n + m) time
- **Rabin-Karp**: Rolling hash for substring search
- **Suffix Arrays**: Efficient string processing

### Graph Algorithms
- **Dijkstra's Algorithm**: Shortest path in weighted graphs
- **Union-Find**: Efficient set operations for connectivity
- **Minimum Spanning Tree**: Kruskal's and Prim's algorithms

### Dynamic Programming Patterns
- **Memoization**: Top-down approach with caching
- **Tabulation**: Bottom-up approach building solutions
- **Common Patterns**: Knapsack, LCS, Edit Distance


---

## Practice Problems & Applications

### Real-World Problem Categories


### Array & String Problems
- **Two Sum**: Hash table for O(n) solution
- **Valid Anagram**: Character frequency counting
- **Longest Palindromic Substring**: Expand around centers
- **Merge Intervals**: Sorting and greedy approach

### Linked List Challenges
- **Reverse Linked List**: Iterative and recursive solutions
- **Detect Cycle**: Floyd's cycle detection algorithm
- **Merge Two Sorted Lists**: Two-pointer technique
- **Remove Nth Node**: One-pass solution with dummy node

### Tree & Graph Problems
- **Binary Tree Traversal**: Inorder, preorder, postorder
- **Validate BST**: In-order traversal or bounds checking
- **Lowest Common Ancestor**: Parent pointers or path comparison
- **Number of Islands**: DFS/BFS for connected components

### Dynamic Programming
- **Fibonacci Sequence**: Memoization vs tabulation
- **Coin Change**: Minimum coins for target amount
- **Longest Increasing Subsequence**: O(n log n) solution
- **Edit Distance**: String transformation costs

### System Design Applications
- **LRU Cache**: Hash table + doubly linked list
- **Rate Limiter**: Sliding window or token bucket
- **Autocomplete**: Trie with ranking and caching
- **URL Shortener**: Hash functions and collision handling


---

## When to Use What

### Data Structure Decision Matrix


### Quick Decision Guide

| Need | Best Choice | Alternative | Avoid |
|------|-------------|-------------|-------|
| **Fast random access** | Array | Dynamic Array | Linked List |
| **Frequent insertions/deletions** | Linked List | Dynamic Array | Static Array |
| **LIFO operations** | Stack | Array (as stack) | Queue |
| **FIFO operations** | Queue | Deque | Stack |
| **Key-value lookups** | Hash Table | BST | Array |
| **Ordered data** | BST | Sorted Array | Hash Table |
| **Hierarchical data** | Tree | Graph | Array |
| **Complex relationships** | Graph | Tree | Linear structures |

### Performance Comparison

| Operation | Array | Linked List | Hash Table | BST | Heap |
|-----------|-------|-------------|------------|-----|------|
| **Access** | O(1) | O(n) | O(1) avg | O(log n) | O(1) peek |
| **Search** | O(n) | O(n) | O(1) avg | O(log n) | O(n) |
| **Insert** | O(n) | O(1) | O(1) avg | O(log n) | O(log n) |
| **Delete** | O(n) | O(1) | O(1) avg | O(log n) | O(log n) |
| **Space** | O(n) | O(n) | O(n) | O(n) | O(n) |

### Algorithm Selection Guide

#### For Searching:
- **Unsorted data**: Linear search O(n)
- **Sorted data**: Binary search O(log n)
- **Hash-based**: Hash table lookup O(1) average

#### For Sorting:
- **Small datasets**: Insertion sort O(n²)
- **General purpose**: Merge sort O(n log n) stable
- **In-place requirement**: Quick sort O(n log n) average
- **Nearly sorted**: Insertion sort O(n) best case

#### For Graph Traversal:
- **Find any path**: DFS
- **Shortest path (unweighted)**: BFS
- **Shortest path (weighted)**: Dijkstra's algorithm
- **All pairs shortest path**: Floyd-Warshall

#### For String Processing:
- **Simple search**: Brute force O(nm)
- **Multiple searches**: KMP O(n + m)
- **Prefix matching**: Trie
- **Fuzzy matching**: Edit distance DP


---

## Conclusion

This comprehensive guide covers the fundamental data structures and algorithms every software developer should master. Remember:

1. **Understand the trade-offs** - Every data structure has strengths and weaknesses
2. **Practice implementation** - Code these structures from scratch to truly understand them
3. **Analyze complexity** - Always consider time and space complexity in your solutions
4. **Choose wisely** - Select the right tool for your specific problem requirements
5. **Keep learning** - These fundamentals are the foundation for more advanced topics

### Next Steps
- **Practice coding problems** on platforms like LeetCode, HackerRank, or CodeSignal
- **Study advanced topics** like dynamic programming, graph algorithms, and system design
- **Build projects** that utilize these data structures in real-world applications
- **Read algorithm books** like "Introduction to Algorithms" (CLRS) for deeper understanding

### Resources for Further Learning
- **Online Judges**: LeetCode, HackerRank, Codeforces
- **Visualization Tools**: VisuAlgo, Algorithm Visualizer
- **Books**: "Cracking the Coding Interview", "Elements of Programming Interviews"
- **Courses**: MIT 6.006, Stanford CS161, Coursera Algorithm Specialization

Happy coding! 🚀

---

*This guide represents a comprehensive overview of fundamental computer science concepts. For the most current information and advanced topics, continue exploring and practicing with real-world problems.*

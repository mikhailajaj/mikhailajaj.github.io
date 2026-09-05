/* Post metadata ported from the original repo's content/blog/*.mdx frontmatter.
   Full articles are not published here yet — `image` is only set when the
   cover asset exists in /public/blog. */

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  tags: string[]
  featured: boolean
  image?: string
  readTime?: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'building-scalable-nextjs-applications',
    title: 'Building Scalable Next.js Applications: Best Practices and Performance Optimization',
    excerpt:
      'Discover the essential patterns and practices for building Next.js applications that scale from prototype to production with millions of users.',
    date: '2024-01-15',
    category: 'Full-Stack Development',
    tags: ['Next.js', 'React', 'Performance', 'Scalability', 'TypeScript'],
    featured: true,
    image: '/blog/nextjs-scalability.svg',
  },
  {
    slug: 'cloud-architecture-aws-best-practices',
    title: 'AWS Cloud Architecture Best Practices: Building Resilient and Cost-Effective Systems',
    excerpt:
      'Master AWS cloud architecture with proven patterns for building secure, scalable, and cost-effective systems in the cloud.',
    date: '2024-01-10',
    category: 'Cloud Architecture',
    tags: ['AWS', 'Cloud Architecture', 'DevOps', 'Serverless', 'Infrastructure'],
    featured: true,
    image: '/blog/aws-architecture.svg',
  },
  {
    slug: 'sql-joins-comprehensive-guide',
    title: 'SQL Joins: A Comprehensive Guide to Set Operations and Data Relationships',
    excerpt:
      'A deep dive into SQL joins and set operations, explaining how different join types produce different outputs using set theory concepts and practical examples.',
    date: '2024-12-19',
    category: 'SQL',
    tags: ['SQL', 'Database', 'Joins', 'Set Theory', 'Data Analysis', 'Query Optimization'],
    featured: false,
    image: '/blog/sql-joins.svg',
  },
  {
    slug: 'basic-data-structures',
    title: 'Complete Guide to Basic Data Structures',
    excerpt:
      'Master the fundamentals of data structures and algorithms with this comprehensive guide covering arrays, linked lists, stacks, queues, trees, graphs, and essential algorithms with practical TypeScript examples.',
    date: '2025-08-25',
    category: 'Software Engineering',
    tags: ['Data Structures', 'Algorithms', 'Computer Science', 'TypeScript', 'Big O'],
    featured: true,
    image: '/blog/data-structures.svg',
  },
  {
    slug: 'advanced-react-patterns',
    title: 'Advanced React Patterns for Scalable Applications',
    excerpt:
      'Master advanced React patterns that will make your applications more maintainable, reusable, and scalable. Learn when and how to use compound components, render props, and custom hooks effectively.',
    date: '2024-01-15',
    category: 'Frontend Development',
    tags: ['React', 'JavaScript', 'Design Patterns', 'Frontend Architecture'],
    featured: false,
    image: '/blog/react-patterns.svg',
  },
  {
    slug: 'algorithm-visualization-showcase',
    title: 'Complete Algorithm Visualization Showcase',
    excerpt:
      'A collection of fundamental algorithms — sorting, graph traversal, pathfinding, and data structures — each worked through step by step.',
    date: '2024-12-19',
    category: 'Algorithms',
    tags: ['Algorithms', 'Visualization', 'Interactive Learning', 'Computer Science'],
    featured: false,
    image: '/blog/algorithm-showcase.svg',
    readTime: '25 min',
  },
  {
    slug: 'sorting-algorithms-visualization',
    title: 'Interactive Sorting Algorithms Visualization',
    excerpt:
      'Work through the fundamental sorting algorithms — bubble sort, merge sort, quicksort and more — with their trade-offs and complexity explained.',
    date: '2024-12-19',
    category: 'Algorithms',
    tags: ['Sorting', 'Algorithms', 'Visualization', 'Computer Science'],
    featured: false,
    image: '/blog/sorting-algorithms.svg',
    readTime: '15 min',
  },
  {
    slug: 'graph-algorithms-visualization',
    title: 'Graph Algorithms Visualization: BFS, DFS, Dijkstra & More',
    excerpt:
      "Work through the core graph algorithms: breadth-first search, depth-first search, Dijkstra's algorithm, and minimum spanning trees.",
    date: '2024-12-19',
    category: 'Algorithms',
    tags: ['Graph Algorithms', 'BFS', 'DFS', 'Dijkstra', 'MST', 'Visualization'],
    featured: false,
    image: '/blog/graph-algorithms.svg',
    readTime: '20 min',
  },
  {
    slug: 'pathfinding-algorithms-visualization',
    title: 'Pathfinding Algorithms: A*, Dijkstra, BFS Interactive Guide',
    excerpt:
      'The pathfinding algorithms behind games, robotics, and navigation — A*, Dijkstra, BFS, DFS, and greedy search — explained step by step.',
    date: '2024-12-19',
    category: 'Algorithms',
    tags: ['Pathfinding', 'A*', 'Dijkstra', 'Game AI', 'Robotics', 'Navigation'],
    featured: false,
    image: '/blog/pathfinding.svg',
    readTime: '18 min',
  },
  {
    slug: 'ux-design-principles-for-developers',
    title: 'UX Design Principles Every Developer Should Know',
    excerpt:
      'Bridge the gap between development and design by understanding core UX principles that improve user satisfaction and application success.',
    date: '2024-01-20',
    category: 'UX Design',
    tags: ['UX Design', 'User Experience', 'Frontend Development', 'Usability'],
    featured: false,
    image: '/blog/ux-principles.svg',
  },
  {
    slug: 'typescript-best-practices',
    title: 'TypeScript Best Practices for Enterprise Applications',
    excerpt:
      'Learn advanced TypeScript techniques and best practices that will help you build more robust, maintainable, and scalable enterprise applications.',
    date: '2024-01-10',
    category: 'Backend Development',
    tags: ['TypeScript', 'JavaScript', 'Enterprise', 'Best Practices'],
    featured: false,
    image: '/blog/typescript.svg',
  },
  {
    slug: 'modern-data-engineering-pipelines',
    title: 'Modern Data Engineering Pipelines: From Raw Data to Business Intelligence',
    excerpt:
      'Discover how to design and implement modern data engineering pipelines that transform raw data into actionable business insights.',
    date: '2024-01-05',
    category: 'Data Engineering',
    tags: ['Data Engineering', 'ETL', 'Apache Airflow', 'Python', 'Analytics'],
    featured: true,
    image: '/blog/data-pipeline.svg',
  },
]

export const blogCategories = Array.from(
  new Set(blogPosts.map((p) => p.category)),
).sort()

/**
 * Projects API Functions
 * 
 * Server-side data fetching functions for projects.
 * Can be used in server components, API routes, and static generation.
 */

import { Project } from '@/types/project';

// Mock data - replace with actual API calls or database queries
const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce solution built with Next.js, featuring user authentication, payment processing, inventory management, and admin dashboard. Includes real-time notifications and advanced search functionality.',
    category: 'fullstack',
    technologies: ['Next.js', 'React', 'TypeScript', 'Prisma', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
    status: 'completed',
    image: '/projects/ecommerce.jpg',
    demoUrl: 'https://ecommerce-demo.example.com',
    githubUrl: 'https://github.com/mikhailajaj/ecommerce-platform',
    featured: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-03-20',
  },
  {
    id: '2',
    title: 'AWS Serverless Infrastructure',
    description: 'Scalable serverless architecture using AWS Lambda, API Gateway, and DynamoDB. Includes CI/CD pipeline with GitHub Actions and Infrastructure as Code using Terraform.',
    category: 'cloud',
    technologies: ['AWS Lambda', 'API Gateway', 'DynamoDB', 'Terraform', 'GitHub Actions', 'Node.js'],
    status: 'completed',
    image: '/projects/aws-serverless.jpg',
    githubUrl: 'https://github.com/mikhailajaj/aws-serverless-infrastructure',
    featured: true,
    createdAt: '2024-02-01',
    updatedAt: '2024-04-10',
  },
  {
    id: '3',
    title: 'Customer Analytics Dashboard',
    description: 'Real-time analytics dashboard for customer behavior analysis. Features interactive charts, data visualization, and automated reporting with machine learning insights.',
    category: 'data',
    technologies: ['Python', 'Django', 'React', 'D3.js', 'PostgreSQL', 'Redis', 'Celery'],
    status: 'completed',
    image: '/projects/analytics-dashboard.jpg',
    demoUrl: 'https://analytics-demo.example.com',
    githubUrl: 'https://github.com/mikhailajaj/customer-analytics',
    featured: true,
    createdAt: '2024-03-01',
    updatedAt: '2024-05-15',
  },
  // Add more projects...
];

/**
 * Fetch all projects
 * 
 * @param options - Filtering and pagination options
 * @returns Promise<Project[]>
 */
export async function getProjects(options?: {
  category?: string;
  featured?: boolean;
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<Project[]> {
  try {
    // In a real application, this would be a database query or API call
    // Example with Prisma:
    // const projects = await prisma.project.findMany({
    //   where: {
    //     category: options?.category,
    //     featured: options?.featured,
    //     status: options?.status,
    //   },
    //   take: options?.limit,
    //   skip: options?.offset,
    //   orderBy: { createdAt: 'desc' },
    // });

    // For now, simulate API delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 100));

    let filteredProjects = [...MOCK_PROJECTS];

    // Apply filters
    if (options?.category) {
      filteredProjects = filteredProjects.filter(p => p.category === options.category);
    }

    if (options?.featured !== undefined) {
      filteredProjects = filteredProjects.filter(p => p.featured === options.featured);
    }

    if (options?.status) {
      filteredProjects = filteredProjects.filter(p => p.status === options.status);
    }

    // Apply pagination
    if (options?.offset) {
      filteredProjects = filteredProjects.slice(options.offset);
    }

    if (options?.limit) {
      filteredProjects = filteredProjects.slice(0, options.limit);
    }

    return filteredProjects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw new Error('Failed to fetch projects');
  }
}

/**
 * Fetch a single project by ID
 * 
 * @param id - Project ID
 * @returns Promise<Project | null>
 */
export async function getProjectById(id: string): Promise<Project | null> {
  try {
    // In a real application:
    // const project = await prisma.project.findUnique({
    //   where: { id },
    // });

    await new Promise(resolve => setTimeout(resolve, 50));

    const project = MOCK_PROJECTS.find(p => p.id === id);
    return project || null;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw new Error('Failed to fetch project');
  }
}

/**
 * Fetch featured projects
 * 
 * @param limit - Number of projects to return
 * @returns Promise<Project[]>
 */
export async function getFeaturedProjects(limit: number = 3): Promise<Project[]> {
  return getProjects({ featured: true, limit });
}

/**
 * Fetch projects by category
 * 
 * @param category - Project category
 * @param limit - Number of projects to return
 * @returns Promise<Project[]>
 */
export async function getProjectsByCategory(category: string, limit?: number): Promise<Project[]> {
  return getProjects({ category, limit });
}

/**
 * Get unique categories from all projects
 * 
 * @returns Promise<string[]>
 */
export async function getProjectCategories(): Promise<string[]> {
  try {
    // In a real application:
    // const categories = await prisma.project.findMany({
    //   select: { category: true },
    //   distinct: ['category'],
    // });

    const projects = await getProjects();
    const categories = [...new Set(projects.map(p => p.category))];
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
}

/**
 * Get unique technologies from all projects
 * 
 * @returns Promise<string[]>
 */
export async function getProjectTechnologies(): Promise<string[]> {
  try {
    const projects = await getProjects();
    const technologies = [...new Set(projects.flatMap(p => p.technologies))];
    return technologies.sort();
  } catch (error) {
    console.error('Error fetching technologies:', error);
    throw new Error('Failed to fetch technologies');
  }
}

/**
 * Search projects by query
 * 
 * @param query - Search query
 * @param limit - Number of results to return
 * @returns Promise<Project[]>
 */
export async function searchProjects(query: string, limit?: number): Promise<Project[]> {
  try {
    const projects = await getProjects();
    const searchTerm = query.toLowerCase();

    const filteredProjects = projects.filter(project => 
      project.title.toLowerCase().includes(searchTerm) ||
      project.description.toLowerCase().includes(searchTerm) ||
      project.technologies.some(tech => tech.toLowerCase().includes(searchTerm)) ||
      project.category.toLowerCase().includes(searchTerm)
    );

    return limit ? filteredProjects.slice(0, limit) : filteredProjects;
  } catch (error) {
    console.error('Error searching projects:', error);
    throw new Error('Failed to search projects');
  }
}

/**
 * Get project statistics
 * 
 * @returns Promise<ProjectStats>
 */
export async function getProjectStats(): Promise<{
  total: number;
  completed: number;
  inProgress: number;
  planned: number;
  featured: number;
  categories: Record<string, number>;
}> {
  try {
    const projects = await getProjects();

    const stats = {
      total: projects.length,
      completed: projects.filter(p => p.status === 'completed').length,
      inProgress: projects.filter(p => p.status === 'in-progress').length,
      planned: projects.filter(p => p.status === 'planned').length,
      featured: projects.filter(p => p.featured).length,
      categories: projects.reduce((acc, project) => {
        acc[project.category] = (acc[project.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };

    return stats;
  } catch (error) {
    console.error('Error fetching project stats:', error);
    throw new Error('Failed to fetch project statistics');
  }
}
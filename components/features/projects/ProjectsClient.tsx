/**
 * Projects Client Component
 * 
 * Client-side component that receives projects data from server component
 * and provides interactive functionality through context.
 */

"use client";

import React, { useState, createContext, useContext, useMemo } from 'react';
import { motion } from 'framer-motion';

// Types
interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  status: 'completed' | 'in-progress' | 'planned';
  image?: string;
  demoUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

interface ProjectsContextType {
  projects: Project[];
  filteredProjects: Project[];
  selectedProject: Project | null;
  filters: {
    category: string;
    technology: string;
    status: string;
    search: string;
  };
  setSelectedProject: (project: Project | null) => void;
  updateFilters: (filters: Partial<ProjectsContextType['filters']>) => void;
  clearFilters: () => void;
}

// Context
const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

// Custom hook
export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within ProjectsProvider');
  }
  return context;
};

// Provider component
interface ProjectsProviderProps {
  children: React.ReactNode;
  projects: Project[];
}

export const ProjectsProvider: React.FC<ProjectsProviderProps> = ({ 
  children, 
  projects 
}) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filters, setFilters] = useState({
    category: 'all',
    technology: 'all',
    status: 'all',
    search: ''
  });

  // Memoized filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Category filter
      if (filters.category !== 'all' && project.category !== filters.category) {
        return false;
      }
      
      // Technology filter
      if (filters.technology !== 'all' && !project.technologies.includes(filters.technology)) {
        return false;
      }
      
      // Status filter
      if (filters.status !== 'all' && project.status !== filters.status) {
        return false;
      }
      
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          project.title.toLowerCase().includes(searchTerm) ||
          project.description.toLowerCase().includes(searchTerm) ||
          project.technologies.some(tech => tech.toLowerCase().includes(searchTerm))
        );
      }
      
      return true;
    });
  }, [projects, filters]);

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      technology: 'all',
      status: 'all',
      search: ''
    });
  };

  const value = {
    projects,
    filteredProjects,
    selectedProject,
    filters,
    setSelectedProject,
    updateFilters,
    clearFilters,
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};

// Main client component
interface ProjectsClientProps {
  projects: Project[];
}

export const ProjectsClient: React.FC<ProjectsClientProps> = ({ projects }) => {
  return (
    <ProjectsProvider projects={projects}>
      <div className="projects-container">
        <ProjectsHeader />
        <ProjectsFilters />
        <ProjectsGrid />
        <ProjectModal />
      </div>
    </ProjectsProvider>
  );
};

// Header component
const ProjectsHeader: React.FC = () => {
  const { projects, filteredProjects } = useProjects();

  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl font-bold mb-4">My Projects</h1>
      <p className="text-gray-600 dark:text-gray-300">
        Showing {filteredProjects.length} of {projects.length} projects
      </p>
    </motion.div>
  );
};

// Filters component
const ProjectsFilters: React.FC = () => {
  const { filters, updateFilters, clearFilters, projects } = useProjects();

  // Get unique values for filter options
  const categories = useMemo(() => 
    [...new Set(projects.map(p => p.category))], [projects]
  );
  
  const technologies = useMemo(() => 
    [...new Set(projects.flatMap(p => p.technologies))], [projects]
  );

  return (
    <motion.div 
      className="filters-container mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search projects..."
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />

        {/* Category Filter */}
        <select
          value={filters.category}
          onChange={(e) => updateFilters({ category: e.target.value })}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>

        {/* Technology Filter */}
        <select
          value={filters.technology}
          onChange={(e) => updateFilters({ technology: e.target.value })}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All Technologies</option>
          {technologies.map(tech => (
            <option key={tech} value={tech}>
              {tech}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => updateFilters({ status: e.target.value })}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="in-progress">In Progress</option>
          <option value="planned">Planned</option>
        </select>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={clearFilters}
        className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        Clear All Filters
      </button>
    </motion.div>
  );
};

// Grid component
const ProjectsGrid: React.FC = () => {
  const { filteredProjects, setSelectedProject } = useProjects();

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No projects found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {filteredProjects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          index={index}
          onClick={() => setSelectedProject(project)}
        />
      ))}
    </motion.div>
  );
};

// Project card component
interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, onClick }) => {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
    >
      {project.image && (
        <div className="h-48 bg-gray-200 dark:bg-gray-700">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {project.title}
          </h3>
          <span className={`px-2 py-1 text-xs rounded-full ${
            project.status === 'completed' ? 'bg-green-100 text-green-800' :
            project.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {project.status.replace('-', ' ')}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 3).map(tech => (
            <span
              key={tech}
              className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
              +{project.technologies.length - 3} more
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Modal component
const ProjectModal: React.FC = () => {
  const { selectedProject, setSelectedProject } = useProjects();

  if (!selectedProject) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setSelectedProject(null)}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedProject.title}
            </h2>
            <button
              onClick={() => setSelectedProject(null)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          
          {selectedProject.image && (
            <img
              src={selectedProject.image}
              alt={selectedProject.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
          )}
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {selectedProject.description}
          </p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Technologies Used</h3>
            <div className="flex flex-wrap gap-2">
              {selectedProject.technologies.map(tech => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4">
            {selectedProject.demoUrl && (
              <a
                href={selectedProject.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Demo
              </a>
            )}
            {selectedProject.githubUrl && (
              <a
                href={selectedProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                View Code
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectsClient;
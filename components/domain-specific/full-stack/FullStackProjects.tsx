'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/base/Button';
import { Card, CardContent } from '@/components/ui/base/Card';
import { fullStackProjects, getFeaturedFullStackProjects } from '@/data/projects/full-stack';
import { 
  FaExternalLinkAlt, 
  FaGithub, 
  FaArrowRight,
  FaCode,
  FaUsers,
  FaClock,
  FaStar
} from 'react-icons/fa';

type FilterType = 'all' | 'featured' | 'saas' | 'ecommerce' | 'healthcare';

const filterOptions = [
  { value: 'all', label: 'All Projects', count: fullStackProjects.length },
  { value: 'featured', label: 'Featured', count: getFeaturedFullStackProjects().length },
  { value: 'saas', label: 'SaaS', count: fullStackProjects.filter(p => p.tags.includes('SaaS')).length },
  { value: 'ecommerce', label: 'E-Commerce', count: fullStackProjects.filter(p => p.tags.includes('E-Commerce')).length },
  { value: 'healthcare', label: 'Healthcare', count: fullStackProjects.filter(p => p.tags.includes('Healthcare')).length }
];

export function FullStackProjects() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  
  const filteredProjects = fullStackProjects.filter(project => {
    switch (activeFilter) {
      case 'featured':
        return project.featured;
      case 'saas':
        return project.tags.includes('SaaS');
      case 'ecommerce':
        return project.tags.includes('E-Commerce');
      case 'healthcare':
        return project.tags.includes('Healthcare');
      default:
        return true;
    }
  });

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <FaCode className="text-blue-400 text-2xl" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Full-Stack Projects
            </h2>
          </div>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Comprehensive web applications built with modern technologies, 
            delivering measurable business impact and exceptional user experiences.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setActiveFilter(option.value as FilterType)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === option.value
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {option.label} ({option.count})
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Card variant="interactive" className="h-full bg-slate-900/50 border-slate-700 hover:border-slate-600 group">
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                    <div className="text-center">
                      <FaCode className="text-4xl text-slate-600 mb-2 mx-auto" />
                      <p className="text-slate-500 text-sm">Project Screenshot</p>
                    </div>
                  </div>
                  
                  {/* Featured Badge */}
                  {project.featured && (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <FaStar className="mr-1" />
                      Featured
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {project.status === 'completed' ? 'Completed' : 'In Progress'}
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Project Title & Description */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <FaClock className="text-blue-400 text-sm" />
                      <span className="text-gray-300 text-sm">{project.timeline}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaUsers className="text-green-400 text-sm" />
                      <span className="text-gray-300 text-sm">{project.client?.size || 'Enterprise'}</span>
                    </div>
                  </div>

                  {/* Impact Highlight */}
                  {project.impact.metrics.length > 0 && (
                    <div className="mb-4 p-3 bg-slate-800/50 rounded-lg">
                      <p className="text-green-400 text-sm font-medium mb-1">Key Impact:</p>
                      <p className="text-gray-300 text-sm">
                        {project.impact.metrics[0]}
                      </p>
                    </div>
                  )}

                  {/* Tech Stack */}
                  <div className="mb-6">
                    <p className="text-gray-400 text-xs mb-2">Technologies:</p>
                    <div className="flex flex-wrap gap-1">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech.name}
                          className="px-2 py-1 bg-slate-800 text-gray-300 text-xs rounded"
                        >
                          {tech.name}
                        </span>
                      ))}
                      {project.techStack.length > 4 && (
                        <span className="px-2 py-1 bg-slate-700 text-gray-400 text-xs rounded">
                          +{project.techStack.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {project.caseStudyUrl && (
                      <Link href={project.caseStudyUrl} className="flex-1">
                        <Button variant="default" size="sm" className="w-full">
                          Case Study
                          <FaArrowRight className="ml-2" />
                        </Button>
                      </Link>
                    )}
                    
                    <div className="flex gap-2">
                      {project.liveDemo && (
                        <Link href={project.liveDemo} target="_blank">
                          <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                            <FaExternalLinkAlt className="mr-2" />
                            Demo
                          </Button>
                        </Link>
                      )}
                      
                      {project.codeRepo && (
                        <Link href={project.codeRepo} target="_blank">
                          <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                            <FaGithub className="mr-2" />
                            Code
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Client Testimonial */}
                  {project.client?.testimonial && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <p className="text-gray-400 text-sm italic">
                        &ldquo;{project.client.testimonial.substring(0, 100)}...&rdquo;
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        - {project.client.name}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Projects CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/portfolio?domain=full-stack">
            <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              View All Full-Stack Projects
              <FaArrowRight className="ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
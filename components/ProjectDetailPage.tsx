"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaExternalLinkAlt, FaGithub, FaCheckCircle, FaClock, FaUsers, FaTag } from 'react-icons/fa';
import { ProjectCaseStudy } from '@/data/projects-enhanced';

interface ProjectDetailPageProps {
  project: ProjectCaseStudy;
}

const ProjectHero: React.FC<{ project: ProjectCaseStudy }> = ({ project }) => (
  <section className="relative py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <div className="max-w-7xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <Link 
          href="/#projects"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Projects
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          {project.title}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          {project.subtitle}
        </p>
        
        {/* Project Meta */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <FaClock className="mr-2" />
            {project.timeline}
          </div>
          <div className="flex items-center">
            <FaUsers className="mr-2" />
            Team of {project.teamSize}
          </div>
          <div className="flex items-center">
            <FaTag className="mr-2" />
            {project.role}
          </div>
        </div>
      </motion.div>
      
      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative w-full h-96 md:h-[500px] rounded-xl overflow-hidden shadow-2xl"
      >
        <Image
          src={project.images.hero}
          alt={project.title}
          fill
          className="object-cover"
          priority
        />
      </motion.div>
    </div>
  </section>
);

const ProjectOverview: React.FC<{ project: ProjectCaseStudy }> = ({ project }) => (
  <section className="py-20 bg-white dark:bg-gray-900">
    <div className="max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Project Overview</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
          {project.overview}
        </p>
        
        {/* Quick Links */}
        <div className="flex flex-wrap gap-4">
          {project.links.live && (
            <Link
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FaExternalLinkAlt className="mr-2" />
              View Live Demo
            </Link>
          )}
          <Link
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors"
          >
            <FaGithub className="mr-2" />
            View Source Code
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

const ProjectChallenge: React.FC<{ project: ProjectCaseStudy }> = ({ project }) => (
  <section className="py-20 bg-gray-50 dark:bg-gray-800">
    <div className="max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">The Challenge</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          {project.challenge}
        </p>
      </motion.div>
    </div>
  </section>
);

const ProjectSolution: React.FC<{ project: ProjectCaseStudy }> = ({ project }) => (
  <section className="py-20 bg-white dark:bg-gray-900">
    <div className="max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">The Solution</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
          {project.solution}
        </p>
        
        {/* Technologies Used */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Technologies Used</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(project.technologies).map(([category, icons]) => (
              <div key={category} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-gray-900 dark:text-white capitalize">
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {icons?.map((tech, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const ProjectImpact: React.FC<{ project: ProjectCaseStudy }> = ({ project }) => (
  <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
    <div className="max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Impact & Results</h2>
        
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {project.impact.metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
            >
              <FaCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{metric}</span>
            </motion.div>
          ))}
        </div>
        
        {/* Business Value */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Business Value</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {project.impact.businessValue}
          </p>
        </div>
        
        {/* Testimonial */}
        {project.impact.testimonial && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border-l-4 border-blue-500"
          >
            <blockquote className="text-lg text-gray-700 dark:text-gray-300 italic mb-4">
              &ldquo;{project.impact.testimonial.quote}&rdquo;
            </blockquote>
            <div className="text-sm">
              <div className="font-semibold text-gray-900 dark:text-white">
                {project.impact.testimonial.author}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {project.impact.testimonial.role}, {project.impact.testimonial.company}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  </section>
);

const ProjectGallery: React.FC<{ project: ProjectCaseStudy }> = ({ project }) => (
  <section className="py-20 bg-white dark:bg-gray-900">
    <div className="max-w-6xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white">Project Gallery</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {project.images.gallery.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <Image
                src={image}
                alt={`${project.title} screenshot ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </motion.div>
          ))}
        </div>
        
        {/* Architecture Diagram */}
        {project.images.architecture && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12"
          >
            <h3 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
              System Architecture
            </h3>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={project.images.architecture}
                alt={`${project.title} architecture diagram`}
                fill
                className="object-contain bg-white dark:bg-gray-800"
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  </section>
);

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ project }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <ProjectHero project={project} />
      <ProjectOverview project={project} />
      <ProjectChallenge project={project} />
      <ProjectSolution project={project} />
      <ProjectImpact project={project} />
      <ProjectGallery project={project} />
    </div>
  );
};

export default ProjectDetailPage;
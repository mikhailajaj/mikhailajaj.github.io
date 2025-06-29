'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/base/Card';
import { getFullStackTechnologies } from '@/data/projects/full-stack';
import { 
  FaReact, 
  FaNodeJs, 
  FaDatabase, 
  FaCode,
  FaServer,
  FaCloud,
  FaTools,
  FaShieldAlt
} from 'react-icons/fa';

const skillCategories = [
  {
    title: 'Frontend Development',
    icon: <FaReact />,
    color: 'from-blue-500 to-cyan-500',
    skills: [
      { name: 'React/Next.js', level: 95, description: 'Advanced component architecture, SSR, SSG' },
      { name: 'TypeScript', level: 90, description: 'Type-safe development, advanced patterns' },
      { name: 'Tailwind CSS', level: 95, description: 'Responsive design, custom components' },
      { name: 'State Management', level: 85, description: 'Redux, Zustand, React Query' }
    ]
  },
  {
    title: 'Backend Development',
    icon: <FaNodeJs />,
    color: 'from-green-500 to-emerald-500',
    skills: [
      { name: 'Node.js/Express', level: 90, description: 'RESTful APIs, middleware, authentication' },
      { name: 'NestJS', level: 80, description: 'Enterprise architecture, decorators, guards' },
      { name: 'API Design', level: 95, description: 'REST, GraphQL, OpenAPI documentation' },
      { name: 'Microservices', level: 75, description: 'Service architecture, communication patterns' }
    ]
  },
  {
    title: 'Database & Storage',
    icon: <FaDatabase />,
    color: 'from-purple-500 to-pink-500',
    skills: [
      { name: 'MongoDB', level: 90, description: 'Schema design, aggregation, indexing' },
      { name: 'PostgreSQL', level: 85, description: 'Complex queries, optimization, migrations' },
      { name: 'Redis', level: 80, description: 'Caching, sessions, pub/sub patterns' },
      { name: 'Database Design', level: 90, description: 'Normalization, performance optimization' }
    ]
  },
  {
    title: 'DevOps & Deployment',
    icon: <FaCloud />,
    color: 'from-orange-500 to-red-500',
    skills: [
      { name: 'Docker', level: 85, description: 'Containerization, multi-stage builds' },
      { name: 'CI/CD', level: 80, description: 'GitHub Actions, automated testing' },
      { name: 'Cloud Platforms', level: 75, description: 'Vercel, Netlify, AWS basics' },
      { name: 'Monitoring', level: 70, description: 'Error tracking, performance monitoring' }
    ]
  }
];

const certifications = [
  { name: 'AWS Certified Developer', year: '2024', status: 'Active' },
  { name: 'MongoDB Certified Developer', year: '2023', status: 'Active' },
  { name: 'React Advanced Patterns', year: '2023', status: 'Completed' },
  { name: 'Node.js Application Development', year: '2022', status: 'Completed' }
];

const methodologies = [
  { name: 'Agile/Scrum', description: 'Sprint planning, daily standups, retrospectives' },
  { name: 'Test-Driven Development', description: 'Unit testing, integration testing, E2E testing' },
  { name: 'Code Review', description: 'Peer review, quality assurance, knowledge sharing' },
  { name: 'Performance Optimization', description: 'Bundle analysis, lazy loading, caching strategies' }
];

export function FullStackSkills() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Technical Skills & Expertise
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Comprehensive full-stack development skills spanning modern frontend frameworks, 
            scalable backend architectures, and robust database solutions.
          </p>
        </motion.div>

        {/* Skills Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * categoryIndex }}
            >
              <Card variant="glass" className="h-full p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                    <span className="text-white text-xl">
                      {category.icon}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{category.title}</h3>
                </div>

                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * skillIndex }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">{skill.name}</span>
                        <span className="text-gray-400 text-sm">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                        <motion.div
                          className={`h-2 rounded-full bg-gradient-to-r ${category.color}`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: 0.2 * skillIndex }}
                        />
                      </div>
                      <p className="text-gray-400 text-sm">{skill.description}</p>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Certifications & Methodologies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card variant="glass" className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                  <FaShieldAlt className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-bold text-white">Certifications</h3>
              </div>

              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={cert.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg"
                  >
                    <div>
                      <p className="text-white font-medium">{cert.name}</p>
                      <p className="text-gray-400 text-sm">Earned {cert.year}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      cert.status === 'Active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {cert.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Development Methodologies */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card variant="glass" className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <FaTools className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-bold text-white">Methodologies</h3>
              </div>

              <div className="space-y-4">
                {methodologies.map((method, index) => (
                  <motion.div
                    key={method.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="p-3 bg-slate-800/50 rounded-lg"
                  >
                    <p className="text-white font-medium mb-1">{method.name}</p>
                    <p className="text-gray-400 text-sm">{method.description}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Skills Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <Card variant="glass" className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Full-Stack Development Expertise
            </h3>
            <p className="text-gray-300 text-lg mb-6 max-w-4xl mx-auto">
              With 5+ years of experience, I deliver end-to-end web solutions using modern technologies. 
              From React frontends to Node.js backends, I build scalable applications that drive business growth.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">15+</div>
                <div className="text-gray-400 text-sm">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">25+</div>
                <div className="text-gray-400 text-sm">Technologies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-1">98%</div>
                <div className="text-gray-400 text-sm">Client Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-1">5+</div>
                <div className="text-gray-400 text-sm">Years Experience</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/base/Button';
import { Card } from '@/components/ui/base/Card';
import { 
  FaCode, 
  FaReact, 
  FaNodeJs, 
  FaDatabase,
  FaArrowRight,
  FaGithub,
  FaExternalLinkAlt,
  FaCheckCircle
} from 'react-icons/fa';

const achievements = [
  { label: 'Full-Stack Projects', value: '15+' },
  { label: 'Years Experience', value: '5+' },
  { label: 'Client Satisfaction', value: '98%' },
  { label: 'Code Quality Score', value: 'A+' }
];

const techStack = [
  { name: 'React/Next.js', icon: <FaReact />, description: 'Modern frontend frameworks' },
  { name: 'Node.js/Express', icon: <FaNodeJs />, description: 'Scalable backend solutions' },
  { name: 'TypeScript', icon: <FaCode />, description: 'Type-safe development' },
  { name: 'Databases', icon: <FaDatabase />, description: 'MongoDB, PostgreSQL, Redis' }
];

const highlights = [
  'End-to-end application development',
  'Modern React & Next.js expertise',
  'Scalable Node.js backend architecture',
  'Database design & optimization',
  'API development & integration',
  'Performance optimization',
  'Security best practices',
  'CI/CD & deployment automation'
];

export function FullStackHero() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-black/50" />
      
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-800 rounded-lg flex items-center justify-center">
                <FaCode className="text-white text-xl" />
              </div>
              <span className="text-slate-400 font-medium">Full-Stack Development</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              End-to-End
              <span className="block bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Web Solutions
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              I build comprehensive web applications from concept to deployment, 
              specializing in modern React frontends, scalable Node.js backends, 
              and robust database architectures that drive business growth.
            </p>
            
            {/* Key Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              {highlights.map((highlight, index) => (
                <motion.div
                  key={highlight}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="flex items-center space-x-2"
                >
                  <FaCheckCircle className="text-green-400 text-sm flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{highlight}</span>
                </motion.div>
              ))}
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#projects">
                <Button size="lg" variant="gradient" className="w-full sm:w-auto">
                  View Projects
                  <FaArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link href="https://github.com/mikhailajaj" target="_blank">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-gray-600 text-gray-300 hover:bg-gray-800">
                  <FaGithub className="mr-2" />
                  GitHub Profile
                </Button>
              </Link>
            </div>
          </motion.div>
          
          {/* Right Column - Tech Stack & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Achievement Stats */}
            <Card variant="glass" className="p-6">
              <h3 className="text-white font-semibold text-lg mb-4">Achievements</h3>
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.label} className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {achievement.value}
                    </div>
                    <div className="text-sm text-gray-400">
                      {achievement.label}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            {/* Tech Stack */}
            <Card variant="glass" className="p-6">
              <h3 className="text-white font-semibold text-lg mb-4">Core Technologies</h3>
              <div className="space-y-4">
                {techStack.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-slate-700 to-slate-800 rounded-lg flex items-center justify-center">
                      <span className="text-blue-400 text-lg">
                        {tech.icon}
                      </span>
                    </div>
                    <div>
                      <div className="text-white font-medium">{tech.name}</div>
                      <div className="text-gray-400 text-sm">{tech.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
            
            {/* Quick Links */}
            <Card variant="glass" className="p-6">
              <h3 className="text-white font-semibold text-lg mb-4">Quick Access</h3>
              <div className="space-y-3">
                <Link href="/case-studies/ecommerce-platform" className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors group">
                  <span className="text-gray-300 group-hover:text-white">Featured Case Study</span>
                  <FaExternalLinkAlt className="text-gray-500 group-hover:text-blue-400" />
                </Link>
                <Link href="#services" className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors group">
                  <span className="text-gray-300 group-hover:text-white">Service Offerings</span>
                  <FaArrowRight className="text-gray-500 group-hover:text-blue-400" />
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
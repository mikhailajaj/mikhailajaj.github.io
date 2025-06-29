'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/base/Button';
import { Card } from '@/components/ui/base/Card';
import { 
  FaCloud, 
  FaAws, 
  FaDocker, 
  FaServer,
  FaArrowRight,
  FaGithub,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaShieldAlt,
  FaCogs,
  FaChartLine
} from 'react-icons/fa';

const achievements = [
  { label: 'Cloud Projects', value: '12+' },
  { label: 'AWS Certifications', value: '3' },
  { label: 'Cost Savings', value: '$2M+' },
  { label: 'Uptime Achieved', value: '99.99%' }
];

const techStack = [
  { name: 'AWS Services', icon: <FaAws />, description: 'Lambda, EC2, S3, RDS, CloudWatch' },
  { name: 'Container Orchestration', icon: <FaDocker />, description: 'Docker, Kubernetes, ECS' },
  { name: 'Infrastructure as Code', icon: <FaCogs />, description: 'Terraform, CloudFormation' },
  { name: 'DevOps & Automation', icon: <FaServer />, description: 'CI/CD, Monitoring, Security' }
];

const highlights = [
  'Serverless architecture design and implementation',
  'Kubernetes container orchestration',
  'Infrastructure as Code with Terraform',
  'CI/CD pipeline automation',
  'Cloud security and compliance',
  'Cost optimization strategies',
  'Disaster recovery planning',
  'Performance monitoring and alerting'
];

const certifications = [
  { name: 'AWS Certified Solutions Architect', level: 'Professional', year: '2024' },
  { name: 'AWS Certified DevOps Engineer', level: 'Professional', year: '2023' },
  { name: 'AWS Certified Security Specialist', level: 'Specialty', year: '2023' }
];

export function CloudHero() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-black/50" />
      
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <FaCloud className="text-white text-xl" />
              </div>
              <span className="text-blue-400 font-medium">Cloud Engineering</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Scalable Cloud
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Infrastructure
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              I design and implement robust cloud architectures using AWS services, 
              container orchestration, and Infrastructure as Code to build scalable, 
              secure, and cost-effective solutions that drive business growth.
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
                  View Cloud Projects
                  <FaArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link href="https://github.com/mikhailajaj" target="_blank">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-gray-600 text-gray-300 hover:bg-gray-800">
                  <FaGithub className="mr-2" />
                  Infrastructure Code
                </Button>
              </Link>
            </div>
          </motion.div>
          
          {/* Right Column - Stats & Certifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Achievement Stats */}
            <Card variant="glass" className="p-6">
              <h3 className="text-white font-semibold text-lg mb-4">Cloud Achievements</h3>
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.label} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-white mb-2">
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
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-700 to-blue-800 rounded-lg flex items-center justify-center">
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
            
            {/* AWS Certifications */}
            <Card variant="glass" className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FaShieldAlt className="text-orange-400 text-lg" />
                <h3 className="text-white font-semibold text-lg">AWS Certifications</h3>
              </div>
              <div className="space-y-3">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={cert.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="flex items-center justify-between p-3 bg-blue-900/20 rounded-lg border border-blue-800/30"
                  >
                    <div>
                      <div className="text-white font-medium text-sm">{cert.name}</div>
                      <div className="text-blue-400 text-xs">{cert.level}</div>
                    </div>
                    <div className="text-gray-400 text-xs">{cert.year}</div>
                  </motion.div>
                ))}
              </div>
            </Card>
            
            {/* Quick Links */}
            <Card variant="glass" className="p-6">
              <h3 className="text-white font-semibold text-lg mb-4">Quick Access</h3>
              <div className="space-y-3">
                <Link href="/case-studies/serverless-microservices-platform" className="flex items-center justify-between p-3 rounded-lg bg-blue-800/50 hover:bg-blue-700/50 transition-colors group">
                  <span className="text-gray-300 group-hover:text-white">Serverless Architecture Case Study</span>
                  <FaExternalLinkAlt className="text-gray-500 group-hover:text-blue-400" />
                </Link>
                <Link href="#services" className="flex items-center justify-between p-3 rounded-lg bg-blue-800/50 hover:bg-blue-700/50 transition-colors group">
                  <span className="text-gray-300 group-hover:text-white">Cloud Services & Pricing</span>
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
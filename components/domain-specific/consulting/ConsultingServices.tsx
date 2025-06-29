'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/base/Button';
import { Card, CardContent } from '@/components/ui/base/Card';
import { 
  FaChartLine,
  FaRocket,
  FaCogs,
  FaUsers,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaUserFriends,
  FaDollarSign,
  FaEye,
  FaHandshake
} from 'react-icons/fa';

const services = [
  {
    id: 'digital-transformation',
    title: 'Digital Transformation Strategy',
    description: 'Comprehensive digital transformation planning and execution, modernizing legacy systems and establishing scalable, future-ready technology foundations.',
    icon: <FaRocket />,
    color: 'from-indigo-600 to-indigo-800',
    features: [
      'Technology roadmap development',
      'Legacy system modernization',
      'Cloud migration strategy',
      'Process automation',
      'Change management',
      'ROI optimization'
    ],
    deliverables: [
      'Digital transformation roadmap',
      'Technology architecture design',
      'Implementation timeline',
      'Change management plan',
      'Success metrics framework'
    ],
    timeline: '12-24 months',
    teamSize: '8-15 experts',
    pricing: '$150,000 - $500,000',
    caseStudy: '/case-studies/enterprise-digital-transformation'
  },
  {
    id: 'agile-coaching',
    title: 'Agile Transformation & Coaching',
    description: 'End-to-end agile transformation services including team coaching, process optimization, and cultural change management for improved delivery velocity.',
    icon: <FaCogs />,
    color: 'from-blue-600 to-blue-800',
    features: [
      'Agile methodology training',
      'Scrum team coaching',
      'Process optimization',
      'Tool implementation',
      'Performance metrics',
      'Continuous improvement'
    ],
    deliverables: [
      'Agile transformation plan',
      'Team training programs',
      'Process documentation',
      'Metrics dashboard',
      'Coaching framework'
    ],
    timeline: '6-12 months',
    teamSize: '3-6 experts',
    pricing: '$75,000 - $200,000',
    caseStudy: '/case-studies/agile-transformation-healthcare'
  },
  {
    id: 'technical-strategy',
    title: 'Technical Strategy & Architecture',
    description: 'Strategic technical guidance for startups and enterprises, including architecture design, technology selection, and scalability planning.',
    icon: <FaChartLine />,
    color: 'from-purple-600 to-purple-800',
    features: [
      'Technical architecture design',
      'Technology stack selection',
      'Scalability planning',
      'Security framework',
      'Performance optimization',
      'Cost optimization'
    ],
    deliverables: [
      'Technical strategy document',
      'Architecture blueprints',
      'Technology recommendations',
      'Implementation roadmap',
      'Risk assessment'
    ],
    timeline: '3-8 months',
    teamSize: '2-5 experts',
    pricing: '$50,000 - $150,000',
    caseStudy: '/case-studies/startup-technical-strategy'
  },
  {
    id: 'team-building',
    title: 'Technical Team Building & Leadership',
    description: 'Comprehensive team building services including hiring strategy, leadership development, and organizational structure optimization.',
    icon: <FaUsers />,
    color: 'from-green-600 to-green-800',
    features: [
      'Hiring strategy development',
      'Leadership mentoring',
      'Team structure design',
      'Performance frameworks',
      'Culture development',
      'Retention strategies'
    ],
    deliverables: [
      'Team building strategy',
      'Hiring playbook',
      'Leadership development plan',
      'Performance metrics',
      'Culture framework'
    ],
    timeline: '6-18 months',
    teamSize: '2-4 experts',
    pricing: '$60,000 - $180,000',
    caseStudy: '/case-studies/startup-technical-strategy'
  }
];

const process = [
  {
    step: 1,
    title: 'Assessment & Discovery',
    description: 'Comprehensive analysis of current state, challenges, and opportunities.',
    duration: '2-4 weeks'
  },
  {
    step: 2,
    title: 'Strategy Development',
    description: 'Custom strategy and roadmap development based on business objectives.',
    duration: '2-3 weeks'
  },
  {
    step: 3,
    title: 'Implementation Planning',
    description: 'Detailed implementation plan with timelines, resources, and milestones.',
    duration: '1-2 weeks'
  },
  {
    step: 4,
    title: 'Execution & Coaching',
    description: 'Hands-on implementation support and team coaching throughout the process.',
    duration: '3-18 months'
  },
  {
    step: 5,
    title: 'Optimization & Handoff',
    description: 'Performance optimization, knowledge transfer, and sustainable practices.',
    duration: '2-4 weeks'
  }
];

export function ConsultingServices() {
  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-lg flex items-center justify-center">
              <FaChartLine className="text-white text-lg" />
            </div>
            <span className="text-indigo-400 font-medium">Services</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Technical Consulting
            <span className="block bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
              Services
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Strategic technical consulting services that transform organizations through 
            expert guidance, proven methodologies, and measurable business results.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card variant="glass" className="h-full group hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  {/* Service Header */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-lg flex items-center justify-center`}>
                      <span className="text-white text-xl">
                        {service.icon}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {service.title}
                    </h3>
                  </div>

                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Key Features */}
                  <div className="mb-6">
                    <h4 className="text-white font-semibold text-sm mb-3">Key Features:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {service.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <FaCheckCircle className="text-indigo-400 text-xs flex-shrink-0" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-slate-800/30 rounded-lg">
                    <div className="text-center">
                      <FaClock className="text-indigo-400 mx-auto mb-1" />
                      <div className="text-white text-xs font-medium">{service.timeline}</div>
                      <div className="text-gray-400 text-xs">Timeline</div>
                    </div>
                    <div className="text-center">
                      <FaUserFriends className="text-indigo-400 mx-auto mb-1" />
                      <div className="text-white text-xs font-medium">{service.teamSize}</div>
                      <div className="text-gray-400 text-xs">Team Size</div>
                    </div>
                    <div className="text-center">
                      <FaDollarSign className="text-indigo-400 mx-auto mb-1" />
                      <div className="text-white text-xs font-medium">{service.pricing}</div>
                      <div className="text-gray-400 text-xs">Investment</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/contact" className="flex-1">
                      <Button variant="gradient" size="sm" className="w-full">
                        <FaHandshake className="mr-2" />
                        Schedule Consultation
                      </Button>
                    </Link>
                    {service.caseStudy && (
                      <Link href={service.caseStudy}>
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                          <FaEye className="mr-1" />
                          Case Study
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Process Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card variant="glass">
            <CardContent className="p-8">
              <div className="text-center mb-12">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Our Consulting
                  <span className="block bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                    Process
                  </span>
                </h3>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  A proven methodology that ensures successful delivery of technical consulting 
                  engagements with measurable business impact and sustainable results.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {process.map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold">{step.step}</span>
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-2">{step.title}</h4>
                    <p className="text-gray-400 text-xs mb-2">{step.description}</p>
                    <span className="text-indigo-400 text-xs font-medium">{step.duration}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card variant="glass">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Transform Your Organization?
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Let&apos;s discuss how strategic technical consulting can accelerate your 
                digital transformation and drive sustainable business growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" variant="gradient">
                    Schedule Strategy Session
                    <FaArrowRight className="ml-2" />
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button size="lg" variant="outline" className="border-indigo-400 text-indigo-400 hover:bg-indigo-400 hover:text-black">
                    View Case Studies
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
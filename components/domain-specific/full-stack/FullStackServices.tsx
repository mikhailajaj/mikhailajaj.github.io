'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/base/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/base/Card';
import { 
  FaCode, 
  FaRocket, 
  FaShieldAlt, 
  FaChartLine,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaDollarSign,
  FaUsers,
  FaTools,
  FaLightbulb,
  FaHandshake
} from 'react-icons/fa';

const services = [
  {
    id: 'web-application-development',
    title: 'Web Application Development',
    icon: <FaCode />,
    description: 'Complete end-to-end web application development from concept to deployment.',
    features: [
      'Custom React/Next.js frontend development',
      'Scalable Node.js backend architecture',
      'Database design and optimization',
      'API development and integration',
      'Responsive design and mobile optimization',
      'Performance optimization and SEO'
    ],
    pricing: {
      type: 'project',
      range: '$15,000 - $75,000',
      timeline: '6-16 weeks'
    },
    deliverables: [
      'Fully functional web application',
      'Source code and documentation',
      'Deployment and hosting setup',
      'Training and knowledge transfer',
      '3 months post-launch support'
    ],
    idealFor: 'Startups and businesses needing custom web solutions',
    cta: 'Start Your Project'
  },
  {
    id: 'saas-development',
    title: 'SaaS Platform Development',
    icon: <FaRocket />,
    description: 'Build scalable Software-as-a-Service platforms with subscription management and analytics.',
    features: [
      'Multi-tenant architecture design',
      'User authentication and authorization',
      'Subscription and billing integration',
      'Admin dashboard and analytics',
      'API development for third-party integrations',
      'Scalable cloud infrastructure setup'
    ],
    pricing: {
      type: 'project',
      range: '$25,000 - $100,000',
      timeline: '12-24 weeks'
    },
    deliverables: [
      'Complete SaaS platform',
      'Admin and user dashboards',
      'Payment processing integration',
      'API documentation',
      'Deployment and monitoring setup',
      '6 months ongoing support'
    ],
    idealFor: 'Entrepreneurs and companies launching SaaS products',
    cta: 'Build Your SaaS'
  },
  {
    id: 'legacy-modernization',
    title: 'Legacy System Modernization',
    icon: <FaTools />,
    description: 'Modernize legacy applications with current technologies while maintaining business continuity.',
    features: [
      'Legacy system analysis and assessment',
      'Migration strategy and planning',
      'Gradual modernization approach',
      'Data migration and integrity',
      'Performance improvements',
      'Security enhancements'
    ],
    pricing: {
      type: 'project',
      range: '$20,000 - $150,000',
      timeline: '8-32 weeks'
    },
    deliverables: [
      'Modernized application architecture',
      'Migrated data and functionality',
      'Performance and security improvements',
      'Documentation and training',
      'Phased rollout plan',
      'Ongoing maintenance support'
    ],
    idealFor: 'Enterprises with outdated systems needing modernization',
    cta: 'Modernize Your System'
  },
  {
    id: 'technical-consulting',
    title: 'Technical Architecture Consulting',
    icon: <FaLightbulb />,
    description: 'Strategic technical guidance for architecture decisions and technology selection.',
    features: [
      'Technology stack evaluation',
      'Architecture design and review',
      'Performance optimization strategies',
      'Security assessment and recommendations',
      'Team training and mentoring',
      'Code review and quality assurance'
    ],
    pricing: {
      type: 'hourly',
      range: '$150 - $250/hour',
      timeline: 'Flexible'
    },
    deliverables: [
      'Technical architecture documentation',
      'Technology recommendations',
      'Implementation roadmap',
      'Best practices guidelines',
      'Team training materials',
      'Ongoing advisory support'
    ],
    idealFor: 'Teams needing expert technical guidance and mentoring',
    cta: 'Get Expert Advice'
  }
];

const processSteps = [
  {
    step: 1,
    title: 'Discovery & Planning',
    description: 'Understanding your requirements, goals, and technical constraints',
    duration: '1-2 weeks',
    deliverables: ['Project scope document', 'Technical requirements', 'Timeline and budget']
  },
  {
    step: 2,
    title: 'Design & Architecture',
    description: 'Creating the technical architecture and user experience design',
    duration: '1-3 weeks',
    deliverables: ['System architecture', 'Database design', 'UI/UX mockups']
  },
  {
    step: 3,
    title: 'Development & Testing',
    description: 'Building the application with regular progress updates and testing',
    duration: '4-16 weeks',
    deliverables: ['Working application', 'Test coverage', 'Documentation']
  },
  {
    step: 4,
    title: 'Deployment & Launch',
    description: 'Deploying to production and ensuring smooth launch',
    duration: '1-2 weeks',
    deliverables: ['Production deployment', 'Monitoring setup', 'Launch support']
  },
  {
    step: 5,
    title: 'Support & Maintenance',
    description: 'Ongoing support, bug fixes, and feature enhancements',
    duration: 'Ongoing',
    deliverables: ['Bug fixes', 'Performance monitoring', 'Feature updates']
  }
];

const testimonials = [
  {
    quote: "Mikhail delivered an exceptional e-commerce platform that exceeded our expectations. The performance improvements and new features have significantly boosted our sales.",
    client: "RetailMax Inc.",
    role: "CTO",
    project: "E-commerce Platform"
  },
  {
    quote: "The AI-powered insights have transformed how our clients manage their projects. Mikhail's technical expertise and attention to detail were exceptional.",
    client: "ProductivityPro",
    role: "Founder",
    project: "Task Management SaaS"
  }
];

export function FullStackServices() {
  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Full-Stack Development Services
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Comprehensive web development services from concept to deployment. 
            I help businesses build scalable, high-performance applications that drive growth.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Card variant="interactive" className="h-full bg-slate-900/50 border-slate-700 hover:border-slate-600 group">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl">
                        {service.icon}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white group-hover:text-blue-400 transition-colors">
                        {service.title}
                      </CardTitle>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {service.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <div>
                    <h4 className="text-white font-medium mb-3">What&apos;s Included:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-2">
                          <FaCheckCircle className="text-green-400 text-sm mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing & Timeline */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-center">
                      <FaDollarSign className="text-green-400 text-lg mx-auto mb-1" />
                      <p className="text-white font-medium text-sm">{service.pricing.range}</p>
                      <p className="text-gray-400 text-xs">Investment</p>
                    </div>
                    <div className="text-center">
                      <FaClock className="text-blue-400 text-lg mx-auto mb-1" />
                      <p className="text-white font-medium text-sm">{service.pricing.timeline}</p>
                      <p className="text-gray-400 text-xs">Timeline</p>
                    </div>
                  </div>

                  {/* Ideal For */}
                  <div className="p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                    <p className="text-blue-400 text-sm font-medium mb-1">Ideal For:</p>
                    <p className="text-gray-300 text-sm">{service.idealFor}</p>
                  </div>

                  {/* CTA Button */}
                  <Link href={`/contact?service=${service.id}`}>
                    <Button variant="default" className="w-full">
                      {service.cta}
                      <FaArrowRight className="ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Development Process */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Development Process
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A proven methodology that ensures successful project delivery with clear milestones and regular communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card variant="glass" className="h-full p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">{step.step}</span>
                  </div>
                  <h4 className="text-white font-semibold mb-2">{step.title}</h4>
                  <p className="text-gray-400 text-sm mb-3">{step.description}</p>
                  <div className="text-blue-400 text-xs font-medium mb-2">{step.duration}</div>
                  <ul className="text-gray-500 text-xs space-y-1">
                    {step.deliverables.map((deliverable, idx) => (
                      <li key={idx}>- {deliverable}</li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Client Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Client Success Stories
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Real results from real clients who have transformed their businesses with custom full-stack solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 * index }}
              >
                <Card variant="glass" className="p-6">
                  <div className="flex items-start space-x-4">
                    <FaHandshake className="text-blue-400 text-2xl mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300 italic mb-4">
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>
                      <div>
                        <p className="text-white font-medium">{testimonial.client}</p>
                        <p className="text-gray-400 text-sm">{testimonial.role}</p>
                        <p className="text-blue-400 text-sm">{testimonial.project}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <Card variant="gradient" domain="full-stack" className="p-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Build Your Next Application?
            </h3>
            <p className="text-gray-200 text-lg mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss your project requirements and create a custom solution that drives your business forward.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact?service=consultation">
                <Button size="lg" variant="default" className="bg-white text-black hover:bg-gray-100">
                  Schedule Free Consultation
                  <FaArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link href="/portfolio?domain=full-stack">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                  View Portfolio
                </Button>
              </Link>
            </div>
            
            <div className="mt-6 text-sm text-gray-300">
              <p>Free 30-minute consultation - No obligation - Response within 24 hours</p>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
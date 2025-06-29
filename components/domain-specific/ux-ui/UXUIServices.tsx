'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/base/Button';
import { Card, CardContent } from '@/components/ui/base/Card';
import { 
  FaPaintBrush,
  FaUsers,
  FaMobile,
  FaDesktop,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaUserFriends,
  FaDollarSign,
  FaEye
} from 'react-icons/fa';

const services = [
  {
    id: 'ux-research-strategy',
    title: 'UX Research & Strategy',
    description: 'Comprehensive user research, persona development, and strategic UX planning to inform design decisions and improve user experiences.',
    icon: <FaUsers />,
    color: 'from-blue-600 to-blue-800',
    features: [
      'User interviews and surveys',
      'Persona development',
      'User journey mapping',
      'Competitive analysis',
      'Information architecture',
      'Usability testing'
    ],
    deliverables: [
      'Research findings report',
      'User personas and journey maps',
      'UX strategy document',
      'Wireframes and prototypes',
      'Testing recommendations'
    ],
    timeline: '4-8 weeks',
    teamSize: '2-3 experts',
    pricing: '$15,000 - $35,000',
    caseStudy: '/case-studies/fintech-mobile-banking-redesign'
  },
  {
    id: 'ui-visual-design',
    title: 'UI & Visual Design',
    description: 'Beautiful, modern interface design that balances aesthetics with usability, creating engaging digital experiences that convert.',
    icon: <FaPaintBrush />,
    color: 'from-purple-600 to-purple-800',
    features: [
      'Visual design systems',
      'High-fidelity mockups',
      'Interactive prototypes',
      'Brand integration',
      'Responsive design',
      'Accessibility compliance'
    ],
    deliverables: [
      'Design system documentation',
      'High-fidelity designs',
      'Interactive prototypes',
      'Asset library',
      'Style guide'
    ],
    timeline: '6-10 weeks',
    teamSize: '2-4 experts',
    pricing: '$20,000 - $50,000',
    caseStudy: '/case-studies/healthcare-patient-portal'
  },
  {
    id: 'mobile-app-design',
    title: 'Mobile App Design',
    description: 'Native and cross-platform mobile app design focused on user engagement, conversion optimization, and platform-specific best practices.',
    icon: <FaMobile />,
    color: 'from-green-600 to-green-800',
    features: [
      'iOS and Android design',
      'Mobile-first approach',
      'Touch interaction design',
      'Performance optimization',
      'App store optimization',
      'Cross-platform consistency'
    ],
    deliverables: [
      'Mobile design system',
      'Platform-specific designs',
      'Interactive prototypes',
      'Animation specifications',
      'Developer handoff assets'
    ],
    timeline: '8-12 weeks',
    teamSize: '3-5 experts',
    pricing: '$25,000 - $65,000',
    caseStudy: '/case-studies/fintech-mobile-banking-redesign'
  },
  {
    id: 'design-system-development',
    title: 'Design System Development',
    description: 'Scalable design systems and component libraries that ensure consistency, improve efficiency, and accelerate product development.',
    icon: <FaDesktop />,
    color: 'from-orange-600 to-orange-800',
    features: [
      'Component library creation',
      'Design token systems',
      'Documentation and guidelines',
      'Developer collaboration',
      'Scalability planning',
      'Maintenance strategies'
    ],
    deliverables: [
      'Component library',
      'Design system documentation',
      'Implementation guidelines',
      'Code integration',
      'Training materials'
    ],
    timeline: '6-14 weeks',
    teamSize: '3-4 experts',
    pricing: '$30,000 - $75,000',
    caseStudy: '/case-studies/healthcare-patient-portal'
  }
];

const process = [
  {
    step: 1,
    title: 'Discovery & Research',
    description: 'Understanding users, business goals, and technical constraints through research.',
    duration: '1-2 weeks'
  },
  {
    step: 2,
    title: 'Strategy & Planning',
    description: 'Developing UX strategy, information architecture, and design approach.',
    duration: '1 week'
  },
  {
    step: 3,
    title: 'Design & Prototyping',
    description: 'Creating wireframes, visual designs, and interactive prototypes.',
    duration: '4-8 weeks'
  },
  {
    step: 4,
    title: 'Testing & Iteration',
    description: 'User testing, feedback collection, and design refinement.',
    duration: '1-2 weeks'
  },
  {
    step: 5,
    title: 'Handoff & Support',
    description: 'Developer handoff, implementation support, and design system delivery.',
    duration: '1-2 weeks'
  }
];

export function UXUIServices() {
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
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
              <FaPaintBrush className="text-white text-lg" />
            </div>
            <span className="text-purple-400 font-medium">Services</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            UX/UI Design
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Services
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Comprehensive UX/UI design services that transform user experiences through 
            research-driven design, beautiful interfaces, and measurable business results.
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
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
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
                          <FaCheckCircle className="text-purple-400 text-xs flex-shrink-0" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-slate-800/30 rounded-lg">
                    <div className="text-center">
                      <FaClock className="text-purple-400 mx-auto mb-1" />
                      <div className="text-white text-xs font-medium">{service.timeline}</div>
                      <div className="text-gray-400 text-xs">Timeline</div>
                    </div>
                    <div className="text-center">
                      <FaUserFriends className="text-purple-400 mx-auto mb-1" />
                      <div className="text-white text-xs font-medium">{service.teamSize}</div>
                      <div className="text-gray-400 text-xs">Team Size</div>
                    </div>
                    <div className="text-center">
                      <FaDollarSign className="text-purple-400 mx-auto mb-1" />
                      <div className="text-white text-xs font-medium">{service.pricing}</div>
                      <div className="text-gray-400 text-xs">Investment</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/contact" className="flex-1">
                      <Button variant="gradient" size="sm" className="w-full">
                        Get Quote
                        <FaArrowRight className="ml-2" />
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
                  Our Design
                  <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Process
                  </span>
                </h3>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  A proven user-centered design methodology that ensures successful delivery 
                  of beautiful, functional, and user-friendly digital experiences.
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
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold">{step.step}</span>
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-2">{step.title}</h4>
                    <p className="text-gray-400 text-xs mb-2">{step.description}</p>
                    <span className="text-purple-400 text-xs font-medium">{step.duration}</span>
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
                Ready to Transform Your User Experience?
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Let&apos;s discuss how thoughtful UX/UI design can improve user satisfaction, 
                increase conversions, and drive business growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" variant="gradient">
                    Schedule Design Consultation
                    <FaArrowRight className="ml-2" />
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button size="lg" variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black">
                    View Design Portfolio
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
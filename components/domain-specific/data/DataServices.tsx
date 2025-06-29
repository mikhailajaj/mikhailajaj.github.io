'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/base/Button';
import { Card, CardContent } from '@/components/ui/base/Card';
import { 
  FaChartBar,
  FaBrain,
  FaDatabase,
  FaEye,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaUsers,
  FaDollarSign
} from 'react-icons/fa';

const services = [
  {
    id: 'predictive-analytics',
    title: 'Predictive Analytics & Forecasting',
    description: 'Build machine learning models to predict customer behavior, demand patterns, and business outcomes.',
    icon: <FaChartBar />,
    color: 'from-blue-600 to-blue-800',
    features: [
      'Customer churn prediction',
      'Demand forecasting',
      'Risk assessment models',
      'Revenue optimization',
      'Market trend analysis',
      'Real-time scoring systems'
    ],
    deliverables: [
      'Production-ready ML models',
      'Interactive dashboards',
      'Model documentation',
      'Performance monitoring',
      'Training materials'
    ],
    timeline: '6-12 weeks',
    teamSize: '2-4 experts',
    pricing: '$25,000 - $75,000',
    caseStudy: '/case-studies/customer-behavior-analytics'
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning Solutions',
    description: 'Custom ML algorithms and AI systems for classification, regression, clustering, and deep learning applications.',
    icon: <FaBrain />,
    color: 'from-purple-600 to-purple-800',
    features: [
      'Custom algorithm development',
      'Deep learning models',
      'Computer vision systems',
      'Natural language processing',
      'Recommendation engines',
      'Anomaly detection'
    ],
    deliverables: [
      'Trained ML models',
      'API endpoints',
      'Model validation reports',
      'Deployment scripts',
      'Maintenance guidelines'
    ],
    timeline: '8-16 weeks',
    teamSize: '3-5 experts',
    pricing: '$35,000 - $120,000',
    caseStudy: '/case-studies/financial-fraud-detection'
  },
  {
    id: 'business-intelligence',
    title: 'Business Intelligence & Reporting',
    description: 'Transform raw data into actionable insights with comprehensive BI solutions and executive dashboards.',
    icon: <FaEye />,
    color: 'from-green-600 to-green-800',
    features: [
      'Executive dashboards',
      'KPI monitoring systems',
      'Automated reporting',
      'Data storytelling',
      'Performance analytics',
      'Competitive analysis'
    ],
    deliverables: [
      'Interactive dashboards',
      'Automated reports',
      'Data pipeline setup',
      'User training',
      'Documentation'
    ],
    timeline: '4-8 weeks',
    teamSize: '2-3 experts',
    pricing: '$15,000 - $45,000',
    caseStudy: '/case-studies/supply-chain-optimization'
  },
  {
    id: 'data-engineering',
    title: 'Data Engineering & Infrastructure',
    description: 'Build scalable data pipelines, warehouses, and analytics infrastructure for enterprise-grade solutions.',
    icon: <FaDatabase />,
    color: 'from-orange-600 to-orange-800',
    features: [
      'Data pipeline development',
      'Data warehouse design',
      'ETL/ELT processes',
      'Real-time streaming',
      'Data quality monitoring',
      'Cloud data architecture'
    ],
    deliverables: [
      'Data pipeline infrastructure',
      'Data quality frameworks',
      'Monitoring systems',
      'Documentation',
      'Team training'
    ],
    timeline: '6-14 weeks',
    teamSize: '2-4 experts',
    pricing: '$30,000 - $85,000',
    caseStudy: '/case-studies/healthcare-patient-outcomes'
  }
];

const process = [
  {
    step: 1,
    title: 'Discovery & Assessment',
    description: 'Analyze your data landscape, business objectives, and technical requirements.',
    duration: '1-2 weeks'
  },
  {
    step: 2,
    title: 'Strategy & Planning',
    description: 'Develop comprehensive analytics strategy and implementation roadmap.',
    duration: '1 week'
  },
  {
    step: 3,
    title: 'Development & Implementation',
    description: 'Build and deploy analytics solutions with iterative feedback cycles.',
    duration: '4-12 weeks'
  },
  {
    step: 4,
    title: 'Testing & Optimization',
    description: 'Validate models, optimize performance, and ensure quality standards.',
    duration: '1-2 weeks'
  },
  {
    step: 5,
    title: 'Deployment & Training',
    description: 'Deploy to production and train your team on new analytics capabilities.',
    duration: '1-2 weeks'
  }
];

export function DataServices() {
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
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-800 rounded-lg flex items-center justify-center">
              <FaChartBar className="text-white text-lg" />
            </div>
            <span className="text-green-400 font-medium">Services</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Data Analytics
            <span className="block bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Services
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Comprehensive data science and analytics services to transform your business 
            through intelligent automation, predictive insights, and data-driven strategies.
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
                    <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">
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
                          <FaCheckCircle className="text-green-400 text-xs flex-shrink-0" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-slate-800/30 rounded-lg">
                    <div className="text-center">
                      <FaClock className="text-green-400 mx-auto mb-1" />
                      <div className="text-white text-xs font-medium">{service.timeline}</div>
                      <div className="text-gray-400 text-xs">Timeline</div>
                    </div>
                    <div className="text-center">
                      <FaUsers className="text-green-400 mx-auto mb-1" />
                      <div className="text-white text-xs font-medium">{service.teamSize}</div>
                      <div className="text-gray-400 text-xs">Team Size</div>
                    </div>
                    <div className="text-center">
                      <FaDollarSign className="text-green-400 mx-auto mb-1" />
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
                  Our Analytics
                  <span className="block bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    Process
                  </span>
                </h3>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  A proven methodology that ensures successful delivery of data analytics 
                  solutions tailored to your business needs.
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
                    <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold">{step.step}</span>
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-2">{step.title}</h4>
                    <p className="text-gray-400 text-xs mb-2">{step.description}</p>
                    <span className="text-green-400 text-xs font-medium">{step.duration}</span>
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
                Ready to Transform Your Data?
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Let&apos;s discuss how data analytics can drive your business forward. 
                Schedule a free consultation to explore opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" variant="gradient">
                    Schedule Consultation
                    <FaArrowRight className="ml-2" />
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button size="lg" variant="outline" className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black">
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
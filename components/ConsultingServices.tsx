'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaChartLine, 
  FaCog, 
  FaUsers, 
  FaLightbulb, 
  FaRocket,
  FaShieldAlt,
  FaCloud,
  FaDatabase,
  FaMobile,
  FaGlobe,
  FaSearch,
  FaCode,
  FaCheckCircle,
  FaArrowRight
} from 'react-icons/fa';

interface ConsultingService {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  features: string[];
  deliverables: string[];
  timeline: string;
  price: string;
}

const consultingServices: ConsultingService[] = [
  {
    id: 1,
    title: "Digital Strategy Consulting",
    description: "Comprehensive digital transformation roadmap tailored to your business goals",
    icon: FaChartLine,
    color: "from-blue-500 to-cyan-500",
    features: [
      "Current state assessment",
      "Technology stack evaluation",
      "Digital maturity analysis",
      "ROI projections",
      "Implementation roadmap"
    ],
    deliverables: [
      "Digital strategy document",
      "Technology recommendations",
      "Implementation timeline",
      "Budget planning",
      "Risk assessment"
    ],
    timeline: "2-4 weeks",
    price: "Starting at $5,000"
  },
  {
    id: 2,
    title: "Technical Architecture Review",
    description: "In-depth analysis of your technical infrastructure and recommendations for optimization",
    icon: FaCog,
    color: "from-purple-500 to-pink-500",
    features: [
      "Code quality assessment",
      "Performance analysis",
      "Security audit",
      "Scalability review",
      "Best practices evaluation"
    ],
    deliverables: [
      "Architecture assessment report",
      "Performance optimization plan",
      "Security recommendations",
      "Refactoring roadmap",
      "Documentation updates"
    ],
    timeline: "1-3 weeks",
    price: "Starting at $3,500"
  },
  {
    id: 3,
    title: "UX/UI Audit & Optimization",
    description: "Comprehensive user experience analysis with actionable improvement recommendations",
    icon: FaUsers,
    color: "from-green-500 to-teal-500",
    features: [
      "Heuristic evaluation",
      "User journey analysis",
      "Accessibility audit",
      "Conversion optimization",
      "Mobile responsiveness review"
    ],
    deliverables: [
      "UX audit report",
      "Wireframe improvements",
      "Design recommendations",
      "Accessibility compliance plan",
      "A/B testing strategy"
    ],
    timeline: "2-3 weeks",
    price: "Starting at $4,000"
  },
  {
    id: 4,
    title: "Cloud Migration Strategy",
    description: "Strategic planning and execution guidance for cloud infrastructure migration",
    icon: FaCloud,
    color: "from-orange-500 to-red-500",
    features: [
      "Cloud readiness assessment",
      "Migration strategy planning",
      "Cost optimization analysis",
      "Security considerations",
      "Performance benchmarking"
    ],
    deliverables: [
      "Migration roadmap",
      "Cost-benefit analysis",
      "Security framework",
      "Performance metrics",
      "Training materials"
    ],
    timeline: "3-6 weeks",
    price: "Starting at $7,500"
  },
  {
    id: 5,
    title: "Data Strategy & Analytics",
    description: "Transform your data into actionable insights with comprehensive analytics strategy",
    icon: FaDatabase,
    color: "from-indigo-500 to-purple-500",
    features: [
      "Data audit and mapping",
      "Analytics implementation",
      "KPI framework development",
      "Reporting automation",
      "Data governance planning"
    ],
    deliverables: [
      "Data strategy document",
      "Analytics dashboard",
      "KPI tracking system",
      "Automated reports",
      "Data governance policies"
    ],
    timeline: "4-8 weeks",
    price: "Starting at $6,000"
  },
  {
    id: 6,
    title: "Innovation Workshop",
    description: "Collaborative sessions to identify opportunities and develop innovative solutions",
    icon: FaLightbulb,
    color: "from-pink-500 to-rose-500",
    features: [
      "Design thinking workshops",
      "Ideation sessions",
      "Rapid prototyping",
      "Market validation",
      "Implementation planning"
    ],
    deliverables: [
      "Innovation report",
      "Prototype concepts",
      "Market analysis",
      "Implementation plan",
      "Next steps roadmap"
    ],
    timeline: "1-2 weeks",
    price: "Starting at $2,500"
  }
];

const ConsultingServices: React.FC = () => {
  const [activeService, setActiveService] = useState<number>(1);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section id="consulting" className="py-20 bg-gradient-to-br from-neutral-900 to-blue-900 text-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Strategic Consulting
          </h2>
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto leading-relaxed">
            Accelerate your digital transformation with expert guidance. From strategy to implementation, 
            I help businesses navigate complex technical challenges and unlock growth opportunities.
          </p>
        </motion.div>

        {/* Consulting Approach */}
        <div className="grid md:grid-cols-4 gap-8 mb-20">
          {[
            {
              icon: FaSearch,
              title: "Investigate",
              description: "Deep dive analysis of current state and challenges",
              step: "01"
            },
            {
              icon: FaLightbulb,
              title: "Strategize",
              description: "Develop tailored solutions and roadmaps",
              step: "02"
            },
            {
              icon: FaRocket,
              title: "Execute",
              description: "Guide implementation with hands-on support",
              step: "03"
            },
            {
              icon: FaChartLine,
              title: "Optimize",
              description: "Monitor, measure, and continuously improve",
              step: "04"
            }
          ].map((approach, index) => (
            <motion.div
              key={index}
              className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center text-black font-bold text-lg">
                {approach.step}
              </div>
              <approach.icon className="text-4xl text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold mb-3">{approach.title}</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">
                {approach.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {consultingServices.map((service, index) => (
            <motion.div
              key={service.id}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => setActiveService(service.id)}
              onHoverStart={() => setHoveredCard(service.id)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center mb-6`}>
                <service.icon className="text-2xl text-white" />
              </div>
              
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-neutral-300 text-sm mb-4 leading-relaxed">
                {service.description}
              </p>
              
              <div className="flex justify-between items-center">
                <span className="text-cyan-400 font-semibold">{service.price}</span>
                <span className="text-neutral-400 text-sm">{service.timeline}</span>
              </div>
              
              {activeService === service.id && (
                <motion.div
                  className="mt-4 pt-4 border-t border-white/20"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-2 px-4 rounded-lg font-medium hover:from-cyan-600 hover:to-purple-600 transition-all duration-300">
                    Learn More <FaArrowRight className="inline ml-2" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Detailed Service View */}
        <motion.div
          className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {consultingServices.map((service) => (
            activeService === service.id && (
              <div key={service.id} className="grid lg:grid-cols-2 gap-8">
                <div>
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center mb-6`}>
                    <service.icon className="text-3xl text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">{service.title}</h3>
                  <p className="text-lg text-neutral-300 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-xl p-4">
                      <h4 className="font-bold mb-3 text-cyan-400">Key Features</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <FaCheckCircle className="text-green-400 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl p-4">
                      <h4 className="font-bold mb-3 text-purple-400">Deliverables</h4>
                      <ul className="space-y-2">
                        {service.deliverables.map((deliverable, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <FaCheckCircle className="text-green-400 mr-2 flex-shrink-0" />
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl p-8 border border-cyan-500/30">
                    <h4 className="text-2xl font-bold mb-6 text-center">Project Details</h4>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-300">Timeline:</span>
                        <span className="font-semibold text-cyan-400">{service.timeline}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-300">Investment:</span>
                        <span className="font-semibold text-purple-400">{service.price}</span>
                      </div>
                    </div>
                    
                    <motion.button
                      className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-3 px-6 rounded-xl font-bold text-lg hover:from-cyan-600 hover:to-purple-600 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Start This Project
                    </motion.button>
                  </div>
                </div>
              </div>
            )
          ))}
        </motion.div>

        {/* Why Choose Me */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-4xl font-bold mb-12">Why Choose My Consulting Services?</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FaShieldAlt,
                title: "Proven Expertise",
                description: "Years of experience across industries and technologies"
              },
              {
                icon: FaUsers,
                title: "Collaborative Approach",
                description: "Work closely with your team to ensure knowledge transfer"
              },
              {
                icon: FaRocket,
                title: "Results-Driven",
                description: "Focus on measurable outcomes and business value"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-white/5 rounded-xl p-6 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <benefit.icon className="text-4xl text-cyan-400 mb-4 mx-auto" />
                <h4 className="text-xl font-bold mb-3">{benefit.title}</h4>
                <p className="text-neutral-300">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ConsultingServices;
'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  FaUsers, 
  FaSearch, 
  FaPalette, 
  FaCode, 
  FaChartLine, 
  FaLightbulb,
  FaEye,
  FaHeart,
  FaBrain,
  FaRocket
} from 'react-icons/fa';

interface UXProcess {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  details: string[];
}

const uxProcesses: UXProcess[] = [
  {
    id: 1,
    title: "User Research",
    description: "Deep dive into user needs, behaviors, and pain points",
    icon: FaSearch,
    color: "from-blue-500 to-cyan-500",
    details: [
      "User interviews and surveys",
      "Competitive analysis",
      "Persona development",
      "Journey mapping"
    ]
  },
  {
    id: 2,
    title: "Information Architecture",
    description: "Structure content and features for optimal user flow",
    icon: FaBrain,
    color: "from-purple-500 to-pink-500",
    details: [
      "Site mapping",
      "Content strategy",
      "Navigation design",
      "Information hierarchy"
    ]
  },
  {
    id: 3,
    title: "Visual Design",
    description: "Create beautiful, accessible, and brand-aligned interfaces",
    icon: FaPalette,
    color: "from-green-500 to-teal-500",
    details: [
      "UI component design",
      "Design systems",
      "Accessibility compliance",
      "Brand integration"
    ]
  },
  {
    id: 4,
    title: "Prototyping",
    description: "Build interactive prototypes to validate concepts",
    icon: FaRocket,
    color: "from-orange-500 to-red-500",
    details: [
      "Low-fi wireframes",
      "High-fi prototypes",
      "Interactive demos",
      "Micro-interactions"
    ]
  },
  {
    id: 5,
    title: "User Testing",
    description: "Validate designs with real users and iterate",
    icon: FaUsers,
    color: "from-indigo-500 to-purple-500",
    details: [
      "Usability testing",
      "A/B testing",
      "Analytics review",
      "Feedback integration"
    ]
  },
  {
    id: 6,
    title: "Implementation",
    description: "Collaborate with developers for pixel-perfect execution",
    icon: FaCode,
    color: "from-pink-500 to-rose-500",
    details: [
      "Design handoff",
      "Developer collaboration",
      "Quality assurance",
      "Performance optimization"
    ]
  }
];

const UXDesignShowcase: React.FC = () => {
  const [activeProcess, setActiveProcess] = useState<number>(1);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section id="ux-design" className="py-20 bg-gradient-to-br from-neutral-50 to-blue-50 dark:from-neutral-950 dark:to-blue-950">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            UX Design Excellence
          </h2>
          <p className="text-xl text-neutral-700 dark:text-neutral-200 max-w-3xl mx-auto leading-relaxed">
            Creating user-centered digital experiences through research, design, and strategic thinking. 
            Every pixel serves a purpose, every interaction tells a story.
          </p>
        </motion.div>

        {/* UX Philosophy Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: FaEye,
              title: "User-Centered",
              description: "Every decision starts with understanding user needs and behaviors",
              color: "from-blue-500 to-cyan-500"
            },
            {
              icon: FaHeart,
              title: "Empathy-Driven",
              description: "Design with compassion and understanding for diverse user experiences",
              color: "from-purple-500 to-pink-500"
            },
            {
              icon: FaChartLine,
              title: "Data-Informed",
              description: "Combine qualitative insights with quantitative metrics for optimal results",
              color: "from-green-500 to-teal-500"
            }
          ].map((philosophy, index) => (
            <motion.div
              key={index}
              className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl p-8 border border-neutral-200/50 dark:border-neutral-700/50 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${philosophy.color} flex items-center justify-center mb-6 mx-auto`}>
                <philosophy.icon className="text-2xl text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center text-neutral-900 dark:text-white">
                {philosophy.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300 text-center leading-relaxed">
                {philosophy.description}
              </p>
              
              {/* Animated border */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-transparent"
                style={{
                  background: `linear-gradient(45deg, transparent, ${hoveredCard === index ? 'rgba(59, 130, 246, 0.3)' : 'transparent'}, transparent)`,
                }}
                animate={{
                  opacity: hoveredCard === index ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>

        {/* UX Process Timeline */}
        <div className="mb-20">
          <motion.h3
            className="text-4xl font-bold text-center mb-12 text-neutral-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            My UX Design Process
          </motion.h3>

          {/* Process Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {uxProcesses.map((process) => (
              <motion.button
                key={process.id}
                onClick={() => setActiveProcess(process.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeProcess === process.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white/80 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <process.icon className="inline mr-2" />
                {process.title}
              </motion.button>
            ))}
          </div>

          {/* Active Process Details */}
          <motion.div
            key={activeProcess}
            className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-3xl p-8 border border-neutral-200/50 dark:border-neutral-700/50 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {uxProcesses.map((process) => (
              activeProcess === process.id && (
                <div key={process.id} className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${process.color} flex items-center justify-center mb-6`}>
                      <process.icon className="text-3xl text-white" />
                    </div>
                    <h4 className="text-3xl font-bold mb-4 text-neutral-900 dark:text-white">
                      {process.title}
                    </h4>
                    <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">
                      {process.description}
                    </p>
                    <ul className="space-y-3">
                      {process.details.map((detail, index) => (
                        <motion.li
                          key={index}
                          className="flex items-center text-neutral-700 dark:text-neutral-200"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <FaLightbulb className="text-yellow-500 mr-3 flex-shrink-0" />
                          {detail}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Process Visualization */}
                  <div className="relative">
                    <motion.div
                      className={`w-full h-64 rounded-2xl bg-gradient-to-br ${process.color} opacity-20`}
                      animate={{
                        scale: [1, 1.05, 1],
                        rotate: [0, 2, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className={`w-32 h-32 rounded-full bg-gradient-to-r ${process.color} flex items-center justify-center shadow-2xl`}
                        animate={{
                          y: [0, -10, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <process.icon className="text-4xl text-white" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </motion.div>
        </div>

        {/* UX Tools & Skills */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-4xl font-bold mb-8 text-neutral-900 dark:text-white">
            Tools & Expertise
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: "Figma", category: "Design" },
              { name: "Adobe XD", category: "Design" },
              { name: "Sketch", category: "Design" },
              { name: "Principle", category: "Prototyping" },
              { name: "Framer", category: "Prototyping" },
              { name: "Miro", category: "Collaboration" },
              { name: "Hotjar", category: "Analytics" },
              { name: "Maze", category: "Testing" },
              { name: "Optimal Workshop", category: "Research" },
              { name: "Notion", category: "Documentation" },
              { name: "Zeplin", category: "Handoff" },
              { name: "Abstract", category: "Version Control" }
            ].map((tool, index) => (
              <motion.div
                key={index}
                className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-xl p-4 border border-neutral-200/50 dark:border-neutral-700/50 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <div className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                  {tool.name}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  {tool.category}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Transform Your User Experience?
            </h3>
            <p className="text-xl mb-6 opacity-90">
              Let&apos;s collaborate to create digital experiences that users love and businesses value.
            </p>
            <motion.button
              className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-neutral-100 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your UX Project
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default UXDesignShowcase;
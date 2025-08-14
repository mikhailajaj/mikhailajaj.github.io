"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/base/Card";
import { getUXUITechnologies } from "@/data/projects/ux-ui-design";
import {
  FaPaintBrush,
  FaMobile,
  FaUsers,
  FaCode,
  FaAward,
  FaCertificate,
  FaGraduationCap,
} from "react-icons/fa";

const technologies = getUXUITechnologies();

const skillCategories = [
  {
    name: "Design Tools",
    icon: <FaPaintBrush />,
    color: "from-purple-600 to-purple-800",
    skills: technologies.filter((tech) => tech.category === "design"),
  },
  {
    name: "Prototyping",
    icon: <FaMobile />,
    color: "from-pink-600 to-pink-800",
    skills: technologies.filter((tech) => tech.category === "prototyping"),
  },
  {
    name: "User Research",
    icon: <FaUsers />,
    color: "from-blue-600 to-blue-800",
    skills: technologies.filter((tech) => tech.category === "research"),
  },
  {
    name: "Development Handoff",
    icon: <FaCode />,
    color: "from-green-600 to-green-800",
    skills: technologies.filter((tech) => tech.category === "handoff"),
  },
];

const designMethodologies = [
  {
    name: "Design Thinking",
    description: "Human-centered approach to innovation and problem-solving",
    proficiency: "expert",
  },
  {
    name: "User-Centered Design",
    description: "Design process focused on user needs and behaviors",
    proficiency: "expert",
  },
  {
    name: "Agile UX",
    description: "UX design integrated with agile development methodologies",
    proficiency: "advanced",
  },
  {
    name: "Lean UX",
    description: "Rapid experimentation and iterative design approach",
    proficiency: "advanced",
  },
  {
    name: "Service Design",
    description:
      "Holistic approach to designing end-to-end service experiences",
    proficiency: "intermediate",
  },
];

const certifications = [
  {
    name: "Google UX Design Professional Certificate",
    issuer: "Google",
    year: "2023",
    level: "Professional",
  },
  {
    name: "Nielsen Norman Group UX Certification",
    issuer: "NN/g",
    year: "2023",
    level: "Professional",
  },
  {
    name: "Adobe Certified Expert - XD",
    issuer: "Adobe",
    year: "2022",
    level: "Expert",
  },
];

const achievements = [
  {
    title: "UX Design Excellence Award",
    description: "Best Mobile Banking Experience 2024",
    year: "2024",
  },
  {
    title: "Accessibility Champion",
    description: "Leading inclusive design practices",
    year: "2023",
  },
  {
    title: "Design System Pioneer",
    description: "Healthcare design system implementation",
    year: "2023",
  },
];

const getProficiencyColor = (proficiency: string) => {
  switch (proficiency) {
    case "expert":
      return "bg-purple-500";
    case "advanced":
      return "bg-blue-500";
    case "intermediate":
      return "bg-pink-500";
    default:
      return "bg-gray-500";
  }
};

const getProficiencyWidth = (proficiency: string) => {
  switch (proficiency) {
    case "expert":
      return "w-full";
    case "advanced":
      return "w-4/5";
    case "intermediate":
      return "w-3/5";
    default:
      return "w-2/5";
  }
};

export function UXUISkills() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
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
            <span className="text-purple-400 font-medium">Expertise</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Design
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Skills
            </span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Comprehensive UX/UI design expertise spanning user research, visual
            design, prototyping, and modern design tools and methodologies.
          </p>
        </motion.div>

        {/* Skills Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <Card variant="glass" className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center`}
                    >
                      <span className="text-white text-xl">
                        {category.icon}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      {category.name}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: categoryIndex * 0.1 + skillIndex * 0.05,
                        }}
                        viewport={{ once: true }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{skill.icon}</span>
                            <span className="text-white font-medium">
                              {skill.name}
                            </span>
                          </div>
                          <span className="text-sm text-gray-400 capitalize">
                            {skill.proficiency}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getProficiencyColor(skill.proficiency)} ${getProficiencyWidth(skill.proficiency)} transition-all duration-1000 ease-out`}
                          ></div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Design Methodologies */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card variant="glass">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-lg flex items-center justify-center">
                  <FaGraduationCap className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Design Methodologies
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {designMethodologies.map((methodology, index) => (
                  <motion.div
                    key={methodology.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    viewport={{ once: true }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">
                        {methodology.name}
                      </span>
                      <span className="text-sm text-gray-400 capitalize">
                        {methodology.proficiency}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {methodology.description}
                    </p>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProficiencyColor(methodology.proficiency)} ${getProficiencyWidth(methodology.proficiency)} transition-all duration-1000 ease-out`}
                      ></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Certifications & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card variant="glass">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                    <FaCertificate className="text-white text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Certifications
                  </h3>
                </div>

                <div className="space-y-4">
                  {certifications.map((cert, index) => (
                    <motion.div
                      key={cert.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      viewport={{ once: true }}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-700/30 transition-colors"
                    >
                      <FaCertificate className="text-purple-400 mt-1" />
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">
                          {cert.name}
                        </h4>
                        <p className="text-gray-400 text-xs">{cert.issuer}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-purple-400 text-xs font-medium">
                            {cert.level}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {cert.year}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Card variant="glass">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-yellow-800 rounded-lg flex items-center justify-center">
                    <FaAward className="text-white text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Achievements</h3>
                </div>

                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      viewport={{ once: true }}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-700/30 transition-colors"
                    >
                      <FaAward className="text-yellow-400 mt-1" />
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">
                          {achievement.title}
                        </h4>
                        <p className="text-gray-400 text-xs">
                          {achievement.description}
                        </p>
                        <span className="text-purple-400 text-xs font-medium">
                          {achievement.year}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/base/Card";
import { getDataAnalyticsTechnologies } from "@/data/projects/data-analytics";
import {
  FaPython,
  FaBrain,
  FaChartBar,
  FaDatabase,
  FaAward,
  FaCertificate,
} from "react-icons/fa";

const technologies = getDataAnalyticsTechnologies();

const skillCategories = [
  {
    name: "Programming & Analysis",
    icon: <FaPython />,
    color: "from-blue-600 to-blue-800",
    skills: technologies.filter((tech) => tech.category === "programming"),
  },
  {
    name: "Machine Learning",
    icon: <FaBrain />,
    color: "from-purple-600 to-purple-800",
    skills: technologies.filter((tech) => tech.category === "ml"),
  },
  {
    name: "Data Visualization",
    icon: <FaChartBar />,
    color: "from-green-600 to-green-800",
    skills: technologies.filter((tech) => tech.category === "visualization"),
  },
  {
    name: "Big Data & Cloud",
    icon: <FaDatabase />,
    color: "from-orange-600 to-orange-800",
    skills: technologies.filter(
      (tech) => tech.category === "bigdata" || tech.category === "cloud",
    ),
  },
];

const certifications = [
  {
    name: "AWS Certified Machine Learning - Specialty",
    issuer: "Amazon Web Services",
    year: "2024",
    level: "Specialty",
  },
  {
    name: "Google Cloud Professional Data Engineer",
    issuer: "Google Cloud",
    year: "2023",
    level: "Professional",
  },
  {
    name: "Microsoft Azure Data Scientist Associate",
    issuer: "Microsoft",
    year: "2023",
    level: "Associate",
  },
];

const achievements = [
  {
    title: "Kaggle Competition Winner",
    description: "Top 1% in Customer Churn Prediction Challenge",
    year: "2024",
  },
  {
    title: "Data Science Publication",
    description: "Published research on ML model interpretability",
    year: "2023",
  },
  {
    title: "Industry Speaker",
    description: "Keynote at Data Science Conference 2023",
    year: "2023",
  },
];

const getProficiencyColor = (proficiency: string) => {
  switch (proficiency) {
    case "expert":
      return "bg-green-500";
    case "advanced":
      return "bg-blue-500";
    case "intermediate":
      return "bg-yellow-500";
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

export function DataSkills() {
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
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-800 rounded-lg flex items-center justify-center">
              <FaBrain className="text-white text-lg" />
            </div>
            <span className="text-green-400 font-medium">Expertise</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Technical
            <span className="block bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Skills
            </span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Comprehensive data science and analytics expertise spanning machine
            learning, statistical analysis, and modern data engineering
            technologies.
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
                      <FaCertificate className="text-green-400 mt-1" />
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">
                          {cert.name}
                        </h4>
                        <p className="text-gray-400 text-xs">{cert.issuer}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-green-400 text-xs font-medium">
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
                        <span className="text-green-400 text-xs font-medium">
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

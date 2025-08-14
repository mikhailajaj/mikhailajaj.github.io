"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/base/Button";
import { Card, CardContent } from "@/components/ui/base/Card";
import {
  dataAnalyticsProjects,
  getFeaturedDataAnalyticsProjects,
} from "@/data/projects/data-analytics";
import {
  FaExternalLinkAlt,
  FaGithub,
  FaArrowRight,
  FaChartBar,
  FaUsers,
  FaClock,
  FaStar,
  FaBrain,
  FaDatabase,
  FaEye,
} from "react-icons/fa";

type FilterType = "all" | "featured" | "ml" | "bi" | "predictive";

const filterOptions = [
  { value: "all", label: "All Projects", count: dataAnalyticsProjects.length },
  {
    value: "featured",
    label: "Featured",
    count: getFeaturedDataAnalyticsProjects().length,
  },
  {
    value: "ml",
    label: "Machine Learning",
    count: dataAnalyticsProjects.filter((p) =>
      p.tags.includes("Machine Learning"),
    ).length,
  },
  {
    value: "bi",
    label: "Business Intelligence",
    count: dataAnalyticsProjects.filter((p) =>
      p.tags.includes("Business Intelligence"),
    ).length,
  },
  {
    value: "predictive",
    label: "Predictive Analytics",
    count: dataAnalyticsProjects.filter((p) =>
      p.tags.includes("Predictive Analytics"),
    ).length,
  },
];

export function DataProjects() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filteredProjects = dataAnalyticsProjects.filter((project) => {
    switch (activeFilter) {
      case "featured":
        return project.featured;
      case "ml":
        return project.tags.includes("Machine Learning");
      case "bi":
        return project.tags.includes("Business Intelligence");
      case "predictive":
        return project.tags.includes("Predictive Analytics");
      default:
        return true;
    }
  });

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
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
            <span className="text-green-400 font-medium">Portfolio</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Data Analytics
            <span className="block bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Real-world data science projects that deliver measurable business
            impact through machine learning, predictive analytics, and
            intelligent automation.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setActiveFilter(option.value as FilterType)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeFilter === option.value
                  ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg"
                  : "bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              {option.label} ({option.count})
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                variant="glass"
                className="h-full group hover:shadow-2xl transition-all duration-300"
              >
                <CardContent className="p-6">
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {project.featured && (
                          <FaStar className="text-yellow-400 text-sm" />
                        )}
                        <span className="text-green-400 text-sm font-medium">
                          {project.domain.replace("-", " ").toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                        {project.title}
                      </h3>
                    </div>
                  </div>

                  {/* Project Description */}
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Impact Metrics */}
                  <div className="mb-4">
                    <h4 className="text-white font-semibold text-sm mb-2">
                      Key Impact:
                    </h4>
                    <div className="grid grid-cols-1 gap-1">
                      {project.impact.metrics.slice(0, 2).map((metric, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                          <span className="text-gray-300 text-sm">
                            {metric}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-slate-800/50 text-green-400 text-xs rounded-md border border-green-400/20"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-2 py-1 bg-slate-800/50 text-gray-400 text-xs rounded-md">
                          +{project.technologies.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Project Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <FaClock className="text-xs" />
                        <span>{project.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaUsers className="text-xs" />
                        <span>{project.teamSize} team</span>
                      </div>
                    </div>
                    <span className="text-green-400 font-medium">
                      {project.role}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {project.caseStudyUrl && (
                      <Link href={project.caseStudyUrl} className="flex-1">
                        <Button variant="gradient" size="sm" className="w-full">
                          <FaEye className="mr-2" />
                          Case Study
                        </Button>
                      </Link>
                    )}

                    <div className="flex gap-2">
                      {project.liveUrl && (
                        <Link href={project.liveUrl} target="_blank">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                          >
                            <FaExternalLinkAlt className="mr-1" />
                            Demo
                          </Button>
                        </Link>
                      )}
                      {project.githubUrl && (
                        <Link href={project.githubUrl} target="_blank">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                          >
                            <FaGithub className="mr-1" />
                            Code
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Business Value */}
                  {project.impact.businessValue && (
                    <div className="mt-4 p-3 bg-green-900/20 border border-green-400/20 rounded-lg">
                      <p className="text-green-300 text-sm">
                        <strong>Business Impact:</strong>{" "}
                        {project.impact.businessValue}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Projects CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/projects">
            <Button
              size="lg"
              variant="outline"
              className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
            >
              View All Analytics Projects
              <FaArrowRight className="ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

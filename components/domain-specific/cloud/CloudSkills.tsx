"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/base/Card";
import { getCloudTechnologies } from "@/data/projects/cloud";
import {
  FaAws,
  FaDocker,
  FaServer,
  FaCloud,
  FaShieldAlt,
  FaCogs,
  FaChartLine,
  FaTools,
} from "react-icons/fa";

const skillCategories = [
  {
    title: "AWS Cloud Services",
    icon: <FaAws />,
    color: "from-orange-500 to-yellow-500",
    skills: [
      {
        name: "AWS Lambda",
        level: 95,
        description: "Serverless functions, event-driven architecture",
      },
      {
        name: "Amazon EC2",
        level: 90,
        description: "Virtual servers, auto-scaling, load balancing",
      },
      {
        name: "Amazon S3",
        level: 95,
        description: "Object storage, CDN, static website hosting",
      },
      {
        name: "Amazon RDS",
        level: 85,
        description: "Managed databases, backup, monitoring",
      },
    ],
  },
  {
    title: "Container Orchestration",
    icon: <FaDocker />,
    color: "from-blue-500 to-cyan-500",
    skills: [
      {
        name: "Docker",
        level: 95,
        description: "Containerization, multi-stage builds, optimization",
      },
      {
        name: "Kubernetes",
        level: 85,
        description: "Container orchestration, service mesh, monitoring",
      },
      {
        name: "Amazon ECS",
        level: 80,
        description: "Container service, task definitions, scaling",
      },
      {
        name: "Docker Compose",
        level: 90,
        description: "Multi-container applications, development",
      },
    ],
  },
  {
    title: "Infrastructure as Code",
    icon: <FaCogs />,
    color: "from-purple-500 to-pink-500",
    skills: [
      {
        name: "Terraform",
        level: 90,
        description: "Infrastructure provisioning, state management",
      },
      {
        name: "AWS CloudFormation",
        level: 80,
        description: "AWS native IaC, stack management",
      },
      {
        name: "Ansible",
        level: 75,
        description: "Configuration management, automation",
      },
      {
        name: "Pulumi",
        level: 70,
        description: "Modern IaC with programming languages",
      },
    ],
  },
  {
    title: "DevOps & Monitoring",
    icon: <FaChartLine />,
    color: "from-green-500 to-emerald-500",
    skills: [
      {
        name: "CI/CD Pipelines",
        level: 90,
        description: "GitHub Actions, Jenkins, automated deployment",
      },
      {
        name: "CloudWatch",
        level: 85,
        description: "AWS monitoring, logging, alerting",
      },
      {
        name: "Prometheus",
        level: 75,
        description: "Metrics collection, time-series database",
      },
      {
        name: "Grafana",
        level: 75,
        description: "Data visualization, dashboards, alerting",
      },
    ],
  },
];

const awsCertifications = [
  {
    name: "AWS Certified Solutions Architect",
    level: "Professional",
    year: "2024",
    status: "Active",
    description: "Advanced architectural principles and best practices",
  },
  {
    name: "AWS Certified DevOps Engineer",
    level: "Professional",
    year: "2023",
    status: "Active",
    description: "Continuous delivery and automation on AWS",
  },
  {
    name: "AWS Certified Security Specialist",
    level: "Specialty",
    year: "2023",
    status: "Active",
    description: "Security controls and compliance in AWS",
  },
];

const cloudMethodologies = [
  {
    name: "Well-Architected Framework",
    description: "AWS best practices for reliability, security, efficiency",
  },
  {
    name: "Infrastructure as Code",
    description: "Version-controlled, repeatable infrastructure deployment",
  },
  {
    name: "GitOps",
    description:
      "Git-based workflow for infrastructure and application deployment",
  },
  {
    name: "Site Reliability Engineering",
    description: "Monitoring, alerting, and incident response practices",
  },
];

export function CloudSkills() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Cloud Engineering Expertise
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Comprehensive cloud skills spanning AWS services, container
            orchestration, Infrastructure as Code, and DevOps practices for
            scalable, secure solutions.
          </p>
        </motion.div>

        {/* Skills Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * categoryIndex }}
            >
              <Card
                variant="glass"
                className="h-full p-6 bg-blue-900/10 border-blue-800/30"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}
                  >
                    <span className="text-white text-xl">{category.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {category.title}
                  </h3>
                </div>

                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * skillIndex }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">
                          {skill.name}
                        </span>
                        <span className="text-blue-400 text-sm">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                        <motion.div
                          className={`h-2 rounded-full bg-gradient-to-r ${category.color}`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: 0.2 * skillIndex }}
                        />
                      </div>
                      <p className="text-gray-400 text-sm">
                        {skill.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* AWS Certifications & Methodologies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AWS Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card
              variant="glass"
              className="p-6 bg-orange-900/10 border-orange-800/30"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center">
                  <FaShieldAlt className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  AWS Certifications
                </h3>
              </div>

              <div className="space-y-4">
                {awsCertifications.map((cert, index) => (
                  <motion.div
                    key={cert.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="p-4 bg-orange-900/20 rounded-lg border border-orange-800/30"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-white font-medium">{cert.name}</p>
                        <p className="text-orange-400 text-sm">
                          {cert.level} - {cert.year}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          cert.status === "Active"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {cert.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{cert.description}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Cloud Methodologies */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card
              variant="glass"
              className="p-6 bg-blue-900/10 border-blue-800/30"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <FaTools className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Cloud Methodologies
                </h3>
              </div>

              <div className="space-y-4">
                {cloudMethodologies.map((method, index) => (
                  <motion.div
                    key={method.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="p-3 bg-blue-900/20 rounded-lg border border-blue-800/30"
                  >
                    <p className="text-white font-medium mb-1">{method.name}</p>
                    <p className="text-gray-400 text-sm">
                      {method.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Skills Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <Card
            variant="glass"
            className="p-8 text-center bg-blue-900/10 border-blue-800/30"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Cloud Engineering Excellence
            </h3>
            <p className="text-gray-300 text-lg mb-6 max-w-4xl mx-auto">
              With 5+ years of cloud experience and multiple AWS certifications,
              I design and implement scalable, secure, and cost-effective cloud
              solutions that drive business transformation.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">12+</div>
                <div className="text-gray-400 text-sm">Cloud Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-1">3</div>
                <div className="text-gray-400 text-sm">AWS Certifications</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">
                  $2M+
                </div>
                <div className="text-gray-400 text-sm">Cost Savings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-1">
                  99.99%
                </div>
                <div className="text-gray-400 text-sm">Uptime Achieved</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

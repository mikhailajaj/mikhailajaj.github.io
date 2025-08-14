"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaShieldAlt,
  FaChartBar,
  FaCode,
  FaBug,
  FaDatabase,
  FaNetworkWired,
  FaEye,
  FaLock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaFileAlt,
  FaMicroscope,
  FaUserSecret,
} from "react-icons/fa";

interface InvestigationService {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  capabilities: string[];
  tools: string[];
  timeline: string;
  urgency: "Standard" | "Priority" | "Emergency";
}

const investigationServices: InvestigationService[] = [
  {
    id: 1,
    title: "Security Vulnerability Assessment",
    description:
      "Comprehensive security analysis to identify and remediate potential threats",
    icon: FaShieldAlt,
    color: "from-red-500 to-orange-500",
    capabilities: [
      "Penetration testing",
      "Code security review",
      "Infrastructure scanning",
      "Social engineering assessment",
      "Compliance auditing",
    ],
    tools: ["OWASP ZAP", "Burp Suite", "Nmap", "Metasploit", "Wireshark"],
    timeline: "1-3 weeks",
    urgency: "Priority",
  },
  {
    id: 2,
    title: "Performance Investigation",
    description:
      "Deep dive analysis to identify bottlenecks and optimization opportunities",
    icon: FaChartBar,
    color: "from-blue-500 to-cyan-500",
    capabilities: [
      "Application profiling",
      "Database optimization",
      "Network analysis",
      "Memory leak detection",
      "Load testing",
    ],
    tools: [
      "New Relic",
      "DataDog",
      "Chrome DevTools",
      "JProfiler",
      "Apache JMeter",
    ],
    timeline: "1-2 weeks",
    urgency: "Standard",
  },
  {
    id: 3,
    title: "Code Quality Audit",
    description:
      "Thorough examination of codebase for quality, maintainability, and best practices",
    icon: FaCode,
    color: "from-green-500 to-teal-500",
    capabilities: [
      "Static code analysis",
      "Architecture review",
      "Technical debt assessment",
      "Code smell detection",
      "Documentation review",
    ],
    tools: ["SonarQube", "ESLint", "CodeClimate", "Checkmarx", "Veracode"],
    timeline: "1-2 weeks",
    urgency: "Standard",
  },
  {
    id: 4,
    title: "Bug Investigation & Root Cause Analysis",
    description:
      "Systematic investigation to identify, reproduce, and resolve complex issues",
    icon: FaBug,
    color: "from-purple-500 to-pink-500",
    capabilities: [
      "Issue reproduction",
      "Log analysis",
      "Debugging sessions",
      "Environment comparison",
      "Fix validation",
    ],
    tools: ["Sentry", "LogRocket", "Bugsnag", "Rollbar", "Splunk"],
    timeline: "3-7 days",
    urgency: "Emergency",
  },
  {
    id: 5,
    title: "Data Integrity Investigation",
    description:
      "Comprehensive analysis of data quality, consistency, and integrity issues",
    icon: FaDatabase,
    color: "from-indigo-500 to-purple-500",
    capabilities: [
      "Data validation",
      "Consistency checks",
      "Migration verification",
      "Backup integrity",
      "Corruption detection",
    ],
    tools: [
      "SQL Profiler",
      "MongoDB Compass",
      "Tableau",
      "Apache Spark",
      "Pandas",
    ],
    timeline: "1-3 weeks",
    urgency: "Priority",
  },
  {
    id: 6,
    title: "Digital Forensics",
    description:
      "Professional investigation of digital incidents and evidence collection",
    icon: FaUserSecret,
    color: "from-gray-600 to-gray-800",
    capabilities: [
      "Incident response",
      "Evidence preservation",
      "Timeline reconstruction",
      "Malware analysis",
      "Legal compliance",
    ],
    tools: ["Autopsy", "Volatility", "Wireshark", "YARA", "Sleuth Kit"],
    timeline: "1-4 weeks",
    urgency: "Emergency",
  },
];

const InvestigationServices: React.FC = () => {
  const [activeService, setActiveService] = useState<number>(1);
  const [selectedUrgency, setSelectedUrgency] = useState<string>("All");

  const filteredServices =
    selectedUrgency === "All"
      ? investigationServices
      : investigationServices.filter(
          (service) => service.urgency === selectedUrgency,
        );

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Emergency":
        return "text-red-400 bg-red-500/20";
      case "Priority":
        return "text-yellow-400 bg-yellow-500/20";
      case "Standard":
        return "text-green-400 bg-green-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  return (
    <section
      id="investigation"
      className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 bg-clip-text text-transparent">
            Investigation & Research
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Professional digital investigation services to uncover issues,
            analyze problems, and provide actionable insights. From security
            breaches to performance bottlenecks, I help you get to the bottom of
            complex technical challenges.
          </p>
        </motion.div>

        {/* Investigation Process */}
        <div className="grid md:grid-cols-5 gap-6 mb-20">
          {[
            {
              icon: FaEye,
              title: "Observe",
              description: "Initial assessment and data gathering",
              step: "01",
            },
            {
              icon: FaMicroscope,
              title: "Analyze",
              description: "Deep dive investigation using specialized tools",
              step: "02",
            },
            {
              icon: FaSearch,
              title: "Investigate",
              description: "Systematic exploration of potential causes",
              step: "03",
            },
            {
              icon: FaFileAlt,
              title: "Document",
              description: "Comprehensive reporting of findings",
              step: "04",
            },
            {
              icon: FaCheckCircle,
              title: "Resolve",
              description: "Actionable recommendations and solutions",
              step: "05",
            },
          ].map((process, index) => (
            <motion.div
              key={index}
              className="relative bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -3 }}
            >
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-red-400 to-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm">
                {process.step}
              </div>
              <process.icon className="text-3xl text-yellow-400 mb-3" />
              <h3 className="text-lg font-bold mb-2">{process.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {process.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Urgency Filter */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-white/10 rounded-full p-1 backdrop-blur-sm">
            {["All", "Emergency", "Priority", "Standard"].map((urgency) => (
              <button
                key={urgency}
                onClick={() => setSelectedUrgency(urgency)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedUrgency === urgency
                    ? "bg-white text-gray-900"
                    : "text-white hover:bg-white/20"
                }`}
              >
                {urgency}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => setActiveService(service.id)}
              layout
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`w-14 h-14 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center`}
                >
                  <service.icon className="text-xl text-white" />
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(service.urgency)}`}
                >
                  {service.urgency}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                {service.description}
              </p>

              <div className="flex items-center text-sm text-gray-400">
                <FaClock className="mr-2" />
                {service.timeline}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detailed Service View */}
        <motion.div
          className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {investigationServices.map(
            (service) =>
              activeService === service.id && (
                <div key={service.id} className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="flex items-center mb-6">
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center mr-4`}
                      >
                        <service.icon className="text-2xl text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{service.title}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(service.urgency)}`}
                        >
                          {service.urgency} Response
                        </span>
                      </div>
                    </div>

                    <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/5 rounded-xl p-4">
                        <h4 className="font-bold mb-3 text-yellow-400 flex items-center">
                          <FaCheckCircle className="mr-2" />
                          Capabilities
                        </h4>
                        <ul className="space-y-2">
                          {service.capabilities.map((capability, index) => (
                            <li
                              key={index}
                              className="flex items-center text-sm"
                            >
                              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3 flex-shrink-0" />
                              {capability}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4">
                        <h4 className="font-bold mb-3 text-green-400 flex items-center">
                          <FaCode className="mr-2" />
                          Tools & Technologies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {service.tools.map((tool, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/20">
                    <h4 className="text-xl font-bold mb-6 text-center">
                      Investigation Package
                    </h4>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Response Time:</span>
                        <span className="font-semibold text-yellow-400">
                          {service.timeline}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Urgency Level:</span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getUrgencyColor(service.urgency)}`}
                        >
                          {service.urgency}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm">
                        <FaCheckCircle className="text-green-400 mr-2" />
                        Detailed investigation report
                      </div>
                      <div className="flex items-center text-sm">
                        <FaCheckCircle className="text-green-400 mr-2" />
                        Actionable recommendations
                      </div>
                      <div className="flex items-center text-sm">
                        <FaCheckCircle className="text-green-400 mr-2" />
                        Follow-up consultation
                      </div>
                      <div className="flex items-center text-sm">
                        <FaCheckCircle className="text-green-400 mr-2" />
                        Documentation & evidence
                      </div>
                    </div>

                    <motion.button
                      className={`w-full bg-gradient-to-r ${service.color} text-white py-3 px-6 rounded-xl font-bold hover:opacity-90 transition-all duration-300`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Start Investigation
                    </motion.button>
                  </div>
                </div>
              ),
          )}
        </motion.div>

        {/* Emergency Contact */}
        <motion.div
          className="mt-20 bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <FaExclamationTriangle className="text-4xl mb-4 mx-auto" />
          <h3 className="text-3xl font-bold mb-4">
            Emergency Investigation Services
          </h3>
          <p className="text-xl mb-6 opacity-90">
            Critical security incident or system failure? Get immediate expert
            assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="bg-white text-red-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Emergency Hotline: +1 (416) 474-5749
            </motion.button>
            <motion.button
              className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-red-600 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              24/7 Email Support
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InvestigationServices;

"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  FaAws,
  FaMicrosoft,
  FaGoogle,
  FaCertificate,
  FaTrophy,
  FaMedal,
  FaStar,
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaShieldAlt,
} from "react-icons/fa";
import { SiKubernetes, SiDocker, SiTerraform } from "react-icons/si";

interface Certification {
  id: string;
  name: string;
  issuer: string;
  icon: React.ComponentType<any>;
  date: string;
  expiryDate?: string;
  credentialId: string;
  verificationUrl?: string;
  level: "foundational" | "associate" | "professional" | "expert";
  category: "cloud" | "data" | "security" | "development" | "design";
  status: "active" | "expired" | "pending";
  description: string;
}

interface Award {
  id: string;
  title: string;
  organization: string;
  date: string;
  category: "innovation" | "leadership" | "technical" | "design" | "business";
  description: string;
  icon: React.ComponentType<any>;
  verificationUrl?: string;
  impact: string;
}

interface CredibilityIndicatorsProps {
  showCertifications?: boolean;
  showAwards?: boolean;
  showTrustSignals?: boolean;
  maxItems?: number;
}

const certifications: Certification[] = [
  {
    id: "aws-solutions-architect",
    name: "AWS Certified Solutions Architect - Professional",
    issuer: "Amazon Web Services",
    icon: FaAws,
    date: "2023-08-15",
    expiryDate: "2026-08-15",
    credentialId: "AWS-SAP-2023-001",
    verificationUrl: "https://aws.amazon.com/verification",
    level: "professional",
    category: "cloud",
    status: "active",
    description: "Advanced cloud architecture design and implementation expertise"
  },
  {
    id: "aws-devops-engineer",
    name: "AWS Certified DevOps Engineer - Professional",
    issuer: "Amazon Web Services",
    icon: FaAws,
    date: "2023-06-20",
    expiryDate: "2026-06-20",
    credentialId: "AWS-DOP-2023-002",
    verificationUrl: "https://aws.amazon.com/verification",
    level: "professional",
    category: "cloud",
    status: "active",
    description: "CI/CD pipeline automation and infrastructure as code"
  },
  {
    id: "kubernetes-cka",
    name: "Certified Kubernetes Administrator",
    issuer: "Cloud Native Computing Foundation",
    icon: SiKubernetes,
    date: "2023-04-10",
    expiryDate: "2026-04-10",
    credentialId: "CKA-2023-003",
    verificationUrl: "https://training.linuxfoundation.org/certification/verify",
    level: "professional",
    category: "cloud",
    status: "active",
    description: "Container orchestration and cluster management"
  },
  {
    id: "terraform-associate",
    name: "HashiCorp Certified: Terraform Associate",
    issuer: "HashiCorp",
    icon: SiTerraform,
    date: "2023-02-28",
    expiryDate: "2025-02-28",
    credentialId: "HC-TA-2023-004",
    verificationUrl: "https://www.credly.com/badges",
    level: "associate",
    category: "cloud",
    status: "active",
    description: "Infrastructure as Code and automation"
  },
  {
    id: "google-data-engineer",
    name: "Google Cloud Professional Data Engineer",
    issuer: "Google Cloud",
    icon: FaGoogle,
    date: "2023-01-15",
    expiryDate: "2025-01-15",
    credentialId: "GCP-PDE-2023-005",
    verificationUrl: "https://cloud.google.com/certification",
    level: "professional",
    category: "data",
    status: "active",
    description: "Big data processing and machine learning pipelines"
  }
];

const awards: Award[] = [
  {
    id: "innovation-award-2023",
    title: "Technology Innovation Award",
    organization: "Tech Excellence Council",
    date: "2023-11-15",
    category: "innovation",
    description: "Recognition for breakthrough cloud architecture solutions",
    icon: FaTrophy,
    verificationUrl: "https://techexcellence.org/awards/2023",
    impact: "Reduced infrastructure costs by 40% across 50+ client projects"
  },
  {
    id: "leadership-award-2023",
    title: "Technical Leadership Excellence",
    organization: "Industry Leaders Forum",
    date: "2023-09-20",
    category: "leadership",
    description: "Outstanding leadership in digital transformation initiatives",
    icon: FaMedal,
    verificationUrl: "https://industryleaders.org/awards",
    impact: "Led 15+ successful digital transformation projects"
  },
  {
    id: "design-excellence-2022",
    title: "UX Design Excellence Award",
    organization: "Design Innovation Institute",
    date: "2022-12-10",
    category: "design",
    description: "Exceptional user experience design and implementation",
    icon: FaStar,
    verificationUrl: "https://designinnovation.org/awards",
    impact: "Improved user engagement by 65% across client applications"
  }
];

const trustSignals = [
  {
    metric: "$30M+",
    label: "Business Impact Generated",
    description: "Cumulative value delivered across all client projects"
  },
  {
    metric: "98%",
    label: "Client Satisfaction Rate",
    description: "Based on post-project surveys and testimonials"
  },
  {
    metric: "150+",
    label: "Projects Completed",
    description: "Successful deliveries across all service domains"
  },
  {
    metric: "5+",
    label: "Years Experience",
    description: "Deep expertise in modern technology solutions"
  }
];

const CredibilityIndicators: React.FC<CredibilityIndicatorsProps> = ({
  showCertifications = true,
  showAwards = true,
  showTrustSignals = true,
  maxItems = 6
}) => {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [selectedAward, setSelectedAward] = useState<Award | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const getLevelColor = (level: string) => {
    switch (level) {
      case "foundational": return "text-blue-500 bg-blue-500/10";
      case "associate": return "text-green-500 bg-green-500/10";
      case "professional": return "text-purple-500 bg-purple-500/10";
      case "expert": return "text-orange-500 bg-orange-500/10";
      default: return "text-gray-500 bg-gray-500/10";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "cloud": return "text-blue-500 bg-blue-500/10";
      case "data": return "text-green-500 bg-green-500/10";
      case "security": return "text-red-500 bg-red-500/10";
      case "development": return "text-purple-500 bg-purple-500/10";
      case "design": return "text-pink-500 bg-pink-500/10";
      default: return "text-gray-500 bg-gray-500/10";
    }
  };

  const filteredCertifications = activeFilter === "all" 
    ? certifications 
    : certifications.filter(cert => cert.category === activeFilter);

  return (
    <section className="py-20 bg-gradient-to-b from-background/50 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Verified <span className="text-primary">Expertise</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Industry-recognized certifications, awards, and proven track record 
            demonstrating technical excellence and business impact.
          </p>
        </motion.div>

        {/* Trust Signals */}
        {showTrustSignals && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          >
            {trustSignals.map((signal, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {signal.metric}
                </div>
                <div className="text-lg font-semibold text-foreground mb-1">
                  {signal.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {signal.description}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Certifications Section */}
        {showCertifications && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-foreground">Professional Certifications</h3>
              
              {/* Category Filter */}
              <div className="flex space-x-2">
                {["all", "cloud", "data", "security", "development"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeFilter === filter
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCertifications.slice(0, maxItems).map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card/80 backdrop-blur-md rounded-xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedCert(cert)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <cert.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(cert.level)}`}>
                        {cert.level}
                      </span>
                      {cert.status === "active" && (
                        <FaCheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </div>

                  <h4 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {cert.name}
                  </h4>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {cert.issuer}
                  </p>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {cert.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FaCalendarAlt className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {new Date(cert.date).getFullYear()}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(cert.category)}`}>
                      {cert.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Awards Section */}
        {showAwards && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-foreground mb-8">Industry Recognition</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {awards.map((award, index) => (
                <motion.div
                  key={award.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20 hover:border-primary/40 transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedAward(award)}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <award.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {award.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {award.organization}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {award.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {new Date(award.date).getFullYear()}
                    </span>
                    <span className="text-xs font-medium text-primary">
                      {award.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Certification Detail Modal */}
        <AnimatePresence>
          {selectedCert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedCert(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card rounded-2xl max-w-2xl w-full p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                      <selectedCert.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{selectedCert.name}</h3>
                      <p className="text-muted-foreground">{selectedCert.issuer}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCert(null)}
                    className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Description</h4>
                    <p className="text-muted-foreground">{selectedCert.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Credential ID</h4>
                      <p className="text-muted-foreground font-mono text-sm">{selectedCert.credentialId}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Issue Date</h4>
                      <p className="text-muted-foreground">{new Date(selectedCert.date).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {selectedCert.expiryDate && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Expiry Date</h4>
                      <p className="text-muted-foreground">{new Date(selectedCert.expiryDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-border">
                  {selectedCert.verificationUrl && (
                    <a
                      href={selectedCert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
                    >
                      <FaShieldAlt className="w-4 h-4" />
                      <span>Verify Credential</span>
                      <FaExternalLinkAlt className="w-3 h-3" />
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedCert(null)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Award Detail Modal */}
        <AnimatePresence>
          {selectedAward && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedAward(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card rounded-2xl max-w-2xl w-full p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                      <selectedAward.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{selectedAward.title}</h3>
                      <p className="text-muted-foreground">{selectedAward.organization}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAward(null)}
                    className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Description</h4>
                    <p className="text-muted-foreground">{selectedAward.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Impact</h4>
                    <p className="text-muted-foreground">{selectedAward.impact}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Category</h4>
                      <p className="text-muted-foreground capitalize">{selectedAward.category}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Date</h4>
                      <p className="text-muted-foreground">{new Date(selectedAward.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-border">
                  {selectedAward.verificationUrl && (
                    <a
                      href={selectedAward.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
                    >
                      <FaExternalLinkAlt className="w-4 h-4" />
                      <span>View Award</span>
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedAward(null)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CredibilityIndicators;
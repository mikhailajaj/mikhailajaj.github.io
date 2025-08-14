import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  FaCode,
  FaCloud,
  FaChartBar,
  FaPalette,
  FaSearch,
  FaArrowRight,
} from "react-icons/fa";
import ServiceLayout from "@/components/layouts/ServiceLayout";
import PageHeader from "@/components/navigation/PageHeader";
import CallToAction from "@/components/ui/CallToAction";

export const metadata: Metadata = {
  title: "Services | Mikhail Ajaj - Full-Stack, Cloud & Data Solutions",
  description:
    "Comprehensive technology services including Full-Stack Development, Cloud Architecture, Data Analytics, UX/UI Design, and Technical Consulting.",
  keywords: [
    "Full-Stack Development",
    "Cloud Architecture",
    "Data Analytics",
    "UX/UI Design",
    "Technical Consulting",
    "Software Development Services",
  ],
};

const services = [
  {
    id: "full-stack",
    title: "Full-Stack Development",
    description:
      "End-to-end web and mobile application development using modern technologies like React, Node.js, and cloud platforms.",
    icon: FaCode,
    color: "from-blue-500 to-cyan-500",
    features: [
      "React & Next.js Applications",
      "Node.js & .NET Backend Development",
      "Mobile App Development (Swift, React Native)",
      "Database Design & Optimization",
      "API Development & Integration",
      "Performance Optimization",
    ],
    href: "/services/full-stack",
  },
  {
    id: "cloud",
    title: "Cloud Architecture",
    description:
      "Scalable cloud infrastructure design and implementation on AWS, Azure, and Google Cloud Platform.",
    icon: FaCloud,
    color: "from-teal-500 to-green-500",
    features: [
      "AWS/Azure/GCP Architecture",
      "Serverless Solutions",
      "DevOps & CI/CD Pipelines",
      "Infrastructure as Code",
      "Cost Optimization",
      "Security & Compliance",
    ],
    href: "/services/cloud",
  },
  {
    id: "data",
    title: "Data Analytics",
    description:
      "Transform your data into actionable insights with advanced analytics, visualization, and machine learning solutions.",
    icon: FaChartBar,
    color: "from-purple-500 to-pink-500",
    features: [
      "Data Pipeline Development",
      "Business Intelligence Dashboards",
      "Machine Learning Models",
      "Data Visualization",
      "Predictive Analytics",
      "Real-time Data Processing",
    ],
    href: "/services/data",
  },
  {
    id: "ux-ui",
    title: "UX/UI Design",
    description:
      "User-centered design solutions that create intuitive and engaging digital experiences.",
    icon: FaPalette,
    color: "from-orange-500 to-red-500",
    features: [
      "User Research & Testing",
      "Wireframing & Prototyping",
      "Visual Design Systems",
      "Accessibility Optimization",
      "Mobile-First Design",
      "Design System Development",
    ],
    href: "/services/ux-ui",
  },
  {
    id: "consulting",
    title: "Technical Consulting",
    description:
      "Strategic technology guidance and code reviews using the BMAD methodology for optimal results.",
    icon: FaSearch,
    color: "from-indigo-500 to-purple-500",
    features: [
      "Technical Architecture Review",
      "Code Quality Assessment",
      "Performance Audits",
      "Technology Stack Recommendations",
      "Team Training & Mentoring",
      "BMAD Methodology Implementation",
    ],
    href: "/services/consulting",
  },
];

export default function ServicesPage() {
  return (
    <ServiceLayout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
            Professional{" "}
            <span className="text-blue-600 dark:text-blue-400">Services</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Comprehensive technology solutions across multiple specializations
            to drive your business forward
          </p>
          <Link
            href="#services"
            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-lg font-semibold"
          >
            Explore Services
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Service Offerings
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Specialized expertise across the full technology stack
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group"
              >
                {/* Service Icon */}
                <div
                  className={`w-16 h-16 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <service.icon className="text-white text-2xl" />
                </div>

                {/* Service Content */}
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features List */}
                <ul className="space-y-2 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  href={service.href}
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
                >
                  Learn More
                  <FaArrowRight className="ml-2 text-sm" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Let&apos;s discuss how these services can help achieve your business
            goals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contact"
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
            >
              Get Started
              <FaArrowRight className="ml-2" />
            </Link>
            <Link
              href="/#projects"
              className="inline-flex items-center px-8 py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition-colors font-semibold"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </section>
    </ServiceLayout>
  );
}

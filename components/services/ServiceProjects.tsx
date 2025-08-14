import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";
import { ProjectCaseStudy } from "@/data/projects-enhanced";

interface ServiceProjectsProps {
  projects: ProjectCaseStudy[];
  title: string;
}

const ServiceProjects: React.FC<ServiceProjectsProps> = ({
  projects,
  title,
}) => {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Recent projects and case studies related to this service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.slice(0, 3).map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48">
                <Image
                  src={project.images.hero}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {project.overview}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-green-600">
                    <FaCheckCircle className="mr-2" />
                    <span className="text-sm font-medium">
                      {project.impact.metrics[0]}
                    </span>
                  </div>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    View Case Study →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/#projects"
            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
          >
            View All Projects
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServiceProjects;

import React from "react";
import Link from "next/link";
import { FaRocket } from "react-icons/fa";

interface ServiceCTAProps {
  title: string;
  description: string;
  primaryAction: string;
  secondaryAction: string;
  primaryActionLink?: string;
  secondaryActionLink?: string;
}

const ServiceCTA: React.FC<ServiceCTAProps> = ({
  title,
  description,
  primaryAction,
  secondaryAction,
  primaryActionLink = "/#contact",
  secondaryActionLink = "/services",
}) => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
          {title}
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={primaryActionLink}
            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
          >
            {primaryAction}
            <FaRocket className="ml-2" />
          </Link>
          <Link
            href={secondaryActionLink}
            className="inline-flex items-center px-8 py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition-colors font-semibold"
          >
            {secondaryAction}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServiceCTA;

import React from "react";
import { Testimonial } from "@/data/testimonials";

interface ServiceTestimonialsProps {
  testimonials: Testimonial[];
}

const ServiceTestimonials: React.FC<ServiceTestimonialsProps> = ({
  testimonials,
}) => {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Client Testimonials
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            What clients say about my services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.slice(0, 2).map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic">
                &ldquo;{testimonial.testimonial}&rdquo;
              </p>
              <div className="flex items-center">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.client}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceTestimonials;

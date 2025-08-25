"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  FaStar,
  FaQuoteLeft,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import {
  testimonials,
  getFeaturedTestimonials,
  getTestimonialsByCategory,
} from "@/data/testimonials";

interface TestimonialCardProps {
  testimonial: (typeof testimonials)[0];
  index: number;
  inCarousel?: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps & { inCarousel?: boolean }> = ({
  testimonial,
  index,
  inCarousel = false,
}) => {
  return (
    <motion.div
      initial={inCarousel ? { opacity: 1 } : { opacity: 0, y: 50 }}
      whileInView={inCarousel ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={inCarousel ? { duration: 0 } : { duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
    >
      {/* Quote Icon */}
      <div className="flex items-start justify-between mb-4">
        <FaQuoteLeft className="text-blue-500 text-2xl opacity-50" />
        <div className="flex items-center">
          {[...Array(testimonial.rating)].map((_, i) => (
            <FaStar key={i} className="text-yellow-400 text-sm" />
          ))}
        </div>
      </div>

      {/* Testimonial Text */}
      <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
        &ldquo;{testimonial.testimonial}&rdquo;
      </p>

      {/* Client Info */}
      <div className="flex items-center">
        {testimonial.image && (
          <div className="relative w-12 h-12 mr-4">
            <Image
              src={testimonial.image}
              alt={testimonial.client}
              fill
              className="rounded-full object-cover"
            />
          </div>
        )}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {testimonial.client}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {testimonial.role}
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            {testimonial.company}
          </p>
        </div>
      </div>

      {/* Project Tag */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
          {testimonial.project}
        </span>
      </div>
    </motion.div>
  );
};

const TestimonialCarousel: React.FC<{ testimonials: typeof testimonials }> = ({
  testimonials,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Measure slide height to prevent layout jumps on transition
  React.useLayoutEffect(() => {
    const el = contentRef.current;
    if (el) {
      // Use scrollHeight to capture full content height
      setContainerHeight(el.scrollHeight);
    }
  }, [currentIndex]);

  // Keep height in sync on viewport changes
  React.useEffect(() => {
    const syncHeight = () => {
      const el = contentRef.current;
      if (el) setContainerHeight(el.scrollHeight);
    };
    window.addEventListener("resize", syncHeight);
    return () => window.removeEventListener("resize", syncHeight);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      position: "absolute" as const,
      inset: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      position: "absolute" as const,
      inset: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      position: "absolute" as const,
      inset: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      if (newDirection === 1) {
        return prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1;
      } else {
        return prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1;
      }
    });
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      <motion.div
        className="overflow-hidden rounded-xl relative"
        initial={false}
        animate={{ height: containerHeight ?? "auto" }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 400, damping: 40 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="w-full"
          >
            <div ref={contentRef} className="relative">
              <TestimonialCard
                testimonial={testimonials[currentIndex]}
                index={0}
                inCarousel={true}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Navigation Buttons */}
      <button
        onClick={() => paginate(-1)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
      >
        <FaChevronLeft className="text-gray-600 dark:text-gray-400" />
      </button>
      <button
        onClick={() => paginate(1)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
      >
        <FaChevronRight className="text-gray-600 dark:text-gray-400" />
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                ? "bg-blue-500"
                : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              }`}
          />
        ))}
      </div>
    </div>
  );
};

const TestimonialsSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("featured");
  const featuredTestimonials = getFeaturedTestimonials();

  const getFilteredTestimonials = () => {
    if (activeFilter === "featured") return featuredTestimonials;
    return getTestimonialsByCategory(activeFilter);
  };

  const filteredTestimonials = getFilteredTestimonials();

  const filterButtons = [
    { key: "featured", label: "Featured" },
    { key: "full-stack", label: "Full-Stack" },
    { key: "cloud", label: "Cloud" },
    { key: "data", label: "Data" },
    { key: "consulting", label: "Consulting" },
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900/50" id="testimonials">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black dark:text-white">
            Client{" "}
            <span className="text-blue-600 dark:text-blue-400">
              Testimonials
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            What clients say about working with me across different
            specializations
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {filterButtons.map((button) => (
            <button
              key={button.key}
              onClick={() => setActiveFilter(button.key)}
              className={`px-6 py-2 rounded-full text-sm transition-all duration-300 ${activeFilter === button.key
                  ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-md"
                  : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                }`}
            >
              {button.label}
            </button>
          ))}
        </motion.div>

        {/* Testimonials Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {filteredTestimonials.length > 0 ? (
              <>
                {/* Mobile: Carousel, Desktop: Grid */}
                <div className="block md:hidden">
                  <TestimonialCarousel testimonials={filteredTestimonials} />
                </div>
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredTestimonials.map((testimonial, index) => (
                    <TestimonialCard
                      key={testimonial.id}
                      testimonial={testimonial}
                      index={index}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No testimonials available for this category yet.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {testimonials.length}+
            </div>
            <p className="text-gray-600 dark:text-gray-400">Happy Clients</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              5.0
            </div>
            <p className="text-gray-600 dark:text-gray-400">Average Rating</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              100%
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Project Success Rate
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

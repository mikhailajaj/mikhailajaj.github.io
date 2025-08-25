/**
 * FeaturedReviews Component
 * 
 * Displays featured testimonials with beautiful animations and responsive design
 * inspired by TestimonialsSection with enhanced carousel and grid layouts.
 * Uses React Context to prevent hydration mismatches.
 */

'use client';

import React, { useState, useEffect, useCallback, useLayoutEffect, useRef, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { ExternalLink } from 'lucide-react';
import type { PublicReview } from '@/lib/types/review';
import { getFeaturedTestimonials } from '@/data/testimonials';

// Hydration Context to prevent SSR/Client mismatches
interface HydrationContextType {
  isHydrated: boolean;
}

const HydrationContext = createContext<HydrationContextType>({ isHydrated: false });

const HydrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <HydrationContext.Provider value={{ isHydrated }}>
      {children}
    </HydrationContext.Provider>
  );
};

const useHydration = () => useContext(HydrationContext);

export interface FeaturedReviewsProps {
  /** Maximum number of featured reviews to display */
  maxReviews?: number;
  /** Whether to enable automatic rotation */
  autoRotate?: boolean;
  /** Rotation interval in milliseconds */
  rotationInterval?: number;
  /** Layout variant */
  layout?: 'carousel' | 'grid' | 'highlight';
  /** Whether to show navigation controls */
  showControls?: boolean;
  /** Whether to show view all link */
  showViewAllLink?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  /** Custom empty state component */
  emptyComponent?: React.ReactNode;
}

/**
 * Enhanced review card with beautiful animations and styling
 */
interface ReviewCardProps {
  review: PublicReview;
  index: number;
  inCarousel?: boolean;
  className?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  index,
  inCarousel = false,
  className
}) => {
  const { isHydrated } = useHydration();

  return (
    <motion.div
      initial={inCarousel ? { opacity: 1 } : { opacity: 0, y: 50 }}
      whileInView={inCarousel ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={inCarousel ? { duration: 0 } : { duration: 0.5, delay: index * 0.1 }}
      className={cn(
        'bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700',
        className
      )}
    >
      {/* Quote Icon and Rating */}
      <div className="flex items-start justify-between mb-4">
        <FaQuoteLeft className="text-blue-500 text-2xl opacity-50" />
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <FaStar
              key={i}
              className={cn(
                'text-sm',
                i < review.content.rating
                  ? 'text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              )}
            />
          ))}
        </div>
      </div>

      {/* Testimonial Text */}
      <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
        &ldquo;{review.content.testimonial}&rdquo;
      </p>

      {/* Reviewer Info */}
      <div className="flex items-center">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {review.reviewer.name}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {review.reviewer.title}
          </p>
          {review.reviewer.organization && (
            <p className="text-sm text-blue-600 dark:text-blue-400">
              {review.reviewer.organization}
            </p>
          )}
        </div>
      </div>

      {/* Project Association Tag */}
      {isHydrated && review.content.projectAssociation && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
            {review.content.projectAssociation}
          </span>
        </div>
      )}
    </motion.div>
  );
};

/**
 * Enhanced carousel component with smooth animations and hydration safety
 */
const ReviewCarousel: React.FC<{ reviews: PublicReview[] }> = ({ reviews }) => {
  const { isHydrated } = useHydration();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Measure slide height to prevent layout jumps - only after hydration
  useLayoutEffect(() => {
    if (!isHydrated) return;

    const el = contentRef.current;
    if (el) {
      setContainerHeight(el.scrollHeight);
    }
  }, [currentIndex, isHydrated]);

  // Keep height in sync on viewport changes - only after hydration
  useEffect(() => {
    if (!isHydrated) return;

    const syncHeight = () => {
      const el = contentRef.current;
      if (el) setContainerHeight(el.scrollHeight);
    };

    window.addEventListener('resize', syncHeight);
    return () => window.removeEventListener('resize', syncHeight);
  }, [isHydrated]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      position: 'absolute' as const,
      inset: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      position: 'absolute' as const,
      inset: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      position: 'absolute' as const,
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
        return prevIndex === reviews.length - 1 ? 0 : prevIndex + 1;
      } else {
        return prevIndex === 0 ? reviews.length - 1 : prevIndex - 1;
      }
    });
  };

  // Show static content during SSR, animated content after hydration
  if (!isHydrated) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="rounded-xl">
          <ReviewCard
            review={reviews[0]}
            index={0}
            inCarousel={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      <motion.div
        className="overflow-hidden rounded-xl relative"
        initial={false}
        animate={{ height: containerHeight ?? 'auto' }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
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
              x: { type: 'spring', stiffness: 400, damping: 40 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(_, { offset, velocity }) => {
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
              <ReviewCard
                review={reviews[currentIndex]}
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
        {reviews.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
              ? 'bg-blue-500'
              : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Loading skeleton component
 */
const LoadingSkeleton: React.FC = () => (
  <div className="space-y-6">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              ))}
            </div>
          </div>
          <div className="space-y-2 mb-6">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
          <div className="flex items-center gap-3">
            <div className="space-y-1 flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-28" />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

/**
 * Enhanced empty state component
 */
const EmptyState: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-12"
  >
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, duration: 0.3 }}
      className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center"
    >
      <FaStar className="w-8 h-8 text-gray-400" />
    </motion.div>
    <motion.h3
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.3 }}
      className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2"
    >
      No testimonials yet
    </motion.h3>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.3 }}
      className="text-gray-600 dark:text-gray-400 mb-6"
    >
      Be the first to share your experience working with Mikhail.
    </motion.p>
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.3 }}
      className="flex flex-col sm:flex-row gap-3 justify-center"
    >
      <Button asChild>
        <Link href="/reviews/submit">
          Submit a Review
        </Link>
      </Button>
      <Button asChild variant="outline">
        <Link href="/contact">
          Contact Me
        </Link>
      </Button>
    </motion.div>
  </motion.div>
);

/**
 * FeaturedReviews Component
 */
const FeaturedReviewsContent: React.FC<FeaturedReviewsProps> = ({
  maxReviews = 4,
  autoRotate = true,
  rotationInterval = 8000,
  layout = 'grid',
  showViewAllLink = true,
  className,
  loadingComponent,
  emptyComponent,
}) => {
  const { isHydrated } = useHydration();

  // All state hooks must be declared at the top level
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [fallbackLoaded, setFallbackLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(autoRotate);

  // Fetch featured reviews - prioritize static fallback for static export
  const fetchFeaturedReviews = useCallback(async () => {
    try {
      setLoading(true);

      // For static export, use static testimonials directly
      const fallback = getFeaturedTestimonials().slice(0, maxReviews);
      if (fallback.length > 0) {
        const mapped: PublicReview[] = fallback.map((t) => ({
          id: t.id,
          reviewer: {
            name: t.client,
            title: t.role || '',
            organization: t.company || '',
            relationship: 'client' as const,
            verified: true,
          },
          content: {
            rating: t.rating,
            testimonial: t.testimonial,
            projectAssociation: t.project || '',
            recommendation: t.rating >= 4,
          },
          metadata: {
            approvedAt: t.date,
            source: 'direct' as const,
          },
        }));

        setReviews(mapped);
        setFallbackLoaded(true);
      } else {
        setError('No testimonials available');
      }
    } catch (fallbackErr) {
      console.error('Failed to load static testimonials:', fallbackErr);
      setError('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  }, [maxReviews]);



  // Initial load effect
  useEffect(() => {
    fetchFeaturedReviews();
  }, [fetchFeaturedReviews]);

  // Auto-rotation effect - only after hydration
  useEffect(() => {
    if (!isHydrated || !isRotating || reviews.length <= 1 || layout !== 'carousel') {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [isHydrated, isRotating, reviews.length, rotationInterval, layout]);

  // Render content based on layout
  const renderContent = () => {
    const MotionDiv = isHydrated ? motion.div : 'div';
    const motionProps = isHydrated ? {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 }
    } : {};

    switch (layout) {
      case 'carousel':
        return <ReviewCarousel reviews={reviews} />;

      case 'highlight':
        return (
          <MotionDiv
            {...motionProps}
            className="space-y-6"
          >
            <ReviewCard
              review={reviews[0]}
              index={0}
              className="border-2 border-blue-200 dark:border-blue-800"
            />
            {reviews.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.slice(1, 3).map((review, index) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    index={index + 1}
                    className="scale-95"
                  />
                ))}
              </div>
            )}
          </MotionDiv>
        );

      default: // grid
        return (
          <MotionDiv
            {...motionProps}
          >
            {/* Mobile: Carousel, Desktop: Grid */}
            <div className="block md:hidden">
              <ReviewCarousel reviews={reviews} />
            </div>
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review, index) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  index={index}
                />
              ))}
            </div>
          </MotionDiv>
        );
    }
  };

  // Early returns after all hooks are declared
  if (loading) {
    return (
      <div className={cn('w-full', className)}>
        {loadingComponent || <LoadingSkeleton />}
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('w-full', className)}>
        {emptyComponent || <EmptyState />}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className={cn('w-full', className)}>
        {emptyComponent || <EmptyState />}
      </div>
    );
  }

  const HeaderMotion = isHydrated ? motion.div : 'div';
  const NoticeMotion = isHydrated ? motion.div : 'div';
  const ContentWrapper = isHydrated ? AnimatePresence : React.Fragment;
  const ContentMotion = isHydrated ? motion.div : 'div';
  const LinkMotion = isHydrated ? motion.div : 'div';
  const StatsMotion = isHydrated ? motion.div : 'div';

  const headerProps = isHydrated ? {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  } : {};

  const noticeProps = isHydrated ? {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.2 }
  } : {};

  const contentProps = isHydrated ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5, delay: 0.3 }
  } : {};

  const contentKey = isHydrated ? "content" : undefined;

  const linkProps = isHydrated ? {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay: 0.4 }
  } : {};

  const statsProps = isHydrated ? {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay: 0.5 }
  } : {};

  return (
    <section className={cn('py-12 bg-gray-50 dark:bg-gray-900/50', className)}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <HeaderMotion
          {...headerProps}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black dark:text-white">
            Featured{' '}
            <span className="text-blue-600 dark:text-blue-400">
              Reviews
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            What clients and colleagues say about working with me
          </p>
        </HeaderMotion>

        {/* Static Content Notice */}
        {fallbackLoaded && (
          <NoticeMotion
            {...noticeProps}
            className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl"
          >
            <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
              Featuring real client testimonials and project feedback. <span className='dark:text-yellow-200 font-bold text-red-800'>Template</span>
            </p>
          </NoticeMotion>
        )}

        {/* Content */}
        <ContentWrapper {...(isHydrated ? { mode: "wait" } : {})}>
          <ContentMotion key={contentKey} {...contentProps}>
            {renderContent()}
          </ContentMotion>
        </ContentWrapper>

        {/* Action Links */}
        {showViewAllLink && (
          <LinkMotion
            {...linkProps}
            className="mt-12 text-center space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/reviews/submit" className="inline-flex items-center gap-2">
                  Submit a Review
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                <Link href="/testimonials" className="inline-flex items-center gap-2">
                  View All Testimonials
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </LinkMotion>
        )}

        {/* Stats Section */}
        <StatsMotion
          {...statsProps}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {reviews.length}+
            </div>
            <p className="text-gray-600 dark:text-gray-400">Featured Reviews</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.content.rating, 0) / reviews.length).toFixed(1) : '5.0'}
            </div>
            <p className="text-gray-600 dark:text-gray-400">Average Rating</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {reviews.length > 0 ? Math.round((reviews.filter(r => r.content.recommendation).length / reviews.length) * 100) : 100}%
            </div>
            <p className="text-gray-600 dark:text-gray-400">Recommendation Rate</p>
          </div>
        </StatsMotion>
      </div>
    </section>
  );
};

// Main component with hydration provider
export const FeaturedReviews: React.FC<FeaturedReviewsProps> = (props) => {
  return (
    <HydrationProvider>
      <FeaturedReviewsContent {...props} />
    </HydrationProvider>
  );
};

export default FeaturedReviews;
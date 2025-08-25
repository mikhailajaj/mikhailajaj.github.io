/**
 * Homepage Testimonials Section Component
 * 
 * Integrates FeaturedReviews into the homepage layout with call-to-action,
 * placeholder content, and responsive design optimized for homepage performance.
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  ExternalLink,
  Plus,
  ArrowRight
} from 'lucide-react';
import { FeaturedReviews } from './FeaturedReviews';

export interface HomepageTestimonialsSectionProps {
  /** Section title */
  title?: string;
  /** Section subtitle */
  subtitle?: string;
  /** Whether to show statistics */
  showStats?: boolean;
  /** Whether to show call-to-action */
  showCTA?: boolean;
  /** Layout variant */
  variant?: 'default' | 'compact' | 'featured';
  /** Additional CSS classes */
  className?: string;
  /** Custom section ID for navigation */
  sectionId?: string;
}

/**
 * Statistics component showing testimonial metrics
 */
const TestimonialStats: React.FC = () => {
  const stats = [
    {
      icon: Users,
      value: '50+',
      label: 'Happy Clients',
      description: 'Professionals who recommend my work'
    },
    {
      icon: Star,
      value: '4.9',
      label: 'Average Rating',
      description: 'Based on verified testimonials'
    },
    {
      icon: TrendingUp,
      value: '100%',
      label: 'Success Rate',
      description: 'Projects completed successfully'
    },
    {
      icon: MessageSquare,
      value: '25+',
      label: 'Testimonials',
      description: 'From professors and colleagues'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="text-center hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex justify-center mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {stat.description}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

/**
 * Call-to-action component for submitting reviews
 */
const TestimonialCTA: React.FC<{ variant?: 'default' | 'compact' }> = ({ 
  variant = 'default' 
}) => {
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mt-8"
      >
        <p className="text-muted-foreground mb-4">
          Worked with me? Share your experience!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/reviews/submit" className="inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Submit Review
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/testimonials" className="inline-flex items-center gap-2">
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-12"
    >
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
        <CardContent className="p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-3">
              Have you worked with me?
            </h3>
            <p className="text-muted-foreground mb-6">
              Your testimonial helps others understand the value I bring to projects. 
              Share your experience and help build trust with future collaborators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/reviews/submit" className="inline-flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Submit a Testimonial
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/testimonials" className="inline-flex items-center gap-2">
                  View All Testimonials
                  <ExternalLink className="w-5 h-5" />
                </Link>
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  ✓ Verified Reviews
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  ✓ Professional Network
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

/**
 * Placeholder component when no testimonials are available
 */
const TestimonialPlaceholder: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center py-16"
  >
    <div className="max-w-md mx-auto">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <MessageSquare className="w-10 h-10 text-blue-600 dark:text-blue-400" />
      </div>
      
      <h3 className="text-xl font-semibold mb-3">
        Building Professional Relationships
      </h3>
      
      <p className="text-muted-foreground mb-6">
        I'm actively building my professional network and collecting testimonials 
        from colleagues, professors, and collaborators. Your feedback helps showcase 
        the quality of my work.
      </p>
      
      <div className="space-y-3">
        <Button asChild size="lg">
          <Link href="/reviews/submit" className="inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Be the First to Review
          </Link>
        </Button>
        
        <div className="text-sm text-muted-foreground">
          Have we worked together? I'd love to hear your feedback!
        </div>
      </div>
      
      {/* Preview of what testimonials will look like */}
      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
        <div className="text-xs text-muted-foreground mb-2">Preview:</div>
        <div className="text-sm italic text-gray-600 dark:text-gray-400">
          "Your testimonial will appear here, helping others understand 
          the value and quality of collaborative work..."
        </div>
      </div>
    </div>
  </motion.div>
);

/**
 * Homepage Testimonials Section Component
 */
export const HomepageTestimonialsSection: React.FC<HomepageTestimonialsSectionProps> = ({
  title = "Professional Testimonials",
  subtitle = "What colleagues, professors, and collaborators say about working with me",
  showStats = true,
  showCTA = true,
  variant = 'default',
  className,
  sectionId = 'testimonials'
}) => {
  // Configuration based on variant
  const variantConfig = {
    default: {
      maxReviews: 3,
      layout: 'grid' as const,
      showControls: false,
      padding: 'py-24',
      showViewAllLink: true
    },
    compact: {
      maxReviews: 2,
      layout: 'grid' as const,
      showControls: false,
      padding: 'py-16',
      showViewAllLink: true
    },
    featured: {
      maxReviews: 1,
      layout: 'highlight' as const,
      showControls: true,
      padding: 'py-20',
      showViewAllLink: true
    }
  };

  const config = variantConfig[variant];

  return (
    <section 
      id={sectionId}
      className={cn(
        'bg-gray-50 dark:bg-gray-900/50',
        config.padding,
        className
      )}
    >
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
            {title.split(' ').map((word, index) => (
              <span key={index}>
                {index === title.split(' ').length - 1 ? (
                  <span className="text-blue-600 dark:text-blue-400">{word}</span>
                ) : (
                  `${word} `
                )}
              </span>
            ))}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {subtitle}
          </p>
        </motion.div>

        {/* Statistics */}
        {showStats && variant !== 'compact' && <TestimonialStats />}

        {/* Featured Reviews */}
        <FeaturedReviews
          maxReviews={config.maxReviews}
          layout={config.layout}
          showControls={config.showControls}
          showViewAllLink={config.showViewAllLink}
          autoRotate={variant === 'featured'}
          rotationInterval={8000}
          emptyComponent={<TestimonialPlaceholder />}
          className="mb-8"
        />

        {/* Call to Action */}
        {showCTA && (
          <TestimonialCTA variant={variant === 'compact' ? 'compact' : 'default'} />
        )}
      </div>
    </section>
  );
};

export default HomepageTestimonialsSection;
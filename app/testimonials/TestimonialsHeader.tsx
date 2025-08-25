'use client';

/**
 * Testimonials Header Component
 * 
 * Professional header section for the testimonials page with statistics
 * and engaging introduction.
 */

import React from 'react';
import { MotionDiv } from '@/lib/motion-utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TestimonialsHeaderProps {
  title: string;
  description: string;
  stats?: {
    total: number;
    averageRating: number;
    featuredCount: number;
  };
  className?: string;
}

/**
 * Statistics Card Component
 */
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, delay = 0 }) => (
  <MotionDiv
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Card className="text-center">
      <CardContent className="py-6">
        <div className="flex flex-col items-center gap-2">
          <div className="text-primary mb-2">
            {icon}
          </div>
          <div className="text-2xl font-bold text-foreground">
            {value}
          </div>
          <div className="text-sm text-muted-foreground">
            {label}
          </div>
        </div>
      </CardContent>
    </Card>
  </MotionDiv>
);

/**
 * Testimonials Header Component
 */
export const TestimonialsHeader: React.FC<TestimonialsHeaderProps> = ({
  title,
  description,
  stats,
  className
}) => {
  return (
    <section className={cn('bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950 dark:via-background dark:to-purple-950 py-16 lg:py-24', className)}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Header */}
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-4">
              Professional References
            </Badge>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {title}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          </MotionDiv>

          {/* Statistics */}
          {stats && (
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
            >
              <StatCard
                label="Total Testimonials"
                value={stats.total}
                delay={0.1}
                icon={
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                }
              />
              
              <StatCard
                label="Average Rating"
                value={`${stats.averageRating}/5`}
                delay={0.2}
                icon={
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                }
              />
              
              <StatCard
                label="Featured Reviews"
                value={stats.featuredCount}
                delay={0.3}
                icon={
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                }
              />
            </MotionDiv>
          )}

          {/* Trust Indicators */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex flex-wrap justify-center gap-4"
          >
            <Badge variant="outline" className="text-sm py-2 px-4">
              ✓ Verified Reviews
            </Badge>
            <Badge variant="outline" className="text-sm py-2 px-4">
              ✓ Professional References
            </Badge>
            <Badge variant="outline" className="text-sm py-2 px-4">
              ✓ Real Collaborations
            </Badge>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
};
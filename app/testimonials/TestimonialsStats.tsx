'use client';

/**
 * Testimonials Statistics Component
 * 
 * Displays key statistics and insights about the testimonials collection.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MotionDiv } from '@/lib/motion-utils';
import { cn } from '@/lib/utils';

interface TestimonialsStatsProps {
  total: number;
  featured: number;
  averageRating: number;
  relationships: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  className?: string;
}

/**
 * Rating Distribution Component
 */
interface RatingDistributionProps {
  averageRating: number;
  total: number;
}

const RatingDistribution: React.FC<RatingDistributionProps> = ({ averageRating, total }) => {
  // Mock rating distribution - in real implementation, this would come from API
  const distribution = [
    { stars: 5, count: Math.floor(total * 0.8), percentage: 80 },
    { stars: 4, count: Math.floor(total * 0.15), percentage: 15 },
    { stars: 3, count: Math.floor(total * 0.05), percentage: 5 },
    { stars: 2, count: 0, percentage: 0 },
    { stars: 1, count: 0, percentage: 0 }
  ];

  return (
    <div className="space-y-3">
      {distribution.map((rating) => (
        <div key={rating.stars} className="flex items-center gap-3">
          <div className="flex items-center gap-1 w-12">
            <span className="text-sm font-medium">{rating.stars}</span>
            <svg className="w-3 h-3 fill-yellow-400" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <Progress value={rating.percentage} className="h-2" />
          </div>
          <div className="text-sm text-muted-foreground w-12 text-right">
            {rating.count}
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Relationship Breakdown Component
 */
interface RelationshipBreakdownProps {
  relationships: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
}

const RelationshipBreakdown: React.FC<RelationshipBreakdownProps> = ({ relationships }) => {
  const relationshipColors = {
    professor: 'bg-blue-500',
    colleague: 'bg-green-500',
    supervisor: 'bg-purple-500',
    collaborator: 'bg-orange-500',
    client: 'bg-pink-500'
  };

  return (
    <div className="space-y-3">
      {relationships.map((relationship) => (
        <div key={relationship.type} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className={cn(
                'w-3 h-3 rounded-full',
                relationshipColors[relationship.type as keyof typeof relationshipColors] || 'bg-gray-500'
              )}
            />
            <span className="text-sm font-medium capitalize">
              {relationship.type}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {relationship.percentage}%
            </span>
            <Badge variant="secondary" className="text-xs">
              {relationship.count}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Key Metrics Component
 */
interface KeyMetricsProps {
  total: number;
  featured: number;
  averageRating: number;
}

const KeyMetrics: React.FC<KeyMetricsProps> = ({ total, featured, averageRating }) => {
  const metrics = [
    {
      label: 'Total Reviews',
      value: total,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      color: 'text-blue-600'
    },
    {
      label: 'Featured',
      value: featured,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
      color: 'text-yellow-600'
    },
    {
      label: 'Avg Rating',
      value: `${averageRating}/5`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'text-green-600'
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {metrics.map((metric, index) => (
        <MotionDiv
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="text-center"
        >
          <div className={cn('inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 mb-2', metric.color)}>
            {metric.icon}
          </div>
          <div className="text-lg font-bold text-foreground">
            {metric.value}
          </div>
          <div className="text-xs text-muted-foreground">
            {metric.label}
          </div>
        </MotionDiv>
      ))}
    </div>
  );
};

/**
 * Testimonials Statistics Component
 */
export const TestimonialsStats: React.FC<TestimonialsStatsProps> = ({
  total,
  featured,
  averageRating,
  relationships,
  className
}) => {
  // Mock relationships data if not provided
  const mockRelationships = relationships.length > 0 ? relationships : [
    { type: 'professor', count: Math.floor(total * 0.3), percentage: 30 },
    { type: 'colleague', count: Math.floor(total * 0.25), percentage: 25 },
    { type: 'supervisor', count: Math.floor(total * 0.2), percentage: 20 },
    { type: 'collaborator', count: Math.floor(total * 0.15), percentage: 15 },
    { type: 'client', count: Math.floor(total * 0.1), percentage: 10 }
  ];

  if (total === 0) return null;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn('mb-8', className)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Key Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <KeyMetrics
              total={total}
              featured={featured}
              averageRating={averageRating}
            />
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <RatingDistribution
              averageRating={averageRating}
              total={total}
            />
          </CardContent>
        </Card>

        {/* Relationship Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Professional Relationships</CardTitle>
          </CardHeader>
          <CardContent>
            <RelationshipBreakdown relationships={mockRelationships} />
          </CardContent>
        </Card>
      </div>
    </MotionDiv>
  );
};
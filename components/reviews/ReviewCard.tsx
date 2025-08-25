/**
 * ReviewCard Component
 * 
 * A flexible card component for displaying testimonials and reviews
 * with support for different variants and responsive design.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MotionDiv } from '@/lib/motion-utils';
import { RatingDisplay } from './RatingDisplay';
import { TemplateIndicator } from '@/components/ui/TemplateIndicator';
import type { Review, PublicReview, ReviewerRelationship } from '@/lib/types/review';

export interface ReviewCardProps {
  /** The review data to display */
  review: Review | PublicReview;
  /** Visual variant of the card */
  variant?: 'default' | 'featured' | 'compact';
  /** Whether to show admin actions (for admin interface) */
  showActions?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Click handler for the card */
  onClick?: () => void;
}

/**
 * Relationship display configuration
 */
const relationshipConfig: Record<ReviewerRelationship, { label: string; color: string }> = {
  professor: { label: 'Professor', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  colleague: { label: 'Colleague', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  supervisor: { label: 'Supervisor', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  collaborator: { label: 'Collaborator', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
  client: { label: 'Client', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' }
};

/**
 * Avatar Component
 * Displays reviewer avatar with fallback to initials
 */
interface AvatarProps {
  name: string;
  avatar?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ name, avatar, size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        'rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold',
        sizeClasses[size],
        className
      )}
    >
      {avatar ? (
        <img
          src={avatar}
          alt={`${name}'s avatar`}
          className="w-full h-full rounded-full object-cover"
          onError={(e) => {
            // Fallback to initials if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      ) : null}
      {!avatar && (
        <span className="select-none">{initials}</span>
      )}
    </div>
  );
};

/**
 * Truncate text with ellipsis
 */
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

/**
 * ReviewCard Component
 */
export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  variant = 'default',
  showActions = false,
  className,
  onClick
}) => {
  // Safety checks for undefined data
  if (!review || !review.reviewer || !review.content) {
    return (
      <Card className={cn('p-6', className)}>
        <CardContent>
          <p className="text-muted-foreground">Invalid review data</p>
        </CardContent>
      </Card>
    );
  }

  const { reviewer, content } = review;
  // Handle both Review and PublicReview types - admin field might not exist
  const admin = 'admin' in review ? review.admin : { featured: false };
  const relationshipInfo = relationshipConfig[reviewer.relationship] || {
    label: 'Unknown',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  };

  // Variant-specific configurations
  const variantConfig = {
    default: {
      testimonialLength: 300,
      showFullProfile: true,
      showSkills: true,
      showProject: true,
      cardPadding: 'p-6',
      ratingSize: 'md' as const,
      avatarSize: 'md' as const
    },
    featured: {
      testimonialLength: 400,
      showFullProfile: true,
      showSkills: true,
      showProject: true,
      cardPadding: 'p-8',
      ratingSize: 'lg' as const,
      avatarSize: 'lg' as const
    },
    compact: {
      testimonialLength: 150,
      showFullProfile: false,
      showSkills: false,
      showProject: false,
      cardPadding: 'p-4',
      ratingSize: 'sm' as const,
      avatarSize: 'sm' as const
    }
  };

  const config = variantConfig[variant];

  // Card styling based on variant
  const cardClasses = cn(
    'transition-all duration-200 hover:shadow-lg',
    {
      'border-2 border-yellow-200 dark:border-yellow-800 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950':
        variant === 'featured' && admin.featured,
      'hover:scale-[1.02]': variant !== 'compact',
      'cursor-pointer': onClick
    },
    className
  );

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={onClick ? { y: -2 } : undefined}
    >
      <Card className={cardClasses} onClick={onClick}>
        <CardHeader className={cn('pb-4', config.cardPadding)}>
          {/* Header with avatar and basic info */}
          <div className="flex items-start gap-4">
            <Avatar
              name={reviewer.name}
              avatar={reviewer.avatar}
              size={config.avatarSize}
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg leading-tight truncate">
                    {reviewer.name}
                  </h3>

                  {config.showFullProfile && (
                    <>
                      {reviewer.title && (
                        <p className="text-sm text-muted-foreground truncate">
                          {reviewer.title}
                        </p>
                      )}
                      {reviewer.organization && (
                        <p className="text-sm text-muted-foreground truncate">
                          {reviewer.organization}
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* Rating */}
                <div className="flex-shrink-0">
                  <RatingDisplay
                    rating={content?.rating || 0}
                    size={config.ratingSize}
                    animated={variant === 'featured'}
                  />
                </div>
              </div>

              {/* Relationship badge */}
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant="secondary"
                  className={cn('text-xs', relationshipInfo.color)}
                >
                  {relationshipInfo.label}
                </Badge>

                {admin.featured && variant !== 'compact' && (
                  <Badge variant="default" className="text-xs bg-yellow-500 text-yellow-50">
                    Featured
                  </Badge>
                )}

                {reviewer.verified && (
                  <Badge variant="outline" className="text-xs">
                    ✓ Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className={cn('pt-0', config.cardPadding)}>
          {/* Testimonial text */}
          <blockquote className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            "{truncateText(content?.testimonial || 'No testimonial provided', config.testimonialLength)}"
          </blockquote>

          {/* Project association */}
          {config.showProject && content?.projectAssociation && (
            <div className="mb-3">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Project:</span> {content.projectAssociation}
              </p>
            </div>
          )}

          {/* Skills mentioned */}
          {config.showSkills && content?.skills && content.skills.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-1">Skills mentioned:</p>
              <div className="flex flex-wrap gap-1">
                {content.skills.slice(0, variant === 'featured' ? 6 : 4).map((skill, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs px-2 py-0.5"
                  >
                    {skill}
                  </Badge>
                ))}
                {content.skills.length > (variant === 'featured' ? 6 : 4) && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    +{content.skills.length - (variant === 'featured' ? 6 : 4)} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Work period */}
          {config.showFullProfile && content?.workPeriod && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Period:</span>{' '}
              {new Date(content.workPeriod.start).toLocaleDateString()} - {' '}
              {content.workPeriod.end
                ? new Date(content.workPeriod.end).toLocaleDateString()
                : 'Present'
              }
            </div>
          )}

          {/* Admin actions */}
          {showActions && (
            <div className="flex gap-2 mt-4 pt-4 border-t">
              <button className="text-xs px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors">
                Approve
              </button>
              <button className="text-xs px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors">
                Reject
              </button>
              <button className="text-xs px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors">
                Feature
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </MotionDiv>
  );
};

export default ReviewCard;
'use client';

/**
 * Testimonials Search Component
 * 
 * Advanced search and filtering interface for testimonials with
 * real-time search, filters, and layout controls.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { MotionDiv } from '@/lib/motion-utils';
import { cn } from '@/lib/utils';
// Custom debounce implementation
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

interface SearchFilters {
  search: string;
  minRating?: number;
  relationship?: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface TestimonialsSearchProps {
  filters: SearchFilters;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  loading?: boolean;
  layout: 'grid' | 'list' | 'masonry';
  onLayoutChange: (layout: 'grid' | 'list' | 'masonry') => void;
  className?: string;
}

/**
 * Relationship options for filtering
 */
const relationshipOptions = [
  { value: 'professor', label: 'Professor' },
  { value: 'colleague', label: 'Colleague' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'collaborator', label: 'Collaborator' },
  { value: 'client', label: 'Client' }
];

/**
 * Sort options
 */
const sortOptions = [
  { value: 'approvedAt', label: 'Most Recent' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'organization', label: 'Organization' }
];

/**
 * Layout Control Component
 */
interface LayoutControlProps {
  layout: 'grid' | 'list' | 'masonry';
  onLayoutChange: (layout: 'grid' | 'list' | 'masonry') => void;
}

const LayoutControl: React.FC<LayoutControlProps> = ({ layout, onLayoutChange }) => (
  <div className="flex items-center gap-1 border rounded-lg p-1">
    <Button
      variant={layout === 'grid' ? 'default' : 'ghost'}
      size="sm"
      onClick={() => onLayoutChange('grid')}
      className="px-3"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    </Button>
    <Button
      variant={layout === 'list' ? 'default' : 'ghost'}
      size="sm"
      onClick={() => onLayoutChange('list')}
      className="px-3"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    </Button>
    <Button
      variant={layout === 'masonry' ? 'default' : 'ghost'}
      size="sm"
      onClick={() => onLayoutChange('masonry')}
      className="px-3"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM14 5a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
      </svg>
    </Button>
  </div>
);

/**
 * Active Filters Display
 */
interface ActiveFiltersProps {
  filters: SearchFilters;
  onClearFilter: (key: keyof SearchFilters) => void;
  onClearAll: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({ filters, onClearFilter, onClearAll }) => {
  const activeFilters = [];

  if (filters.search) {
    activeFilters.push({
      key: 'search' as keyof SearchFilters,
      label: `Search: "${filters.search}"`
    });
  }

  if (filters.minRating) {
    activeFilters.push({
      key: 'minRating' as keyof SearchFilters,
      label: `Min Rating: ${filters.minRating}★`
    });
  }

  if (filters.relationship) {
    const relationshipLabel = relationshipOptions.find(opt => opt.value === filters.relationship)?.label;
    activeFilters.push({
      key: 'relationship' as keyof SearchFilters,
      label: `Relationship: ${relationshipLabel}`
    });
  }

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">Active filters:</span>
      {activeFilters.map(filter => (
        <Badge
          key={filter.key}
          variant="secondary"
          className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
          onClick={() => onClearFilter(filter.key)}
        >
          {filter.label}
          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="text-xs"
      >
        Clear All
      </Button>
    </div>
  );
};

/**
 * Testimonials Search Component
 */
export const TestimonialsSearch: React.FC<TestimonialsSearchProps> = ({
  filters,
  onFiltersChange,
  loading = false,
  layout,
  onLayoutChange,
  className
}) => {
  const [localSearch, setLocalSearch] = useState(filters.search);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      onFiltersChange({ search: searchTerm });
    }, 300),
    [onFiltersChange]
  );

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    debouncedSearch(value);
  };

  // Clear individual filter
  const handleClearFilter = (key: keyof SearchFilters) => {
    onFiltersChange({ [key]: undefined });
    if (key === 'search') {
      setLocalSearch('');
    }
  };

  // Clear all filters
  const handleClearAll = () => {
    setLocalSearch('');
    onFiltersChange({
      search: '',
      minRating: undefined,
      relationship: undefined
    });
  };

  // Update local search when filters change externally
  useEffect(() => {
    setLocalSearch(filters.search);
  }, [filters.search]);

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn('mb-8', className)}
    >
      <Card>
        <CardContent className="p-6">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Input
                  placeholder="Search testimonials, names, organizations..."
                  value={localSearch}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
                {localSearch && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => handleSearchChange('')}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                )}
              </div>
            </div>

            {/* Layout Control */}
            <LayoutControl layout={layout} onLayoutChange={onLayoutChange} />
          </div>

          {/* Filters Row */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Rating Filter */}
            <div className="flex-1">
              <Select
                value={filters.minRating ? filters.minRating.toString() : undefined}
                onValueChange={(value) => onFiltersChange({ 
                  minRating: value === 'any' ? undefined : parseInt(value) 
                })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Minimum Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Rating</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="3">3+ Stars</SelectItem>
                  <SelectItem value="2">2+ Stars</SelectItem>
                  <SelectItem value="1">1+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Relationship Filter */}
            <div className="flex-1">
              <Select
                value={filters.relationship ?? undefined}
                onValueChange={(value) => onFiltersChange({ 
                  relationship: value === 'all' ? undefined : value 
                })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Relationship Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Relationships</SelectItem>
                  {relationshipOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Options */}
            <div className="flex-1">
              <Select
                value={filters.sortBy}
                onValueChange={(value) => onFiltersChange({ sortBy: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <div className="flex-shrink-0">
              <Button
                variant="outline"
                onClick={() => onFiltersChange({ 
                  sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
                })}
                disabled={loading}
                className="px-3"
              >
                {filters.sortOrder === 'asc' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                  </svg>
                )}
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          <ActiveFilters
            filters={filters}
            onClearFilter={handleClearFilter}
            onClearAll={handleClearAll}
          />
        </CardContent>
      </Card>
    </MotionDiv>
  );
};
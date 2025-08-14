/**
 * Optimized Testimonial Context with Performance Enhancements
 * Implements clean code principles and efficient GET methods
 */

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { Testimonial } from "@/data/types";

// Clean Code Principle: "Name Things Like They Matter"
interface TestimonialContextType {
  testimonials: Testimonial[];
  loading: boolean;
  error: string | null;
  fetchTestimonials: (forceRefresh?: boolean) => Promise<void>;
  updateTestimonial: (id: string, updates: Partial<Testimonial>) => void;
  getTestimonialById: (id: string) => Testimonial | undefined;
  getFeaturedTestimonials: () => Testimonial[];
  getTestimonialsByRating: (minRating: number) => Testimonial[];
}

// Focused context - Single Responsibility Principle
const TestimonialContext = createContext<TestimonialContextType | undefined>(
  undefined,
);

// Simple testimonial service for now
const testimonialService = {
  async fetchAll(): Promise<Testimonial[]> {
    // Mock data for now - replace with actual API call
    return [
      {
        id: "1",
        name: "John Doe",
        role: "CTO",
        company: "Tech Corp",
        content: "Excellent work on our project.",
        rating: 5,
        featured: true,
        image: "/testimonial1.jpg",
      },
    ];
  },
};

// Optimized Provider with memoization
export function TestimonialProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized fetch function
  const fetchTestimonials = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const testimonialData = await testimonialService.fetchAll();
      setTestimonials(testimonialData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch testimonials";
      setError(errorMessage);
      console.error("Testimonial fetch error:", errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoized update function with immutable patterns
  const updateTestimonial = useCallback(
    (id: string, updates: Partial<Testimonial>) => {
      setTestimonials((prevTestimonials) =>
        prevTestimonials.map((testimonial) =>
          testimonial.id === id
            ? { ...testimonial, ...updates, lastUpdated: Date.now() }
            : testimonial,
        ),
      );
    },
    [],
  );

  // Memoized selector functions
  const getTestimonialById = useCallback(
    (id: string) => {
      return testimonials.find((testimonial) => testimonial.id === id);
    },
    [testimonials],
  );

  const getFeaturedTestimonials = useCallback(() => {
    return testimonials.filter((testimonial) => testimonial.featured);
  }, [testimonials]);

  const getTestimonialsByRating = useCallback(
    (minRating: number) => {
      return testimonials.filter(
        (testimonial) => testimonial.rating >= minRating,
      );
    },
    [testimonials],
  );

  // Auto-fetch on mount
  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  // Memoized context value
  const contextValue = useMemo(
    () => ({
      testimonials,
      loading,
      error,
      fetchTestimonials,
      updateTestimonial,
      getTestimonialById,
      getFeaturedTestimonials,
      getTestimonialsByRating,
    }),
    [
      testimonials,
      loading,
      error,
      fetchTestimonials,
      updateTestimonial,
      getTestimonialById,
      getFeaturedTestimonials,
      getTestimonialsByRating,
    ],
  );

  return (
    <TestimonialContext.Provider value={contextValue}>
      {children}
    </TestimonialContext.Provider>
  );
}

// Optimized custom hook with error handling
export function useTestimonialData(): TestimonialContextType {
  const context = useContext(TestimonialContext);
  if (context === undefined) {
    throw new Error(
      "useTestimonialData must be used within a TestimonialProvider",
    );
  }
  return context;
}

// Context selectors to prevent unnecessary re-renders
export function useTestimonialSelector<T>(
  selector: (context: TestimonialContextType) => T,
): T {
  const context = useTestimonialData();
  return useMemo(() => selector(context), [context, selector]);
}

// Specialized hooks for common use cases
export function useTestimonials() {
  return useTestimonialSelector((context) => context.testimonials);
}

export function useFeaturedTestimonials() {
  return useTestimonialSelector((context) => context.getFeaturedTestimonials());
}

export function useTestimonialLoading() {
  return useTestimonialSelector((context) => context.loading);
}

export function useTestimonialError() {
  return useTestimonialSelector((context) => context.error);
}

export function useTestimonialById(id: string) {
  return useTestimonialSelector((context) => context.getTestimonialById(id));
}

export function useHighRatedTestimonials(minRating = 4) {
  return useTestimonialSelector((context) =>
    context.getTestimonialsByRating(minRating),
  );
}

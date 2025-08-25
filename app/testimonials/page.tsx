/**
 * Testimonials Page
 * 
 * A dedicated page for displaying professional testimonials with SEO optimization,
 * social sharing, filtering, and search functionality.
 */

import React from 'react';
import { Metadata } from 'next';
import { TestimonialsPageClient } from './TestimonialsPageClient';
import { generateStructuredData } from '@/lib/seo';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Professional Testimonials | Mikhail Ajaj - Full-Stack Developer',
  description: 'Read testimonials from professors, colleagues, and clients about Mikhail Ajaj\'s work in full-stack development, cloud engineering, data analytics, and technical consulting.',
  keywords: [
    'testimonials',
    'reviews',
    'client feedback',
    'professional references',
    'full-stack developer',
    'cloud engineer',
    'data analyst',
    'technical consultant',
    'Mikhail Ajaj'
  ],
  authors: [{ name: 'Mikhail Ajaj' }],
  creator: 'Mikhail Ajaj',
  publisher: 'Mikhail Ajaj',
  
  // Open Graph
  openGraph: {
    title: 'Professional Testimonials | Mikhail Ajaj',
    description: 'Read testimonials from professors, colleagues, and clients about Mikhail Ajaj\'s professional work and expertise.',
    url: 'https://mikhailajaj.com/testimonials',
    siteName: 'Mikhail Ajaj Portfolio',
    type: 'website',
    images: [
      {
        url: 'https://mikhailajaj.com/og-testimonials.jpg',
        width: 1200,
        height: 630,
        alt: 'Mikhail Ajaj Professional Testimonials',
      },
    ],
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Testimonials | Mikhail Ajaj',
    description: 'Read testimonials from professors, colleagues, and clients about Mikhail Ajaj\'s professional work.',
    creator: '@mikhailajaj',
    images: ['https://mikhailajaj.com/og-testimonials.jpg'],
  },
  
  // Additional SEO
  alternates: {
    canonical: 'https://mikhailajaj.com/testimonials',
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

/**
 * Generate structured data for testimonials page
 */
function generateTestimonialsStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mikhailajaj.com';
  
  // Person schema for Mikhail Ajaj
  const personSchema = generateStructuredData.person({
    name: 'Mikhail Ajaj',
    jobTitle: 'Full-Stack Developer & Technical Consultant',
    url: baseUrl,
    image: `${baseUrl}/profile-image.jpg`,
    email: 'contact@mikhailajaj.com',
    sameAs: [
      'https://linkedin.com/in/mikhailajaj',
      'https://github.com/mikhailajaj',
      'https://twitter.com/mikhailajaj'
    ]
  });

  // Website schema
  const websiteSchema = generateStructuredData.website({
    name: 'Mikhail Ajaj Portfolio',
    url: baseUrl,
    description: 'Professional portfolio showcasing full-stack development, cloud engineering, and technical consulting services.',
    author: 'Mikhail Ajaj',
    potentialAction: {
      target: `${baseUrl}/search?q={search_term_string}`,
      queryInput: 'required name=search_term_string'
    }
  });

  // Testimonials collection schema
  const testimonialsSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Professional Testimonials',
    description: 'Collection of testimonials from professors, colleagues, and clients about Mikhail Ajaj\'s professional work.',
    url: `${baseUrl}/testimonials`,
    author: {
      '@type': 'Person',
      name: 'Mikhail Ajaj'
    },
    mainEntity: {
      '@type': 'ItemList',
      name: 'Professional Testimonials',
      description: 'Testimonials and reviews from professional collaborators',
      numberOfItems: 0, // Will be updated dynamically
      itemListElement: [] // Will be populated with actual testimonials
    }
  };

  return [personSchema, websiteSchema, testimonialsSchema];
}

/**
 * Testimonials Page Component
 */
export default function TestimonialsPage() {
  const structuredData = generateTestimonialsStructuredData();

  return (
    <>
      {/* Structured Data */}
      {structuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema)
          }}
        />
      ))}
      
      {/* Page Content */}
      <TestimonialsPageClient />
    </>
  );
}
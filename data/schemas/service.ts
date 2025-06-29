import { Domain, Technology } from './project';

export interface ServicePricing {
  type: 'fixed' | 'hourly' | 'project' | 'retainer';
  range: string;
  currency: 'USD' | 'CAD' | 'EUR';
  description?: string;
}

export interface ServiceDeliverable {
  name: string;
  description: string;
  timeline: string;
  included: boolean;
}

export interface ServiceTestimonial {
  clientName: string;
  clientTitle: string;
  clientCompany: string;
  content: string;
  rating: number;
  projectId?: string;
}

export interface Service {
  id: string;
  domain: Domain;
  title: string;
  description: string;
  shortDescription: string;
  capabilities: string[];
  deliverables: ServiceDeliverable[];
  timeline: string;
  pricing?: ServicePricing;
  technologies: Technology[];
  relatedProjects: string[];
  testimonials: ServiceTestimonial[];
  featured: boolean;
  available: boolean;
  ctaText: string;
  ctaUrl: string;
  benefits: string[];
  process: {
    step: number;
    title: string;
    description: string;
    duration: string;
  }[];
}

export interface ServiceInquiry {
  serviceId: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  projectDescription: string;
  budget?: string;
  timeline?: string;
  requirements: string[];
  contactMethod: 'email' | 'phone' | 'video';
  urgency: 'low' | 'medium' | 'high';
}
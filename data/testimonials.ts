export interface Testimonial {
  id: string;
  client: string;
  role: string;
  company: string;
  testimonial: string;
  project: string;
  projectId?: string;
  rating: number;
  image?: string;
  date: string;
  featured: boolean;
  category: 'full-stack' | 'cloud' | 'data' | 'consulting' | 'ux-ui';
}

export const testimonials: Testimonial[] = [
  {
    id: "testimonial-1",
    client: "Sarah Johnson",
    role: "HR Director",
    company: "TechCorp Solutions",
    testimonial: "This app completely transformed our company's holiday party planning. What used to take weeks of coordination now happens seamlessly in minutes. The automated name drawing and preference matching eliminated all the usual confusion and stress.",
    project: "Secret Santa Holiday Exchange App",
    projectId: "secret-santa-app",
    rating: 5,
    image: "/testimonials/sarah-johnson.jpg",
    date: "2024-01-15",
    featured: true,
    category: "full-stack"
  },
  {
    id: "testimonial-2",
    client: "Michael Chen",
    role: "CTO",
    company: "InnovateTech",
    testimonial: "The automation platform transformed our deployment process. We went from dreading releases to deploying multiple times per day with confidence. The cost savings and reliability improvements exceeded our expectations.",
    project: "Cloud Infrastructure Automation Platform",
    projectId: "cloud-infrastructure-automation",
    rating: 5,
    image: "/testimonials/michael-chen.jpg",
    date: "2024-02-20",
    featured: true,
    category: "cloud"
  },
  {
    id: "testimonial-3",
    client: "Lisa Rodriguez",
    role: "Marketing Director",
    company: "RetailMax",
    testimonial: "The analytics platform gave us insights we never had before. We can now predict customer behavior and optimize our strategies in real-time. The ROI was evident within the first month of implementation.",
    project: "Customer Behavior Analytics Platform",
    projectId: "data-analytics-dashboard",
    rating: 5,
    image: "/testimonials/lisa-rodriguez.jpg",
    date: "2024-03-10",
    featured: true,
    category: "data"
  },
  {
    id: "testimonial-4",
    client: "David Park",
    role: "Product Manager",
    company: "StartupXYZ",
    testimonial: "Mikhail's consulting approach using the BMAD methodology helped us identify and solve critical technical debt issues that were blocking our growth. His systematic approach and clear communication made the complex simple.",
    project: "Technical Consulting & Code Review",
    rating: 5,
    date: "2024-01-30",
    featured: true,
    category: "consulting"
  },
  {
    id: "testimonial-5",
    client: "Emily Watson",
    role: "Founder",
    company: "DesignStudio Pro",
    testimonial: "The UX audit and redesign recommendations were spot-on. User engagement increased by 40% after implementing the suggested changes. Mikhail has a great eye for both technical implementation and user experience.",
    project: "UX/UI Design Consultation",
    rating: 5,
    date: "2024-02-05",
    featured: false,
    category: "ux-ui"
  },
  {
    id: "testimonial-6",
    client: "Robert Kim",
    role: "Engineering Manager",
    company: "DataFlow Inc",
    testimonial: "Working with Mikhail on our data pipeline optimization was a game-changer. His deep understanding of both cloud architecture and data processing helped us reduce costs by 35% while improving performance.",
    project: "Data Pipeline Optimization",
    rating: 5,
    date: "2024-03-25",
    featured: false,
    category: "data"
  }
];

// Helper functions
export const getFeaturedTestimonials = () => testimonials.filter(t => t.featured);

export const getTestimonialsByCategory = (category: string) => 
  testimonials.filter(t => t.category === category);

export const getTestimonialByProject = (projectId: string) => 
  testimonials.find(t => t.projectId === projectId);

export const getAverageRating = () => {
  const total = testimonials.reduce((sum, t) => sum + t.rating, 0);
  return (total / testimonials.length).toFixed(1);
};

// Legacy compatibility
export const legacyTestimonials = [
  {
    quote: "Working with Mikhail has been an exceptional experience. His technical expertise and professional approach delivered results beyond our expectations.",
    name: "Sarah Johnson",
    title: "HR Director at TechCorp Solutions",
  },
  {
    quote: "The BMAD methodology and systematic approach to problem-solving made our complex project manageable and successful.",
    name: "Michael Chen",
    title: "CTO at InnovateTech",
  },
  {
    quote: "Mikhail's ability to understand both technical requirements and business needs resulted in a solution that perfectly fit our goals.",
    name: "Lisa Rodriguez",
    title: "Marketing Director at RetailMax",
  }
];
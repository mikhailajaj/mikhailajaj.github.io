#!/bin/bash

# Consolidate Service Components Script
# Merges 5 domain-specific service components into 1 configurable component

set -e

echo "🔄 Consolidating Service Components..."
echo "Pattern: Universal component with domain-specific data (proven with domain heroes)"

# Analyze current service components
echo "📋 Current service components:"
find components/domain-specific/ -name "*Services.tsx" | sort

echo ""
echo "📝 Creating consolidated ServiceGrid component..."

# Create the new consolidated service component
cat > components/ui/ServiceGrid.tsx << 'EOF'
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DomainConfig } from "@/lib/constants/domains";

interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  pricing?: {
    starting: string;
    description: string;
  };
  icon?: React.ReactNode;
  popular?: boolean;
}

interface ServiceGridProps {
  domain: DomainConfig;
  services: Service[];
  layout?: 'grid' | 'list' | 'cards';
  showPricing?: boolean;
  showFeatures?: boolean;
  className?: string;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({
  domain,
  services,
  layout = 'grid',
  showPricing = true,
  showFeatures = true,
  className
}) => {
  // Handle hydration for animations
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use domain color directly from domain config
  const domainColor = domain.color || '#3B82F6';

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  const gridClasses = {
    grid: "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
    list: "space-y-6",
    cards: "grid md:grid-cols-2 gap-8"
  };

  return (
    <section 
      className={cn("py-20 bg-background", className)}
      style={{
        '--domain-primary': domainColor,
        '--domain-secondary': domainColor,
      } as React.CSSProperties}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={isMounted ? { opacity: 0, y: 20 } : false}
          animate={isMounted ? { opacity: 1, y: 0 } : false}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {domain.name} Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional {domain.name.toLowerCase()} solutions tailored to your business needs
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial={isMounted ? "initial" : false}
          animate={isMounted ? "animate" : false}
          variants={containerVariants}
          className={gridClasses[layout]}
        >
          {services.map((service, index) => (
            <motion.div key={service.id} variants={itemVariants}>
              <Card className={cn(
                "h-full relative overflow-hidden",
                service.popular && "ring-2 ring-[var(--domain-primary)] ring-opacity-50"
              )}>
                {service.popular && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-[var(--domain-primary)] text-white px-3 py-1 rounded-full text-sm font-medium">
                      Popular
                    </span>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    {service.icon && (
                      <div className="text-[var(--domain-primary)] text-2xl">
                        {service.icon}
                      </div>
                    )}
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  {showFeatures && service.features.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">What's Included:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-2">
                            <span className="text-[var(--domain-primary)] mt-1">✓</span>
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Pricing */}
                  {showPricing && service.pricing && (
                    <div className="border-t pt-4">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-2xl font-bold text-[var(--domain-primary)]">
                          {service.pricing.starting}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {service.pricing.description}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* CTA Button */}
                  <div className="pt-4">
                    <Link href="/contact">
                      <Button 
                        className="w-full bg-[var(--domain-primary)] hover:bg-[var(--domain-primary)]/90"
                        size="lg"
                      >
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={isMounted ? { opacity: 0, y: 20 } : false}
          animate={isMounted ? { opacity: 1, y: 0 } : false}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-muted-foreground mb-6">
            Need a custom solution? Let's discuss your specific requirements.
          </p>
          <Link href="/contact">
            <Button variant="outline" size="lg">
              Schedule Consultation
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceGrid;
EOF

echo "✅ Created consolidated ServiceGrid component"

# Create service data file
echo "📝 Creating service data structure..."

cat > lib/data/serviceData.ts << 'EOF'
// Domain-specific service data for ServiceGrid component

export const domainServices = {
  'full-stack': [
    {
      id: 'web-development',
      title: 'Web Application Development',
      description: 'Custom web applications built with modern technologies',
      features: [
        'React/Next.js frontend development',
        'Node.js/Express backend APIs',
        'Database design and optimization',
        'Authentication and security',
        'Responsive design implementation',
        'Performance optimization'
      ],
      pricing: {
        starting: '$5,000',
        description: 'starting price'
      },
      icon: '🚀',
      popular: true
    },
    {
      id: 'api-development',
      title: 'API Development & Integration',
      description: 'RESTful APIs and third-party integrations',
      features: [
        'RESTful API design',
        'GraphQL implementation',
        'Third-party API integration',
        'API documentation',
        'Rate limiting and security',
        'Testing and monitoring'
      ],
      pricing: {
        starting: '$3,000',
        description: 'starting price'
      },
      icon: '🔗'
    },
    {
      id: 'maintenance',
      title: 'Application Maintenance',
      description: 'Ongoing support and feature development',
      features: [
        'Bug fixes and updates',
        'Performance monitoring',
        'Security patches',
        'Feature enhancements',
        'Technical support',
        'Documentation updates'
      ],
      pricing: {
        starting: '$1,500',
        description: 'per month'
      },
      icon: '🛠️'
    }
  ],
  'cloud': [
    {
      id: 'cloud-migration',
      title: 'Cloud Migration',
      description: 'Seamless migration to AWS cloud infrastructure',
      features: [
        'Infrastructure assessment',
        'Migration strategy planning',
        'AWS setup and configuration',
        'Data migration',
        'Performance optimization',
        'Cost optimization'
      ],
      pricing: {
        starting: '$8,000',
        description: 'starting price'
      },
      icon: '☁️',
      popular: true
    },
    {
      id: 'devops-automation',
      title: 'DevOps & Automation',
      description: 'CI/CD pipelines and infrastructure automation',
      features: [
        'CI/CD pipeline setup',
        'Infrastructure as Code',
        'Automated testing',
        'Monitoring and alerting',
        'Container orchestration',
        'Security automation'
      ],
      pricing: {
        starting: '$6,000',
        description: 'starting price'
      },
      icon: '⚙️'
    },
    {
      id: 'cloud-consulting',
      title: 'Cloud Architecture Consulting',
      description: 'Strategic cloud architecture planning',
      features: [
        'Architecture review',
        'Best practices guidance',
        'Cost optimization strategies',
        'Security assessment',
        'Scalability planning',
        'Technology recommendations'
      ],
      pricing: {
        starting: '$2,000',
        description: 'per week'
      },
      icon: '🏗️'
    }
  ],
  'data': [
    {
      id: 'data-analytics',
      title: 'Data Analytics & BI',
      description: 'Business intelligence and data visualization',
      features: [
        'Data pipeline development',
        'Power BI dashboard creation',
        'Data warehouse design',
        'ETL process automation',
        'Performance metrics tracking',
        'Custom reporting solutions'
      ],
      pricing: {
        starting: '$4,000',
        description: 'starting price'
      },
      icon: '📊',
      popular: true
    },
    {
      id: 'machine-learning',
      title: 'Machine Learning Solutions',
      description: 'Custom ML models and predictive analytics',
      features: [
        'Predictive model development',
        'Data preprocessing',
        'Model training and validation',
        'ML pipeline automation',
        'Performance monitoring',
        'Model deployment'
      ],
      pricing: {
        starting: '$7,000',
        description: 'starting price'
      },
      icon: '🤖'
    },
    {
      id: 'data-consulting',
      title: 'Data Strategy Consulting',
      description: 'Strategic data initiatives and governance',
      features: [
        'Data strategy development',
        'Governance framework',
        'Technology assessment',
        'ROI analysis',
        'Implementation roadmap',
        'Team training'
      ],
      pricing: {
        starting: '$3,000',
        description: 'per week'
      },
      icon: '📈'
    }
  ],
  'ux-ui': [
    {
      id: 'ux-design',
      title: 'UX Research & Design',
      description: 'User-centered design and research',
      features: [
        'User research and interviews',
        'Persona development',
        'User journey mapping',
        'Wireframing and prototyping',
        'Usability testing',
        'Design system creation'
      ],
      pricing: {
        starting: '$3,500',
        description: 'starting price'
      },
      icon: '🎨',
      popular: true
    },
    {
      id: 'ui-development',
      title: 'UI Development',
      description: 'Frontend implementation and optimization',
      features: [
        'Responsive design implementation',
        'Component library development',
        'Accessibility optimization',
        'Performance optimization',
        'Cross-browser compatibility',
        'Animation and interactions'
      ],
      pricing: {
        starting: '$4,000',
        description: 'starting price'
      },
      icon: '💻'
    },
    {
      id: 'design-systems',
      title: 'Design System Development',
      description: 'Scalable design systems and style guides',
      features: [
        'Design token creation',
        'Component library',
        'Style guide documentation',
        'Brand guidelines',
        'Accessibility standards',
        'Implementation guidelines'
      ],
      pricing: {
        starting: '$5,000',
        description: 'starting price'
      },
      icon: '🔧'
    }
  ],
  'consulting': [
    {
      id: 'technical-strategy',
      title: 'Technical Strategy Consulting',
      description: 'Strategic technology planning and architecture',
      features: [
        'Technology assessment',
        'Architecture planning',
        'Digital transformation strategy',
        'Technology roadmap',
        'Risk assessment',
        'Implementation planning'
      ],
      pricing: {
        starting: '$4,000',
        description: 'per week'
      },
      icon: '📋',
      popular: true
    },
    {
      id: 'team-leadership',
      title: 'Technical Team Leadership',
      description: 'Team building and technical leadership',
      features: [
        'Team structure planning',
        'Hiring and recruitment',
        'Process optimization',
        'Agile implementation',
        'Performance management',
        'Technical mentoring'
      ],
      pricing: {
        starting: '$3,500',
        description: 'per week'
      },
      icon: '👥'
    },
    {
      id: 'project-rescue',
      title: 'Project Rescue & Recovery',
      description: 'Troubled project assessment and recovery',
      features: [
        'Project assessment',
        'Risk identification',
        'Recovery planning',
        'Team restructuring',
        'Process improvement',
        'Delivery acceleration'
      ],
      pricing: {
        starting: '$5,000',
        description: 'per week'
      },
      icon: '🚨'
    }
  ]
};
EOF

echo "✅ Created service data structure"

echo ""
echo "📋 Next steps:"
echo "1. Update domain service pages to use new ServiceGrid component"
echo "2. Test all domain service sections"
echo "3. Remove old service components after testing"
echo ""
echo "🎯 Expected savings: 4 components removed"
echo "📦 Bundle size reduction: ~20KB (estimated)"
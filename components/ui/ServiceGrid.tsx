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
                      <h4 className="font-semibold mb-3">What’s Included:</h4>
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
            Need a custom solution? Let&apos;s discuss your specific requirements.
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

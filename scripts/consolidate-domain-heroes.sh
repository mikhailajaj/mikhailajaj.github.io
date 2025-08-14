#!/bin/bash

# Consolidate Domain Hero Components
# Merges 5 domain-specific hero components into 1 configurable component

set -e

echo "🎯 Consolidating Domain Hero Components..."

# Create the new consolidated component
echo "📝 Creating consolidated DomainHero component..."

cat > components/ui/DomainHero.tsx << 'EOF'
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useDomainTheme } from "@/lib/contexts/DomainThemeContext";
import type { DomainConfig } from "@/lib/constants/domains";

interface Achievement {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface DomainHeroProps {
  domain: DomainConfig;
  achievements: Achievement[];
  technologies: string[];
  featuredProjects?: Array<{
    title: string;
    description: string;
    technologies: string[];
    url?: string;
  }>;
  className?: string;
}

export const DomainHero: React.FC<DomainHeroProps> = ({
  domain,
  achievements,
  technologies,
  featuredProjects = [],
  className
}) => {
  const { theme } = useDomainTheme(domain.id);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(
        "relative min-h-screen flex items-center justify-center",
        "bg-gradient-to-br from-background to-muted",
        className
      )}
      style={{
        '--domain-primary': theme.colors.primary,
        '--domain-secondary': theme.colors.secondary,
      } as React.CSSProperties}
    >
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Hero Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6"
            >
              <domain.icon className="w-16 h-16 mx-auto mb-4 text-[var(--domain-primary)]" />
            </motion.div>
            
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              {domain.name}
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
            >
              {domain.description}
            </motion.p>
          </div>

          {/* Achievement Metrics */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {achievements.map((achievement, index) => (
              <Card key={index} className="p-6 text-center">
                {achievement.icon && (
                  <div className="mb-3 text-[var(--domain-primary)]">
                    {achievement.icon}
                  </div>
                )}
                <div className="text-2xl md:text-3xl font-bold mb-2 text-[var(--domain-primary)]">
                  {achievement.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {achievement.label}
                </div>
              </Card>
            ))}
          </motion.div>

          {/* Technology Stack */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-center mb-8">
              Technology Expertise
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-muted rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Featured Projects */}
          {featuredProjects.length > 0 && (
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold text-center mb-8">
                Featured Projects
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProjects.slice(0, 3).map((project, index) => (
                  <Card key={index} className="p-6">
                    <h3 className="text-lg font-semibold mb-3">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-muted rounded text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    {project.url && (
                      <Link href={project.url}>
                        <Button variant="outline" size="sm">
                          View Project
                        </Button>
                      </Link>
                    )}
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Call to Action */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/projects">
                <Button size="lg" className="bg-[var(--domain-primary)] hover:bg-[var(--domain-primary)]/90">
                  View All Projects
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Start a Project
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default DomainHero;
EOF

echo "✅ Created consolidated DomainHero component"

# Create migration script for updating imports
echo "📝 Creating migration script for domain hero imports..."

cat > scripts/migrate-domain-hero-imports.sh << 'EOF'
#!/bin/bash

# Migrate domain hero imports to use consolidated component

echo "🔄 Migrating domain hero imports..."

# Update full-stack page
if [ -f "app/full-stack/page.tsx" ]; then
  sed -i.bak 's/import.*FullStackHero.*from.*domain-specific\/full-stack\/FullStackHero/import { DomainHero } from "@\/components\/ui\/DomainHero"/g' app/full-stack/page.tsx
  sed -i.bak 's/<FullStackHero/<DomainHero domain={DOMAINS.FULL_STACK} achievements={fullStackAchievements} technologies={fullStackTechnologies}/g' app/full-stack/page.tsx
fi

# Update cloud engineering page
if [ -f "app/cloud-engineering/page.tsx" ]; then
  sed -i.bak 's/import.*CloudHero.*from.*domain-specific\/cloud\/CloudHero/import { DomainHero } from "@\/components\/ui\/DomainHero"/g' app/cloud-engineering/page.tsx
  sed -i.bak 's/<CloudHero/<DomainHero domain={DOMAINS.CLOUD_ENGINEERING} achievements={cloudAchievements} technologies={cloudTechnologies}/g' app/cloud-engineering/page.tsx
fi

# Update data analytics page
if [ -f "app/data-analytics/page.tsx" ]; then
  sed -i.bak 's/import.*DataHero.*from.*domain-specific\/data\/DataHero/import { DomainHero } from "@\/components\/ui\/DomainHero"/g' app/data-analytics/page.tsx
  sed -i.bak 's/<DataHero/<DomainHero domain={DOMAINS.DATA_ANALYTICS} achievements={dataAchievements} technologies={dataTechnologies}/g' app/data-analytics/page.tsx
fi

# Update UX/UI design page
if [ -f "app/ux-ui-design/page.tsx" ]; then
  sed -i.bak 's/import.*UXUIHero.*from.*domain-specific\/ux-ui\/UXUIHero/import { DomainHero } from "@\/components\/ui\/DomainHero"/g' app/ux-ui-design/page.tsx
  sed -i.bak 's/<UXUIHero/<DomainHero domain={DOMAINS.UX_UI_DESIGN} achievements={uxuiAchievements} technologies={uxuiTechnologies}/g' app/ux-ui-design/page.tsx
fi

# Update technical consulting page
if [ -f "app/technical-consulting/page.tsx" ]; then
  sed -i.bak 's/import.*ConsultingHero.*from.*domain-specific\/consulting\/ConsultingHero/import { DomainHero } from "@\/components\/ui\/DomainHero"/g' app/technical-consulting/page.tsx
  sed -i.bak 's/<ConsultingHero/<DomainHero domain={DOMAINS.TECHNICAL_CONSULTING} achievements={consultingAchievements} technologies={consultingTechnologies}/g' app/technical-consulting/page.tsx
fi

echo "✅ Migration complete! Please review the changes and test functionality."
echo "💡 Backup files created with .bak extension"
EOF

chmod +x scripts/migrate-domain-hero-imports.sh

echo "📋 Next steps:"
echo "1. Review the new DomainHero component: components/ui/DomainHero.tsx"
echo "2. Run migration script: ./scripts/migrate-domain-hero-imports.sh"
echo "3. Update domain pages to use new component with proper props"
echo "4. Test all domain pages to ensure functionality"
echo "5. Remove old domain hero components after testing"
echo ""
echo "🎯 Expected savings: 4 components removed"
echo "📦 Bundle size reduction: ~15KB (estimated)"
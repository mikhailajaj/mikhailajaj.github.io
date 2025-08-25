"use client";
import React from "react";
// AnimatedBentoGrid components removed as requested
import { gridItems } from "@/data/gridItems";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Define types for grid items
interface GridItem {
  id: number;
  title: string;
  description: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  icons?: (string | React.ComponentType)[];
  image?: {
    src: string;
    alt: string;
  };
}

const IconRenderer: React.FC<{ icon: string | React.ComponentType }> = ({
  icon,
}) => {
  const IconComponent = icon;
  return <IconComponent className="w-5 h-5" />;
};

const DescriptionRenderer: React.FC<{
  description: string | React.ComponentType;
}> = ({ description }) => {
  if (typeof description === "string") {
    return <>{description}</>;
  } else {
    const DescriptionComponent = description;
    return (
      <DescriptionComponent className="w-fit flex align-center justify-center" />
    );
  }
};

const GridItemHeader: React.FC<{
  image?: GridItem["image"];
  icons?: GridItem["icons"];
}> = ({ image, icons }) => {
  if (!image) {
    return (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100" />
    );
  }

  return (
    <div className="relative flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden group">
      <Image
        src={image.src}
        alt={image.alt}
        width={300}
        height={200}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />

      {/* Enhanced overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      />
    </div>
  );
};

const GridIcons: React.FC<{
  icons?: GridItem["icons"];
}> = ({ icons }) => {
  if (!icons || icons.length === 0) return null;

  return (
    <motion.div
      className="flex bottom-2 left-2 gap-2 bg-black/20 dark:bg-white/10 backdrop-blur-sm rounded-full p-2 border border-white/10"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {icons.map((icon, index) => (
        <motion.div
          key={index}
          className="flex items-center justify-center"
          whileHover={{ scale: 1.2, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <IconRenderer icon={icon} />
        </motion.div>
      ))}
    </motion.div>
  );
};

const AboutMeGrid: React.FC = () => {
  return (
    <section id="about" className="w-full py-20">
      {/* Section header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent mb-4">
          About Me
        </h2>
        <p className="text-lg text-neutral-700 dark:text-neutral-200 max-w-2xl mx-auto">
          Discover my journey, skills, and the technologies I work with
        </p>
      </motion.div>

      {/* Simple grid layout replacing AnimatedBentoGrid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {gridItems.map((item: any, index: number) => (
          <motion.div
            key={item.id}
            className={cn(
              "p-6 bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-all duration-300",
              item.className
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            {/* Header with image */}
            <div className="mb-4">
              <GridItemHeader image={item.image} />
            </div>
            
            {/* Content */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-card-foreground">
                {item.title}
              </h3>
              <div className="text-muted-foreground text-sm">
                <DescriptionRenderer description={item.description} />
              </div>
              
              {/* Icons */}
              {item.icons && (
                <div className="pt-2">
                  <GridIcons icons={item.icons} />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AboutMeGrid;

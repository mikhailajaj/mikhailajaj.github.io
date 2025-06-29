import React from 'react';
import { motion } from 'framer-motion';

interface ServiceHeroProps {
  title: React.ReactNode;
  subtitle: string;
  backgroundImage?: string;
}

const ServiceHero: React.FC<ServiceHeroProps> = ({ title, subtitle, backgroundImage }) => {
  return (
    <section 
      className="relative py-24 px-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage || '/path/to/default-hero.jpg'})` }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="relative max-w-7xl mx-auto text-center text-white">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          {title}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl max-w-3xl mx-auto"
        >
          {subtitle}
        </motion.p>
      </div>
    </section>
  );
};

export default ServiceHero;

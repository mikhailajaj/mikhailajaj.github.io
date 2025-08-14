import React from "react";
import { SafeMotionDiv } from "@/components/ui/MotionComponents";

interface ServiceHeroProps {
  title: React.ReactNode;
  subtitle: string;
  backgroundImage?: string;
}

const ServiceHero: React.FC<ServiceHeroProps> = ({
  title,
  subtitle,
  backgroundImage,
}) => {
  return (
    <section
      className="relative py-24 px-4 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${backgroundImage || "/path/to/default-hero.jpg"})`,
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="relative max-w-7xl mx-auto text-center text-white">
        <SafeMotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          <h1>{title}</h1>
        </SafeMotionDiv>
        <SafeMotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl max-w-3xl mx-auto"
        >
          <p>{subtitle}</p>
        </SafeMotionDiv>
      </div>
    </section>
  );
};

export default ServiceHero;

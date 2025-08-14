import React from "react";
import { DynamicCalculator as ClientROICalculator } from "@/components/ui/DynamicLoader";
import AssessmentTool from "@/components/interactive/AssessmentTool";
import {
  LazyInteractiveSection,
  ProgressiveContainer,
} from "@/components/ui/LazySection";

const ToolsPage = () => {
  return (
    <div className="pt-10 container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-white">
        Interactive Tools
      </h1>
      <p className="text-center text-gray-300 mb-12 max-w-3xl mx-auto">
        Explore our suite of interactive tools designed to help you make
        informed decisions about your projects, technology stack, and business
        investments.
      </p>

      <ProgressiveContainer staggerDelay={200} className="space-y-12">
        <LazyInteractiveSection
          title="ROI Calculator"
          description="Calculate return on investment for your projects with advanced analytics"
          className="w-full"
        >
          <ClientROICalculator />
        </LazyInteractiveSection>

        <LazyInteractiveSection
          title="Assessment Tool"
          description="Evaluate project complexity and requirements"
          className="w-full"
        >
          <AssessmentTool />
        </LazyInteractiveSection>
      </ProgressiveContainer>
    </div>
  );
};

export default ToolsPage;

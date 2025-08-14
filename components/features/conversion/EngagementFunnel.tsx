"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaBuilding,
  FaComment,
  FaRocket,
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft,
  FaCalendarAlt,
  FaPhone,
  FaLinkedin,
  FaDownload,
  FaPlay,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface EngagementStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  fields: FormField[];
  cta: string;
  benefits: string[];
}

interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "select" | "textarea" | "checkbox" | "radio";
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: (value: string) => string | null;
}

interface FormData {
  [key: string]: string | boolean | string[];
}

interface EngagementFunnelProps {
  onComplete?: (data: FormData) => void;
  showProgressBar?: boolean;
  allowSkipSteps?: boolean;
  customSteps?: EngagementStep[];
}

const defaultSteps: EngagementStep[] = [
  {
    id: "interest",
    title: "What interests you most?",
    description: "Help us understand your primary focus area",
    icon: FaRocket,
    cta: "Continue",
    benefits: [
      "Personalized recommendations",
      "Relevant case studies",
      "Tailored solutions"
    ],
    fields: [
      {
        name: "primaryInterest",
        label: "Primary Interest",
        type: "radio",
        required: true,
        options: [
          { value: "full-stack", label: "Full-Stack Development" },
          { value: "cloud", label: "Cloud Architecture & DevOps" },
          { value: "data", label: "Data Analytics & Engineering" },
          { value: "ux-ui", label: "UX/UI Design & Research" },
          { value: "consulting", label: "Technical Consulting" },
          { value: "multiple", label: "Multiple Services" }
        ]
      },
      {
        name: "urgency",
        label: "Timeline",
        type: "select",
        required: true,
        options: [
          { value: "immediate", label: "Immediate (within 1 month)" },
          { value: "short", label: "Short-term (1-3 months)" },
          { value: "medium", label: "Medium-term (3-6 months)" },
          { value: "long", label: "Long-term (6+ months)" },
          { value: "exploring", label: "Just exploring options" }
        ]
      }
    ]
  },
  {
    id: "project",
    title: "Tell us about your project",
    description: "Share details about your specific needs",
    icon: FaBuilding,
    cta: "Next Step",
    benefits: [
      "Accurate project estimation",
      "Technology recommendations",
      "Resource planning"
    ],
    fields: [
      {
        name: "projectType",
        label: "Project Type",
        type: "select",
        required: true,
        options: [
          { value: "new-development", label: "New Development Project" },
          { value: "modernization", label: "Legacy System Modernization" },
          { value: "optimization", label: "Performance Optimization" },
          { value: "migration", label: "Cloud Migration" },
          { value: "consulting", label: "Technical Consulting" },
          { value: "audit", label: "System Audit & Review" }
        ]
      },
      {
        name: "budget",
        label: "Budget Range",
        type: "select",
        required: true,
        options: [
          { value: "under-25k", label: "Under $25,000" },
          { value: "25k-50k", label: "$25,000 - $50,000" },
          { value: "50k-100k", label: "$50,000 - $100,000" },
          { value: "100k-250k", label: "$100,000 - $250,000" },
          { value: "over-250k", label: "Over $250,000" },
          { value: "discuss", label: "Let's discuss" }
        ]
      },
      {
        name: "projectDescription",
        label: "Project Description",
        type: "textarea",
        required: true,
        placeholder: "Describe your project goals, challenges, and requirements..."
      }
    ]
  },
  {
    id: "contact",
    title: "Let's connect",
    description: "Provide your contact information for personalized follow-up",
    icon: FaUser,
    cta: "Schedule Consultation",
    benefits: [
      "Free 30-minute consultation",
      "Custom project proposal",
      "No-obligation discussion"
    ],
    fields: [
      {
        name: "name",
        label: "Full Name",
        type: "text",
        required: true,
        placeholder: "Your full name"
      },
      {
        name: "email",
        label: "Email Address",
        type: "email",
        required: true,
        placeholder: "your.email@company.com",
        validation: (value) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value) ? null : "Please enter a valid email address";
        }
      },
      {
        name: "company",
        label: "Company",
        type: "text",
        required: true,
        placeholder: "Your company name"
      },
      {
        name: "role",
        label: "Your Role",
        type: "text",
        required: true,
        placeholder: "e.g., CTO, Product Manager, Founder"
      },
      {
        name: "phone",
        label: "Phone Number (Optional)",
        type: "text",
        required: false,
        placeholder: "+1 (555) 123-4567"
      },
      {
        name: "preferredContact",
        label: "Preferred Contact Method",
        type: "radio",
        required: true,
        options: [
          { value: "email", label: "Email" },
          { value: "phone", label: "Phone Call" },
          { value: "video", label: "Video Call" },
          { value: "linkedin", label: "LinkedIn Message" }
        ]
      }
    ]
  }
];

const EngagementFunnel: React.FC<EngagementFunnelProps> = ({
  onComplete,
  showProgressBar = true,
  allowSkipSteps = false,
  customSteps
}) => {
  const steps = customSteps || defaultSteps;
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || value === "")) {
      return `${field.label} is required`;
    }
    
    if (field.validation && value) {
      return field.validation(value);
    }
    
    return null;
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    currentStepData.fields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Clear error for this field
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: "" }));
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onComplete) {
        onComplete(formData);
      }
      
      setIsCompleted(true);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name] || "";
    const error = errors[field.name];

    switch (field.type) {
      case "text":
      case "email":
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={field.type}
              value={value as string}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                error ? "border-red-500" : "border-border focus:border-primary"
              }`}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case "textarea":
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={value as string}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-none ${
                error ? "border-red-500" : "border-border focus:border-primary"
              }`}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case "select":
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <select
              value={value as string}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                error ? "border-red-500" : "border-border focus:border-primary"
              }`}
            >
              <option value="">Select an option...</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case "radio":
        return (
          <div key={field.name} className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="space-y-2">
              {field.options?.map(option => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name={field.name}
                    value={option.value}
                    checked={value === option.value}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    className="w-4 h-4 text-primary border-border focus:ring-primary"
                  />
                  <span className="text-foreground">{option.label}</span>
                </label>
              ))}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <FaCheckCircle className="w-10 h-10 text-white" />
        </motion.div>
        
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Thank you for your interest!
        </h2>
        
        <p className="text-lg text-muted-foreground mb-8">
          I&apos;ll review your information and get back to you within 24 hours with a personalized proposal.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card/50 rounded-lg p-4">
            <FaCalendarAlt className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Free consultation scheduled</p>
          </div>
          <div className="bg-card/50 rounded-lg p-4">
            <FaDownload className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Resources sent to email</p>
          </div>
          <div className="bg-card/50 rounded-lg p-4">
            <FaPlay className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Next steps outlined</p>
          </div>
        </div>

        <div className="space-y-4">
          <Button size="lg" className="w-full md:w-auto">
            <FaCalendarAlt className="w-4 h-4 mr-2" />
            Schedule Follow-up Call
          </Button>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
            <span>Connect with me:</span>
            <a href="#" className="text-primary hover:text-primary/80">
              <FaLinkedin className="w-4 h-4" />
            </a>
            <a href="#" className="text-primary hover:text-primary/80">
              <FaEnvelope className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      {showProgressBar && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-card/80 backdrop-blur-md rounded-2xl p-8 border border-border/50"
        >
          {/* Step Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <currentStepData.icon className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-muted-foreground">
              {currentStepData.description}
            </p>
          </div>

          {/* Benefits */}
          <div className="bg-primary/5 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-foreground mb-3">What you&apos;ll get:</h3>
            <ul className="space-y-2">
              {currentStepData.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <FaCheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Form Fields */}
          <div className="space-y-6 mb-8">
            {currentStepData.fields.map(renderField)}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            <div className="flex items-center space-x-2">
              {allowSkipSteps && currentStep < steps.length - 1 && (
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="text-muted-foreground"
                >
                  Skip
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                disabled={isSubmitting}
                className="flex items-center space-x-2"
              >
                <span>
                  {isSubmitting ? "Submitting..." : currentStepData.cta}
                </span>
                {!isSubmitting && <FaArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default EngagementFunnel;
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Schemas for each step
const PersonalInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

const ProjectDetailsSchema = z.object({
  projectType: z.string().min(1, "Project type is required"),
  budget: z.string().optional(),
  timeline: z.string().optional(),
});

const MessageSchema = z.object({
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type PersonalInfo = z.infer<typeof PersonalInfoSchema>;
type ProjectDetails = z.infer<typeof ProjectDetailsSchema>;
type Message = z.infer<typeof MessageSchema>;

type FormData = PersonalInfo & ProjectDetails & Message;

const EnhancedContactForm = () => {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(
      step === 1
        ? PersonalInfoSchema
        : step === 2
          ? ProjectDetailsSchema
          : MessageSchema,
    ),
    mode: "onBlur",
  });

  const nextStep = async () => {
    const isValid = await trigger();
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const onSubmit = async (data: FormData) => {
    const isValid = await trigger();
    if (isValid) {
      console.log("Form Data:", data);
      // Here you would typically send the data to a backend API
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-8 border rounded-lg shadow-md bg-card text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
        <p className="text-lg">
          Your message has been sent successfully. We will get back to you
          shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 border rounded-lg shadow-md bg-card text-white max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Contact Us</h2>

      <div className="mb-6">
        <div className="flex justify-between mb-2 text-sm font-medium">
          <span className={step >= 1 ? "text-blue-400" : "text-muted-foreground"}>
            Personal Info
          </span>
          <span className={step >= 2 ? "text-blue-400" : "text-muted-foreground"}>
            Project Details
          </span>
          <span className={step >= 3 ? "text-blue-400" : "text-muted-foreground"}>
            Message
          </span>
        </div>
        <div className="w-full bg-card rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-muted-foreground"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                {...register("name")}
                className="mt-1 block w-full p-3 border border-border rounded-md shadow-sm bg-card text-white focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-muted-foreground"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className="mt-1 block w-full p-3 border border-border rounded-md shadow-sm bg-card text-white focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-muted-foreground"
              >
                Phone (Optional)
              </label>
              <input
                type="text"
                id="phone"
                {...register("phone")}
                className="mt-1 block w-full p-3 border border-border rounded-md shadow-sm bg-card text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="projectType"
                className="block text-sm font-medium text-muted-foreground"
              >
                Project Type
              </label>
              <input
                type="text"
                id="projectType"
                {...register("projectType")}
                className="mt-1 block w-full p-3 border border-border rounded-md shadow-sm bg-card text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Web Development, Mobile App, Data Analysis"
              />
              {errors.projectType && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.projectType.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="budget"
                className="block text-sm font-medium text-muted-foreground"
              >
                Budget (Optional)
              </label>
              <input
                type="text"
                id="budget"
                {...register("budget")}
                className="mt-1 block w-full p-3 border border-border rounded-md shadow-sm bg-card text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., $5,000 - $10,000"
              />
            </div>
            <div>
              <label
                htmlFor="timeline"
                className="block text-sm font-medium text-muted-foreground"
              >
                Timeline (Optional)
              </label>
              <input
                type="text"
                id="timeline"
                {...register("timeline")}
                className="mt-1 block w-full p-3 border border-border rounded-md shadow-sm bg-card text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 2-3 months"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-muted-foreground"
              >
                Your Message
              </label>
              <textarea
                id="message"
                {...register("message")}
                rows={6}
                className="mt-1 block w-full p-3 border border-border rounded-md shadow-sm bg-card text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell us more about your project and how we can help..."
              ></textarea>
              {errors.message && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.message.message}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2 border border-border rounded-md text-muted-foreground hover:bg-card focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Previous
            </button>
          )}

          {step < 3 && (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ml-auto"
            >
              Next
            </button>
          )}

          {step === 3 && (
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ml-auto"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EnhancedContactForm;

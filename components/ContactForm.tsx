/**
 * Contact Form Component
 *
 * Type-safe contact form with proper error handling and validation
 */

"use client";

import React, { useState } from "react";
import { useComponentLogger } from "@/lib/logging/LoggingIntegration";
import { useIsHydrated } from "@/lib/utils/hydration";
import {
  SafeMotionDiv,
  SafeMotionForm,
} from "@/components/ui/MotionComponents";

// ✅ Form data interface
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// ✅ Form validation interface
interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

// ✅ Submit status type
type SubmitStatus = "idle" | "submitting" | "success" | "error";

const ContactForm: React.FC = () => {
  const { logUserInteraction, logError } = useComponentLogger("ContactForm");
  const isHydrated = useIsHydrated();

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [submitMessage, setSubmitMessage] = useState<string>("");

  // ✅ Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // ✅ Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      logUserInteraction("form-validation-failed", "contact-form");
      return;
    }

    setSubmitStatus("submitting");
    logUserInteraction("form-submit-attempt", "contact-form");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real implementation, you would send the data to your API
      console.log("Form submitted:", formData);

      setSubmitStatus("success");
      setSubmitMessage(
        "Thank you for your message! I&apos;ll get back to you soon.",
      );

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      logUserInteraction("form-submit-success", "contact-form");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send message";
      setSubmitStatus("error");
      setSubmitMessage(
        "Sorry, there was an error sending your message. Please try again.",
      );
      logError("Form submission failed", error as Error);
    }
  };

  return (
    <section className={isHydrated ? "py-20 bg-background dark:bg-black" : "py-20 bg-background"}>
      <div className="max-w-4xl mx-auto px-4">
        <SafeMotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className={isHydrated ? "text-4xl md:text-5xl font-bold text-foreground mb-4" : "text-4xl md:text-5xl font-bold text-foreground mb-4"}>
            Get In Touch
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to start your next project? Let&apos;s discuss how I can help
            bring your ideas to life.
          </p>
        </SafeMotionDiv>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <SafeMotionDiv
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SafeMotionForm
              onSubmit={handleSubmit}
              className={isHydrated ? "bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border dark:bg-white/10 dark:border-white/20" : "bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border"}
            >
              <h3 className={isHydrated ? "text-2xl font-bold text-foreground mb-6" : "text-2xl font-bold text-foreground mb-6"}>
                Send a Message
              </h3>

              {/* Name Field */}
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-muted-foreground mb-2"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={isHydrated ? `w-full px-4 py-3 bg-input border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors dark:bg-white/10 dark:text-white dark:placeholder-gray-400 ${
                    errors.name ? "border-red-500" : "border-border dark:border-white/30"
                  }` : `w-full px-4 py-3 bg-input border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                    errors.name ? "border-red-500" : "border-border"
                  }`}
                  placeholder="Your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-muted-foreground mb-2"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={isHydrated ? `w-full px-4 py-3 bg-input border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors dark:bg-white/10 dark:text-white dark:placeholder-gray-400 ${
                    errors.email ? "border-red-500" : "border-border dark:border-white/30"
                  }` : `w-full px-4 py-3 bg-input border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                    errors.email ? "border-red-500" : "border-border"
                  }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Subject Field */}
              <div className="mb-6">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-muted-foreground mb-2"
                >
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={isHydrated ? `w-full px-4 py-3 bg-input border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors dark:bg-white/10 dark:text-white dark:placeholder-gray-400 ${
                    errors.subject ? "border-red-500" : "border-border dark:border-white/30"
                  }` : `w-full px-4 py-3 bg-input border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                    errors.subject ? "border-red-500" : "border-border"
                  }`}
                  placeholder="Project inquiry, consultation, etc."
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-400">{errors.subject}</p>
                )}
              </div>

              {/* Message Field */}
              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-muted-foreground mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className={isHydrated ? `w-full px-4 py-3 bg-input border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-vertical dark:bg-white/10 dark:text-white dark:placeholder-gray-400 ${
                    errors.message ? "border-red-500" : "border-border dark:border-white/30"
                  }` : `w-full px-4 py-3 bg-input border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-vertical ${
                    errors.message ? "border-red-500" : "border-border"
                  }`}
                  placeholder="Tell me about your project, timeline, budget, and any specific requirements..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-400">{errors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitStatus === "submitting"}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
                  submitStatus === "submitting"
                    ? "bg-card cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105"
                }`}
              >
                {submitStatus === "submitting" ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Message"
                )}
              </button>

              {/* Status Message */}
              {submitMessage && (
                <div
                  className={`mt-4 p-4 rounded-lg ${
                    submitStatus === "success"
                      ? "bg-green-500/20 border border-green-500/30 text-green-400"
                      : "bg-red-500/20 border border-red-500/30 text-red-400"
                  }`}
                >
                  {submitMessage}
                </div>
              )}
            </SafeMotionForm>
          </SafeMotionDiv>

          {/* Contact Information */}
          <SafeMotionDiv
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={isHydrated ? "bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border dark:bg-white/10 dark:border-white/20" : "bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border"}
          >
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Let&apos;s Connect
            </h3>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground">Email</h4>
                  <p className="text-muted-foreground">contact@mikhailajaj.com</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    I typically respond within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground">LinkedIn</h4>
                  <p className="text-muted-foreground">linkedin.com/in/mikhailajaj</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Professional networking and updates
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground">
                    Response Time
                  </h4>
                  <p className="text-muted-foreground">Within 24 hours</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Monday - Friday, 9 AM - 6 PM EST
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
              <h4 className="text-lg font-semibold text-blue-400 mb-2">
                Ready to Start?
              </h4>
              <p className="text-sm text-muted-foreground">
                I&apos;m currently accepting new projects for Q2 2024.
                Let&apos;s discuss your requirements and see how I can help
                bring your vision to life.
              </p>
            </div>
          </SafeMotionDiv>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;

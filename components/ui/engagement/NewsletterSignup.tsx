"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { AnimatedButton } from "@/components/ui/interactive/AnimatedButton";
import { FaEnvelope, FaCheck, FaTimes } from "react-icons/fa";

interface NewsletterSignupProps {
  title?: string;
  description?: string;
  variant?: "default" | "minimal" | "card";
  className?: string;
}

const variants = {
  default:
    "bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl p-6",
  minimal: "border border-gray-200 dark:border-gray-700 rounded-lg p-4",
  card: "bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6",
};

export function NewsletterSignup({
  title = "Stay Updated",
  description = "Get notified about new projects and articles.",
  variant = "default",
  className,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");

    try {
      // Simulate API call - replace with your actual newsletter service
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For demo purposes, we'll just show success
      setStatus("success");
      setMessage("Thank you for subscribing!");
      setEmail("");

      // Reset status after 3 seconds
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 3000);
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");

      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(variants[variant], "my-8", className)}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
          <FaEnvelope className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border transition-colors duration-200",
                    "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                    "border-gray-300 dark:border-gray-600",
                    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                    "placeholder-gray-500 dark:placeholder-gray-400",
                    status === "error" && "border-red-500 focus:ring-red-500",
                  )}
                  disabled={status === "loading" || status === "success"}
                  required
                />
              </div>

              <AnimatedButton
                type="submit"
                loading={status === "loading"}
                disabled={status === "success"}
                icon={status === "success" ? <FaCheck /> : undefined}
                className="sm:w-auto"
              >
                {status === "success" ? "Subscribed!" : "Subscribe"}
              </AnimatedButton>
            </div>

            {/* Status message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={cn(
                  "flex items-center gap-2 text-sm p-3 rounded-lg",
                  status === "success" &&
                    "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400",
                  status === "error" &&
                    "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400",
                )}
              >
                {status === "success" && <FaCheck className="w-4 h-4" />}
                {status === "error" && <FaTimes className="w-4 h-4" />}
                {message}
              </motion.div>
            )}
          </form>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            No spam. Unsubscribe anytime. I respect your privacy.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

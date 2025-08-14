"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const NewsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type NewsletterFormData = z.infer<typeof NewsletterSchema>;

const NewsletterSignup = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(NewsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Newsletter Signup Data:", data);
      setIsSubmitted(true);
      reset();
    } catch (err) {
      setError("Failed to subscribe. Please try again.");
      console.error("Newsletter signup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-gray-800 text-white max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Subscribe to Our Newsletter
      </h2>
      {isSubmitted ? (
        <div className="text-center text-green-400">
          <p className="text-lg">Thank you for subscribing!</p>
          <p className="text-sm">
            You&apos;ll receive the latest updates directly in your inbox.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              className="mt-1 block w-full p-3 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your email address"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>
          {error && (
            <p className="mt-1 text-sm text-red-400 text-center">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-md py-3 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      )}
    </div>
  );
};

export default NewsletterSignup;

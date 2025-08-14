"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const CommentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
});

type CommentFormData = z.infer<typeof CommentSchema>;

interface Comment {
  name: string;
  comment: string;
  timestamp: string;
}

const CommentSystem = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentFormData>({
    resolver: zodResolver(CommentSchema),
  });

  const onSubmit = async (data: CommentFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call to submit comment
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Submitted Comment:", data);

      const newComment: Comment = {
        name: data.name,
        comment: data.comment,
        timestamp: new Date().toLocaleString(),
      };
      setComments((prevComments) => [...prevComments, newComment]);
      setIsSubmitted(true);
      reset();
    } catch (err) {
      setError("Failed to submit comment. Please try again.");
      console.error("Comment submission error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-gray-800 text-white">
      <h2 className="text-2xl font-bold mb-4">Leave a Comment</h2>
      {isSubmitted && (
        <div className="text-center text-green-400 mb-4">
          <p className="text-lg">Your comment has been submitted!</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            {...register("name")}
            className="mt-1 block w-full p-3 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email")}
            className="mt-1 block w-full p-3 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-300"
          >
            Comment
          </label>
          <textarea
            id="comment"
            {...register("comment")}
            rows={4}
            className="mt-1 block w-full p-3 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          ></textarea>
          {errors.comment && (
            <p className="mt-1 text-sm text-red-400">
              {errors.comment.message}
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
          {isLoading ? "Submitting..." : "Submit Comment"}
        </button>
      </form>

      {comments.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">
            Comments ({comments.length})
          </h3>
          <div className="space-y-4">
            {comments.map((c, index) => (
              <div key={index} className="p-4 bg-gray-700 rounded-md">
                <p className="font-semibold">
                  {c.name}{" "}
                  <span className="text-gray-400 text-sm">
                    on {c.timestamp}
                  </span>
                </p>
                <p className="mt-1 text-gray-300">{c.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSystem;

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export function FeaturedProjects() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Showcasing the best work from each technical domain with measurable
            business impact.
          </p>
        </motion.div>

        <Card variant="glass" className="p-8">
          <div className="text-center text-gray-300">
            <p>Featured projects component - Coming soon in Phase 2</p>
            <p className="text-sm text-gray-500 mt-2">
              Will display 1-2 top projects from each domain with case study
              links
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}

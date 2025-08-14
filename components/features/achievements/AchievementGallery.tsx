"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export function AchievementGallery() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Achievements & Recognition
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Professional achievements, industry recognition, and contributions
            to the tech community.
          </p>
        </motion.div>

        <Card className="p-8 bg-card/80 backdrop-blur-md">
          <div className="text-center text-foreground">
            <p className="text-foreground">Achievement gallery component - Coming soon in Phase 2</p>
            <p className="text-sm text-muted-foreground mt-2">
              Will showcase awards, certifications, and professional recognition
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}

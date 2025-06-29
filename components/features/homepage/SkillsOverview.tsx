'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/base/Card';

export function SkillsOverview() {
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
            Technical Excellence Across Domains
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Comprehensive expertise spanning the full technology stack, from frontend interfaces to cloud infrastructure.
          </p>
        </motion.div>

        <Card variant="glass" className="p-8">
          <div className="text-center text-gray-300">
            <p>Skills overview component - Coming soon in Phase 2</p>
            <p className="text-sm text-gray-500 mt-2">
              Will showcase technical skills organized by domain with proficiency levels
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
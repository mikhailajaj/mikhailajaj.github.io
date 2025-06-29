'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/base/Button';
import { Card } from '@/components/ui/base/Card';
import { FaArrowRight, FaEnvelope, FaCalendar } from 'react-icons/fa';

export function CallToAction() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card variant="gradient" domain="full-stack" className="text-center p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
              Whether you need a full-stack application, cloud infrastructure, data analytics, 
              or technical consulting, I&apos;m here to help bring your vision to life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" variant="default" className="bg-white text-black hover:bg-gray-100">
                  <FaEnvelope className="mr-2" />
                  Start a Conversation
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                  <FaCalendar className="mr-2" />
                  View Services
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 text-sm text-gray-300">
              <p>Typically respond within 24 hours • Free initial consultation</p>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
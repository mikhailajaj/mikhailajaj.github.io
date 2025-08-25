"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/base/Button";
import { Card } from "@/components/ui/base/Card";
import { FaArrowRight, FaEnvelope, FaCalendar } from "react-icons/fa";

export function CallToAction() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card
            variant="elevated"
            className="text-center p-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 border-none shadow-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-lg text-gray-100 mb-8 max-w-2xl mx-auto">
              Whether you need a full-stack application, cloud infrastructure,
              data analytics, or technical consulting, I&apos;m here to help
              bring your vision to life.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="default"
                  className="bg-white text-gray-900 hover:bg-gray-100 hover:text-gray-900 font-semibold shadow-lg"
                >
                  <FaEnvelope className="mr-2" />
                  Start a Conversation
                </Button>
              </Link>
              <Link href="/services">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-gray-900 font-semibold shadow-lg"
                >
                  <FaCalendar className="mr-2" />
                  View Services
                </Button>
              </Link>
            </div>

            <div className="mt-8 text-sm text-gray-200">
              <p>
                Typically respond within 24 hours • Free initial consultation
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

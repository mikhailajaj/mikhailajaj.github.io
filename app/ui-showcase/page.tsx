"use client";

import React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { AnimatedButton } from "@/components/ui/interactive/AnimatedButton";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  ExpandableContent,
  Accordion,
} from "@/components/ui/interactive/ExpandableContent";
import { NewsletterSignup } from "@/components/ui/engagement/NewsletterSignup";
import { MegaMenu } from "@/components/ui/navigation/MegaMenu";
import {
  FaCode,
  FaCloud,
  FaChartBar,
  FaPalette,
  FaLightbulb,
  FaRocket,
  FaHeart,
  FaStar,
} from "react-icons/fa";

export default function UIShowcase() {
  const [showMegaMenu, setShowMegaMenu] = React.useState(false);

  return (
    <MainLayout
      showNavigation={true}
      showFooter={true}
      showScrollProgress={true}
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-display font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              UI/UX Showcase
            </h1>
            <p className="text-body-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Demonstrating the enhanced UI components and improved user
              experience patterns implemented based on the comprehensive
              improvement guide.
            </p>
          </div>

          {/* Enhanced Buttons Section */}
          <section className="space-y-6">
            <h2 className="text-h2 font-semibold text-gray-900 dark:text-gray-100">
              Enhanced Interactive Buttons
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <AnimatedButton variant="primary" icon={<FaRocket />}>
                  Primary Action
                </AnimatedButton>
                <AnimatedButton
                  variant="secondary"
                  icon={<FaHeart />}
                  iconPosition="right"
                >
                  Secondary
                </AnimatedButton>
                <AnimatedButton variant="outline" loading={false}>
                  Outline Style
                </AnimatedButton>
                <AnimatedButton variant="ghost" icon={<FaStar />}>
                  Ghost Button
                </AnimatedButton>
              </div>

              <div className="mt-4 space-y-2">
                <AnimatedButton
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={<FaCode />}
                >
                  Full Width Large Button
                </AnimatedButton>
                <div className="flex gap-2">
                  <AnimatedButton variant="primary" size="sm">
                    Small
                  </AnimatedButton>
                  <AnimatedButton variant="secondary" size="md">
                    Medium
                  </AnimatedButton>
                  <AnimatedButton variant="outline" size="lg">
                    Large
                  </AnimatedButton>
                </div>
              </div>
            </div>
          </section>

          {/* Progressive Disclosure Section */}
          <section className="space-y-6">
            <h2 className="text-h2 font-semibold text-gray-900 dark:text-gray-100">
              Progressive Disclosure & Expandable Content
            </h2>

            <div className="space-y-4">
              <ExpandableContent
                title="Full-Stack Development Services"
                icon={<FaCode />}
                variant="card"
              >
                <div className="space-y-4">
                  <p className="text-body text-gray-600 dark:text-gray-300">
                    I specialize in building modern web applications using
                    cutting-edge technologies like React, Next.js, Node.js, and
                    TypeScript. My approach focuses on creating scalable,
                    maintainable, and performant applications.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-h6 font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Frontend
                      </h4>
                      <ul className="text-body-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <li>• React & Next.js</li>
                        <li>• TypeScript</li>
                        <li>• Tailwind CSS</li>
                        <li>• Framer Motion</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-h6 font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Backend
                      </h4>
                      <ul className="text-body-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <li>• Node.js & Express</li>
                        <li>• MongoDB & PostgreSQL</li>
                        <li>• REST & GraphQL APIs</li>
                        <li>• Authentication & Security</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </ExpandableContent>

              <ExpandableContent
                title="Cloud Engineering & DevOps"
                icon={<FaCloud />}
                variant="default"
              >
                <p className="text-body text-gray-600 dark:text-gray-300">
                  Expert in AWS cloud services, containerization with Docker,
                  and CI/CD pipelines. I help businesses scale their
                  applications efficiently and securely in the cloud.
                </p>
              </ExpandableContent>

              <ExpandableContent
                title="Data Engineering & Analytics"
                icon={<FaChartBar />}
                variant="minimal"
              >
                <p className="text-body text-gray-600 dark:text-gray-300">
                  Building robust data pipelines, implementing ETL processes,
                  and creating insightful analytics dashboards using modern data
                  stack technologies.
                </p>
              </ExpandableContent>
            </div>
          </section>

          {/* Mega Menu Demo */}
          <section className="space-y-6">
            <h2 className="text-h2 font-semibold text-gray-900 dark:text-gray-100">
              Mega Menu Navigation
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <p className="text-body text-gray-600 dark:text-gray-300 mb-4">
                Click the button below to see the mega menu in action:
              </p>
              <div className="relative">
                <AnimatedButton
                  variant="primary"
                  onClick={() => setShowMegaMenu(!showMegaMenu)}
                  icon={<FaPalette />}
                >
                  {showMegaMenu ? "Hide" : "Show"} Mega Menu
                </AnimatedButton>
                <MegaMenu
                  isOpen={showMegaMenu}
                  onClose={() => setShowMegaMenu(false)}
                />
              </div>
            </div>
          </section>

          {/* Newsletter Signup Variants */}
          <section className="space-y-6">
            <h2 className="text-h2 font-semibold text-gray-900 dark:text-gray-100">
              Newsletter Signup Components
            </h2>

            <NewsletterSignup
              title="Stay Updated with My Latest Work"
              description="Get notified about new projects, blog posts, and insights from the world of development."
              variant="default"
            />

            <NewsletterSignup
              title="Join the Community"
              description="Subscribe for weekly development tips and tutorials."
              variant="card"
            />

            <NewsletterSignup
              title="Quick Subscribe"
              description="Simple newsletter signup."
              variant="minimal"
            />
          </section>

          {/* Typography Scale Demo */}
          <section className="space-y-6">
            <h2 className="text-h2 font-semibold text-gray-900 dark:text-gray-100">
              Typography Scale & Spacing System
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 space-y-md">
              <div className="text-display text-gray-900 dark:text-gray-100">
                Display Text
              </div>
              <div className="text-h1 text-gray-900 dark:text-gray-100">
                Heading 1
              </div>
              <div className="text-h2 text-gray-900 dark:text-gray-100">
                Heading 2
              </div>
              <div className="text-h3 text-gray-900 dark:text-gray-100">
                Heading 3
              </div>
              <div className="text-h4 text-gray-900 dark:text-gray-100">
                Heading 4
              </div>
              <div className="text-h5 text-gray-900 dark:text-gray-100">
                Heading 5
              </div>
              <div className="text-h6 text-gray-900 dark:text-gray-100">
                Heading 6
              </div>
              <div className="text-body-lg text-gray-600 dark:text-gray-300">
                Large body text
              </div>
              <div className="text-body text-gray-600 dark:text-gray-300">
                Regular body text
              </div>
              <div className="text-body-sm text-gray-600 dark:text-gray-300">
                Small body text
              </div>
              <div className="text-caption text-gray-500 dark:text-gray-400">
                Caption text
              </div>
            </div>
          </section>

          {/* Spacing System Demo */}
          <section className="space-y-6">
            <h2 className="text-h2 font-semibold text-gray-900 dark:text-gray-100">
              Consistent Spacing System
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="space-y-2xs">
                <div className="bg-primary-100 dark:bg-primary-900/30 p-2xs rounded">
                  2xs spacing (4px)
                </div>
                <div className="bg-primary-200 dark:bg-primary-800/30 p-xs rounded">
                  xs spacing (8px)
                </div>
                <div className="bg-primary-300 dark:bg-primary-700/30 p-sm rounded">
                  sm spacing (16px)
                </div>
                <div className="bg-primary-400 dark:bg-primary-600/30 p-md rounded">
                  md spacing (24px)
                </div>
                <div className="bg-primary-500 dark:bg-primary-500/30 p-lg rounded text-white">
                  lg spacing (32px)
                </div>
              </div>
            </div>
          </section>
        </div>

       {/* Bento Grid Demo */}
       <section className="space-y-6 mt-12">
         <h2 className="text-h2 font-semibold text-gray-900 dark:text-gray-100">
           Bento Grid (Aceternity-inspired)
         </h2>
         <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
           {(() => {
             const items = [
               {
                 title: "The Dawn of Innovation",
                 description:
                   "Explore the birth of groundbreaking ideas and inventions.",
               },
               {
                 title: "The Digital Revolution",
                 description:
                   "Dive into the transformative power of technology.",
               },
               {
                 title: "The Art of Design",
                 description:
                   "Discover the beauty of thoughtful and functional design.",
               },
               {
                 title: "The Power of Communication",
                 description:
                   "Understand the impact of effective communication.",
               },
               {
                 title: "The Pursuit of Knowledge",
                 description:
                   "Join the quest for understanding and enlightenment.",
               },
               {
                 title: "The Joy of Creation",
                 description:
                   "Experience the thrill of bringing ideas to life.",
               },
             ];
             // using imported BentoGrid

             return (
               <BentoGrid>
                 {items.map((item, idx) => (
                   <BentoGridItem
                     key={idx}
                     title={item.title}
                     description={item.description}
                     className={idx === 0 ? "md:col-span-2" : ""}
                   />
                 ))}
               </BentoGrid>
             );
           })()}
         </div>
       </section>
     </div>
    </MainLayout>
  );
}

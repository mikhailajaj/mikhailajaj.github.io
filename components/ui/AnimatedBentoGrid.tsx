"use client";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import {
  scrollAnimations,
  hoverAnimations,
  createStaggeredAnimation,
} from "@/lib/animations";
import Contact from "./Contact";

export const AnimatedBentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const containerAnimation = createStaggeredAnimation(
    scrollAnimations.slideInFromBottom,
    0.1,
    0.2,
  );

  return (
    <motion.div
      ref={ref}
      className={cn(
        "grid grid-cols-1 gap-8 max-w-7xl mx-auto md:grid-cols-6 lg:grid-cols-5 md:grid-row-7 lg:gap-8",
        className,
      )}
      variants={containerAnimation.container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedBentoGridItem = ({
  className,
  title,
  description,
  id,
  img,
  imgClassName,
  titleClassName,
  spareImg,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  id: number;
  img?: string;
  imgClassName?: string;
  titleClassName?: string;
  spareImg?: string;
}) => {
  const itemRef = useRef(null);
  const isInView = useInView(itemRef, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={itemRef}
      className={cn(
        "relative row-span-1 rounded-3xl group/bento overflow-hidden border border-white/10 dark:border-white/5",
        // Enhanced glassmorphism effect
        "bg-white/5 dark:bg-black/5 backdrop-blur-xl",
        // Enhanced shadows and glow
        "shadow-2xl shadow-black/10 dark:shadow-black/20",
        // Hover effects
        "hover:shadow-3xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20",
        "hover:border-white/20 dark:hover:border-white/10",
        "transition-all duration-500 ease-out",
        className,
      )}
      variants={scrollAnimations.slideInFromBottom}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover="hover"
    >
      {/* Background gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover/bento:opacity-100 transition-opacity duration-500"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      />

      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover/bento:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.1), transparent)",
          filter: "blur(1px)",
        }}
        animate={{
          background: [
            "linear-gradient(0deg, transparent, rgba(59, 130, 246, 0.1), transparent)",
            "linear-gradient(90deg, transparent, rgba(147, 51, 234, 0.1), transparent)",
            "linear-gradient(180deg, transparent, rgba(236, 72, 153, 0.1), transparent)",
            "linear-gradient(270deg, transparent, rgba(59, 130, 246, 0.1), transparent)",
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {id !== 6 && (
        <div className="h-full w-full relative">
          {/* Enhanced image container */}
          <div className="w-full h-full absolute">
            {img && (
              <motion.img
                src={img}
                alt={img}
                className={cn(
                  "object-cover object-center transition-transform duration-700 group-hover/bento:scale-110",
                  imgClassName,
                )}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            )}
          </div>

          {/* Spare image with enhanced positioning */}
          <motion.div
            className={`absolute right-0 -bottom-5 ${id === 5 && "w-full opacity-80"}`}
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.3 }}
          >
            {spareImg && (
              <Image
                src={spareImg}
                alt={spareImg || "Spare image"}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
          </motion.div>

          {/* Enhanced content container */}
          <motion.div
            className={cn(
              titleClassName,
              "relative md:h-full min-h-40 flex flex-col px-5 p-5 lg:p-10 z-10",
            )}
            variants={hoverAnimations.lift}
            initial="rest"
            whileHover="hover"
          >
            {/* Enhanced title */}
            <motion.div
              className="font-sans text-lg lg:text-3xl max-w-96 font-bold z-10 text-neutral-950 dark:text-white"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              {title}
            </motion.div>

            {/* Enhanced description */}
            <motion.div
              className="font-sans font-extralight md:max-w-32 md:text-xs lg:text-base text-sm text-neutral-700 dark:text-neutral-200 z-10 mt-2"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              {description}
            </motion.div>
          </motion.div>
        </div>
      )}

      {/* Contact section for item 6 */}
      <div className="h-fit">
        {id === 6 && <Contact title={title} description={description} />}
      </div>

      {/* Enhanced tech stack for item 3 */}
      {id === 3 && (
        <motion.div
          className="flex gap-1 lg:gap-5 w-fit absolute -right-3 lg:-right-2"
          variants={
            createStaggeredAnimation(scrollAnimations.slideInFromRight, 0.1)
              .container
          }
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Left column */}
          <div className="flex flex-col gap-3 md:gap-3 lg:gap-8">
            {leftLists.map((item, i) => (
              <motion.span
                key={i}
                className="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base rounded-lg text-center bg-black/20 dark:bg-white/10 backdrop-blur-sm border border-white/10 text-white font-medium hover:bg-black/30 dark:hover:bg-white/20 transition-all duration-300"
                variants={scrollAnimations.slideInFromRight}
                whileHover={{ scale: 1.05, x: -5 }}
                transition={{ duration: 0.2 }}
              >
                {item}
              </motion.span>
            ))}
            <span className="lg:py-4 lg:px-3 py-4 px-3 rounded-lg text-center bg-black/10 dark:bg-white/5"></span>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-3 md:gap-3 lg:gap-8">
            <span className="lg:py-4 lg:px-3 py-4 px-3 rounded-lg text-center bg-black/10 dark:bg-white/5"></span>
            {rightLists.map((item, i) => (
              <motion.span
                key={i}
                className="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base rounded-lg text-center bg-black/20 dark:bg-white/10 backdrop-blur-sm border border-white/10 text-white font-medium hover:bg-black/30 dark:hover:bg-white/20 transition-all duration-300"
                variants={scrollAnimations.slideInFromRight}
                whileHover={{ scale: 1.05, x: -5 }}
                transition={{ duration: 0.2, delay: i * 0.1 }}
              >
                {item}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Enhanced promotions for item 5 */}
      {id === 5 && (
        <motion.div
          variants={
            createStaggeredAnimation(scrollAnimations.scaleIn, 0.15).container
          }
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {promos.map((promo, index) => (
            <motion.div
              key={index}
              className="p-4 bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-lg border border-white/10 m-2 cursor-pointer hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300"
              variants={scrollAnimations.scaleIn}
              whileHover={{
                scale: 1.02,
                y: -2,
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="font-bold text-lg text-neutral-950 dark:text-white">
                {promo.title}
              </h3>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-1">
                {promo.description}
              </p>
              <p className="font-semibold text-md text-primary-600 dark:text-primary-400 mt-2">
                {promo.price}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Icon overlay */}
      {icon && (
        <motion.div
          className="absolute bottom-4 right-4"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
      )}
    </motion.div>
  );
};

// Data arrays (keeping the same as original)
const promos = [
  {
    title: "Promotion Title 1",
    description: "This is a description for promotion 1.",
    price: "$19.99",
  },
  {
    title: "Promotion Title 2",
    description: "This is a description for promotion 2.",
    price: "$29.99",
  },
];

const leftLists = ["React", "Next.js", "Tailwind CSS"];
const rightLists = ["GraphQL", "Prisma", "Apollo Client"];

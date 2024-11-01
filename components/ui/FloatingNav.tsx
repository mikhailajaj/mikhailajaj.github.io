"use client";
import React, { type JSX } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import ThemeSwitcher from "../ThemeSwitcher";
export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  return (
    <motion.div
      initial={{
        opacity: 1,
        y: 0,
      }}
      className={cn(
        "flex max-w-fit sm:text-sm bg-white fixed right-2 inset-x-0 mx-auto border border-white/[0.2] dark:border-white/[0.2] sm:rounded-none md:rounded-3xl dark:bg-black shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] px-10 py-5 items-center justify-center md:space-x-4 z-100 sm:space-x-2 ",
        className
      )}
    >
      {navItems.map((navItem: any, idx: number) => (
        <Link
          key={`link=${idx}`}
          href={navItem.link}
          className={cn(
            "relative dark:text-neutral-50 items-center flex space-x-2 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500 hover:border-black dark:hover:border-white border-b-2 border-transparent transition-all duration-200",
          )}
        >
          <span className="block sm:hidden">{navItem.icon}</span>
          <span className="text-sm !cursor-pointer ">{navItem.name}</span>
        </Link>
        
      ))
      }<ThemeSwitcher  />
      
    </motion.div>
  );
};

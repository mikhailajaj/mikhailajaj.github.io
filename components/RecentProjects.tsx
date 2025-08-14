"use client";
import React, { useState } from "react";
import Image from "next/image";
import { projects } from "@/data";
import { enhancedProjects } from "@/data/projects-enhanced";
import { PinContainer } from "./ui/3d-pin";
import {
  FaLocationArrow,
  FaGithub,
  FaCheckCircle,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const FilterButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2 rounded-full text-sm transition-all duration-300 ${
      active
        ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-md"
        : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
    }`}
  >
    {children}
  </button>
);

const ProjectCard = ({ project }) => {
  const {
    id,
    title,
    des,
    img,
    iconLists,
    link,
    metrics,
    github,
    categories = [],
  } = project;

  // Find corresponding enhanced project for case study link
  const enhancedProject = enhancedProjects.find(
    (ep) => ep.id === id.toString() || ep.title === title,
  );

  // Determine accent color based on first category
  let accentColor = "text-blue-500";
  if (categories.includes("cloud")) {
    accentColor = "text-teal-500";
  } else if (categories.includes("data")) {
    accentColor = "text-purple-500";
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      key={id}
      className="sm:h-[41rem] lg-min-h-[32.5rem] h-[32rem] flex items-center justify-center sm:w-[570px] w-[80vw]"
    >
      <PinContainer title={title} href={link}>
        <div className="flex relative items-center justify-center sm:w-[570px] w-[80vw] sm:h-[40vh] overflow-hidden h-[30vh] mb-10">
          <Image
            src={img}
            alt={title}
            fill
            className="object-cover z-10"
            sizes="(max-width: 640px) 80vw, 570px"
          />

          {/* Category badges */}
          <div className="absolute top-4 left-4 flex gap-2 z-20">
            {categories.map((category, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  category === "cloud"
                    ? "bg-teal-500/20 text-teal-500"
                    : category === "data"
                      ? "bg-purple-500/20 text-purple-500"
                      : "bg-blue-500/20 text-blue-500"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
            ))}
          </div>
        </div>

        <h1 className="font-bold lg:text-2xl md:text-xl text-base line-clamp-1">
          {title}
        </h1>
        <p className="lg:text-xl lg:font-normal font-light text-sm line-clamp-2">
          {des}
        </p>

        {/* Added metrics with icon */}
        <p
          className={`${accentColor} text-sm font-semibold mt-2 flex items-center`}
        >
          <FaCheckCircle className="mr-1" /> {metrics}
        </p>

        <div className="flex items-center justify-between mt-7 mb-3">
          <div className="flex items-center">
            {iconLists.map((Icon, index) => (
              <div
                key={index}
                className="border border-white/[0.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                style={{
                  transform: `translateX(-${5 * index * 2}px)`,
                }}
              >
                {typeof Icon === "function" ? (
                  <Icon className="w-10 h-10 p-2" />
                ) : (
                  <Image
                    src={Icon}
                    alt="Tech icon"
                    width={40}
                    height={40}
                    className="p-2 object-contain"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            {enhancedProject && (
              <Link
                href={`/projects/${enhancedProject.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="flex justify-center items-center hover:text-green-500 transition-colors cursor-pointer"
              >
                <p className="flex lg:text-sm md:text-xs text-xs">Case Study</p>
                <FaExternalLinkAlt className="ms-1" />
              </Link>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(github, "_blank", "noopener,noreferrer");
              }}
              className="flex justify-center items-center hover:text-blue-500 transition-colors cursor-pointer"
            >
              <p className="flex lg:text-sm md:text-xs text-xs">Code</p>
              <FaGithub className="ms-1" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(link, "_blank", "noopener,noreferrer");
              }}
              className="flex justify-center items-center hover:text-purple-500 transition-colors cursor-pointer"
            >
              <p className="flex lg:text-sm md:text-xs text-xs">Live Demo</p>
              <FaLocationArrow className="ms-1" />
            </button>
          </div>
        </div>
      </PinContainer>
    </motion.div>
  );
};

const RecentProjects = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((project) =>
          project.categories?.includes(activeFilter),
        );

  return (
    <div className="py-20 px-4" id="projects">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black dark:text-white">
          Featured{" "}
          <span className="text-blue-600 dark:text-blue-400">Projects</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          A selection of my recent work across different specializations
        </p>
      </motion.div>

      {/* Filter buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-wrap justify-center gap-4 mb-12"
      >
        <FilterButton
          active={activeFilter === "all"}
          onClick={() => setActiveFilter("all")}
        >
          All Projects
        </FilterButton>
        <FilterButton
          active={activeFilter === "full-stack"}
          onClick={() => setActiveFilter("full-stack")}
        >
          Full-Stack
        </FilterButton>
        <FilterButton
          active={activeFilter === "cloud"}
          onClick={() => setActiveFilter("cloud")}
        >
          Cloud
        </FilterButton>
        <FilterButton
          active={activeFilter === "data"}
          onClick={() => setActiveFilter("data")}
        >
          Data
        </FilterButton>
        <FilterButton
          active={activeFilter === "mobile"}
          onClick={() => setActiveFilter("mobile")}
        >
          Mobile
        </FilterButton>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          layout
          className="flex flex-wrap justify-center items-center gap-x-24 gap-y-8 mt-10"
        >
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 dark:text-gray-400 text-center py-10"
            >
              No projects found in this category yet.
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mt-12"
      >
        <Link
          href="/projects"
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          View All Projects
          <FaLocationArrow className="ml-2" />
        </Link>
      </motion.div>
    </div>
  );
};

export default RecentProjects;

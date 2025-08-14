"use client";
import React from "react";
import Link from "next/link";
import { FaEye, FaCode, FaCloud, FaDatabase } from "react-icons/fa";
import { motion } from "framer-motion";

const ResumeCard = ({
  icon,
  title,
  description,
  resumeType,
  color,
  delay,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{
        y: -5,
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 ${color} relative overflow-hidden cursor-pointer`}
    >
      <div
        className={`absolute top-0 right-0 w-24 h-24 ${color.replace("border-", "bg-").replace("dark:border-", "dark:bg-")}/5 rounded-bl-full`}
      ></div>

      <div className="flex items-center mb-4">
        <div
          className={`p-3 rounded-lg ${color.replace("border-", "bg-").replace("dark:border-", "dark:bg-")}/10`}
        >
          {icon}
        </div>
        <h3 className="text-xl font-bold ml-3">{title}</h3>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
        {description}
      </p>

      <Link
        href={`/resume?type=${resumeType}`}
        className={`flex items-center justify-center gap-2 px-4 py-2 ${color.replace("border-", "bg-").replace("dark:border-", "dark:bg-")} text-white rounded-lg hover:opacity-90 transition-all group`}
      >
        <span>View Resume</span>
        <FaEye className="transition-transform group-hover:scale-110" />
      </Link>
    </motion.div>
  );
};

const ResumeDownloads = () => {
  return (
    <div className="py-20 px-4" id="resumes">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black dark:text-white">
          My <span className="text-blue-600 dark:text-blue-400">Resumes</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          View beautifully designed resumes with stunning UI/UX, tailored to different roles and technologies. Download options available on each resume page.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <ResumeCard
          icon={<FaCode className="text-3xl text-blue-500" />}
          title="Software Developer"
          description="Focused on web development skills, front-end frameworks, back-end technologies, and full-stack projects with detailed project experience."
          resumeType="software-developer"
          color="border-blue-500 dark:border-blue-400"
          delay={0.1}
        />

        <ResumeCard
          icon={<FaDatabase className="text-3xl text-purple-500" />}
          title="Data Analyst"
          description="Showcasing data processing, analytics, machine learning projects, and experience with statistical modeling and visualization."
          resumeType="data-analyst"
          color="border-purple-500 dark:border-purple-400"
          delay={0.3}
        />

        <ResumeCard
          icon={<FaCloud className="text-3xl text-teal-500" />}
          title="Cloud Engineer"
          description="Highlighting cloud infrastructure, DevOps practices, serverless architecture, and AWS/Azure expertise. (Coming Soon)"
          resumeType="cloud-engineer"
          color="border-teal-500 dark:border-teal-400"
          delay={0.5}
        />
      </div>
    </div>
  );
};

export default ResumeDownloads;

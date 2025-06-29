'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FaCloud, FaDatabase, FaLaptopCode } from 'react-icons/fa';

const SkillCard = ({ icon, title, skills, delay, accentColor, bgPattern }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-t-4 relative overflow-hidden ${accentColor}`}
    >
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5 dark:opacity-10 z-0" 
        style={{ 
          backgroundImage: `url(${bgPattern})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      <div className="relative z-10">
        <div className={`flex items-center mb-6`}>
          <div className={`p-3 rounded-lg ${accentColor.replace('border-', 'bg-').replace('dark:border-', 'dark:bg-')}/10`}>
            {icon}
          </div>
          <h3 className="text-xl font-bold ml-3">{title}</h3>
        </div>
        
        <ul className="space-y-3">
          {skills.map((skill, index) => (
            <motion.li 
              key={index} 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: delay + index * 0.1 }}
              className="flex items-center"
            >
              <span className={`w-2 h-2 rounded-full mr-2 ${accentColor.replace('border-', 'bg-').replace('dark:border-', 'dark:bg-')}`}></span>
              <span className="text-gray-700 dark:text-gray-300">{skill}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

const SpecializedSkills = () => {
  return (
    <div className="py-20 px-4" id="skills">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-center mb-4 text-black dark:text-white"
      >
        My <span className="text-blue-600 dark:text-blue-400">Specialized Skills</span>
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto"
      >
        With expertise across multiple domains, I bring a versatile skill set to solve complex technical challenges
      </motion.p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <SkillCard
          icon={<FaLaptopCode className="text-3xl text-blue-500" />}
          title="Full-Stack Development"
          skills={[
            "React & Next.js",
            "Node.js & Express",
            "MongoDB & SQL Databases",
            "RESTful APIs & GraphQL",
            "TypeScript & JavaScript",
            "Responsive UI/UX Design"
          ]}
          delay={0.1}
          accentColor="border-blue-500 dark:border-blue-400"
          bgPattern="/patterns/circuit-board.svg"
        />
        
        <SkillCard
          icon={<FaCloud className="text-3xl text-teal-500" />}
          title="Cloud Engineering"
          skills={[
            "AWS Services (Lambda, S3, EC2)",
            "Serverless Architecture",
            "CI/CD Pipelines",
            "Infrastructure as Code",
            "Cloud Security Best Practices",
            "Microservices Architecture"
          ]}
          delay={0.3}
          accentColor="border-teal-500 dark:border-teal-400"
          bgPattern="/patterns/cloud-pattern.svg"
        />
        
        <SkillCard
          icon={<FaDatabase className="text-3xl text-purple-500" />}
          title="Data Engineering"
          skills={[
            "Data Visualization",
            "ETL Pipelines",
            "Database Optimization",
            "Big Data Processing",
            "Data Analysis & Reporting",
            "Business Intelligence Tools"
          ]}
          delay={0.5}
          accentColor="border-purple-500 dark:border-purple-400"
          bgPattern="/patterns/data-flow.svg"
        />
      </div>
    </div>
  );
};

export default SpecializedSkills;
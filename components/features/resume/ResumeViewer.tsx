"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaCode, 
  FaDatabase, 
  FaCloud, 
  FaDownload, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaGlobe,
  FaGraduationCap,
  FaBriefcase,
  FaCog,
  FaProjectDiagram,
  FaArrowLeft
} from "react-icons/fa";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

// Resume data structure
const resumeData = {
  "software-developer": {
    title: "Software Developer",
    color: "blue",
    icon: <FaCode className="text-2xl" />,
    downloadLink: "/resumes/Software Developer Mikhail  Ajaj.docx",
    contact: {
      phone: "+1 (416) 474-5749",
      email: "ajaj@sheridancollege.ca",
      location: "Burlington, ON",
      website: "https://mikhailajaj.github.io/"
    },
    summary: "A curious dreamer in the realm of code, weaving solutions that bridge imagination and reality. As a Senior Computer Science student at Sheridan College, I bring a deep understanding of software engineering and architecture. With a passion for React, React Native, and Node.js, I craft elegant mobile and web experiences. Driven to learn, collaborate, and solve, I seek to leave an impact through meaningful projects, blending innovation and practicality in every line of code.",
    education: {
      degree: "Honours Bachelor of Computer Science (Mobile Computing)",
      institution: "Sheridan College | Oakville, ON",
      expected: "Apr 2026",
      relatedCourses: [
        "Business Intelligence and Data Mining (In Progress)",
        "Software Engineering (Completed: Apr 2024, Grade: A)",
        "Distributed Mobility (Completed: Jan 2024, Grade: A)",
        "Artificial Intelligence (Completed: Jan 2024, Grade: C)",
        "Database Modelling (Completed: Jan 2018, Grade: B+)",
        "Human Computer Interaction (Completed: Jan 2024, Grade: A)",
        "Mobile Application Principles (Completed: Apr 2018, Grade: A-)",
        "Mobile Web App Development (Completed: Apr 2019, Grade: B+)",
        "Scripting & Web Languages (Completed: Jan 2018, Grade: A-)",
        "Programming Principles (Completed: Dec 2017, Grade: A)",
        "Cognitive Computing (completed: Dec 2024, Grade: A+)"
      ],
      supportiveCourses: [
        "Software Design (Completed: Jan 2021)",
        "Data Structures and Algorithms (Completed: Jan 2019)"
      ]
    },
    technicalSkills: {
      "Languages & Frameworks": "JavaScript / TypeScript (advanced) • Python • SQL • Kotlin • Swift • Java • C# • React / React Native • Next.js • Node.js • .NET",
      "Methods & Collaboration": "Agile (Scrum) • Test-Driven Development • Project Management",
      "Cloud & DevOps": "Microsoft Azure • AWS • Git • Azure DevOps • Jira • CI/CD • REST APIs",
      "Data & Automation": "Excel (advanced) • Power Platform • Data Warehousing • Business Intelligence • Report Automation • Process Automation"
    },
    coreCompetencies: [
      "Full-Stack Development & Problem-Solving",
      "Mobile Development & Quality Assurance",
      "Customer-Focused Solution Design",
      "Agile Team Collaboration",
      "Technical Documentation & Communication",
      "Continuous Learning & Adaptability"
    ],
    experience: [
      {
        title: "Project owner/software architect",
        period: "Jan 2024 - Apr 2024",
        company: "Secret Santa (invitation system) | Group Project",
        link: "https://github.com/mikhailajaj/SecretSanta",
        achievements: [
          "Optimized project management with Jira, significantly increasing development speed and team efficiency.",
          "Created a Visual Paradigm repository, ensuring accuracy and reducing clarification time, which enhanced team collaboration.",
          "Formulated business rules and stakeholder relations, boosting governance and reducing compliance risks.",
          "Designed a Figma prototype to refine UI/UX, receiving early feedback that reduced design revisions.",
          "Standardized development using Git integration, which optimized code sharing and streamlined continuous integration.",
          "Implemented AWS for secure authentication and efficient data management, improving overall system performance."
        ]
      }
    ]
  },
  "data-analyst": {
    title: "Data Analyst",
    color: "purple",
    icon: <FaDatabase className="text-2xl" />,
    downloadLink: "/resumes/MIKHAIL AJAJ DATA ANALYST.pdf",
    contact: {
      phone: "(416) 474-5749",
      email: "ajaj@sheridancollege.ca",
      location: "Burlington, ON",
      website: "https://www.linkedin.com/in/mikhail-ajaj/"
    },
    summary: "Detail-oriented Data Science student with strong programming skills in Python and SQL, seeking an internship position at Interac. Equipped with hands-on experience in statistical modeling and data analysis, with a focus on delivering actionable insights through data visualization. Demonstrates proven ability to manipulate large datasets and develop machine learning models.",
    education: {
      degree: "Honours Bachelor of Computer Science (Mobile Computing)",
      institution: "Sheridan College | Oakville, ON",
      expected: "Apr 2026",
      relatedCourses: [
        "Business Intelligence and Data Mining (Completed: 2025/01)",
        "Software Engineering (Completed: 2024/04)",
        "Theory of Computation (Completed: 2024/04)",
        "Artificial Intelligence (Completed: 2024/01)",
        "Statistics for Data Science (Completed: 2023/01)"
      ],
      supportiveCourses: [
        "Jira, Microsoft Azure, AWS, Report Automation, Azure DevOps",
        "Agile Scrum, Project Management",
        "Software Design (Completed: 2021/01)",
        "Data Structures and Algorithms (Completed: 2020/01)"
      ]
    },
    technicalSkills: {
      "Data Analysis & Automation": "MS Excel (Advanced), Power Platform, Python, Data Analysis, Process Automation, Business Intelligence Tools",
      "Programming Languages": "Python, SQL, JavaScript, Kotlin, Swift, Java, C#",
      "Development Frameworks Technologies": "React/React Native, .NET, APIs, iOS/Android App Development",
      "Soft Skills": "Problem-Solving, Communication, Team Collaboration"
    },
    projects: [
      {
        title: "Business Intelligence & Data mining (assignments)",
        period: "Sep 2024 - Dec 2024",
        links: [
          "https://colab.research.google.com/drive/1sVxThilHXATxMv_1ulKXUFputiBkkV59?usp=sharing",
          "https://colab.research.google.com/drive/1mKKMrP42gCntroAwEh0_J5gvfVm0_rVf?usp=sharing"
        ]
      },
      {
        title: "AI Classification of Abalone Sex",
        period: "Jan 2024 - Apr 2024",
        link: "https://github.com/mikhailajaj/Ai_Classification_Abalone_Sex",
        description: "Developed a machine learning model to classify the sex of abalones using various physical measurements. The project applies data preprocessing, feature engineering, and model optimization techniques to enhance classification accuracy.",
        achievements: [
          "Implemented supervised learning algorithms and compared performance metrics.",
          "Applied data preprocessing steps such as handling missing values, feature scaling, and encoding categorical data.",
          "Experimented with different models and hyperparameter tuning to improve model accuracy.",
          "Conducted thorough data analysis and visualization to understand data distribution and relationships."
        ],
        technologies: "Python, Scikit-Learn, Pandas, NumPy, Matplotlib, Jupyter Notebook"
      }
    ]
  },
  "cloud-engineer": {
    title: "Cloud Engineer",
    color: "teal",
    icon: <FaCloud className="text-2xl" />,
    downloadLink: "/resumes/cloud-resume.pdf",
    contact: {
      phone: "+1 (416) 474-5749",
      email: "ajaj@sheridancollege.ca",
      location: "Burlington, ON",
      website: "https://mikhailajaj.github.io/"
    },
    summary: "Cloud Engineering resume coming soon. This will showcase expertise in cloud infrastructure, DevOps practices, serverless architecture, and AWS/Azure solutions.",
    education: {
      degree: "Honours Bachelor of Computer Science (Mobile Computing)",
      institution: "Sheridan College | Oakville, ON",
      expected: "Apr 2026",
      relatedCourses: [
        "Cloud Computing & Infrastructure",
        "DevOps & Automation",
        "Distributed Systems",
        "Software Engineering"
      ]
    },
    technicalSkills: {
      "Cloud Platforms": "AWS, Microsoft Azure, Google Cloud Platform",
      "DevOps Tools": "Docker, Kubernetes, Jenkins, GitLab CI/CD",
      "Infrastructure as Code": "Terraform, CloudFormation, ARM Templates",
      "Monitoring & Logging": "CloudWatch, Azure Monitor, Prometheus, Grafana"
    }
  }
};

const ResumeViewer = () => {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  const [selectedResume, setSelectedResume] = useState<string>("software-developer");
  
  useEffect(() => {
    if (typeParam && resumeData[typeParam]) {
      setSelectedResume(typeParam);
    }
  }, [typeParam]);
  
  const resume = resumeData[selectedResume];

  const colorClasses = {
    blue: {
      gradient: "from-blue-500 to-blue-600",
      bg: "bg-blue-500",
      text: "text-blue-600",
      border: "border-blue-500",
      hover: "hover:bg-blue-50"
    },
    purple: {
      gradient: "from-purple-500 to-purple-600",
      bg: "bg-purple-500",
      text: "text-purple-600",
      border: "border-purple-500",
      hover: "hover:bg-purple-50"
    },
    teal: {
      gradient: "from-teal-500 to-teal-600",
      bg: "bg-teal-500",
      text: "text-teal-600",
      border: "border-teal-500",
      hover: "hover:bg-teal-50"
    }
  };

  const currentColor = colorClasses[resume.color];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/about">
              <Button variant="ghost" size="sm" className="gap-2">
                <FaArrowLeft className="text-sm" />
                Back to About
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Resume Viewer</h1>
          </div>
          
          {/* Resume Type Selector */}
          <div className="flex gap-2">
            {Object.entries(resumeData).map(([key, data]) => (
              <Button
                key={key}
                variant={selectedResume === key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedResume(key)}
                className={`gap-2 ${selectedResume === key ? colorClasses[data.color].bg : ''}`}
              >
                {data.icon}
                {data.title}
              </Button>
            ))}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedResume}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            {/* Resume Header */}
            <div className={`bg-gradient-to-r ${currentColor.gradient} text-white p-8 rounded-t-2xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2">MIKHAIL AJAJ</h1>
                  <h2 className="text-2xl font-light opacity-90">{resume.title}</h2>
                </div>
                <div className="text-right space-y-2">
                  <div className="flex items-center gap-2 justify-end">
                    <FaPhone className="text-sm" />
                    <span>{resume.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <FaEnvelope className="text-sm" />
                    <span>{resume.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <FaMapMarkerAlt className="text-sm" />
                    <span>{resume.contact.location}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <FaGlobe className="text-sm" />
                    <a href={resume.contact.website} className="hover:underline">
                      Portfolio
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Content */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-b-2xl shadow-xl">
              {/* Summary */}
              <section className="mb-8">
                <h3 className={`text-2xl font-bold ${currentColor.text} mb-4 flex items-center gap-2`}>
                  <FaBriefcase />
                  SUMMARY
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {resume.summary}
                </p>
              </section>

              {/* Education */}
              <section className="mb-8">
                <h3 className={`text-2xl font-bold ${currentColor.text} mb-4 flex items-center gap-2`}>
                  <FaGraduationCap />
                  EDUCATION
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xl font-semibold">{resume.education.degree}</h4>
                    <p className="text-gray-600 dark:text-gray-400">{resume.education.institution}</p>
                    <p className="text-sm text-gray-500">Expected: {resume.education.expected}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold mb-2">Related Courses:</h5>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm">
                      {resume.education.relatedCourses.map((course, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className={`w-2 h-2 ${currentColor.bg} rounded-full mt-2 flex-shrink-0`}></span>
                          {course}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {resume.education.supportiveCourses && (
                    <div>
                      <h5 className="font-semibold mb-2">Supportive Courses:</h5>
                      <ul className="space-y-1 text-sm">
                        {resume.education.supportiveCourses.map((course, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className={`w-2 h-2 ${currentColor.bg} rounded-full mt-2 flex-shrink-0`}></span>
                            {course}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>

              {/* Technical Skills */}
              <section className="mb-8">
                <h3 className={`text-2xl font-bold ${currentColor.text} mb-4 flex items-center gap-2`}>
                  <FaCog />
                  TECHNICAL SKILLS
                </h3>
                <div className="grid gap-4">
                  {Object.entries(resume.technicalSkills).map(([category, skills]) => (
                    <div key={category}>
                      <h5 className="font-semibold mb-2">{category}:</h5>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{skills}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Core Competencies (for software developer) */}
              {resume.coreCompetencies && (
                <section className="mb-8">
                  <h3 className={`text-2xl font-bold ${currentColor.text} mb-4`}>
                    CORE COMPETENCIES
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {resume.coreCompetencies.map((competency, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className={`w-2 h-2 ${currentColor.bg} rounded-full mt-2 flex-shrink-0`}></span>
                        {competency}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Experience (for software developer) */}
              {resume.experience && (
                <section className="mb-8">
                  <h3 className={`text-2xl font-bold ${currentColor.text} mb-4`}>
                    EXPERIENCE
                  </h3>
                  {resume.experience.map((exp, index) => (
                    <div key={index} className="mb-6">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-xl font-semibold">{exp.title}</h4>
                        <span className="text-sm text-gray-500">{exp.period}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">{exp.company}</p>
                      {exp.link && (
                        <a href={exp.link} className={`${currentColor.text} hover:underline text-sm`}>
                          {exp.link}
                        </a>
                      )}
                      <ul className="mt-3 space-y-1">
                        {exp.achievements.map((achievement, achIndex) => (
                          <li key={achIndex} className="flex items-start gap-2 text-sm">
                            <span className={`w-2 h-2 ${currentColor.bg} rounded-full mt-2 flex-shrink-0`}></span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              )}

              {/* Projects (for data analyst) */}
              {resume.projects && (
                <section className="mb-8">
                  <h3 className={`text-2xl font-bold ${currentColor.text} mb-4 flex items-center gap-2`}>
                    <FaProjectDiagram />
                    PROJECTS
                  </h3>
                  {resume.projects.map((project, index) => (
                    <div key={index} className="mb-6 p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-xl font-semibold">{project.title}</h4>
                        <span className="text-sm text-gray-500">{project.period}</span>
                      </div>
                      
                      {project.description && (
                        <p className="text-gray-700 dark:text-gray-300 mb-3">{project.description}</p>
                      )}
                      
                      {project.link && (
                        <a href={project.link} className={`${currentColor.text} hover:underline text-sm block mb-2`}>
                          {project.link}
                        </a>
                      )}
                      
                      {project.links && (
                        <div className="mb-3">
                          {project.links.map((link, linkIndex) => (
                            <a key={linkIndex} href={link} className={`${currentColor.text} hover:underline text-sm block`}>
                              Assignment {linkIndex + 1}: {link}
                            </a>
                          ))}
                        </div>
                      )}
                      
                      {project.achievements && (
                        <ul className="space-y-1 mb-3">
                          {project.achievements.map((achievement, achIndex) => (
                            <li key={achIndex} className="flex items-start gap-2 text-sm">
                              <span className={`w-2 h-2 ${currentColor.bg} rounded-full mt-2 flex-shrink-0`}></span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      )}
                      
                      {project.technologies && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>Technologies Used:</strong> {project.technologies}
                        </p>
                      )}
                    </div>
                  ))}
                </section>
              )}

              {/* Download Button */}
              <div className="text-center pt-8 border-t">
                <a
                  href={resume.downloadLink}
                  download
                  className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${currentColor.gradient} text-white rounded-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl`}
                >
                  <FaDownload />
                  Download {resume.title} Resume
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ResumeViewer;
import { image } from "framer-motion/client";

import { FaReact, FaNodeJs, FaAws, FaGithub } from "react-icons/fa";
import {
  SiDotnet,
  SiMongodb,
  SiRedis,
  SiSwift,
  SiTailwindcss,
} from "react-icons/si";

// Import enhanced project data
import { projectCaseStudies } from "./project-case-studies";
// Legacy projects removed during cleanup
import {
  testimonials as enhancedTestimonials,
  legacyTestimonials,
} from "./testimonials";

export const navItems = [
  { name: "About", link: "#about" },
  { name: "Skills", link: "#skills" },
  { name: "Projects", link: "#projects" },
  {
    name: "Services",
    link: "/services",
    dropdown: [
      {
        name: "All Services",
        link: "/services",
        description: "Complete overview of all services offered",
      },
      {
        name: "Full-Stack Development",
        link: "/services/full-stack",
        description: "End-to-end web and mobile application development",
      },
      {
        name: "Cloud Architecture",
        link: "/services/cloud",
        description: "Scalable cloud infrastructure and DevOps solutions",
      },
      {
        name: "Data Analytics",
        link: "/services/data",
        description: "Data engineering and business intelligence solutions",
      },
      {
        name: "UX/UI Design",
        link: "/services/ux-ui",
        description: "User experience design and interface optimization",
      },
      {
        name: "Technical Consulting",
        link: "/services/consulting",
        description: "Strategic technology consulting and architecture review",
      },
    ],
  },
  { name: "Blog", link: "/blog" },
  { name: "Testimonials", link: "#testimonials" },
  { name: "Experience", link: "#experience" },
  { name: "Contact", link: "#contact" },
];

// Export enhanced projects for new components
export { projectCaseStudies };

// Export enhanced projects as default projects
export const projects = projectCaseStudies;

// Export enhanced testimonials for new components
export { enhancedTestimonials };

// Export legacy format for backward compatibility
export const testimonials = legacyTestimonials;

export const companies = [
  {
    id: 1,
    name: "Tech Innovations",
    img: "/cloud.svg",
    nameImg: "/cloudName.svg",
  },
];

export const workExperience = [
  {
    id: 1,
    title: "Frontend Engineer",
    desc: "Assisted in the development of a web-based platform using React.js, enhancing interactivity.",
    className: "md:col-span-2",
    thumbnail: "/exp1.svg",
  },
  {
    id: 2,
    title: "Mobile App Dev - Swwift",
    desc: "Designed and developed mobile app for both iOS  platforms using SwiftUI.",
    className: "md:col-span-2", // change to md:col-span-2
    thumbnail: "/exp2.svg",
  },
  {
    id: 3,
    title: "Freelance App Dev Project",
    desc: "Task completion for a client, including frontend and backend development.",
    className: "md:col-span-2", // change to md:col-span-2
    thumbnail: "/exp3.svg",
  },
  {
    id: 4,
    title: "Cloud Computing technology",
    desc: "Using cloud computing technologies such as AWS, Azure, and Google Cloud Platform.",
    className: "md:col-span-2",
    thumbnail: "/exp4.svg",
  },
];

export const socialMedia = [
  {
    id: 1,
    img: "/git.svg",
  },
  {
    id: 2,
    img: "/twit.svg",
  },
  {
    id: 3,
    img: "/link.svg",
  },
];

export const myInfo = {
  firstName: "Mikhail",
  lastName: "Ajaj",
  company: "Mikhail Ajaj CS",
  phone: "+1416-474-5749",
  email: "mikhailajaj@gmail.com",
  website: "https://mikhailajaj.github.io/",
  instagram: "https://www.instagram.com/mikhailajaj/",
};

export const qoutes = [
  {
    qoutesID: 1,
    qouteStr: "each step is one step closer to success",
    language: "en",
  },
  {
    qoutesID: 2,
    qouteStr:
      "There are many ways to solve a problem, but only one way to find it",
    language: "en",
  },
  {
    qoutesID: 3,
    qouteStr: "The process of building a product is not a linear process",
    language: "en",
  },
  {
    qoutesID: 4,
    qouteStr:
      "“The best way to predict the future is to invent it.” - Alan Kay",
    language: "en",
  },
  {
    qoutesID: 5,
    qouteStr: "“Simplicity is the soul of efficiency.” - Austin Freeman",
    language: "en",
  },
  {
    qoutesID: 6,
    qouteStr:
      "“A good plan today is better than a perfect plan tomorrow.” - George S. Patton",
    language: "en",
  },
  {
    qoutesID: 7,
    qouteStr: "Measure twice, cut once.",
    language: "en",
  },
  {
    qoutesID: 8,
    qouteStr: "种树最佳时间是二十年前，其次是现在。",
    translation:
      "The best time to plant a tree was 20 years ago. The second-best time is now.",
    language: "cn",
  },
  {
    qoutesID: 9,
    qouteStr:
      "“Perfection is not attainable, but if we chase perfection, we can catch excellence.” - Vince Lombardi",
    language: "en",
  },
  {
    qoutesID: 10,
    qouteStr:
      "“The only way to do great work is to love what you do.” - Steve Jobs",
    language: "en",
  },
  {
    qoutesID: 11,
    qouteStr: "“Wer im Glashaus sitzt, sollte nicht mit Steinen werfen.”",
    translation: "He who sits in a glass house should not throw stones.",
    language: "de",
  },
  {
    qoutesID: 12,
    qouteStr:
      "“Un pessimiste voit la difficulté dans chaque opportunité, un optimiste voit l'opportunité dans chaque difficulté.” - Winston Churchill",
    Translation:
      "A pessimist sees the difficulty in every opportunity, an optimist sees the opportunity in every difficulty.",
    language: "fr",
  },
  {
    qoutesID: 13,
    qouteStr:
      "“La vida es aquello que te pasa mientras estás ocupado haciendo otros planes.” - John Lennon",
    Translation:
      "Life is what happens to you while you’re busy making other plans.",
    language: "es",
  },
  {
    qoutesID: 14,
    qouteStr: "“纸上得来终觉浅，绝知此事要躬行。” - 陆游",
    Translation:
      "Knowledge from books is superficial; to understand it thoroughly, you must practice it.",
    language: "cn",
  },
];

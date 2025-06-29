import { FaReact, FaNodeJs, FaAws, FaGithub } from 'react-icons/fa';
import { SiDotnet, SiMongodb, SiRedis, SiSwift, SiTailwindcss } from 'react-icons/si';

// Legacy project format with actual icon components
export const legacyProjects = [
  {
    id: 1,
    title: "Secret Santa",
    des: "Modernize your holiday gift exchanges with an innovative app that simplifies event organization, from automated name drawing to gift preferences and event management.",
    img: "/p1.png",
    iconLists: [FaReact, SiDotnet, SiMongodb, SiRedis, FaAws, FaGithub, SiSwift, SiTailwindcss],
    link: "https://github.com/mikhailajaj/SecretSanta",
    categories: ["full-stack", "mobile"],
    metrics: "Reduced gift exchange planning time by 80%",
    github: "https://github.com/mikhailajaj/SecretSanta"
  },
  {
    id: 2,
    title: "Cloud Infrastructure Automation",
    des: "Developed a serverless architecture using AWS Lambda, API Gateway, and DynamoDB to automate deployment processes for a client's web applications.",
    img: "/cloud-project.png",
    iconLists: [FaAws, FaNodeJs, SiMongodb],
    link: "#",
    categories: ["cloud"],
    metrics: "Reduced deployment time from 2 hours to 5 minutes",
    github: "https://github.com/mikhailajaj/cloud-project"
  },
  {
    id: 3,
    title: "Data Analytics Dashboard",
    des: "Built an interactive dashboard for visualizing and analyzing customer behavior data, helping businesses make data-driven decisions.",
    img: "/data-project.png",
    iconLists: [FaReact, SiMongodb, FaNodeJs],
    link: "#",
    categories: ["data", "full-stack"],
    metrics: "Increased client conversion rate by 25%",
    github: "https://github.com/mikhailajaj/data-dashboard"
  }
];
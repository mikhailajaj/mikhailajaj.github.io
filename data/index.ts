import { image } from "framer-motion/client";

import { FaReact, FaNodeJs, FaAws, FaGithub } from 'react-icons/fa';
import { SiDotnet, SiMongodb, SiRedis,SiSwift ,SiTailwindcss } from 'react-icons/si';
  
export const navItems = [
    { name: "About", link: "#about"},
    { name: "Projects", link: "#projects" },
    { name: "Testimonials", link: "#testimonials" },
    { name: "Approach", link: "#approach" },
    { name: "Experiance", link: "#experiance" },
    { name: "Contact", link: "#contact" },
  ];
  
 
  
  export const projects = [
   
    {
      id: 1,
      title: "Secret Santa",
      des: "Modernize your holiday gift exchanges with an innovative app that simplifies event organization, from automated name drawing to gift preferences and event management.",
      img: "/p1.png",
      iconLists: [FaReact, SiDotnet, SiMongodb, SiRedis, FaAws, FaGithub, SiSwift, SiTailwindcss],
      link: "https://github.com/mikhailajaj/SecretSanta",
    }
   
  ];
  
  export const testimonials = [
    {
      quote:
        "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
      name: "Michael Johnson",
      title: "Director of AlphaStream Technologies",
    },
    {
      quote:
        "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
      name: "Michael Johnson",
      title: "Director of AlphaStream Technologies",
    },
    {
      quote:
        "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
      name: "Michael Johnson",
      title: "Director of AlphaStream Technologies",
    },
    {
      quote:
        "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
      name: "Michael Johnson",
      title: "Director of AlphaStream Technologies",
    },
    {
      quote:
        "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
      name: "Michael Johnson",
      title: "Director of AlphaStream Technologies",
    },
  ];
  
  export const companies = [
    {
      id: 1,
      name: "cloudinary",
      img: "/cloud.svg",
      nameImg: "/cloudName.svg",
    },
    {
      id: 2,
      name: "appwrite",
      img: "/app.svg",
      nameImg: "/appName.svg",
    },
    {
      id: 3,
      name: "HOSTINGER",
      img: "/host.svg",
      nameImg: "/hostName.svg",
    },
    {
      id: 4,
      name: "stream",
      img: "/s.svg",
      nameImg: "/streamName.svg",
    },
    {
      id: 5,
      name: "docker.",
      img: "/dock.svg",
      nameImg: "/dockerName.svg",
    },
  ];
  
  export const workExperience = [
    {
      id: 1,
      title: "Frontend Engineer Intern",
      desc: "Assisted in the development of a web-based platform using React.js, enhancing interactivity.",
      className: "md:col-span-2",
      thumbnail: "/exp1.svg",
    },
    {
      id: 2,
      title: "Mobile App Dev - JSM Tech",
      desc: "Designed and developed mobile app for both iOS & Android platforms using React Native.",
      className: "md:col-span-2", // change to md:col-span-2
      thumbnail: "/exp2.svg",
    },
    {
      id: 3,
      title: "Freelance App Dev Project",
      desc: "Led the dev of a mobile app for a client, from initial concept to deployment on app stores.",
      className: "md:col-span-2", // change to md:col-span-2
      thumbnail: "/exp3.svg",
    },
    {
      id: 4,
      title: "Lead Frontend Developer",
      desc: "Developed and maintained user-facing features using modern frontend technologies.",
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
  firstName: 'Mikhail',
  lastName: 'Ajaj',
  company: 'Mikhail Ajaj CS',
  phone: '+1416-474-5749',
  email: 'mikhailajaj@gmail.com',
  website: 'https://mikhailajaj.github.io/',
  instagram: 'https://www.instagram.com/mikhailajaj/'
};

export const qoutes = [{
  qoutesID : 1,
  qouteStr : "each step is one step closer to success",
  language : "en",
},
{
  qoutesID : 2,
  qouteStr : "There are many ways to solve a problem, but only one way to find it",
  language : "en",
},
{
  qoutesID : 3,
  qouteStr : "The process of building a product is not a linear process",
  language : "en",
},
{
  qoutesID : 4,
  qouteStr : "“The best way to predict the future is to invent it.” - Alan Kay",
  language : "en",
},
{
  qoutesID : 5,
  qouteStr : "“Simplicity is the soul of efficiency.” - Austin Freeman",
  language : "en",
},
{
  qoutesID : 6,
  qouteStr : "“A good plan today is better than a perfect plan tomorrow.” - George S. Patton",
  language : "en",
},
{
  qoutesID : 7,
  qouteStr : "Measure twice, cut once.",
  language : "en",
},
{
  qoutesID : 8,
  qouteStr : "种树最佳时间是二十年前，其次是现在。",
  translation : "The best time to plant a tree was 20 years ago. The second-best time is now.",
  language: "cn"
},
{
  qoutesID : 9,
  qouteStr : "“Perfection is not attainable, but if we chase perfection, we can catch excellence.” - Vince Lombardi",
  language : "en",
},
{
  qoutesID : 10,
  qouteStr : "“The only way to do great work is to love what you do.” - Steve Jobs",
  language : "en",
},
{
  qoutesID : 11,
  qouteStr : "“Wer im Glashaus sitzt, sollte nicht mit Steinen werfen.”",
  translation : "He who sits in a glass house should not throw stones.",
  language : "de",
},
{
  qoutesID : 12,
  qouteStr : "“Un pessimiste voit la difficulté dans chaque opportunité, un optimiste voit l'opportunité dans chaque difficulté.” - Winston Churchill",
  Translation: "A pessimist sees the difficulty in every opportunity, an optimist sees the opportunity in every difficulty.",
  language : "fr",
},
{
  qoutesID : 13,
  qouteStr : "“La vida es aquello que te pasa mientras estás ocupado haciendo otros planes.” - John Lennon",
  Translation: "Life is what happens to you while you’re busy making other plans.",
  language : "es",
},
{
  qoutesID : 14,
  qouteStr : "“纸上得来终觉浅，绝知此事要躬行。” - 陆游",
  Translation: "Knowledge from books is superficial; to understand it thoroughly, you must practice it.",
  language : "cn",
},
{
  qoutesID : 4,
  qouteStr : "“The best way to predict the future is to invent it.” - Alan Kay"
},
{
  qoutesID : 4,
  qouteStr : "“The best way to predict the future is to invent it.” - Alan Kay"
},
{
  qoutesID : 4,
  qouteStr : "“The best way to predict the future is to invent it.” - Alan Kay"
},
{
  qoutesID : 4,
  qouteStr : "“The best way to predict the future is to invent it.” - Alan Kay"
},
{
  qoutesID : 4,
  qouteStr : "“The best way to predict the future is to invent it.” - Alan Kay"
},
{
  qoutesID : 4,
  qouteStr : "“The best way to predict the future is to invent it.” - Alan Kay"
},
{
  qoutesID : 4,
  qouteStr : "“The best way to predict the future is to invent it.” - Alan Kay"
},
{
  qoutesID : 4,
  qouteStr : "“The best way to predict the future is to invent it.” - Alan Kay"
},
{
  qoutesID : 4,
  qouteStr : "“The best way to predict the future is to invent it.” - Alan Kay"
},
{
  qoutesID : 4,
  qouteStr : "“The best way to predict the future is to invent it.” - Alan Kay"
},
{
  qoutesID : 4,
  qouteStr : "“The best way to predict the future is to invent it.” - Alan Kay"
},
]

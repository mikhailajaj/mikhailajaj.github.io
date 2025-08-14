import type { EducationData } from "./schemas/education";

export const educationData: EducationData = {
  items: [
    {
      id: "sheridan-bsc-mobile",
      level: "university",
      title: "Honours Bachelor of Computer Science (Mobile Computing)",
      institution: "Sheridan College",
      location: "Oakville, ON, Canada",
      start: "2017",
      end: "2026",
      ongoing: true,
      link: "https://www.sheridancollege.ca/programs/bachelor-computer-science-mobile-computing",
      description:
        "Four-year honours program focused on mobile computing, software engineering, and modern development practices.",
      attachments: [
        {
          label: "Official Transcript (PDF)",
          href: "/docs/Education/Official-Transcript.pdf",
        },
      ],
      highlights: [
        "Advanced mobile development (iOS/Android)",
        "Data structures, algorithms, distributed systems",
        "Cloud-native development and DevOps foundations",
      ],
      order: 1,
    },
    {
      id: "port-credit-secondary",
      level: "highschool",
      title: "Ontario Secondary School Diploma",
      institution: "Port Credit Secondary School",
      location: "Mississauga, ON, Canada",
      end: "2017",
      description: "Graduated high school with focus on math and computer science.",
      order: 2,
    },
    {
      id: "tawjihi-jordan",
      level: "secondary",
      title: "High School (Tawjihi)",
      institution: "Jordan (national curriculum)",
      location: "Jordan",
      end: "2014",
      description: "Completed high school requirements (Tawjihi).",
      order: 3,
    },
    {
      id: "primary-syria",
      level: "primary",
      title: "Grades 1–11",
      institution: "Syrian national education system",
      location: "Syria",
      end: "2013",
      description: "Primary and middle school education through grade 11.",
      order: 4,
    },
  ],
};

export type { EducationItem, EducationData, EducationLevel } from "./schemas/education";

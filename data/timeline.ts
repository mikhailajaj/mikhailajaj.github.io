import type { TimelineData } from "./schemas/timeline";

export const timelineData: TimelineData = {
  items: [
    // Education
    {
      id: "edu-sheridan-bsc-mobile",
      type: "education",
      title: "Honours Bachelor of Computer Science (Mobile Computing)",
      institutionOrCompany: "Sheridan College",
      location: "Oakville, ON, Canada",
      start: "2022",
      end: "2026 (Fall)",
      ongoing: true,
      link: "https://www.sheridancollege.ca/programs/bachelor-computer-science-mobile-computing",
      description: "Honours BCS in Mobile Computing. Co-op terms expected Summer 2026 and Winter 2026.",
      attachments: [
        {
          label: "Official Transcript (Text Extract)",
          href: "/docs/Education/Official Transcript (1).txt",
        },
        {
          label: "Official Transcript (PDF)",
          href: "/docs/Education/Official Transcript (1).pdf",
        },
      ],
      highlights: [
        "Advanced iOS/Android development",
        "Software engineering, data structures, distributed systems",
        "Cloud-native development and DevOps foundations",
      ],
      order: 1,
    },
    {
      id: "edu-pcss",
      type: "education",
      title: "Ontario Secondary School Diploma",
      institutionOrCompany: "Port Credit Secondary School",
      location: "Mississauga, ON, Canada",
      end: "2016",
      description: "Graduated high school with a focus on math and technology.",
      order: 3,
    },

    // Placeholder work entries (you can replace with real roles)
    {
      id: "work-internship-1",
      type: "work",
      title: "Software Engineering Intern",
      institutionOrCompany: "Your Company Here",
      location: "Remote",
      start: "2025",
      end: "2025",
      description: "Contributed to frontend features and performance optimization.",
      highlights: ["React/Next.js", "Performance tuning", "Accessibility improvements"],
      order: 2,
    },
  ],
};

export type { TimelineBaseItem, TimelineData, TimelineType } from "./schemas/timeline";

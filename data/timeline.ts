import type { TimelineData } from "./schemas/timeline";

export const timelineData: TimelineData = {
  items: [
    // Work
    {
      id: "work-tandia-data-analyst",
      type: "work",
      title: "Data Analyst",
      institutionOrCompany: "Tandia",
      start: "2026 (Aug)",
      ongoing: true,
      description:
        "Full-time Data Analyst role following graduation, continuing on from the Summer 2026 co-op term.",
      order: 1,
    },
    {
      id: "work-tandia-coop",
      type: "work",
      title: "Co-op Student",
      institutionOrCompany: "Tandia",
      start: "2026 (May)",
      end: "2026 (Aug)",
      description:
        "Second co-op term of the Honours BCS program. The placement led to a full-time Data Analyst offer.",
      order: 3,
    },
    {
      id: "work-linkify-swe-intern",
      type: "work",
      title: "Software Developer Intern",
      institutionOrCompany: "Linkify",
      start: "2026 (Jan)",
      end: "2026 (Apr)",
      description:
        "First co-op term. Built and shipped features for Linkify apps as a software developer.",
      order: 4,
    },

    // Education
    {
      id: "edu-sheridan-bsc-mobile",
      type: "education",
      title: "Honours Bachelor of Computer Science (Mobile Computing)",
      institutionOrCompany: "Sheridan College",
      location: "Oakville, ON, Canada",
      start: "2022",
      end: "2026 (Aug)",
      ongoing: false,
      link: "https://www.sheridancollege.ca/programs/bachelor-computer-science-mobile-computing",
      description:
        "Honours BCS in Mobile Computing. Co-op terms at Linkify (Winter 2026) and Tandia (Summer 2026). Graduated August 2026.",
      attachments: [
        {
          label: "Official Transcript (Text Extract)",
          href: "/docs/Education/official-transcript.txt",
        },
        {
          label: "Unofficial Transcript (PDF, up to date)",
          href: "/docs/Education/SSR_TSRPT.pdf",
        },
      ],
      highlights: [
        "Advanced iOS/Android development",
        "Software engineering, data structures, distributed systems",
        "Cloud-native development and DevOps foundations",
      ],
      order: 2,
    },
    {
      id: "edu-pcss",
      type: "education",
      title: "Ontario Secondary School Diploma",
      institutionOrCompany: "Port Credit Secondary School",
      location: "Mississauga, ON, Canada",
      end: "2016",
      description: "Graduated high school with a focus on math and technology.",
      order: 5,
    },

  ],
};

export type { TimelineBaseItem, TimelineData, TimelineType } from "./schemas/timeline";

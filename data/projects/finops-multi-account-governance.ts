import { Project, Technology } from "@/data/schemas/project";

const technologies: Record<string, Technology> = {
  streamlit: { name: "Streamlit", category: "other", proficiency: "advanced", icon: "🧭" },
  python: { name: "Python", category: "backend", proficiency: "advanced", icon: "🐍" },
  plotly: { name: "Plotly", category: "other", proficiency: "advanced", icon: "📊" },
  pandas: { name: "Pandas", category: "backend", proficiency: "advanced", icon: "🐼" },
};

export const finopsMultiAccountGovernanceProject: Project = {
  id: "finops-multi-account-governance",
  title: "Multi-Account Cost Governance Platform",
  shortTitle: "Multi-Account Governance",
  domain: "cloud",
  description:
    "Coursework project for Cloud Economics (Sheridan College) — an enterprise-style dashboard for tracking tagging compliance across a simulated fleet of 400+ cloud resources spanning multiple accounts. The governance workflow is real; the resource inventory and compliance figures come from the course's sample dataset, not a live multi-account AWS org.",
  problem:
    "At scale, cost governance breaks down when tagging compliance is tracked manually across many accounts — there's no single view of data quality or which team owns which cost. The exercise modeled a 400+ resource fleet at 72% compliance to practice building that centralized view.",
  solution:
    "Built a dashboard that scores data quality, flags non-compliant resources for tag remediation, and reports compliance improvement over time — centralizing what would otherwise be a manual, account-by-account audit into one governance view.",

  impact: {
    metrics: [
      "Tagging compliance modeled at 72% → 94% (a 22-point improvement) across the exercise",
      "400+ cloud resources tracked in the sample multi-account dataset",
      "Interactive tag remediation with data-quality scoring and automated compliance reporting",
    ],
    businessValue:
      "Coursework demonstrating centralized, multi-account FinOps governance — the compliance-scoring and remediation approach mirrors real practice, but the resource counts and improvement numbers reflect the course dataset rather than a production environment.",
  },

  technologies: [technologies.streamlit, technologies.python, technologies.plotly, technologies.pandas],

  highlights: [
    "Centralized compliance tracking across a simulated multi-account fleet",
    "Data-quality scoring and interactive tag remediation",
    "Automated before/after compliance reporting",
  ],

  links: {
    github: "https://github.com/mikhailajaj/streamlit-dashboard/tree/main",
    demo: "https://app-dashboardgit-ybs8afgt8bdffehwt7lgom.streamlit.app/",
  },

  tags: ["Data Quality", "Governance", "Tag Management", "Multi-Account", "Streamlit", "Coursework"],

  featured: false,
  status: "completed",
  year: "2025",
  client: "Coursework — Cloud Economics, Sheridan College",
  role: "Student Developer",
  teamSize: 1,
  duration: "Fall 2025",
};

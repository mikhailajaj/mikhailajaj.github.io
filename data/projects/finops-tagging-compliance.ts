import { Project, Technology } from "@/data/schemas/project";

const technologies: Record<string, Technology> = {
  streamlit: { name: "Streamlit", category: "other", proficiency: "advanced", icon: "🧭" },
  python: { name: "Python", category: "backend", proficiency: "advanced", icon: "🐍" },
  plotly: { name: "Plotly", category: "other", proficiency: "advanced", icon: "📊" },
  aws: { name: "AWS", category: "cloud", proficiency: "intermediate", icon: "☁️" },
};

export const finopsTaggingComplianceProject: Project = {
  id: "finops-tagging-compliance",
  title: "CloudMart Tagging Compliance Dashboard",
  shortTitle: "Tagging Compliance Dashboard",
  domain: "cloud",
  description:
    "Coursework project for Cloud Economics (Sheridan College) — an interactive FinOps dashboard analyzing cloud resource tagging compliance and cost governance across a simulated multi-account environment. The dashboard and workflow logic are real and functional; the underlying cost figures and account data are a course-provided sample dataset, not a live production AWS bill.",
  problem:
    "Untagged cloud resources make it impossible to attribute spend to the right team or product, which is what a FinOps practice needs in order to act on cost. The course exercise modeled that scenario: a sample multi-account dataset with a meaningful share of untagged resources and no way to see where the cost was going.",
  solution:
    "Built a Streamlit dashboard that surfaces untagged spend, tracks tagging compliance over time, and walks through a remediation workflow — historical trend charts, a compliance KPI view, and before/after reporting to show the effect of tagging fixes on cost visibility.",

  impact: {
    metrics: [
      "$41K/month in untagged spend identified within the course dataset",
      "Historical trend analysis and real-time compliance KPI tracking",
      "Remediation workflow with before/after impact reporting",
    ],
    businessValue:
      "Coursework demonstrating the FinOps tagging-compliance workflow used in real cost governance practice — the technique transfers directly, though the $41K figure describes the sample dataset, not production infrastructure.",
  },

  technologies: [technologies.streamlit, technologies.python, technologies.plotly, technologies.aws],

  highlights: [
    "Streamlit + Plotly dashboard for tagging compliance and cost governance",
    "Historical trend analysis of untagged spend over time",
    "Automated remediation workflow with real-time KPI tracking",
  ],

  links: {
    github: "https://github.com/mikhailajaj/cloud-eco-activity-w-10/tree/main",
    demo: "https://cloud-eco-activity-w-10-v1.streamlit.app/",
  },

  tags: ["Streamlit", "Python", "Plotly", "AWS FinOps", "Cost Optimization", "Coursework"],

  featured: false,
  status: "completed",
  year: "2025",
  client: "Coursework — Cloud Economics, Sheridan College",
  role: "Student Developer",
  teamSize: 1,
  duration: "Fall 2025",
};

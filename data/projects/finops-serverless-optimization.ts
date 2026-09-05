import { Project, Technology } from "@/data/schemas/project";

const technologies: Record<string, Technology> = {
  streamlit: { name: "Streamlit", category: "other", proficiency: "advanced", icon: "🧭" },
  python: { name: "Python", category: "backend", proficiency: "advanced", icon: "🐍" },
  plotly: { name: "Plotly", category: "other", proficiency: "advanced", icon: "📊" },
  lambda: { name: "AWS Lambda", category: "cloud", proficiency: "intermediate", icon: "λ" },
};

export const finopsServerlessOptimizationProject: Project = {
  id: "finops-serverless-optimization",
  title: "Serverless FinOps Optimization Suite",
  shortTitle: "Serverless FinOps Optimization",
  domain: "cloud",
  description:
    "Coursework project for Cloud Economics (Sheridan College) — a Lambda cost analysis dashboard covering memory right-sizing, provisioned-concurrency optimization, and containerization recommendations across a simulated set of serverless functions. The analysis techniques are real; the function inventory, savings estimates, and forecasting numbers come from the course's sample dataset, not a live production workload.",
  problem:
    "Serverless costs are easy to lose track of — over-provisioned memory and idle provisioned concurrency quietly inflate the bill, and it's not obvious which functions are worth right-sizing versus containerizing. The exercise worked through a sample set of ~95 Lambda functions to practice identifying that waste.",
  solution:
    "Built a dashboard that analyzes memory allocation against actual usage, evaluates provisioned-concurrency cost/benefit, flags containerization candidates, and forecasts potential savings — including a 3D visualization for comparing migration candidates.",

  impact: {
    metrics: [
      "$750–1,500/month in potential savings modeled (a 30–60% reduction) across the sample function set",
      "~95 Lambda functions analyzed for memory right-sizing and provisioned-concurrency optimization",
      "ML-based cost forecasting exercise showing 85–95% accuracy on the sample data",
    ],
    businessValue:
      "Coursework demonstrating the serverless cost-optimization workflow — memory right-sizing, concurrency tuning, and containerization triage — used in real FinOps practice; the dollar figures describe the course dataset, not production Lambda spend.",
  },

  technologies: [technologies.streamlit, technologies.python, technologies.plotly, technologies.lambda],

  highlights: [
    "Lambda memory right-sizing and provisioned-concurrency cost analysis",
    "Containerization recommendations for high-cost functions",
    "ML-based cost forecasting with 3D visualization of migration candidates",
  ],

  links: {
    github: "https://github.com/mikhailajaj/serverless_cloud_activiry/tree/main",
    demo: "https://serverlesscloudactiviry-1.streamlit.app/",
  },

  tags: ["Serverless", "AWS Lambda", "ML Forecasting", "Cost Optimization", "Streamlit", "Coursework"],

  featured: false,
  status: "completed",
  year: "2025",
  client: "Coursework — Cloud Economics, Sheridan College",
  role: "Student Developer",
  teamSize: 1,
  duration: "Fall 2025",
};

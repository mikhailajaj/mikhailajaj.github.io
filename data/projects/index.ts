import type { Domain, Project } from '../schemas/project'
import { pulseShareProject } from './pulse-share'
import { tarneebOnlineProject } from './tarneeb-online'
import { finopsTaggingComplianceProject } from './finops-tagging-compliance'
import { finopsMultiAccountGovernanceProject } from './finops-multi-account-governance'
import { finopsServerlessOptimizationProject } from './finops-serverless-optimization'

export const allProjects: Project[] = [
  pulseShareProject,
  tarneebOnlineProject,
  finopsTaggingComplianceProject,
  finopsMultiAccountGovernanceProject,
  finopsServerlessOptimizationProject,
]

export const featuredProjects = allProjects.filter((p) => p.featured)

export const getProjectById = (id: string) =>
  allProjects.find((p) => p.id === id)

export const domainLabels: Record<Domain, string> = {
  'full-stack': 'Full-Stack',
  cloud: 'Cloud Engineering',
  data: 'Data Analytics',
  'ux-ui': 'UX/UI Design',
  consulting: 'Technical Consulting',
}

/** Card headings use the short title; detail pages use the full one. */
export const cardTitle = (p: Project) => p.shortTitle ?? p.title

export const techNames = (p: Project) => p.technologies.map((t) => t.name)

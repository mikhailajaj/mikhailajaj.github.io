import React from 'react';
import { notFound } from 'next/navigation';
import { getProjectBySlug, enhancedProjects } from '@/data/projects-enhanced';
import ProjectDetailPage from '@/components/ProjectDetailPage';

export const dynamicParams = false; // Required for static export

export async function generateStaticParams() {
  return enhancedProjects.map((project) => ({
    id: project.slug,
  }));
}

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = getProjectBySlug(id);
  
  if (!project) {
    notFound();
  }
  
  return <ProjectDetailPage project={project} />;
}
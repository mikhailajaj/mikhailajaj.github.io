/**
 * Projects Page - Server Component
 * 
 * Fetches projects data on the server and passes it to client components.
 * This provides optimal performance with server-side rendering and client-side interactivity.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { MainLayout } from '@/components/core/Layout/MainLayout';
import { ProjectsClient } from '@/components/features/projects/ProjectsClient';
import { getProjects } from '@/lib/api/projects';
import { DevelopmentBanner } from '@/components/ui/DevelopmentBanner';

// Static metadata for SEO
export const metadata: Metadata = {
  title: 'Projects | Mikhail Ajaj Portfolio',
  description: 'Explore my portfolio of full-stack development, cloud engineering, and data analytics projects.',
  keywords: ['projects', 'portfolio', 'full-stack', 'cloud', 'data analytics', 'web development'],
  openGraph: {
    title: 'Projects | Mikhail Ajaj Portfolio',
    description: 'Explore my portfolio of full-stack development, cloud engineering, and data analytics projects.',
    type: 'website',
  },
};

// Loading component
function ProjectsLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64"></div>
        ))}
      </div>
    </div>
  );
}

// Main server component
export default async function ProjectsPage() {
  // Fetch projects data on the server
  const projects = await getProjects();

  return (
    <MainLayout 
      showNavigation={true}
      showFooter={true}
      showScrollProgress={true}
      backgroundVariant="default"
    >
      <div className="min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <DevelopmentBanner 
              variant="template" 
              message="Project portfolio is being updated with detailed case studies and live demos"
            />
          </div>
          <Suspense fallback={<ProjectsLoading />}>
            {/* Pass server-fetched data to client component */}
            <ProjectsClient projects={projects} />
          </Suspense>
        </div>
      </div>
    </MainLayout>
  );
}

// Optional: Generate static params for dynamic routes
// export async function generateStaticParams() {
//   const projects = await getProjects();
//   return projects.map((project) => ({
//     id: project.id,
//   }));
// }
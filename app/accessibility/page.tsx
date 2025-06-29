import React from 'react';
import { Metadata } from 'next';
import EnhancedLayout from '@/components/layouts/EnhancedLayout';
import PageHeader from '@/components/navigation/PageHeader';
import AccessibilityDemo from '@/components/accessibility/AccessibilityDemo';

export const metadata: Metadata = {
  title: 'Accessibility Features | Mikhail Ajaj',
  description: 'Demonstration of accessibility features and WCAG 2.1 AA compliance in Mikhail Ajaj\'s portfolio website.',
  keywords: ['Accessibility', 'WCAG', 'Web Accessibility', 'Inclusive Design', 'Screen Reader Support'],
};

export default function AccessibilityPage() {
  return (
    <EnhancedLayout>
      <PageHeader
        title="Accessibility Features"
        subtitle="WCAG 2.1 AA Compliance"
        description="This page demonstrates the accessibility features implemented throughout the website to ensure an inclusive experience for all users, regardless of abilities or disabilities."
        stats={[
          { label: "WCAG Level", value: "AA" },
          { label: "Keyboard Support", value: "100%" },
          { label: "Screen Reader", value: "Optimized" }
        ]}
        actions={[
          {
            label: "View Source Code",
            href: "https://github.com/mikhailajaj/portfolio",
            variant: "secondary"
          }
        ]}
      />

      <AccessibilityDemo />
    </EnhancedLayout>
  );
}
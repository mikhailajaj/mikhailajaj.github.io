import React from "react";
import type { Metadata } from "next";
import ResumeViewer from "@/components/features/resume/ResumeViewer";

export const metadata: Metadata = {
  title: "Resume | Mikhail Ajaj",
  description:
    "View Mikhail Ajaj's professional resume - Software Developer, Data Analyst, and Cloud Engineer with $30M+ business impact.",
  openGraph: {
    title: "Resume | Mikhail Ajaj",
    description:
      "View Mikhail Ajaj's professional resume - Software Developer, Data Analyst, and Cloud Engineer with $30M+ business impact.",
    url: "https://mikhailajaj.github.io/resume",
    type: "profile",
  },
};

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <ResumeViewer />
    </div>
  );
}
"use client";

import React, { createContext, useContext, useMemo } from "react";
import { educationData } from "@/data/education";
import type { EducationData, EducationItem } from "@/data/schemas/education";

interface EducationContextType {
  items: EducationItem[];
  getByLevel: (level: EducationItem["level"]) => EducationItem[];
  getById: (id: string) => EducationItem | undefined;
}

const EducationContext = createContext<EducationContextType | undefined>(undefined);

export function EducationProvider({ children }: { children: React.ReactNode }) {
  const sorted = useMemo(() => {
    // Sort ascending by order so that order: 1 is most recent/highest education
    return [...educationData.items].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }, []);

  const value: EducationContextType = useMemo(() => ({
    items: sorted,
    getByLevel: (level) => sorted.filter((i) => i.level === level),
    getById: (id) => sorted.find((i) => i.id === id),
  }), [sorted]);

  return (
    <EducationContext.Provider value={value}>{children}</EducationContext.Provider>
  );
}

export function useEducation() {
  const ctx = useContext(EducationContext);
  if (!ctx) {
    throw new Error("useEducation must be used within an EducationProvider");
    }
  return ctx;
}

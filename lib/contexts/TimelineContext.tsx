"use client";

import React, { createContext, useContext, useMemo, useState, useCallback } from "react";
import { timelineData } from "@/data/timeline";
import type { TimelineData, TimelineBaseItem, TimelineType } from "@/data/schemas/timeline";

interface TimelineContextType {
  items: TimelineBaseItem[];
  leftItems: TimelineBaseItem[]; // education
  rightItems: TimelineBaseItem[]; // work
  getByType: (type: TimelineType) => TimelineBaseItem[];
  hoverSide: "left" | "right" | "both" | null;
  setHoverSide: (side: "left" | "right" | "both" | null) => void;
}

const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

export function TimelineProvider({ children }: { children: React.ReactNode }) {
  const sorted = useMemo(() => {
    return [...timelineData.items].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }, []);

  const leftItems = useMemo(() => sorted.filter((i) => i.type === "education"), [sorted]);
  const rightItems = useMemo(() => sorted.filter((i) => i.type === "work"), [sorted]);

  const [hoverSide, setHoverSide] = useState<"left" | "right" | "both" | null>(null);

  const value: TimelineContextType = useMemo(
    () => ({
      items: sorted,
      leftItems,
      rightItems,
      getByType: (type) => sorted.filter((i) => i.type === type),
      hoverSide,
      setHoverSide,
    }),
    [sorted, leftItems, rightItems, hoverSide]
  );

  return <TimelineContext.Provider value={value}>{children}</TimelineContext.Provider>;
}

export function useTimeline() {
  const ctx = useContext(TimelineContext);
  if (!ctx) throw new Error("useTimeline must be used within a TimelineProvider");
  return ctx;
}

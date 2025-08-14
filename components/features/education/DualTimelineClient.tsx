"use client";

import dynamic from "next/dynamic";

const DualTimelineInner = dynamic(() => import("@/components/features/education/DualTimeline"), {
  ssr: false,
});

export default function DualTimelineClient() {
  return <DualTimelineInner />;
}


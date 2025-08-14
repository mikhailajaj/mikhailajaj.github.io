"use client";

import React from "react";
import { Card } from "@/components/ui/card";

export function RecognitionTimeline() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Card className="p-8 bg-card/80 backdrop-blur-md">
          <div className="text-center text-foreground">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Recognition Timeline</h2>
            <p className="text-muted-foreground">Recognition timeline component - Coming soon in Phase 2</p>
          </div>
        </Card>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { FaPalette } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

export default function ThemeDemo() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <FaPalette />
            Theme System Demo
          </h1>
          <p className="text-xl text-muted-foreground">
            Theme system demonstration page
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Theme Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>Dark/Light mode support</div>
              <div>Accessibility features</div>
              <div>Responsive design</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Component Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Buttons</h3>
                <div className="flex gap-3">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
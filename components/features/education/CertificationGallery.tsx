"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { certifications } from "@/data/certifications";

export function CertificationGallery() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Card className="p-8 bg-card/80 backdrop-blur-md">
          <div className="text-center text-foreground">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Certifications</h2>
            <p className="text-muted-foreground mb-8">Planned certifications labeled as Wanted</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-left">
              {certifications.map((c) => (
                <div key={c.id} className="border border-border rounded-lg p-4 bg-background/50">
                  <div className="flex items-center gap-3">
                    <div className="relative w-20 h-20">
                      {c.imageUrl ? (
                        <Image src={c.imageUrl} alt={c.title} fill sizes="48px" className="rounded object-contain" />
                      ) : (
                        <div className="w-full h-full rounded bg-muted" aria-hidden />
                      )}

                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{c.title}</div>
                      <div className="text-xs text-muted-foreground">{c.provider}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    {c.url ? (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Learn more
                      </a>
                    ) : (
                      <span />
                    )}
                   
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { balloonMessages, type BalloonMessage } from "@/data/balloonMessages";
import Balloon, { type BalloonModel as UIBalloonModel, type BalloonPayload } from "@/components/balloon-game/Balloon";

// Map category to a colored balloon source. Extend with your colored SVGs.
const categoryToSource = (category: string) => {
  const key = (category || "").toLowerCase();
  // Example mapping: return different files when you add them
  // if (key.includes("phil")) return "/ballons/ballone-yellow.svg";
  // if (key.includes("science")) return "/ballons/ballone-blue.svg";
  return "/ballons/ballone.svg"; // default
};

// Dialog message payload
type MessageDialog = { title: string; description?: string };

type Balloon = {
  id: number;
  msg: BalloonMessage;
  xPct: number; // 0..100
  yPx: number;  // from bottom
  speed: number; // px per frame
  size: number;  // width in px (height scales by svg ratio)
  vx: number;    // horizontal drift px/frame
};

const SVG_RATIO = 450 / 300; // height/width from updated svg viewBox

export default function BalloonGame() {
  const [started, setStarted] = useState(false);
  const [dialog, setDialog] = useState<MessageDialog | null>(null);

  const nextId = useRef(1);
  const [models, setModels] = useState<UIBalloonModel[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);


  const randomMessage = useCallback((): BalloonMessage => {
    return balloonMessages[Math.floor(Math.random() * balloonMessages.length)];
  }, []);

  // Spawn a new DOM balloon model
  const spawnBalloon = useCallback(() => {
    const msg = randomMessage();
    const id = nextId.current++;
    const cw = containerRef.current?.clientWidth || 800;
    const size = Math.max(24, Math.min(64, cw * (0.035 + Math.random() * 0.02)));
    const xPct = Math.random() * 90 + 5; // 5..95
    const speed = 0.2 + Math.random() * 0.5; // slower float speed
    const vx = (Math.random() - 0.5) * 0.6; // slight horizontal drift
    const model: UIBalloonModel = {
      id,
      payload: {
        id: msg.id,
        category: msg.category,
        title: msg.title,
        description: msg.description,
      },
      xPct,
      size,
      speed,
      vx,
      source: categoryToSource(msg.category),
    };
    setModels((prev) => [...prev, model]);
  }, [randomMessage]);

  // Start spawner loop
  useEffect(() => {
    if (!started) return;
    const interval = window.setInterval(spawnBalloon, 1200);
    return () => {
      clearInterval(interval);
    };
  }, [started, spawnBalloon]);

  const handlePop = useCallback((id: number, payload: { title: string; description?: string }) => {
    setModels((prev) => prev.filter((m) => m.id !== id));
    setDialog({ title: payload.title, description: payload.description });
  }, []);

  const handleOffscreen = useCallback((id: number) => {
    setModels((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return (
    <section className="mx-auto max-w-5xl px-4 -mt-6">
    <div className="rounded-xl border bg-card/60 p-6 backdrop-blur">
      <h2 className="text-xl font-semibold mb-2">Playful Knowledge</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Pop color-coded balloons to reveal short thoughts and quotes. More categories and messages coming over time.
      </p>
      
    
    <div className="relative w-full">
      {!started ? (
        <div className="flex justify-center">
          <button
            className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 text-white shadow-lg transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
            onClick={() => setStarted(true)}
          >
            Start Balloon Game
          </button>
        </div>
      ) : (
        <div
          className="relative mx-auto mt-4 h-[520px] w-full max-w-4xl overflow-hidden rounded-xl border bg-background/60 backdrop-blur"
          role="region"
          aria-label="Balloon game area"
        >
          {/* Floating balloons as individual components */}
          {models.map((m) => (
            <Balloon
              key={m.id}
              model={m}
              containerHeight={520}
              onPop={handlePop}
              onOffscreen={handleOffscreen}
            />
          ))}

          {/* Message Dialog */}
          {dialog && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40">
              <div className="max-w-md w-[90%] rounded-lg border bg-background p-5 shadow-2xl">
                <div className="text-lg font-semibold">{dialog.title}</div>
                {dialog.description && (
                  <div className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                    {dialog.description}
                  </div>
                )}
                <div className="mt-5 flex justify-end">
                  <button
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground shadow hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                    onClick={() => setDialog(null)}
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    </div>
  </section>
  );
}


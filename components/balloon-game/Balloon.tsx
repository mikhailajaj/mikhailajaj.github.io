"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

export type BalloonPayload = {
  id: number;
  category: string;
  title: string;
  description?: string;
};

export type BalloonModel = {
  id: number;
  payload: BalloonPayload;
  xPct: number;  // 0..100 left position (centered via translateX)
  size: number;  // width in px (height auto)
  speed: number; // vertical px per frame
  vx: number;    // horizontal drift px per frame
  source: string; // image src (svg)
};

type Props = {
  model: BalloonModel;
  containerHeight: number;
  onPop: (id: number, payload: BalloonPayload) => void;
  onOffscreen: (id: number) => void;
  fallbackSrc?: string;
};

export default function Balloon({ model, containerHeight, onPop, onOffscreen, fallbackSrc = "/ballons/ballone.svg" }: Props) {
  const [xPct, setXPct] = useState(model.xPct);
  const [yPx, setYPx] = useState(0);
  const [src, setSrc] = useState(model.source || fallbackSrc);
  const [offscreen, setOffscreen] = useState(false);
  const offscreenRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const step = useCallback(() => {
    if (offscreenRef.current) return; // stop loop once offscreen
    setYPx((prev) => {
      const next = prev + model.speed;
      if (next > containerHeight + 20) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        offscreenRef.current = true;
        setOffscreen(true); // defer parent update to effect
        return prev; // freeze position
      }
      return next;
    });
    setXPct((prev) => Math.min(98, Math.max(2, prev + (model.vx / Math.max(1, containerHeight)) * 100)));
    rafRef.current = requestAnimationFrame(step);
  }, [containerHeight, model.speed, model.vx]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [step]);

  // Notify parent after commit to avoid updating parent during child render
  useEffect(() => {
    if (offscreen) {
      const id = model.id;
      // Defer parent update to macrotask queue to avoid setState during another render
      const t = setTimeout(() => onOffscreen(id), 0);
      return () => clearTimeout(t);
    }
  }, [offscreen, model.id, onOffscreen]);

  const handleClick = () => {
    onPop(model.id, model.payload);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Pop ${model.payload.category} balloon`}
      className="absolute -translate-x-1/2 select-none"
      style={{
        left: `${xPct}%`,
        bottom: `${yPx}px`,
        width: model.size,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="balloon"
        draggable={false}
        style={{ width: model.size, height: "auto" }}
        onError={() => setSrc(fallbackSrc)}
      />
    </button>
  );
}


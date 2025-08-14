"use client";

import { useEffect } from "react";
import { useAccessibility } from "../context/AccessibilityContext";

/**
 * Screen Reader Announcer Component
 * Announces messages to screen readers via aria-live regions
 */
export function ScreenReaderAnnouncer() {
  const { announcements, clearAnnouncements } = useAccessibility();

  useEffect(() => {
    if (announcements.length > 0) {
      // Clear announcements after they've been read
      const timer = setTimeout(clearAnnouncements, 3000);
      return () => clearTimeout(timer);
    }
  }, [announcements, clearAnnouncements]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcements.map((announcement, index) => (
        <div key={index}>{announcement}</div>
      ))}
    </div>
  );
}
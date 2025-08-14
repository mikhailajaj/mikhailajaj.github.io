// Balloon messages data
// Add more messages over time in this simple array. Keep ids unique.

export type BalloonMessage = {
  id: number;
  category: string; // e.g., "philosophy", "science", etc.
  title: string;
  description: string;
};

export const balloonMessages: BalloonMessage[] = [
  {
    id: 1,
    category: "philosophy",
    title: "Imagination is more important than knowledge",
    description:
      "While knowledge is limited, imagination reaches beyond limits with a sense of creativity.",
  },
  // Add more like:
  // { id: 2, category: "motivation", title: "Stay curious", description: "Curiosity is a compass for discovery." },
];

export default balloonMessages;


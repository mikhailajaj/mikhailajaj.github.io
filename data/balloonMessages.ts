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
  {
    id: 2,
    category: "philosophy",
    title: "Beyond Space or Time",
    description:
      "Absolute freedom is where infinity lives where time has no chance of changing the outcome.",
  },
  {
    id: 3,
    category: "philosophy",
    title: "The Joker's Wisdom",
    description:
      "Joker is my favorite card as it could substitute any cards in a card game, but can only used once until you find a substitution to substitutional (Joker).",
  },
  {
    id: 4,
    category: "philosophy",
    title: "Ace of Diamonds ♦️",
    description:
      "Ace of diamonds ♦️ is my second favorite card, not just because it Ace, but even if its own world flips up side down, won't change.",
  },
];

export default balloonMessages;


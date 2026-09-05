export type TimelineType = "education" | "work";

export interface TimelineBaseItem {
  id: string;
  type: TimelineType;
  title: string; // e.g., Program name or Role title
  institutionOrCompany: string; // institution for education, company for work
  location?: string;
  start?: string;
  end?: string;
  ongoing?: boolean;
  description?: string;
  link?: string;
  attachments?: { label: string; href: string }[];
  highlights?: string[];
  order?: number; // lower = more recent
}

export interface TimelineData {
  items: TimelineBaseItem[];
}

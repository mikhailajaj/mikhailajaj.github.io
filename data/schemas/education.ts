export type EducationLevel =
  | "university"
  | "college"
  | "highschool"
  | "secondary"
  | "primary"
  | "other";

export interface EducationAttachment {
  label: string;
  href: string; // URL to external resource or public asset
}

export interface EducationItem {
  id: string;
  level: EducationLevel;
  title: string; // Program or milestone title
  institution: string;
  location?: string;
  start?: string; // Flexible string (e.g., "2018", "2018-09", "2018 (Fall)")
  end?: string; // Flexible string (e.g., "2022", "2026 (Fall)")
  ongoing?: boolean; // Whether this item is in progress
  description?: string;
  link?: string; // Official program or institution link
  attachments?: EducationAttachment[]; // e.g., transcript, certificates
  highlights?: string[]; // bullet points
  order?: number; // lower = more recent/higher priority in display
}

export interface EducationData {
  items: EducationItem[];
}

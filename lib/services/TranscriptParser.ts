export interface ParsedCourse {
  code?: string;
  name?: string;
  grade?: string; // letter grade token if present
  numericGrade?: number; // parsed numeric grade (e.g., 89)
  term?: string;
  credits?: number;
  subject?: string; // e.g., PROG, INFO, DBAS
  raw: string;
}

// Common grade tokens we'll accept. We'll filter out W and F family.
const GRADE_TOKENS = [
  "A+","A","A-","B+","B","B-","C+","C","C-","D+","D","D-",
  "P","CR","NCR","S","U","INC","IP","PASS","FAIL","WD","W","F","WF"
];

// Course code like COMP 12345 or MATH123 or CS-101.
const COURSE_CODE = /\b([A-Z]{2,5})[-\s]?(\d{3,5}[A-Z]{0,3})\b/;

// Grade token anywhere in the line
const GRADE_REGEX = new RegExp(`\\b(${GRADE_TOKENS.map(t => t.replace('+','\\+')).join('|')})\\b`);

// Term like Fall 2024, Winter 2026, 2024-09, 2024/09, 2024
const TERM_REGEX = /(Fall|Winter|Spring|Summer)\s+\d{4}|\b\d{4}[-\/]\d{2}\b|\b\d{4}\b/i;

export function parseTranscript(text: string): ParsedCourse[] {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const courses: ParsedCourse[] = [];

  let currentTerm: string | undefined;

  for (const rawLine of lines) {
    // Attempt to derive a numeric grade when present as a number before grade points (e.g., "... 8911.40" -> 89)
    const extractNumericGrade = (s: string): number | undefined => {
      // Primary: use the last decimal number on the line (grade points like 657.50, 8911.40, 10012.00)
      const lastNum = s.match(/(\d+)\.(\d{2})\s*$/);
      if (lastNum) {
        const intPart = lastNum[1];
        // Handle perfect score encoded as 100xx.xx
        if (intPart.startsWith('100')) return 100;
        // Common encoding encodes grade in the first two digits (e.g., 8911.40 -> 89)
        if (intPart.length >= 2) {
          const firstTwo = parseInt(intPart.slice(0, 2), 10);
          if (firstTwo >= 0 && firstTwo <= 100) return firstTwo;
        }
        // If first three digits look like a valid grade (0-100), use them
        if (intPart.length >= 3) {
          const firstThree = parseInt(intPart.slice(0, 3), 10);
          if (firstThree >= 0 && firstThree <= 100) return firstThree;
        }
      }
      // Secondary: match patterns like 9612.00 -> 96, and 10012.00 -> 100
      const m = s.match(/\b(\d{2,3})(\d{2})\.(\d{2})\b/);
      if (m) {
        const maybe = parseInt(m[1], 10);
        if (String(maybe).startsWith('100')) return 100;
        if (maybe >= 0 && maybe <= 100) return maybe;
        // Fallback to first two digits
        const two = parseInt(String(maybe).slice(0, 2), 10);
        if (two >= 0 && two <= 100) return two;
      }
      // Fallback: look for a standalone 2-3 digit number near the end of the line
      const tail = s.slice(-20);
      const m2 = tail.match(/\b(\d{2,3})\b/);
      if (m2) {
        const n = parseInt(m2[1], 10);
        if (String(n).startsWith('100')) return 100;
        if (n >= 0 && n <= 100) return n;
      }
      return undefined;
    };
    const line = rawLine.replace(/\s{2,}/g, ' ').trim();

    // Term headers like "Fall 2017", "Winter 2025"
    const termHeader = line.match(/\b(Fall|Winter|Spring|Summer)\s+\d{4}\b/i);
    if (termHeader) {
      currentTerm = termHeader[0];
      continue;
    }

    // Skip obvious headers or separators
    if (/^Page\b|^--- Page|^Transcript|^Official|^Sheridan|^Student|^Program\s*:|^Academic Program History/i.test(line)) continue;
    if (/^Course Description Credits Grade Points Repeat$/i.test(line)) continue;

    const codeMatch = line.match(COURSE_CODE);
    const gradeMatch = line.match(GRADE_REGEX);

    if (!codeMatch && !gradeMatch) {
      // Not confident it's a course line
      continue;
    }

    const code = codeMatch ? `${codeMatch[1]} ${codeMatch[2]}` : undefined;
    const subject = codeMatch ? codeMatch[1] : undefined;
    const grade = gradeMatch ? gradeMatch[1].toUpperCase() : undefined;

    // Detect Withdraw/Fail patterns even when concatenated with numbers like W0.00 or F0.00
    const wfPattern = /\b(WD|FAIL|WF)\b|(?:^|\s)(W|F)\d*(?:\.\d+)?\b/i;
    if (wfPattern.test(line)) {
      continue;
    }

    // Try to extract a simple title by removing code and grade tokens
    let name: string | undefined = undefined;
    if (code) {
      name = line.replace(COURSE_CODE, '').trim();
    } else {
      name = line;
    }
    if (grade) name = name.replace(new RegExp(`\\b${grade}\\b`,'i'), '').trim();

    // Remove extra separators
    name = name.replace(/[-•|]+/g, ' ').replace(/\s{2,}/g, ' ').trim();

    // Strip trailing credits/points clusters from the name (e.g., "3.00 8911.40")
    name = name.replace(/\s+\d+(?:\.\d+)?\s+\d+(?:\.\d+)?\s*$/, '').trim();

    // Credits (best-effort): look for number before or after the name
    let credits: number | undefined;
    const creditMatch = line.match(/(\d+(?:\.\d+)?)(?:\s*credits?)?/i);
    if (creditMatch) credits = parseFloat(creditMatch[1]);

    const term = currentTerm;

    const numericGrade = extractNumericGrade(line);

    courses.push({ code, name, grade, numericGrade, term, credits, subject, raw: rawLine });
  }

  // Deduplicate by code+term if present
  const seen = new Set<string>();
  return courses.filter(c => {
    const key = `${c.code || c.name}-${c.term || ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}


// Extract per-term GPA from transcript text using the same term header detection
// Looks for lines like: "Program  GPA  for Term:3.52"
export function parseTermGPA(text: string): Record<string, number> {
  const lines = text.split(/\r?\n/).map((l) => l.trim());
  const result: Record<string, number> = {};
  let currentTerm: string | undefined;
  const termHeaderRe = /\b(Fall|Winter|Spring|Summer)\s+\d{4}\b/i;
  const gpaRe = /Program\s+GPA\s+for\s+Term\s*:\s*([0-4](?:\.\d{1,2})?)/i;

  for (const raw of lines) {
    const line = raw.replace(/\s{2,}/g, " ").trim();
    const th = line.match(termHeaderRe);
    if (th) {
      // Normalize casing (Fall/Winter/Spring/Summer YYYY)
      const season = th[1][0].toUpperCase() + th[1].slice(1).toLowerCase();
      const year = (th[0].match(/\d{4}/) || [""])[0];
      currentTerm = `${season} ${year}`;
      continue;
    }
    const gm = line.match(gpaRe);
    if (gm && currentTerm) {
      const val = parseFloat(gm[1]);
      if (Number.isFinite(val)) {
        result[currentTerm] = val;
      }
    }
  }

  return result;
}

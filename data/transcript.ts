export interface Course {
  subject: string
  code: string
  name: string
  grade: string       // numeric string, 'W', 'F', 'S', or '' for no-grade entries
  credits: number
  note?: string       // e.g. 'Repeat course excluded from GPA calculation'
}

export interface Term {
  id: string
  label: string
  courses: Course[]
  withdrawalDate?: string
}

export const studentInfo = {
  name: 'Mikhail Ajaj',
  programCode: 'Bach ApplCompSci - Mobile Comp',
  programFull: 'Honours Bachelor of Computer Science (Mobile Computing)',
  institution: 'Sheridan College Institute of Technology and Advanced Learning',
  address: '1430 Trafalgar Road, Oakville, ON L6H 1L1 Canada',
  phone: '(905) 845-9430',
  activeDate: '17/07/2017',
  graduationDate: '14/08/2026',
  printDate: '05/09/2026',
  status: 'Graduated',
  documentType: 'Unofficial Transcript',
}

export const terms: Term[] = [
  {
    id: 'fall-2017',
    label: 'Fall 2017',
    courses: [
      { subject: 'ENGL', code: '17889GD', name: 'Composition & Rhetoric',          grade: '65', credits: 3 },
      { subject: 'ENGL', code: '17889GD', name: 'Composition & Rhetoric',          grade: '',   credits: 0 },
      { subject: 'MATH', code: '10025',   name: 'Mathematics for Computing',        grade: '83', credits: 3 },
      { subject: 'PROG', code: '10004',   name: 'Programming Principles',           grade: '88', credits: 6 },
      { subject: 'SYST', code: '10082',   name: 'Operating Systems Fundamentals',   grade: '89', credits: 3 },
      { subject: 'TELE', code: '10025',   name: 'Network Foundations',              grade: '80', credits: 3 },
    ],
  },
  {
    id: 'winter-2018',
    label: 'Winter 2018',
    courses: [
      { subject: 'DBAS', code: '20146',   name: 'Database Modelling',               grade: '75',  credits: 3 },
      { subject: 'INFO', code: '10229',   name: 'Mobile Computing',                 grade: '100', credits: 3 },
      { subject: 'INFO', code: '16206',   name: 'Scripting & Web Languages',        grade: '82',  credits: 3 },
      { subject: 'MATH', code: '11044',   name: 'Linear Algebra',                   grade: '95',  credits: 3 },
      { subject: 'PHYS', code: '13796GD', name: 'Creativity in Physics',            grade: '71',  credits: 3 },
      { subject: 'PROG', code: '10065',   name: "Interactive Appl'n Development",   grade: '96',  credits: 6 },
    ],
  },
  {
    id: 'fall-2018',
    label: 'Fall 2018',
    courses: [
      { subject: 'CULT', code: '25288GD', name: 'The Power of Voice',               grade: '72', credits: 3 },
      { subject: 'INFO', code: '23431',   name: 'Intro to Info Sys Security',        grade: '80', credits: 3 },
      { subject: 'PROG', code: '20082',   name: 'Mobile Application Principles',    grade: '83', credits: 6 },
      { subject: 'PROG', code: '24310',   name: 'Programming Languages',            grade: '89', credits: 3 },
      { subject: 'SYST', code: '19207',   name: 'Computer Systems Architecture',    grade: '84', credits: 3 },
      { subject: 'TELE', code: '25892',   name: 'Wireless Network Principles',      grade: '78', credits: 3 },
    ],
  },
  {
    id: 'winter-2019',
    label: 'Winter 2019',
    courses: [
      { subject: 'MATH', code: '17028GD', name: 'Creativity in Mathematics',        grade: 'W',  credits: 3 },
      { subject: 'MATH', code: '29599',   name: 'Calculus',                         grade: '78', credits: 3 },
      { subject: 'PROG', code: '20261',   name: 'Mobile Web App Development',       grade: '78', credits: 3 },
      { subject: 'PROG', code: '23672',   name: 'Data Structures and Algorithms',   grade: '73', credits: 6 },
      { subject: 'PROG', code: '27545',   name: 'Web Application Design & Impl.',   grade: '93', credits: 3 },
      { subject: 'PSYC', code: '16571GD', name: 'Principles of Psychology',         grade: '50', credits: 3 },
    ],
  },
  {
    id: 'fall-2019',
    label: 'Fall 2019',
    withdrawalDate: '08/10/2019',
    courses: [
      { subject: 'COWT', code: '10023',   name: 'Co-Operative Education Forum',     grade: 'W', credits: 1 },
      { subject: 'MATH', code: '37198',   name: 'Statistics for Data Science',      grade: 'W', credits: 3 },
      { subject: 'PHIL', code: '28877GD', name: 'Philosophy of the Environment',    grade: 'W', credits: 3 },
      { subject: 'PROG', code: '30000',   name: 'Enterprise Software Systems',      grade: 'W', credits: 3 },
      { subject: 'PROG', code: '31975',   name: 'Advanced Mobile App Developmen',   grade: 'W', credits: 6 },
      { subject: 'SYST', code: '30049',   name: 'Software Design',                  grade: 'W', credits: 3 },
      { subject: 'SYST', code: '30102',   name: 'OS Analysis and Design',           grade: 'W', credits: 3 },
    ],
  },
  {
    id: 'fall-2020',
    label: 'Fall 2020',
    courses: [
      { subject: 'COWT', code: '10023',   name: 'Co-Operative Education Forum',     grade: 'S', credits: 1 },
      { subject: 'MATH', code: '37198',   name: 'Statistics for Data Science',      grade: 'F', credits: 3,
        note: 'Repeated · Excluded from GPA' },
      { subject: 'PROG', code: '30000',   name: 'Enterprise Software Systems',      grade: '53', credits: 3 },
      { subject: 'PROG', code: '31975',   name: 'Advanced Mobile App Developmen',   grade: '67', credits: 4 },
      { subject: 'SYST', code: '30049',   name: 'Software Design',                  grade: '68', credits: 3 },
      { subject: 'SYST', code: '30102',   name: 'OS Analysis and Design',           grade: '53', credits: 3 },
    ],
  },
  {
    id: 'winter-2021',
    label: 'Winter 2021',
    courses: [
      { subject: 'INFO', code: '31179',   name: 'Human Computer Interaction',       grade: 'W', credits: 3 },
      { subject: 'INFO', code: '47546',   name: 'Theory of Computation',            grade: 'W', credits: 3 },
      { subject: 'PROG', code: '34104',   name: 'Distributed Mobility',             grade: 'W', credits: 3 },
      { subject: 'SYST', code: '30025',   name: 'Software Engineering',             grade: 'F', credits: 4,
        note: 'Repeated · Excluded from GPA' },
    ],
  },
  {
    id: 'fall-2022',
    label: 'Fall 2022',
    courses: [
      { subject: 'CULT', code: '20859GD', name: 'Collective Memory',                grade: 'F', credits: 3 },
      { subject: 'MATH', code: '37198',   name: 'Statistics for Data Science',      grade: '53', credits: 3 },
      { subject: 'TELE', code: '21895',   name: 'Network Engineering',              grade: 'W', credits: 3 },
    ],
  },
  {
    id: 'fall-2023',
    label: 'Fall 2023',
    courses: [
      { subject: 'INFO', code: '40975',   name: 'Artificial Intelligence',          grade: '64', credits: 3 },
      { subject: 'TELE', code: '21895',   name: 'Network Engineering',              grade: '90', credits: 3 },
    ],
  },
  {
    id: 'winter-2024',
    label: 'Winter 2024',
    courses: [
      { subject: 'INFO', code: '31179',   name: 'Human Computer Interaction',       grade: '89', credits: 3 },
      { subject: 'INFO', code: '47546',   name: 'Theory of Computation',            grade: '84', credits: 3 },
      { subject: 'PROG', code: '34104',   name: 'Distributed Mobility',             grade: '86', credits: 3 },
      { subject: 'SYST', code: '30025',   name: 'Software Engineering',             grade: '88', credits: 4 },
    ],
  },
  {
    id: 'spring-summer-2024',
    label: 'Spring / Summer 2024',
    courses: [
      { subject: 'COWT', code: '18888',   name: 'Degree Internship Work-Term 1',    grade: 'W', credits: 1 },
    ],
  },
  {
    id: 'fall-2024',
    label: 'Fall 2024',
    courses: [
      { subject: 'DBAS', code: '40551',   name: 'Bus Intell and Data Mining',       grade: '89', credits: 3 },
      { subject: 'INFO', code: '49635',   name: 'CS Capstone Proj. (Inception)',     grade: '77', credits: 4 },
      { subject: 'PROG', code: '48031',   name: 'Cognitive Computing',              grade: '96', credits: 3 },
    ],
  },
  {
    id: 'winter-2025',
    label: 'Winter 2025',
    courses: [
      { subject: 'HIST', code: '11228GD', name: 'Creating Public History',          grade: '76', credits: 3 },
      { subject: 'SCIE', code: '10009GD', name: 'Intro to Environmental Science',   grade: '67', credits: 3 },
    ],
  },
  {
    id: 'spring-summer-2025',
    label: 'Spring / Summer 2025',
    courses: [
      { subject: 'LITT', code: '14895GD', name: 'Intro to the Short Story',         grade: '84', credits: 3 },
      { subject: 'LITT', code: '25892GD', name: 'The 21st Century Novel',           grade: '85', credits: 3 },
    ],
  },
  {
    id: 'fall-2025',
    label: 'Fall 2025',
    courses: [
      { subject: 'INFO', code: '45828',   name: 'CS Capstone Proj (Elaboration)',   grade: '81', credits: 4 },
      { subject: 'INFO', code: '49971',   name: 'Cloud Economics',                  grade: '87', credits: 3 },
      { subject: 'PROG', code: '49332',   name: 'Ubiquitous Computing',             grade: '88', credits: 3 },
      { subject: 'SYST', code: '48557',   name: 'QA & Software Testing',            grade: '80', credits: 3 },
    ],
  },
]

// ─── Display terms ────────────────────────────────────────────────────────────
// Withdrawn (W) and failed (F) attempts are kept in `terms` as the full record
// but hidden from the public site; terms left empty by the filter are dropped.
export const displayTerms: Term[] = terms
  .map((term) => ({
    ...term,
    courses: term.courses.filter((c) => c.grade !== 'W' && c.grade !== 'F'),
  }))
  .filter((term) => term.courses.length > 0)

// ─── Computed stats ───────────────────────────────────────────────────────────
export function computeStats(termList: Term[]) {
  const numericGrades: number[] = []
  let totalCredits = 0

  for (const term of termList) {
    for (const course of term.courses) {
      const n = parseInt(course.grade)
      if (!isNaN(n)) {
        numericGrades.push(n)
        totalCredits += course.credits
      } else if (course.grade === 'S') {
        totalCredits += course.credits
      }
    }
  }

  const avg = numericGrades.length
    ? Math.round(numericGrades.reduce((a, b) => a + b, 0) / numericGrades.length)
    : 0

  const highest = numericGrades.length ? Math.max(...numericGrades) : 0

  return {
    terms: termList.length,
    completedCourses: numericGrades.length,
    totalCredits,
    average: avg,
    highest,
  }
}

// ─── Grade style helper ───────────────────────────────────────────────────────
export function gradeStyle(grade: string): { text: string; bg: string; label: string } {
  const dim    = 'text-[rgb(var(--text-muted-rgb)/0.5)]'
  const muted  = 'text-[rgb(var(--text-muted-rgb))]'
  const ok     = 'text-[rgb(var(--accent-ok-rgb))]'
  const okBg   = 'bg-[rgb(var(--accent-ok-rgb)/0.1)]'
  const cool   = 'text-[rgb(var(--accent-cool-rgb))]'
  const coolBg = 'bg-[rgb(var(--accent-cool-rgb)/0.1)]'
  const warm   = 'text-[rgb(var(--accent-warm-rgb))]'
  const warmBg = 'bg-[rgb(var(--accent-warm-rgb)/0.1)]'
  const alert  = 'text-[rgb(var(--accent-alert-rgb))]'
  const alertBg= 'bg-[rgb(var(--accent-alert-rgb)/0.1)]'
  const neutralBg = 'bg-[rgb(var(--surface-rgb)/0.42)]'

  if (!grade)        return { text: dim,   bg: '',          label: '—' }
  if (grade === 'W') return { text: muted, bg: neutralBg,   label: 'W' }
  if (grade === 'F') return { text: alert, bg: alertBg,     label: 'F' }
  if (grade === 'S') return { text: ok,    bg: okBg,        label: 'S' }

  const n = parseInt(grade)
  if (n >= 90) return { text: ok,   bg: okBg,      label: grade }
  if (n >= 80) return { text: cool, bg: coolBg,    label: grade }
  if (n >= 70) return { text: 'text-[rgb(var(--text-rgb))]', bg: neutralBg, label: grade }
  if (n >= 60) return { text: warm, bg: warmBg,    label: grade }
  return         { text: 'text-[rgb(var(--accent-rgb))]', bg: 'bg-[rgb(var(--accent-rgb)/0.1)]', label: grade }
}

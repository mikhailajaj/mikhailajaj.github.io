# Course Docs (Per-Course Details)

Purpose: Provide structured, citation-ready notes for each course to power the right-side details in the Education timeline.

How to use:
1. Copy `_TEMPLATE.md` to a new file named after the course code, e.g., `PROG20065.md`.
2. Fill the frontmatter with the course code, term, year, subject, title, and a concise summary.
3. Add 2–4 assignments with one-sentence briefs and optional links.
4. List the tech stack (4–10 items).
5. Add relevant resources (syllabus, repos, readings).
6. Include MLA citations (always use MLA style).

Sections and fields:
- Frontmatter:
  - code (e.g., PROG20065)
  - term (e.g., Fall 2024)
  - year (e.g., 2024)
  - subject (e.g., PROG/INFO/DBAS)
  - title
  - summary
  - tech_stack: string[]
  - assignments: { title, brief, link? }[]
  - resources: { label, href }[]
  - mla_citations: { author, title, container, publisher, date, url }[]

Example MLA (web source):
- Lastname, Firstname. "Title of Web Page." Website Name, Publisher, Day Mon. Year, URL. Accessed Day Mon. Year.

Workflow tip:
- Keep one doc per course and add updates after each assignment. This primes you for discussions and quizzes and helps build essay-ready evidence with page/citation info where applicable.


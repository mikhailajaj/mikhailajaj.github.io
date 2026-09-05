'use client'

import {
  AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts'
import { displayTerms as terms } from '@/data/transcript'

// ── Data: Grade journey per term ──────────────────────────────────────────
const trendData = terms
  .map(term => {
    const grades = term.courses.map(c => parseInt(c.grade)).filter(n => !isNaN(n))
    if (grades.length === 0) return null
    const avg = Math.round((grades.reduce((a, b) => a + b, 0) / grades.length) * 10) / 10
    return {
      term: term.label
        .replace('Spring/Summer', 'S/S')
        .replace('Winter', 'Win')
        .replace(/ 20(\d\d)$/, " '$1"),
      avg,
      high: Math.max(...grades),
      low: Math.min(...grades),
      range: [Math.min(...grades), Math.max(...grades)] as [number, number],
    }
  })
  .filter(Boolean) as {
    term: string; avg: number; high: number; low: number; range: [number, number]
  }[]

// ── Data: Grade distribution buckets ─────────────────────────────────────
const rawBuckets = [
  { range: '90 – 100', min: 90, max: 100, count: 0, color: '#facc15' },
  { range: '80 – 89',  min: 80, max:  89, count: 0, color: '#3b82f6' },
  { range: '70 – 79',  min: 70, max:  79, count: 0, color: '#94a3b8' },
  { range: '60 – 69',  min: 60, max:  69, count: 0, color: '#fb923c' },
  { range: '50 – 59',  min: 50, max:  59, count: 0, color: '#f97316' },
  { range: 'Withdrawn (W)', min: -1, max: -1, count: 0, color: '#475569' },
  { range: 'Failed (F)',    min: -2, max: -2, count: 0, color: '#7f1d1d' },
]

for (const term of terms) {
  for (const course of term.courses) {
    const n = parseInt(course.grade)
    if (!isNaN(n)) {
      for (const b of rawBuckets) {
        if (n >= b.min && n <= b.max) { b.count++; break }
      }
    } else if (course.grade === 'W') rawBuckets[5].count++
    else if (course.grade === 'F') rawBuckets[6].count++
  }
}
const distData = rawBuckets.filter(b => b.count > 0)

// ── Data: Subject performance ─────────────────────────────────────────────
const SUBJECT_COLORS: Record<string, string> = {
  PROG: '#f97316',
  INFO: '#3b82f6',
  SYST: '#facc15',
  MATH: '#fb923c',
  TELE: '#7f1d1d',
  DBAS: '#60a5fa',
  ENGL: '#64748b',
  PHYS: '#64748b',
  PSYC: '#64748b',
  HIST: '#64748b',
  SCIE: '#64748b',
  LITT: '#64748b',
  CULT: '#64748b',
}

const subjectMap: Record<string, { grades: number[]; color: string }> = {}
for (const term of terms) {
  for (const course of term.courses) {
    const n = parseInt(course.grade)
    if (!isNaN(n)) {
      if (!subjectMap[course.subject]) {
        subjectMap[course.subject] = {
          grades: [],
          color: SUBJECT_COLORS[course.subject] ?? '#64748b',
        }
      }
      subjectMap[course.subject].grades.push(n)
    }
  }
}
const subjectData = Object.entries(subjectMap)
  .map(([subject, { grades, color }]) => ({
    subject,
    avg: Math.round(grades.reduce((a, b) => a + b, 0) / grades.length),
    count: grades.length,
    color,
  }))
  .sort((a, b) => b.avg - a.avg)

// ── Data: Cumulative credits ──────────────────────────────────────────────
let running = 0
const creditsData = terms.map(term => {
  const earned = term.courses
    .filter(c => !isNaN(parseInt(c.grade)) || c.grade === 'S')
    .reduce((s, c) => s + c.credits, 0)
  running += earned
  return {
    term: term.label
      .replace('Spring/Summer', 'S/S')
      .replace('Winter', 'Win')
      .replace(/ 20(\d\d)$/, " '$1"),
    earned,
    cumulative: running,
  }
})

// ── Shared styles ─────────────────────────────────────────────────────────
const AXIS_STYLE  = { fontSize: 11, fill: '#94a3b8', fontFamily: 'monospace' }
const GRID_STROKE = 'rgba(148,163,184,0.12)'
const CURSOR_FILL = 'rgba(249,115,22,0.08)'

// ── Custom Tooltips ───────────────────────────────────────────────────────
function TrendTooltip({ active, payload, label }: {
  active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string
}) {
  if (!active || !payload?.length) return null
  const main = payload.find(p => p.name === 'avg')
  const high = payload.find(p => p.name === 'high')
  const low  = payload.find(p => p.name === 'low')
  return (
    <div className="bg-[var(--bg-elevated)] border border-[rgb(var(--text-muted-rgb)/0.18)] rounded-xl px-4 py-3 shadow-2xl text-xs font-mono">
      <p className="text-[rgb(var(--text-soft-rgb))] mb-2">{label}</p>
      {main && <p className="text-[rgb(var(--accent-rgb))] font-bold">Avg: {main.value}%</p>}
      {high && <p className="text-[rgb(var(--text-muted-rgb))]">High: {high.value}%</p>}
      {low  && <p className="text-[rgb(var(--text-muted-rgb))]">Low: {low.value}%</p>}
    </div>
  )
}

function SimpleTooltip({ active, payload, label }: {
  active?: boolean; payload?: { value: number; color: string }[]; label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[var(--bg-elevated)] border border-[rgb(var(--text-muted-rgb)/0.18)] rounded-xl px-4 py-3 shadow-2xl text-xs font-mono">
      <p className="text-[rgb(var(--text-soft-rgb))] mb-1">{label}</p>
      <p className="font-bold" style={{ color: payload[0].color }}>
        {payload[0].value}{typeof payload[0].value === 'number' && payload[0].value > 10 ? '%' : ''}
      </p>
    </div>
  )
}

function CreditTooltip({ active, payload, label }: {
  active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[var(--bg-elevated)] border border-[rgb(var(--text-muted-rgb)/0.18)] rounded-xl px-4 py-3 shadow-2xl text-xs font-mono">
      <p className="text-[rgb(var(--text-soft-rgb))] mb-2">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name === 'cumulative' ? 'Total' : 'Earned'}: {p.value} cr
        </p>
      ))}
    </div>
  )
}

// ── Chart components ──────────────────────────────────────────────────────

function ChartCard({ title, subtitle, children }: {
  title: string; subtitle?: string; children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl bg-[rgb(var(--surface-rgb)/0.34)] border border-[rgb(var(--text-muted-rgb)/0.14)] p-5">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-[rgb(var(--text-rgb))]">{title}</h3>
        {subtitle && <p className="text-xs text-[rgb(var(--text-muted-rgb))] mt-0.5 font-mono">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

// Chart 1 — Grade Journey
function GradeJourneyChart() {
  return (
    <ChartCard
      title="Grade Journey"
      subtitle="Average grade per semester · semesters with only W/F grades hidden"
    >
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 40 }}>
          <defs>
            <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#f97316" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="rangeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.14} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke={GRID_STROKE} vertical={false} />

          <XAxis
            dataKey="term"
            tick={{ ...AXIS_STYLE, fontSize: 10 }}
            angle={-35}
            textAnchor="end"
            interval={0}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[45, 105]}
            tick={AXIS_STYLE}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `${v}`}
          />

          <Tooltip content={<TrendTooltip />} cursor={{ fill: CURSOR_FILL }} />

          {/* Reference lines */}
          <ReferenceLine y={80} stroke="rgba(249,115,22,0.22)" strokeDasharray="4 4" />
          <ReferenceLine y={70} stroke="rgba(250,204,21,0.22)" strokeDasharray="4 4" />

          {/* High-low range band */}
          <Area
            type="monotone"
            dataKey="high"
            stroke="none"
            fill="url(#rangeGrad)"
            name="high"
            legendType="none"
          />
          <Area
            type="monotone"
            dataKey="low"
            stroke="none"
            fill="#0f172a"
            name="low"
            legendType="none"
          />

          {/* Average line */}
          <Area
            type="monotone"
            dataKey="avg"
            stroke="#f97316"
            strokeWidth={2}
            fill="url(#avgGrad)"
            dot={{ fill: '#f97316', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#facc15', strokeWidth: 0 }}
            name="avg"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-1 px-1">
        <div className="flex items-center gap-1.5 text-xs text-[rgb(var(--text-muted-rgb))] font-mono">
          <div className="w-6 h-px bg-[rgb(var(--accent-rgb))] relative">
            <div className="absolute inset-0 border-t border-dashed border-[rgb(var(--accent-rgb)/0.4)]" />
          </div>
          80% threshold
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[rgb(var(--text-muted-rgb))] font-mono">
          <div className="w-6 border-t border-dashed border-[rgb(var(--accent-warm-rgb)/0.45)]" />
          70% threshold
        </div>
      </div>
    </ChartCard>
  )
}

// Chart 2 — Grade Distribution
function GradeDistributionChart() {
  return (
    <ChartCard
      title="Grade Distribution"
      subtitle="Count of courses per grade range"
    >
      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={distData}
          layout="vertical"
          margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
          barCategoryGap="25%"
        >
          <CartesianGrid stroke={GRID_STROKE} horizontal={false} />
          <XAxis
            type="number"
            tick={AXIS_STYLE}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="range"
            tick={{ ...AXIS_STYLE, fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={90}
          />
          <Tooltip content={<SimpleTooltip />} cursor={{ fill: CURSOR_FILL }} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} name="courses">
            {distData.map((entry, i) => (
              <Cell key={i} fill={entry.color} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

// Chart 3 — Subject Strengths
function SubjectPerformanceChart() {
  return (
    <ChartCard
      title="Performance by Subject"
      subtitle="Average numeric grade per subject code · sorted by avg"
    >
      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={subjectData}
          layout="vertical"
          margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
          barCategoryGap="25%"
        >
          <CartesianGrid stroke={GRID_STROKE} horizontal={false} />
          <XAxis
            type="number"
            domain={[50, 105]}
            tick={AXIS_STYLE}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `${v}%`}
          />
          <YAxis
            type="category"
            dataKey="subject"
            tick={AXIS_STYLE}
            tickLine={false}
            axisLine={false}
            width={44}
          />
          <ReferenceLine x={80} stroke="rgba(249,115,22,0.22)" strokeDasharray="4 4" />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null
              const entry = subjectData.find(s => s.subject === label)
              return (
                <div className="bg-[var(--bg-elevated)] border border-[rgb(var(--text-muted-rgb)/0.18)] rounded-xl px-4 py-3 shadow-2xl text-xs font-mono">
                  <p className="text-[rgb(var(--text-soft-rgb))] mb-1">{label}</p>
                  <p className="font-bold" style={{ color: payload[0].fill as string }}>
                    Avg: {payload[0].value}%
                  </p>
                  {entry && (
                    <p className="text-[rgb(var(--text-muted-rgb))]">{entry.count} course{entry.count > 1 ? 's' : ''}</p>
                  )}
                </div>
              )
            }}
            cursor={{ fill: CURSOR_FILL }}
          />
          <Bar dataKey="avg" radius={[0, 4, 4, 0]} name="avg">
            {subjectData.map((entry, i) => (
              <Cell key={i} fill={entry.color} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

// Chart 4 — Cumulative Credits
function CumulativeCreditsChart() {
  return (
    <ChartCard
      title="Credits Accumulated"
      subtitle="Total earned credits over time · steps include only terms with earned credits"
    >
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          data={creditsData}
          margin={{ top: 10, right: 10, left: -10, bottom: 40 }}
        >
          <defs>
            <linearGradient id="creditGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={GRID_STROKE} vertical={false} />
          <XAxis
            dataKey="term"
            tick={{ ...AXIS_STYLE, fontSize: 10 }}
            angle={-35}
            textAnchor="end"
            interval={0}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={AXIS_STYLE}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `${v}`}
          />
          <Tooltip content={<CreditTooltip />} cursor={{ fill: CURSOR_FILL }} />
          <Area
            type="monotone"
            dataKey="cumulative"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#creditGrad)"
            dot={{ fill: '#3b82f6', r: 2.5, strokeWidth: 0 }}
            activeDot={{ r: 4, fill: '#facc15', strokeWidth: 0 }}
            name="cumulative"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

// ── Main export ───────────────────────────────────────────────────────────
export default function TranscriptCharts() {
  return (
    <div className="space-y-4">
      {/* Grade Journey — full width */}
      <GradeJourneyChart />

      {/* Distribution + Subject side by side */}
      <div className="grid md:grid-cols-2 gap-4">
        <GradeDistributionChart />
        <SubjectPerformanceChart />
      </div>

      {/* Cumulative credits — full width */}
      <CumulativeCreditsChart />
    </div>
  )
}

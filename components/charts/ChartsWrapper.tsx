'use client'

import dynamic from 'next/dynamic'

const TranscriptCharts = dynamic(() => import('./TranscriptCharts'), {
  ssr: false,
  loading: () => (
    <div className="space-y-4">
      {[320, 300, 260].map(h => (
        <div
          key={h}
          className="rounded-2xl bg-[rgb(var(--surface-rgb)/0.34)] border border-[rgb(var(--text-muted-rgb)/0.14)] animate-pulse"
          style={{ height: h }}
        />
      ))}
    </div>
  ),
})

export default function ChartsWrapper() {
  return <TranscriptCharts />
}

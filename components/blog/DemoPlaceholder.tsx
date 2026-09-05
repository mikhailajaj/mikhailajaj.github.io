const LABELS: Record<string, string> = {
  SortingVisualization: 'Sorting algorithm visualization',
  GraphVisualization: 'Graph algorithm visualization',
  PathfindingVisualization: 'Pathfinding visualization',
  AdvancedAlgorithmShowcase: 'Interactive algorithm showcase',
  VennDiagramComponent: 'SQL join Venn diagram',
  CodeTableComponent: 'Annotated code table',
}

/**
 * Stands in for an interactive component that lived in the previous site and
 * has not been ported. Says so plainly rather than leaving a silent gap where
 * the article's prose refers to a diagram the reader cannot see.
 */
export default function DemoPlaceholder({ name }: { name: string }) {
  const label = LABELS[name] ?? 'Interactive demo'

  return (
    <div
      className="my-8 p-5 rounded-2xl border border-dashed
                 border-[rgb(var(--accent-warm-rgb)/0.3)] bg-[rgb(var(--accent-warm-rgb)/0.05)]"
    >
      <p className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest
                    text-[rgb(var(--accent-warm-rgb)/0.9)] mb-2">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
        {label}
      </p>
      <p className="text-sm text-[rgb(var(--text-muted-rgb))] leading-relaxed">
        This article originally embedded an interactive {label.toLowerCase()}. The
        component has not been ported to this version of the site yet — the
        explanation below stands on its own in the meantime.
      </p>
    </div>
  )
}

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import DemoPlaceholder from './DemoPlaceholder'
import Figure from './Figure'

/** `:::demo ComponentName` markers left by the MDX port. */
const DEMO_MARKER = /^:::demo\s+(\S+)\s*$/

/** `:::figure /path/to.svg | Caption text` — a diagram with a caption. */
const FIGURE_MARKER = /^:::figure\s+(\S+)(?:\s*\|\s*(.+))?\s*$/

/**
 * Renders a ported article. This is a server component, so react-markdown runs
 * at build time and the published page ships no markdown JavaScript.
 */
export default function Article({ body }: { body: string }) {
  // Split on demo markers so each becomes a real component rather than text.
  type Segment =
    | { type: 'md'; value: string }
    | { type: 'demo'; value: string }
    | { type: 'figure'; src: string; caption?: string }

  const segments: Segment[] = []
  let buffer: string[] = []

  const flush = () => {
    if (buffer.length) segments.push({ type: 'md', value: buffer.join('\n') })
    buffer = []
  }

  for (const line of body.split('\n')) {
    const figure = line.match(FIGURE_MARKER)
    if (figure) {
      flush()
      segments.push({ type: 'figure', src: figure[1], caption: figure[2] })
      continue
    }

    const demo = line.match(DEMO_MARKER)
    if (demo) {
      flush()
      segments.push({ type: 'demo', value: demo[1] })
      continue
    }

    buffer.push(line)
  }
  flush()

  return (
    <div className="article">
      {segments.map((segment, i) => {
        if (segment.type === 'figure') {
          return <Figure key={i} src={segment.src} caption={segment.caption} />
        }
        if (segment.type === 'demo') {
          return <DemoPlaceholder key={i} name={segment.value} />
        }
        return (
          <ReactMarkdown
            key={i}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {segment.value}
          </ReactMarkdown>
        )
      })}
    </div>
  )
}

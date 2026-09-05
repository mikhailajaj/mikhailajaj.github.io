import { getSvgSize } from '@/lib/posts'

/**
 * A diagram inside an article, with its caption.
 *
 * Dimensions are read from the asset at build time so the browser reserves the
 * right space before the image loads — an unsized diagram mid-article shoves
 * the reader's position down as it arrives.
 */
export default function Figure({
  src,
  caption,
}: {
  src: string
  caption?: string
}) {
  const size = getSvgSize(src)

  return (
    <figure className="my-8">
      <div
        className="rounded-2xl overflow-hidden border border-[rgb(var(--text-muted-rgb)/0.14)]
                   bg-[rgb(var(--bg-elevated-rgb)/0.5)] p-3"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={caption ?? ''}
          width={size?.width}
          height={size?.height}
          className="w-full h-auto rounded-lg"
          loading="lazy"
          decoding="async"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-xs text-[rgb(var(--text-muted-rgb)/0.85)] text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

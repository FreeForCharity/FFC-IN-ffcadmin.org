import { ImageResponse } from 'next/og'
import { LEGACY_WP_ADMIN_PAGES } from '@/data/legacy-wordpress-administration'

/**
 * Shared OpenGraph image rendering (#255).
 *
 * Build-time branded 1200×630 PNGs via Next's built-in `next/og` (satori) — no
 * extra dependencies. Used by the root `opengraph-image.tsx` and the per-section
 * leaf images so social shares are visually differentiated by title.
 *
 * Satori requires every element with multiple children to set `display: flex`.
 */
export const OG_SIZE = { width: 1200, height: 630 } as const
export const OG_CONTENT_TYPE = 'image/png'

export function renderOgImage({
  title,
  eyebrow,
  accent = '#2dd4bf',
}: {
  title: string
  eyebrow: string
  accent?: string
}): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #0f172a 0%, #134e4a 100%)',
        color: 'white',
        padding: '80px',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize: 32,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: accent,
          fontWeight: 700,
        }}
      >
        {eyebrow}
      </div>
      <div style={{ display: 'flex', fontSize: 70, fontWeight: 800, lineHeight: 1.1 }}>{title}</div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 30,
        }}
      >
        <span style={{ display: 'flex', fontWeight: 700 }}>Free For Charity</span>
        <span style={{ display: 'flex', color: '#94a3b8' }}>ffcadmin.org</span>
      </div>
    </div>,
    { ...OG_SIZE }
  )
}

/** Per-leaf OG image for a Legacy WordPress Administration page (#255). */
export function renderLegacyLeafOg(slug: string): ImageResponse {
  const page = LEGACY_WP_ADMIN_PAGES.find((p) => p.slug === slug)
  // Fail the build loudly on a slug/data mismatch rather than shipping a
  // generic image with the wrong title.
  if (!page) {
    throw new Error(
      `renderLegacyLeafOg: no LEGACY_WP_ADMIN_PAGES entry for slug "${slug}" — directory/data mismatch.`
    )
  }
  return renderOgImage({
    eyebrow: 'Legacy WordPress Administration',
    title: page.title,
    accent: '#38bdf8',
  })
}

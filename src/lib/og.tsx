import { readFileSync } from 'node:fs'
import { join } from 'node:path'
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

/**
 * The canonical FFC circle mark (`public/Svgs/ffc-logo.svg`) as a base64 data
 * URI, read once at build time. Satori rasterizes embedded SVG `<img>`s via
 * resvg, so the gradients render faithfully. Cached so repeated OG routes in a
 * single build don't re-read the file.
 */
let ffcLogoDataUri: string | null = null
function ffcCircleLogo(): string {
  if (ffcLogoDataUri === null) {
    const svg = readFileSync(join(process.cwd(), 'public/Svgs/ffc-logo.svg'), 'utf8')
    ffcLogoDataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
  }
  return ffcLogoDataUri
}

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

/**
 * Roadmap share image — the FFC circle mark as the hero element beside the
 * title. Used by the `/roadmap` opengraph-image + twitter-image routes so
 * social shares of the public roadmap are branded with the FFC logo.
 */
export function renderRoadmapOg({
  eyebrow = 'Free For Charity',
  title = 'The Public Roadmap',
  subtitle = 'Every charity we’re helping — from intake to launch.',
}: {
  eyebrow?: string
  title?: string
  subtitle?: string
} = {}): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
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
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          width: '700px',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 32,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: '#2dd4bf',
            fontWeight: 700,
          }}
        >
          {eyebrow}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>
            {title}
          </div>
          <div style={{ display: 'flex', marginTop: 24, fontSize: 34, color: '#cbd5e1' }}>
            {subtitle}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            fontSize: 30,
          }}
        >
          <span style={{ display: 'flex', fontWeight: 700, color: '#cbd5e1' }}>
            Free websites for 501(c)(3) nonprofits
          </span>
          <span style={{ display: 'flex', color: '#94a3b8' }}>ffcadmin.org</span>
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={ffcCircleLogo()} width={380} height={380} alt="" />
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

import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Free For Charity Admin — volunteer & admin training hub'

export default function Image() {
  return renderOgImage({
    eyebrow: 'Free For Charity Admin',
    title: 'Volunteer & Admin Training Hub',
  })
}

import { renderRoadmapOg, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'The FFC Public Roadmap — every charity Free For Charity is helping'

export default function Image() {
  return renderRoadmapOg()
}

import { renderLegacyLeafOg, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Free For Charity — Legacy WordPress Administration'

export default function Image() {
  return renderLegacyLeafOg('wordpress-training-programs')
}

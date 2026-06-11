import type { Metadata } from 'next'
import SetupGuide from '@/components/SetupGuide'
import { SETUP_GUIDES, getSetupGuide } from '@/data/setup-guides'

export function generateStaticParams() {
  return SETUP_GUIDES.map((g) => ({ guide: g.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ guide: string }>
}): Promise<Metadata> {
  const { guide: slug } = await params
  const guide = getSetupGuide(slug)
  if (!guide) return {}
  return {
    title: guide.title,
    description: guide.description,
    keywords: guide.keywords,
    alternates: { canonical: `https://ffcadmin.org/guides/${guide.slug}/` },
  }
}

export default async function GuideSetupPage({ params }: { params: Promise<{ guide: string }> }) {
  const { guide: slug } = await params
  const guide = getSetupGuide(slug)
  if (!guide) return null
  return <SetupGuide guide={guide} />
}

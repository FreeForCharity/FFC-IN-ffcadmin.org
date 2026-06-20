import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Submit a Request',
  description:
    'Apply for Free For Charity service, request an additional service for your existing FFC charity, or raise a question or escalation. FFC triages new requests within 5 business days.',
  keywords:
    'apply Free For Charity, charity application, FFC intake, request nonprofit website, charity escalation',
  alternates: { canonical: 'https://ffcadmin.org/roadmap/submit/' },
}

const ZEFFY_APPLICATION_URL = 'https://www.zeffy.com/'
const INTAKE_ISSUE_URL =
  'https://github.com/FreeForCharity/FFC-IN-ffcadmin.org/issues/new?template=charity-intake.yml'
const ESCALATION_ISSUE_URL =
  'https://github.com/FreeForCharity/FFC-IN-ffcadmin.org/issues/new?template=escalation.yml'

interface PathCard {
  title: string
  body: string
  href: string
  cta: string
  external: boolean
}

const cards: PathCard[] = [
  {
    title: 'Apply for FFC service',
    body: 'New to FFC? Start with the Zeffy application and verification form. We assess mission fit first, then offer the service products you are ready for.',
    href: ZEFFY_APPLICATION_URL,
    cta: 'Start the Zeffy application',
    external: true,
  },
  {
    title: 'I’m an existing FFC charity',
    body: 'Already partnered with FFC and ready for the next service tier? Open a structured intake issue so we can score readiness and route it to a sponsoring admin.',
    href: INTAKE_ISSUE_URL,
    cta: 'Open an intake issue',
    external: true,
  },
  {
    title: 'I have a question or escalation',
    body: 'A community member, sponsoring admin, or charity with a concern? Use the public escalation form. Never include sensitive or security details in a public issue.',
    href: ESCALATION_ISSUE_URL,
    cta: 'File an escalation',
    external: true,
  },
]

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Roadmap', href: '/roadmap' },
          { label: 'Submit a request' },
        ]}
      />

      <div className="bg-ffc-gradient-teal text-white">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold md:text-4xl">Submit a request</h1>
          <p className="mt-3 max-w-2xl text-lg text-teal-50">
            Pick the path that fits. Zeffy is FFC’s front door for applications and service
            products; structured intake and coordination continue on GitHub.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-gray-900">{card.title}</h2>
              <p className="mt-2 flex-grow text-sm text-gray-600">{card.body}</p>
              <a
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-2 font-semibold text-white hover:opacity-90"
              >
                {card.cta} ↗
              </a>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-bold text-gray-900">What happens next</h2>
          <ul className="mt-3 space-y-2 text-gray-700">
            <li>
              <strong>Triage within 5 business days.</strong> FFC reviews mission fit and
              prioritization-policy alignment, then sets your status on the public roadmap.
            </li>
            <li>
              <strong>Your charity appears on the roadmap</strong> as soon as you apply — even
              before you complete the GitHub-side intake.
            </li>
            <li>
              <strong>Readiness is scored transparently.</strong> You’ll receive a breakdown with
              the top improvements to make. See the{' '}
              <Link href="/roadmap/methodology" className="text-blue-600 hover:underline">
                methodology
              </Link>
              .
            </li>
          </ul>
          <p className="mt-4 rounded-lg bg-teal-50 p-4 text-sm text-teal-900">
            Not comfortable with GitHub? Text <strong>520-222-8104</strong> and an FFC admin will
            complete the intake on your behalf.
          </p>
        </div>
      </main>
    </div>
  )
}

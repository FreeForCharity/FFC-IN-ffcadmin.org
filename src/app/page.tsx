import Link from 'next/link'
import { assetPath } from '@/lib/assetPath'
import NonprofitCallout from '@/components/NonprofitCallout'
import { VOLUNTEER_ROLES } from '@/data/volunteer-roles'
import { getPath } from '@/data/training-modules'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #2E6F8E 49.8%, #FFFFFF 49.8%, #FFFFFF 50.2%, #F57C20 50.2%)',
        }}
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-12">
            {/* Left Column: Text & Content */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in drop-shadow-md">
                Free For Charity
              </h1>
              <p className="text-xl md:text-2xl mb-4 opacity-95 font-light">
                Volunteer & Admin Training Hub
              </p>
              <p className="text-lg md:text-xl mb-8 opacity-95 max-w-2xl text-shadow-sm">
                Learn how we build free, secure websites for nonprofits — then join us
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  href="/get-involved"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Volunteer With FFC
                  <svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
                <Link
                  href="/contributor-ladder"
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
                >
                  Contributor Ladder
                  <svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="flex-1 flex justify-center md:justify-end">
              <div className="relative w-64 h-64 md:w-96 md:h-96 bg-white rounded-full p-6 shadow-2xl animate-fade-in flex items-center justify-center">
                {/* Plain <img> with assetPath: required for GitHub Pages basePath builds
                    (next/image does not apply assetPrefix in this static export). */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={assetPath('/Images/figma-hero-img.webp')}
                  alt="Free For Charity Icon"
                  width={384}
                  height={384}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Charity site-owner spotlight — the most common visitor task */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 to-teal-700">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
              Most charity owners start here
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              FFC built your charity a website? Manage it yourself.
            </h2>
            <p className="text-emerald-50">
              A complete, every-step path from creating your GitHub account to making your first
              edit — in plain English, no coding. Includes the part everyone gets stuck on:{' '}
              <strong>accepting your repository invitation</strong>.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <Link
              href="/site-owner"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-teal-700 rounded-lg font-semibold hover:bg-emerald-50 transition-colors shadow-lg"
            >
              <span aria-hidden="true">🌱&nbsp;</span>Edit My Site
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
            <Link
              href="/site-owner/accept-invitation"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Accept my GitHub invitation
            </Link>
          </div>
        </div>
      </section>

      {/* Persona router */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              What brings you here?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Pick the path that fits you — each one leads straight to the right starting point.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Charity applicant */}
            <Link
              href="/charity-prerequisites"
              className="group block rounded-xl border-2 border-indigo-200 bg-indigo-50 p-6 hover:border-indigo-400 hover:shadow-lg transition-all"
            >
              <span className="text-3xl" aria-hidden="true">
                🏛️
              </span>
              <h3 className="text-lg font-bold text-indigo-900 mt-3 mb-1">
                I run a charity and want FFC&apos;s help
              </h3>
              <p className="text-sm text-indigo-900/80 mb-3">
                Free domain, email, and website — see what to prepare and how to apply.
              </p>
              <span className="inline-flex items-center text-sm font-semibold text-indigo-700 group-hover:text-indigo-900">
                See charity prerequisites
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </Link>

            {/* Charity site owner */}
            <Link
              href="/site-owner"
              className="group block rounded-xl border-2 border-emerald-200 bg-emerald-50 p-6 hover:border-emerald-400 hover:shadow-lg transition-all"
            >
              <span className="text-3xl" aria-hidden="true">
                🌱
              </span>
              <h3 className="text-lg font-bold text-emerald-900 mt-3 mb-1">
                I run a charity and want to edit my site
              </h3>
              <p className="text-sm text-emerald-900/80 mb-3">
                FFC built your website — keep it up to date in plain English, no coding.
              </p>
              <span className="inline-flex items-center text-sm font-semibold text-emerald-700 group-hover:text-emerald-900">
                Edit my charity&apos;s website
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </Link>

            {/* Web developer */}
            <Link
              href="/developer-environment-setup"
              className="group block rounded-xl border-2 border-blue-200 bg-blue-50 p-6 hover:border-blue-400 hover:shadow-lg transition-all"
            >
              <span className="text-3xl" aria-hidden="true">
                💻
              </span>
              <h3 className="text-lg font-bold text-blue-900 mt-3 mb-1">
                I&apos;m a developer who wants to build sites
              </h3>
              <p className="text-sm text-blue-900/80 mb-3">
                Use your AI agent to build and maintain charity websites — start with Claude
                Desktop.
              </p>
              <span className="inline-flex items-center text-sm font-semibold text-blue-700 group-hover:text-blue-900">
                Set up your environment
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </Link>

            {/* Broader volunteer */}
            <Link
              href="/get-involved"
              className="group block rounded-xl border-2 border-teal-200 bg-teal-50 p-6 hover:border-teal-400 hover:shadow-lg transition-all"
            >
              <span className="text-3xl" aria-hidden="true">
                🚀
              </span>
              <h3 className="text-lg font-bold text-teal-900 mt-3 mb-1">
                I want to help charities &amp; FFC broadly
              </h3>
              <p className="text-sm text-teal-900/80 mb-3">
                Volunteer across many nonprofits — admin, design, or development tracks.
              </p>
              <span className="inline-flex items-center text-sm font-semibold text-teal-700 group-hover:text-teal-900">
                See the volunteer tracks
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Priorities</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Building secure, scalable, and sustainable technology solutions for nonprofits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Speed & Simplicity */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: 'var(--color-ffc-teal)' }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Speed & Simplicity</h3>
              <p className="text-gray-600">
                Static-by-default React + Next.js exports, globally cached with minimal moving parts
              </p>
            </div>

            {/* Security */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: 'var(--color-ffc-orange-dark)' }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Security by Design</h3>
              <p className="text-gray-600">
                MFA, automated scanning, least-privilege access, and auditable workflows
              </p>
            </div>

            {/* Compliance */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: 'var(--color-ffc-teal-dark)' }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Compliance & Privacy</h3>
              <p className="text-gray-600">
                U.S. privacy laws (CCPA/CPRA) first, then GDPR with consent-gated analytics
              </p>
            </div>

            {/* AI-Powered */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: 'var(--color-ffc-orange)' }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Productivity</h3>
              <p className="text-gray-600">
                GitHub Copilot Pro (Agent Mode) & Microsoft Copilot for enhanced development
              </p>
            </div>

            {/* Resilience */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: 'var(--color-ffc-teal)' }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Resilience</h3>
              <p className="text-gray-600">
                Verified backups to OneDrive for Business with automated restore drills
              </p>
            </div>

            {/* Open Source */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: 'var(--color-ffc-orange-dark)' }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Community Driven</h3>
              <p className="text-gray-600">
                Charities retain full ownership of content and brand with transparent operations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Free For Charity delivers complete, production-ready technology solutions for
              nonprofits—from secure infrastructure to professional design assets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Technology Infrastructure */}
            <div className="bg-gradient-to-br from-[var(--color-ffc-teal-lightest)] to-[var(--color-ffc-teal-lighter)] rounded-xl shadow-lg p-8 border-2 border-[color:var(--color-ffc-teal)]">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: 'var(--color-ffc-teal-dark)' }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Enterprise-Grade Technology</h3>
              <p className="text-gray-700 mb-4">
                We provide secure, scalable websites built with Next.js and React, deployed through
                CI/CD pipelines with automated testing, security scanning, and compliance
                monitoring.
              </p>
              <Link
                href="/tech-stack"
                className="inline-flex items-center font-semibold hover:opacity-80 transition-opacity"
                style={{ color: 'var(--color-ffc-teal-dark)' }}
              >
                Explore Tech Stack
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            {/* Professional Design */}
            <div className="bg-gradient-to-br from-[var(--color-ffc-orange-lightest)] to-[var(--color-ffc-orange-lighter)] rounded-xl shadow-lg p-8 border-2 border-[color:var(--color-ffc-orange)]">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: 'var(--color-ffc-orange-dark)' }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Professional Design Services
              </h3>
              <p className="text-gray-700 mb-4">
                Our certified Canva designers create comprehensive brand kits, social media
                templates, email designs, and marketing materials tailored to each nonprofit's
                unique mission.
              </p>
              <Link
                href="/canva-designer-path"
                className="inline-flex items-center font-semibold hover:opacity-80 transition-opacity"
                style={{ color: 'var(--color-ffc-orange-dark)' }}
              >
                Learn About Design
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer training tracks — all roles */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Volunteer Training Tracks
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We split volunteering into focused roles, each with its own self-paced curriculum and
              certification. Pick the one that fits you — or browse them all.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              // Driven from the shared volunteer-role data (single source of truth);
              // certifications come from the matching training path.
              ...VOLUNTEER_ROLES.filter((r) => r.pathId).map((r) => ({
                title: r.title.replace(' Volunteer', ''),
                blurb: r.tagline,
                href: r.startHref,
                icon: r.icon,
                cert:
                  getPath(r.pathId!)?.certifications?.join(' · ') ?? 'Self-paced, project-based',
              })),
              {
                title: 'See all training tracks',
                blurb:
                  'Compare every role by depth (Operator → Practitioner → Administrator) in one place.',
                href: '/training',
                icon: '🧭',
                cert: 'Overview of all roles',
              },
            ].map((track) => (
              <Link
                key={track.href}
                href={track.href}
                className="group block bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <span className="text-3xl" aria-hidden="true">
                  {track.icon}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-3 mb-1 group-hover:text-blue-700">
                  {track.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{track.blurb}</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {track.cert}
                </p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/get-involved"
              className="inline-flex items-center justify-center px-6 py-3 bg-ffc-gradient-teal text-white rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              Compare roles &amp; get involved
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <NonprofitCallout />

      {/* Documentation & Testing Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Documentation & Quality Assurance
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive documentation and robust testing ensure reliability and transparency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Documentation Hub */}
            <div className="bg-gradient-to-br from-[var(--color-ffc-teal-lightest)] to-[var(--color-ffc-teal-lighter)] rounded-xl shadow-lg p-8 border-2 border-[color:var(--color-ffc-teal)]">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: 'var(--color-ffc-teal)' }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Documentation Center</h3>
              <p className="text-gray-700 mb-4">
                Complete guides covering deployment, security, responsive design, testing, and code
                quality standards. Every aspect of our infrastructure is thoroughly documented for
                transparency and knowledge transfer.
              </p>
              <Link
                href="/documentation"
                className="inline-flex items-center font-semibold hover:opacity-80 transition-opacity"
                style={{ color: 'var(--color-ffc-teal)' }}
              >
                Browse Documentation
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            {/* Testing Infrastructure */}
            <div className="bg-gradient-to-br from-[var(--color-ffc-orange-lightest)] to-[var(--color-ffc-orange-lighter)] rounded-xl shadow-lg p-8 border-2 border-[color:var(--color-ffc-orange)]">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: 'var(--color-ffc-orange-dark)' }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Testing & Quality</h3>
              <p className="text-gray-700 mb-4">
                Automated testing with Jest, accessibility validation with axe-core, responsive
                design verification, and security scanning with CodeQL. Every deployment is
                validated through comprehensive CI/CD pipelines.
              </p>
              <Link
                href="/testing"
                className="inline-flex items-center font-semibold hover:opacity-80 transition-opacity"
                style={{ color: 'var(--color-ffc-orange-dark)' }}
              >
                View Test Documentation
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

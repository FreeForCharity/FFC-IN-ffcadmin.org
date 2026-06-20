import Link from 'next/link'
import {
  INTAKE_HELP_BASE,
  INTAKE_HELP_CATEGORIES,
  intakeHelpPagesByCategory,
} from '@/data/intake-help'

/** Category-grouped left rail shared by every /intake-help page. */
export default function Sidebar({ currentSlug }: { currentSlug?: string }) {
  return (
    <nav aria-label="Intake help navigation" className="text-sm">
      <Link
        href={INTAKE_HELP_BASE}
        className="block rounded-md px-3 py-2 font-semibold text-gray-900 hover:bg-blue-50"
      >
        All intake help
      </Link>
      {INTAKE_HELP_CATEGORIES.map((category) => (
        <div key={category.id} className="mt-3">
          <p className="px-3 pb-1 text-xs font-bold uppercase tracking-wider text-gray-400">
            {category.label}
          </p>
          {intakeHelpPagesByCategory(category.id).map((page) => {
            const active = page.slug === currentSlug
            return (
              <Link
                key={page.slug}
                href={`${INTAKE_HELP_BASE}/${page.slug}`}
                aria-current={active ? 'page' : undefined}
                className={`block rounded-md px-3 py-1.5 transition-colors ${
                  active
                    ? 'bg-blue-50 font-semibold text-blue-700'
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                {page.shortLabel}
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}

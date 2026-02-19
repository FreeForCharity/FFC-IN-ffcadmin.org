'use client'

import { useDesignerProgress } from '../hooks/useDesignerProgress'
import { DesignerProgressBar } from './DesignerProgressBar'
import { ChecklistItem } from './ChecklistItem'

interface ChecklistStep {
  id: string
  text: string
  link?: { url: string; label: string }
}

const CHECKLIST_STEPS: ChecklistStep[] = [
  // Phase 1: Training
  {
    id: 'course-1',
    text: 'Complete Canva Pro for Nonprofits course',
    link: {
      url: 'https://www.canva.com/design-school/courses/canva-pro-for-nonprofits',
      label: 'Start Course',
    },
  },
  {
    id: 'course-2',
    text: 'Complete Canva for Work course',
    link: {
      url: 'https://www.canva.com/design-school/courses/canva-for-work',
      label: 'Start Course',
    },
  },
  {
    id: 'cert-submit',
    text: 'Download and submit completion certificates to Global Administrator',
  },
  {
    id: 'team-access',
    text: 'Receive Canva for Nonprofits team account access',
  },
  // Phase 2: Brand Kit
  {
    id: 'logo-package',
    text: 'Create logo package (primary, secondary, variations, monochrome)',
  },
  {
    id: 'color-palette',
    text: 'Define color palette (primary, secondary, neutral, accessibility-checked)',
  },
  {
    id: 'typography',
    text: 'Set up typography system (heading fonts, body font, sizes, web-safe alternatives)',
  },
  {
    id: 'visual-style',
    text: 'Document visual style guidelines (photography, icons, spacing, personality)',
  },
  {
    id: 'usage-examples',
    text: 'Create usage examples (social post, document header, presentation slide, business card)',
  },
  // Phase 2: Social Media Templates
  {
    id: 'facebook-templates',
    text: 'Create Facebook templates (feed posts, cover photo, event cover, stories)',
  },
  {
    id: 'twitter-templates',
    text: 'Create Twitter/X templates (post images, header image)',
  },
  {
    id: 'instagram-templates',
    text: 'Create Instagram templates (feed posts, stories, reels, carousels)',
  },
  {
    id: 'linkedin-templates',
    text: 'Create LinkedIn templates (post images, banner image)',
  },
  {
    id: 'pinterest-templates',
    text: 'Create Pinterest templates (pin images, board covers)',
  },
  {
    id: 'youtube-templates',
    text: 'Create YouTube templates (thumbnails, channel art)',
  },
  // Phase 2: Email & Stationery
  {
    id: 'email-newsletter',
    text: 'Design email newsletter template',
  },
  {
    id: 'email-donation',
    text: 'Design donation appeal email template',
  },
  {
    id: 'email-signature',
    text: 'Create email signature block',
  },
  {
    id: 'stationery-letterhead',
    text: 'Design letterhead (8.5x11" with header and footer)',
  },
  {
    id: 'stationery-business-cards',
    text: 'Design business cards (front and back)',
  },
  {
    id: 'stationery-presentation',
    text: 'Create presentation template (title, content, closing slides)',
  },
]

export default function DesignerChecklist() {
  const { completedItems, toggleItem, resetProgress, progressPercentage, isLoaded } =
    useDesignerProgress(CHECKLIST_STEPS.length)

  if (!isLoaded) return null

  return (
    <>
      <DesignerProgressBar percentage={progressPercentage} onReset={resetProgress} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Progress Checklist</h2>
          <p className="text-gray-600 mb-6">
            Track your journey through the Canva Designer path. Check off items as you complete them
            — your progress is saved automatically.
          </p>

          <div className="space-y-6">
            {/* Phase 1: Training */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-xs font-bold">
                  1
                </span>
                Training Courses
              </h3>
              <ul className="space-y-3 ml-8">
                {CHECKLIST_STEPS.filter((s) =>
                  ['course-1', 'course-2', 'cert-submit', 'team-access'].includes(s.id)
                ).map((step) => (
                  <ChecklistItem
                    key={step.id}
                    id={step.id}
                    text={step.text}
                    isCompleted={completedItems.has(step.id)}
                    onToggle={() => toggleItem(step.id)}
                    link={step.link}
                  />
                ))}
              </ul>
            </div>

            {/* Phase 2: Brand Kit */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-xs font-bold">
                  2
                </span>
                Brand Kit
              </h3>
              <ul className="space-y-3 ml-8">
                {CHECKLIST_STEPS.filter((s) =>
                  [
                    'logo-package',
                    'color-palette',
                    'typography',
                    'visual-style',
                    'usage-examples',
                  ].includes(s.id)
                ).map((step) => (
                  <ChecklistItem
                    key={step.id}
                    id={step.id}
                    text={step.text}
                    isCompleted={completedItems.has(step.id)}
                    onToggle={() => toggleItem(step.id)}
                    link={step.link}
                  />
                ))}
              </ul>
            </div>

            {/* Phase 2: Social Media Templates */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <span className="bg-pink-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-xs font-bold">
                  3
                </span>
                Social Media Templates
              </h3>
              <ul className="space-y-3 ml-8">
                {CHECKLIST_STEPS.filter((s) => s.id.endsWith('-templates')).map((step) => (
                  <ChecklistItem
                    key={step.id}
                    id={step.id}
                    text={step.text}
                    isCompleted={completedItems.has(step.id)}
                    onToggle={() => toggleItem(step.id)}
                    link={step.link}
                  />
                ))}
              </ul>
            </div>

            {/* Phase 2: Email & Stationery */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-xs font-bold">
                  4
                </span>
                Email & Stationery
              </h3>
              <ul className="space-y-3 ml-8">
                {CHECKLIST_STEPS.filter(
                  (s) => s.id.startsWith('email-') || s.id.startsWith('stationery-')
                ).map((step) => (
                  <ChecklistItem
                    key={step.id}
                    id={step.id}
                    text={step.text}
                    isCompleted={completedItems.has(step.id)}
                    onToggle={() => toggleItem(step.id)}
                    link={step.link}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

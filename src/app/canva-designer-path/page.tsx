import type { Metadata } from 'next'
import DesignerChecklist from './components/DesignerChecklist'

export const metadata: Metadata = {
  title: 'Canva Designer Learning Path | Free For Charity',
  description:
    'Comprehensive training path for Canva designers supporting nonprofits. Learn Canva Pro features, brand kit creation, social media templates, and nonprofit-specific design strategies.',
  keywords:
    'Canva, designer training, nonprofit design, brand kit, social media templates, Canva Pro, Canva for Nonprofits, design certification',
}

export default function CanvaDesignerPath() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-4">
            <svg
              className="w-8 h-8 mr-3"
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
            <h1 className="text-3xl md:text-4xl font-bold">Canva Designer Learning Path</h1>
          </div>
          <p className="text-pink-100 text-lg">
            Master Canva Pro to create stunning, professional designs for nonprofit organizations
          </p>
        </div>
      </div>

      {/* Interactive Progress Checklist */}
      <DesignerChecklist />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Executive Summary */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="border-l-4 border-pink-600 pl-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome, Creative Designer!</h2>
            <p className="text-gray-600 italic">Your mission: Visual excellence for nonprofits</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-4">
              As a <strong>Canva Designer</strong> for Free for Charity, you are the creative force
              behind the nonprofit's visual identity. This training path is specifically designed to
              transform you into a certified Canva expert who can deliver professional-quality
              designs that elevate the nonprofit's brand and amplify their mission.
            </p>

            <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded mb-6">
              <p className="text-purple-900 font-semibold mb-2">Your Primary Mission:</p>
              <p className="text-purple-900">
                Create a cohesive, professional brand identity and maintain a library of reusable
                templates that empower the nonprofit to communicate their mission effectively across
                all channels.
              </p>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Designer vs. Global Administrator: Understanding Your Role
            </h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
                <caption className="sr-only">
                  Comparison of Canva Designer and Global Administrator roles
                </caption>
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-300"
                    >
                      Aspect
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-300"
                    >
                      Canva Designer (You)
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Global Administrator
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  <tr>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 border-r border-gray-300">
                      Primary Focus
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                      Creative design, brand consistency, visual assets
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      Technical infrastructure, security, account management
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 border-r border-gray-300">
                      Key Tools
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                      Canva Pro (design platform only)
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      Microsoft 365, GitHub, Cloudflare, full tech stack
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 border-r border-gray-300">
                      Deliverables
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                      Brand kit, templates, graphics, social media content
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      Website, email system, security policies, CI/CD pipelines
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 border-r border-gray-300">
                      Account Access
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                      Team member in Canva for Nonprofits account
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      Owner/Admin across all platforms
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 border-r border-gray-300">
                      Certification Path
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                      Canva Pro for Nonprofits + Canva for Work courses
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      MS-900 + GitHub Foundations certifications
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 border-r border-gray-300">
                      Time Commitment
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                      15-20 hours initial training + ongoing design work
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      80-120 hours comprehensive technical training
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-pink-50 border-l-4 border-pink-600 p-4 rounded">
              <p className="text-pink-900">
                <strong>Key Distinction:</strong> You focus exclusively on Canva-based design work.
                The Global Administrator handles all technical infrastructure. Your creativity
                empowers the nonprofit's message; their technical expertise delivers it to the
                world.
              </p>
            </div>
          </div>
        </section>

        {/* Training Overview */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Complete Training Path</h2>
          <p className="text-gray-700 mb-6">
            Your journey consists of two official Canva Design School courses, followed by hands-on
            project work. Upon completion, you'll submit your certification and completed brand kit
            to the Global Administrator for team onboarding.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-300">
              <div className="flex items-center mb-3">
                <span className="text-3xl mr-3" aria-hidden="true">
                  🎓
                </span>
                <h3 className="text-xl font-bold text-gray-900">Course 1: Nonprofit Focus</h3>
              </div>
              <p className="text-gray-700 mb-3">
                <strong>Canva Pro for Nonprofits</strong>
              </p>
              <p className="text-gray-600 text-sm mb-3">
                Learn nonprofit-specific features, fundraising templates, impact storytelling, and
                donor communication strategies.
              </p>
              <a
                href="https://www.canva.com/design-school/courses/canva-pro-for-nonprofits"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-700 hover:text-blue-900 font-semibold"
              >
                Start Course
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
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-300">
              <div className="flex items-center mb-3">
                <span className="text-3xl mr-3" aria-hidden="true">
                  💼
                </span>
                <h3 className="text-xl font-bold text-gray-900">Course 2: Professional Skills</h3>
              </div>
              <p className="text-gray-700 mb-3">
                <strong>Canva for Work</strong>
              </p>
              <p className="text-gray-600 text-sm mb-3">
                Master team collaboration, brand consistency, advanced design techniques, and
                workflow optimization.
              </p>
              <a
                href="https://www.canva.com/design-school/courses/canva-for-work"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-purple-700 hover:text-purple-900 font-semibold"
              >
                Start Course
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
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
            <p className="text-green-900 font-semibold mb-2">Certification Process:</p>
            <ol className="list-decimal list-inside space-y-2 text-green-900">
              <li>Complete both Canva Design School courses at your own pace</li>
              <li>Download or screenshot your completion certificates from each course</li>
              <li>Submit certificates to the Global Administrator via email or shared drive</li>
              <li>
                Global Administrator adds you to the nonprofit's Canva for Nonprofits team account
              </li>
              <li>Begin your primary design work: Brand Kit and template creation</li>
            </ol>
          </div>
        </section>

        {/* Phase 1: Training Courses */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="border-l-4 border-blue-600 pl-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Phase 1: Complete Official Training
            </h2>
            <p className="text-gray-600">
              <strong>Mission:</strong> Master Canva Pro features and nonprofit design strategies
            </p>
            <p className="text-gray-600">
              <strong>Duration:</strong> 10-15 hours (self-paced)
            </p>
          </div>

          {/* Course 1 Details */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
                1
              </span>
              Canva Pro for Nonprofits Course
            </h3>
            <div className="ml-11 space-y-4">
              <p className="text-gray-700">
                <strong>Course Link:</strong>{' '}
                <a
                  href="https://www.canva.com/design-school/courses/canva-pro-for-nonprofits"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Canva Pro for Nonprofits
                </a>
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 font-semibold mb-2">What You'll Learn:</p>
                <ul className="space-y-2">
                  <li className="text-gray-700">
                    <strong>Nonprofit Storytelling:</strong> How to communicate impact, showcase
                    beneficiaries, and build emotional connections with donors
                  </li>
                  <li className="text-gray-700">
                    <strong>Fundraising Campaigns:</strong> Design donation appeals, event
                    invitations, annual reports, and thank-you communications
                  </li>
                  <li className="text-gray-700">
                    <strong>Social Impact Design:</strong> Create graphics that highlight community
                    work, volunteer recruitment, and program outcomes
                  </li>
                  <li className="text-gray-700">
                    <strong>Accessibility Features:</strong> Ensure designs are inclusive and meet
                    accessibility standards for diverse audiences
                  </li>
                  <li className="text-gray-700">
                    <strong>Cost-Effective Design:</strong> Maximize free/low-cost resources
                    available through Canva for Nonprofits
                  </li>
                </ul>
                <div className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded mt-4">
                  <p className="text-blue-900 font-semibold">
                    <span aria-hidden="true">💡</span> Pro Tip: Take notes on nonprofit-specific
                    templates and design patterns you can adapt for your assigned organization.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Course 2 Details */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
                2
              </span>
              Canva for Work Course
            </h3>
            <div className="ml-11 space-y-4">
              <p className="text-gray-700">
                <strong>Course Link:</strong>{' '}
                <a
                  href="https://www.canva.com/design-school/courses/canva-for-work"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-800 underline"
                >
                  Canva for Work
                </a>
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 font-semibold mb-2">What You'll Learn:</p>
                <ul className="space-y-2">
                  <li className="text-gray-700">
                    <strong>Brand Kit Mastery:</strong> Create comprehensive brand guidelines with
                    logos, color palettes, fonts, and visual style guides
                  </li>
                  <li className="text-gray-700">
                    <strong>Team Collaboration:</strong> Share templates, provide feedback, manage
                    design permissions, and maintain version control
                  </li>
                  <li className="text-gray-700">
                    <strong>Template Systems:</strong> Build reusable template libraries that ensure
                    consistency across all nonprofit communications
                  </li>
                  <li className="text-gray-700">
                    <strong>Advanced Features:</strong> Master layers, transparency, image editing,
                    animation, and video capabilities
                  </li>
                  <li className="text-gray-700">
                    <strong>Workflow Optimization:</strong> Batch creation, bulk downloads, keyboard
                    shortcuts, and efficiency techniques
                  </li>
                  <li className="text-gray-700">
                    <strong>Multi-Platform Design:</strong> Create assets optimized for web, social
                    media, print, email, and presentations
                  </li>
                </ul>
                <div className="bg-purple-50 border-l-4 border-purple-600 p-3 rounded mt-4">
                  <p className="text-purple-900 font-semibold">
                    <span aria-hidden="true">💡</span> Pro Tip: The Brand Kit will be your first
                    major deliverable. Pay special attention to these modules!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Phase 2: Primary Goals */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="border-l-4 border-green-600 pl-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Phase 2: Core Design Deliverables
            </h2>
            <p className="text-gray-600">
              <strong>Mission:</strong> Build the nonprofit's complete visual identity system
            </p>
            <p className="text-gray-600">
              <strong>Duration:</strong> 20-30 hours (varies by organization complexity)
            </p>
          </div>

          {/* Goal 1: Brand Kit */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
                1
              </span>
              Primary Goal: Complete the Brand Kit
            </h3>
            <div className="ml-11 space-y-4">
              <p className="text-gray-700">
                <strong>Priority:</strong> This is your <em>most important</em> deliverable and must
                be completed before moving to templates.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 font-semibold mb-3">Brand Kit Components:</p>
                <div className="space-y-4">
                  <div className="border-l-4 border-green-600 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      1. Logo Package (Multiple Formats)
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                      <li>Primary logo (full color, with tagline if applicable)</li>
                      <li>Secondary logo (simplified version for small sizes)</li>
                      <li>Logo variations: horizontal, vertical, icon-only</li>
                      <li>Light background version (dark logo)</li>
                      <li>Dark background version (light logo)</li>
                      <li>Monochrome versions (all black, all white)</li>
                      <li>Safe space guidelines (minimum clear space around logo)</li>
                      <li>Incorrect usage examples (what NOT to do)</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-green-600 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      2. Color Palette (Strategic Selection)
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                      <li>Primary colors (2-3 main brand colors with hex codes)</li>
                      <li>Secondary colors (2-4 complementary accent colors)</li>
                      <li>Neutral colors (grays for text and backgrounds)</li>
                      <li>Success/Warning/Error colors (for buttons and alerts)</li>
                      <li>
                        Color usage guidelines (when to use each color, percentage breakdowns)
                      </li>
                      <li>Accessibility check (ensure sufficient contrast ratios)</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-green-600 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      3. Typography System (Font Hierarchy)
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                      <li>Primary heading font (for titles and major headings)</li>
                      <li>Secondary heading font (for subheadings)</li>
                      <li>Body text font (for paragraphs and long-form content)</li>
                      <li>Font sizes and weights (H1, H2, H3, body, caption, button text, etc.)</li>
                      <li>Line height and letter spacing specifications</li>
                      <li>Web-safe alternatives if custom fonts aren't available</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-green-600 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">4. Visual Style Guidelines</h4>
                    <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                      <li>Photography style (realistic vs. illustrative, candid vs. staged)</li>
                      <li>Image treatment (filters, overlays, border styles)</li>
                      <li>Icon style (line vs. filled, rounded vs. sharp corners)</li>
                      <li>Graphic elements (patterns, shapes, dividers)</li>
                      <li>Spacing and layout principles (margins, padding, grid system)</li>
                      <li>Overall design personality (professional, warm, playful, serious)</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-green-600 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">5. Usage Examples</h4>
                    <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                      <li>Sample social media post showing all elements together</li>
                      <li>Sample document header/footer layout</li>
                      <li>Sample presentation slide design</li>
                      <li>Business card or letterhead mockup</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-600 p-3 rounded mt-4">
                  <p className="text-yellow-900 font-semibold mb-2">
                    <span aria-hidden="true">⚠️</span> Quality Checklist:
                  </p>
                  <ul className="text-yellow-900 text-sm space-y-1 ml-4 list-disc">
                    <li>Does the brand kit reflect the nonprofit's mission and values?</li>
                    <li>Are all colors accessible (WCAG contrast standards)?</li>
                    <li>Is the brand kit documented clearly for future volunteers?</li>
                    <li>
                      Have you received approval from the nonprofit leadership before finalizing?
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Goal 2: Social Media Templates */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
                2
              </span>
              Secondary Goal: Social Media Template Library
            </h3>
            <div className="ml-11 space-y-4">
              <p className="text-gray-700">
                <strong>Objective:</strong> Create a comprehensive set of templates for all major
                social media platforms.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 font-semibold mb-3">
                  Required Templates (Minimum Set):
                </p>

                <div className="space-y-4">
                  <div className="border-l-4 border-blue-400 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      <span aria-hidden="true">📘</span> Facebook
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                      <li>
                        <strong>Feed posts:</strong> Square (1080x1080px) and landscape (1200x630px)
                      </li>
                      <li>
                        <strong>Cover photo:</strong> 820x312px (responsive for mobile)
                      </li>
                      <li>
                        <strong>Event cover:</strong> 1920x1080px
                      </li>
                      <li>
                        <strong>Stories:</strong> 1080x1920px (vertical)
                      </li>
                      <li>
                        Template variations: announcement, event, donation appeal, testimonial,
                        photo collage
                      </li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-sky-400 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      <span aria-hidden="true">🐦</span> Twitter/X
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                      <li>
                        <strong>Post image:</strong> 1200x675px (16:9 ratio)
                      </li>
                      <li>
                        <strong>Header image:</strong> 1500x500px
                      </li>
                      <li>
                        Template variations: quote graphics, statistics, news updates, call to
                        action
                      </li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-pink-400 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      <span aria-hidden="true">📷</span> Instagram
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                      <li>
                        <strong>Feed posts:</strong> Square (1080x1080px)
                      </li>
                      <li>
                        <strong>Stories:</strong> 1080x1920px (with safe zones for text)
                      </li>
                      <li>
                        <strong>Reels:</strong> 1080x1920px (vertical video thumbnail)
                      </li>
                      <li>
                        <strong>Carousel posts:</strong> Multi-image story templates
                      </li>
                      <li>
                        Template variations: behind-the-scenes, volunteer spotlight, impact story,
                        infographic
                      </li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-blue-600 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      <span aria-hidden="true">💼</span> LinkedIn
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                      <li>
                        <strong>Post image:</strong> 1200x627px (professional tone)
                      </li>
                      <li>
                        <strong>Banner image:</strong> 1584x396px
                      </li>
                      <li>
                        Template variations: job postings, board member announcements, annual
                        reports, partnerships
                      </li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-red-400 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      <span aria-hidden="true">📍</span> Pinterest
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                      <li>
                        <strong>Pin image:</strong> 1000x1500px (2:3 ratio, vertical)
                      </li>
                      <li>
                        <strong>Board covers:</strong> 600x600px (square)
                      </li>
                      <li>
                        Template variations: infographics, how-to guides, resource lists,
                        inspirational quotes
                      </li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-purple-400 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      <span aria-hidden="true">🎬</span> YouTube
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                      <li>
                        <strong>Thumbnail:</strong> 1280x720px (bold text, high contrast)
                      </li>
                      <li>
                        <strong>Channel art:</strong> 2560x1440px (safe area: 1546x423px)
                      </li>
                      <li>
                        Template variations: video series thumbnails, intro/outro slides, end
                        screens
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded mt-4">
                  <p className="text-blue-900 font-semibold mb-2">
                    <span aria-hidden="true">💡</span> Template Best Practices:
                  </p>
                  <ul className="text-blue-900 text-sm space-y-1 ml-4 list-disc">
                    <li>Use dynamic text fields that can be easily updated</li>
                    <li>Include placeholder images that can be swapped out</li>
                    <li>Create at least 3-5 variations per platform for variety</li>
                    <li>Document usage instructions for each template</li>
                    <li>Organize templates in Canva folders by platform and purpose</li>
                    <li>Test templates on actual social media platforms before finalizing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Goal 3: Email and Stationery */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
                3
              </span>
              Tertiary Goal: Email and Stationery Templates
            </h3>
            <div className="ml-11 space-y-4">
              <p className="text-gray-700">
                <strong>Objective:</strong> Establish professional communication templates for email
                marketing and print materials.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 font-semibold mb-3">Email Templates:</p>
                <ul className="space-y-3 mb-6">
                  <li className="text-gray-700">
                    <strong>Newsletter template:</strong> Header design with logo, feature sections,
                    footer with contact info and social links
                  </li>
                  <li className="text-gray-700">
                    <strong>Donation appeal:</strong> Eye-catching header image, compelling story
                    section, prominent CTA button
                  </li>
                  <li className="text-gray-700">
                    <strong>Event invitation:</strong> Event details, RSVP button, map/location
                    graphic
                  </li>
                  <li className="text-gray-700">
                    <strong>Thank you email:</strong> Gratitude message with impact statement and
                    next steps
                  </li>
                  <li className="text-gray-700">
                    <strong>Monthly update:</strong> Highlight format for sharing program updates
                    and success stories
                  </li>
                  <li className="text-gray-700">
                    <strong>Email signature:</strong> Professional signature block with logo, title,
                    contact info
                  </li>
                </ul>

                <p className="text-gray-900 font-semibold mb-3">Stationery Templates:</p>
                <ul className="space-y-3">
                  <li className="text-gray-700">
                    <strong>Letterhead:</strong> 8.5x11" with header and footer (for official
                    correspondence)
                  </li>
                  <li className="text-gray-700">
                    <strong>Business cards:</strong> 3.5x2" standard size (front and back designs)
                  </li>
                  <li className="text-gray-700">
                    <strong>Presentation template:</strong> PowerPoint/Slide deck with title slide,
                    content slides, closing slide
                  </li>
                  <li className="text-gray-700">
                    <strong>Report cover page:</strong> Annual report, impact report, financial
                    statement covers
                  </li>
                  <li className="text-gray-700">
                    <strong>Certificate template:</strong> Volunteer recognition, donor
                    acknowledgment, awards
                  </li>
                  <li className="text-gray-700">
                    <strong>Flyer/Brochure:</strong> 8.5x11" one-page flyer and tri-fold brochure
                    layouts
                  </li>
                  <li className="text-gray-700">
                    <strong>Name badges:</strong> Event badges with logo and space for attendee info
                  </li>
                </ul>

                <div className="bg-purple-50 border-l-4 border-purple-600 p-3 rounded mt-4">
                  <p className="text-purple-900 font-semibold mb-2">
                    <span aria-hidden="true">💡</span> Design Considerations:
                  </p>
                  <ul className="text-purple-900 text-sm space-y-1 ml-4 list-disc">
                    <li>Email templates should be simple (many email clients strip complex CSS)</li>
                    <li>Use web-safe fonts for email headers and body text</li>
                    <li>Print materials need high resolution (300 DPI minimum)</li>
                    <li>Include bleed and trim marks for print templates</li>
                    <li>Test print templates with a proof before bulk printing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Phase 3: Ongoing Responsibilities */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="border-l-4 border-orange-600 pl-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Phase 3: Ongoing Design Support
            </h2>
            <p className="text-gray-600">
              <strong>Mission:</strong> Maintain brand consistency and support evolving needs
            </p>
            <p className="text-gray-600">
              <strong>Duration:</strong> Ongoing as needed
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Your Ongoing Roles:</h3>
              <ul className="space-y-3">
                <li className="text-gray-700">
                  <strong>Brand Guardian:</strong> Review all designs created by nonprofit staff to
                  ensure brand consistency
                </li>
                <li className="text-gray-700">
                  <strong>Template Maintainer:</strong> Update templates when nonprofit changes
                  programs, messaging, or visual direction
                </li>
                <li className="text-gray-700">
                  <strong>Design Consultant:</strong> Advise on campaign-specific graphics and
                  special projects
                </li>
                <li className="text-gray-700">
                  <strong>Training Provider:</strong> Train nonprofit staff on using Canva templates
                  correctly
                </li>
                <li className="text-gray-700">
                  <strong>Resource Manager:</strong> Organize Canva folders, archive old templates,
                  maintain asset library
                </li>
                <li className="text-gray-700">
                  <strong>Innovation Scout:</strong> Stay updated on Canva new features and
                  recommend improvements
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border-l-4 border-orange-600">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Communication with Global Administrator:
              </h3>
              <p className="text-gray-700 mb-3">
                While you focus exclusively on Canva design, stay in regular communication with the
                Global Administrator for:
              </p>
              <ul className="space-y-2 text-gray-700 ml-4 list-disc">
                <li>
                  Logo files needed for website integration (SVG, PNG with transparent background)
                </li>
                <li>Color hex codes for website styling</li>
                <li>Font selections compatible with web hosting</li>
                <li>
                  Asset delivery (export high-res images, share Canva template links, provide design
                  files)
                </li>
                <li>Design approval workflows and revision processes</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Resources and Tips */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Additional Resources and Pro Tips
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-blue-600"
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
                Canva Design School Resources
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>
                  • <strong>Design School Homepage:</strong> Browse all free courses and tutorials
                </li>
                <li>
                  • <strong>Canva Blog:</strong> Stay updated on design trends and new features
                </li>
                <li>
                  • <strong>Template Library:</strong> Explore 1M+ professional templates for
                  inspiration
                </li>
                <li>
                  • <strong>YouTube Channel:</strong> Video tutorials for specific techniques
                </li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-green-600"
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
                Design Best Practices
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Use high-quality images (avoid pixelated or low-res photos)</li>
                <li>• Maintain consistent spacing and alignment across all designs</li>
                <li>• Keep text readable (high contrast, appropriate font sizes)</li>
                <li>• Less is more: avoid cluttered designs with too many elements</li>
                <li>• Test designs on mobile devices before finalizing</li>
                <li>• Save multiple versions and iterations for client review</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-purple-600"
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
                Efficiency Tips
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>
                  • <strong>Keyboard shortcuts:</strong> Learn Canva shortcuts to work faster
                </li>
                <li>
                  • <strong>Duplicate templates:</strong> Use "Make a Copy" for quick variations
                </li>
                <li>
                  • <strong>Organize folders:</strong> Create logical folder structure in Canva
                </li>
                <li>
                  • <strong>Save favorites:</strong> Bookmark commonly used elements and templates
                </li>
                <li>
                  • <strong>Batch export:</strong> Download multiple designs at once
                </li>
                <li>
                  • <strong>Use grids:</strong> Enable alignment guides for precision
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Common Pitfalls to Avoid
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Don't use copyrighted images without proper licensing</li>
                <li>• Avoid generic stock photos that don't reflect the nonprofit's work</li>
                <li>• Don't overuse effects (shadows, gradients, filters)</li>
                <li>• Never stretch or distort logos (maintain aspect ratio)</li>
                <li>• Don't use too many fonts (stick to 2-3 max per design)</li>
                <li>• Avoid poor color combinations (check accessibility contrast ratios)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Certification Submission */}
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 md:p-8 border-2 border-green-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Get Started? Here's Your Checklist
          </h2>

          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Complete Both Training Courses</h3>
                <p className="text-gray-700 text-sm">
                  Finish Canva Pro for Nonprofits and Canva for Work. Download your certificates.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Submit Certificates to Global Admin
                </h3>
                <p className="text-gray-700 text-sm">
                  Email or share your completion certificates. Global Admin will add you to the
                  Canva team.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Build the Brand Kit</h3>
                <p className="text-gray-700 text-sm">
                  Your first priority! Create comprehensive brand guidelines in Canva.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Create Social Media Template Library
                </h3>
                <p className="text-gray-700 text-sm">
                  Build templates for all major platforms (Facebook, Instagram, Twitter, LinkedIn,
                  etc.).
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                5
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Design Email and Stationery Templates
                </h3>
                <p className="text-gray-700 text-sm">
                  Create newsletter templates, letterhead, business cards, and presentation decks.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                6
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Provide Ongoing Design Support</h3>
                <p className="text-gray-700 text-sm">
                  Maintain brand consistency, update templates, and train nonprofit staff.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-100 border-l-4 border-green-600 p-4 rounded">
            <p className="text-green-900 font-semibold mb-2">Questions?</p>
            <p className="text-green-900 text-sm">
              Reach out to your assigned Global Administrator for guidance, feedback, and technical
              support. They're here to help you succeed!
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl shadow-lg p-6 md:p-8 border-2 border-pink-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Start Your Design Journey Today</h2>
          <p className="text-gray-700 mb-6">
            Your creativity will make a lasting impact on the nonprofit you serve. Every design you
            create helps amplify their mission, attract supporters, and drive positive change in the
            world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://www.canva.com/design-school/courses/canva-pro-for-nonprofits"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
            >
              Start Nonprofit Course
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
            </a>
            <a
              href="https://www.canva.com/design-school/courses/canva-for-work"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl"
            >
              Start Work Course
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
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}

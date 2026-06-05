import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import PromptBox from '@/components/PromptBox'

export const metadata: Metadata = {
  title: 'Common Edits Cookbook',
  description:
    'Ready-to-paste prompts for the most common edits to your FFC charity website: contact info, hours, the donate button, photos, text, team members, social links — plus recurring posts like a blog, newsletter, or board-meeting minutes. No code, just copy, fill in, and hand to your AI assistant.',
  keywords:
    'charity website edits, update nonprofit website, blog post, newsletter, board minutes, donate button, AI prompts, Free For Charity, site owner cookbook',
  alternates: {
    canonical: 'https://ffcadmin.org/site-owner/common-edits/',
  },
}

interface QuickEdit {
  title: string
  blurb: string
  prompt: string
  caution?: string
}

const quickEdits: QuickEdit[] = [
  {
    title: 'Update contact info',
    blurb: 'Phone number, email address, or mailing address.',
    prompt:
      'update our contact information to: phone <new phone>, email <new email>, address <new address>. Change it everywhere it appears.',
  },
  {
    title: 'Change opening hours / service times',
    blurb: 'New hours, holiday closures, or service schedules.',
    prompt:
      'update our hours / service times to <new hours>. If they appear in more than one place, update all of them and keep the format consistent.',
  },
  {
    title: 'Update the donate link or button',
    blurb: 'Point the donate button at a new link, or fix the label.',
    prompt:
      'update our donate button so it links to <new donation URL> and the button text reads <new label>. Double-check the link opens correctly.',
  },
  {
    title: 'Replace the logo or a photo',
    blurb: 'Swap in a new image you provide.',
    prompt:
      'replace <the logo / the photo in the “About” section / etc.> with the new image I’m providing. Keep it looking good on phones and computers, and add descriptive alt text for screen readers.',
    caution: 'Have the new image file ready to share with your assistant.',
  },
  {
    title: 'Edit a section of text',
    blurb: 'Reword your mission, about, or services copy.',
    prompt:
      'update the <mission / about / services> text to read: “<your new wording>”. Keep the existing style and headings.',
  },
  {
    title: 'Add or update a team member',
    blurb: 'New board member or staff bio and photo.',
    prompt:
      'add a team member named <name>, role <role>, with this short bio: “<bio>”. Match how the other team members are shown. I’ll provide a photo.',
  },
  {
    title: 'Update social media links',
    blurb: 'New or changed Facebook, Instagram, etc.',
    prompt:
      'update our social media links: <Facebook URL>, <Instagram URL>, <other>. Remove any that no longer apply.',
  },
  {
    title: 'Change colors or brand accents',
    blurb: 'Tweak the accent colors to match your brand.',
    prompt:
      'adjust our brand accent color to <color or hex code>. Keep the text easy to read and make sure the contrast still meets accessibility guidelines.',
    caution:
      'Ask the assistant to confirm the new colors stay accessible (readable contrast) before publishing.',
  },
]

export default function CommonEditsCookbookPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Edit My Charity Website', href: '/site-owner' },
          { label: 'Common Edits Cookbook' },
        ]}
      />

      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-4">
            <span className="text-5xl mr-4" aria-hidden="true">
              📒
            </span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Common Edits Cookbook</h1>
              <p className="text-teal-50 text-sm mt-1">
                Copy a prompt, fill in the blanks, hand it to your assistant
              </p>
            </div>
          </div>
          <p className="text-teal-50 text-lg max-w-3xl">
            These are the changes charity site owners make most often. Each one is a friendly,
            ready-to-paste prompt — no code. New here? Start with{' '}
            <Link href="/site-owner" className="underline font-medium text-white">
              Edit Your Charity&apos;s Website
            </Link>{' '}
            first, then keep this page handy.
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* How to use */}
        <div className="bg-teal-50 border-l-4 border-teal-500 p-5 rounded mb-8 text-sm text-teal-900">
          <strong>How to use a prompt:</strong> copy it, replace anything in{' '}
          <strong>&lt;angle brackets&gt;</strong> with your details, and paste it to your assistant.
          Every prompt assumes the assistant is already connected to your repository (set up on the{' '}
          <Link href="/site-owner" className="underline font-medium">
            main Site Owner page
          </Link>
          ). When in doubt, add: “follow the conventions in the repository&apos;s{' '}
          <code>AGENTS.md</code>, and use FreeForCharity/FFC-IN-ffcadmin.org as an example.”
        </div>

        {/* Quick edits */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🛠️
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Quick edits</h2>
              <p className="text-gray-600">Updating content that&apos;s already on your site</p>
            </div>
          </div>
          <div className="space-y-5">
            {quickEdits.map((edit) => (
              <div
                key={edit.title}
                className="bg-white rounded-xl shadow border border-gray-200 p-5 md:p-6"
              >
                <h3 className="text-lg font-bold text-gray-900">{edit.title}</h3>
                <p className="text-sm text-gray-600 mt-0.5">{edit.blurb}</p>
                <PromptBox accent="emerald" label="Paste this — fill in the blanks">
                  &ldquo;In my charity&apos;s website repository{' '}
                  <strong>&lt;your repository&gt;</strong>, please {edit.prompt} Show me what
                  changed before publishing, and once I approve and the checks pass, publish
                  it.&rdquo;
                </PromptBox>
                {edit.caution && (
                  <div className="mt-3 bg-amber-50 border-l-4 border-amber-400 p-3 rounded text-xs text-amber-900">
                    <strong>Tip:</strong> {edit.caution}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Recurring publishing tasks */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🗞️
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recurring posts</h2>
              <p className="text-gray-600">
                Blogs, newsletters, and minutes — published over and over
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded mb-6 text-sm text-blue-900">
            <strong>Your site grows as your mission needs it.</strong> A new FFC site usually starts
            as a single page and adds sections only when you need them. So each prompt below works
            two ways: the <strong>first time</strong>, it asks the assistant to create the section
            if you don&apos;t have one yet; <strong>after that</strong>, it just adds the latest
            entry. The assistant figures out which applies.
          </div>

          {/* Blog */}
          <div className="bg-white rounded-xl shadow border border-gray-200 p-5 md:p-6 mb-5">
            <h3 className="text-lg font-bold text-gray-900">Add a blog / article / news post</h3>
            <p className="text-sm text-gray-600 mt-0.5">Share an update, story, or announcement.</p>
            <PromptBox accent="emerald" label="Paste this — fill in the blanks">
              &ldquo;In my charity&apos;s website repository{' '}
              <strong>&lt;your repository&gt;</strong>, I want to publish a news post titled{' '}
              <strong>&lt;title&gt;</strong>, dated <strong>&lt;date&gt;</strong>, with this
              content: &lsquo;<strong>&lt;your text&gt;</strong>
              &rsquo;. If my site doesn&apos;t already have a news/blog section, create one that
              matches the site&apos;s style and add a link to it from the main page; if it does,
              just add this as the newest post. Follow the repository&apos;s <code>
                AGENTS.md
              </code>{' '}
              and use FreeForCharity/FFC-IN-ffcadmin.org as an example. Show me the result before
              publishing.&rdquo;
            </PromptBox>
          </div>

          {/* Newsletter */}
          <div className="bg-white rounded-xl shadow border border-gray-200 p-5 md:p-6 mb-5">
            <h3 className="text-lg font-bold text-gray-900">Post the monthly newsletter</h3>
            <p className="text-sm text-gray-600 mt-0.5">
              Put each month&apos;s newsletter on your site.
            </p>
            <PromptBox accent="emerald" label="Paste this — fill in the blanks">
              &ldquo;In my charity&apos;s website repository{' '}
              <strong>&lt;your repository&gt;</strong>, publish our{' '}
              <strong>&lt;month, year&gt;</strong> newsletter. Here is the content: &lsquo;
              <strong>&lt;paste newsletter text&gt;</strong>&rsquo;. If there&apos;s no newsletter
              section yet, create one that matches the site&apos;s style and link to it from the
              main page; otherwise add this as the newest issue and keep past issues listed. Follow{' '}
              <code>AGENTS.md</code>. Show me the result before publishing.&rdquo;
            </PromptBox>
          </div>

          {/* Board minutes */}
          <div className="bg-white rounded-xl shadow border border-amber-300 p-5 md:p-6">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900">Post the monthly board minutes</h3>
              <span className="text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                Member-based orgs
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-0.5">
              For membership organizations that publish their board meeting minutes.
            </p>

            <div className="mt-3 bg-amber-50 border-l-4 border-amber-500 p-4 rounded text-sm text-amber-900">
              <strong>Important — this is public.</strong> Your website can be seen by anyone on the
              internet. A static site can&apos;t hide minutes behind a members-only login, so
              anything you post here is visible to everyone. Only post minutes your board has{' '}
              <strong>approved for public release</strong> — and if the full minutes shouldn&apos;t
              be public, post a short approved summary instead.
            </div>

            <PromptBox accent="emerald" label="Paste this — fill in the blanks">
              &ldquo;In my charity&apos;s website repository{' '}
              <strong>&lt;your repository&gt;</strong>, publish our board meeting minutes for{' '}
              <strong>&lt;meeting date&gt;</strong>. Here is the approved, public version: &lsquo;
              <strong>&lt;paste approved minutes or summary&gt;</strong>
              &rsquo;. If there&apos;s no minutes section yet, create one that matches the
              site&apos;s style and link to it; otherwise add this as the newest entry and keep
              prior minutes listed by date. Remember this will be publicly visible. Follow{' '}
              <code>AGENTS.md</code>. Show me the result before publishing.&rdquo;
            </PromptBox>
          </div>
        </section>

        {/* Footer nav */}
        <div className="bg-gradient-to-br from-gray-50 to-teal-50 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Related</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <Link href="/site-owner" className="text-teal-700 underline hover:text-teal-900">
                &larr; Back to Edit Your Charity&apos;s Website
              </Link>
            </li>
            <li>
              <Link
                href="/developer-environment-setup/claude-desktop"
                className="text-teal-700 underline hover:text-teal-900"
              >
                Claude Desktop setup guide
              </Link>
              <span className="text-gray-500"> &mdash; how the assistant connects to GitHub</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}

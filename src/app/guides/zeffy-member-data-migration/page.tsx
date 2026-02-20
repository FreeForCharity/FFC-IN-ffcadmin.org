import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Zeffy Member Data Migration Guide',
  description:
    'Step-by-step guide for migrating nonprofit membership data into Zeffy CRM. Covers Zeffy CSV import format, payment history migration, contact deduplication, and data cleanup using Claude AI. 2,094 records migrated successfully.',
  keywords:
    'Zeffy migration, Zeffy CRM import, Zeffy CSV import, Zeffy membership data, nonprofit data migration, migrate to Zeffy, Zeffy nonprofit CRM, Claude AI data migration',
}

const tocItems = [
  { id: 'overview', label: '1. Project Overview' },
  { id: 'prerequisites', label: '2. What You Need Before Starting' },
  { id: 'setup', label: '3. Setting Up Claude Cowork & The Prompts That Matter' },
  { id: 'explicit-asks', label: "4. What Claude Won't Do Unless You Ask" },
  { id: 'phase-1', label: '5. Phase 1: Data Assessment & Cleanup' },
  { id: 'phase-2', label: '6. Phase 2: Building Import Files' },
  { id: 'phase-3', label: '7. Phase 3: Importing into Zeffy' },
  { id: 'data-quality', label: '8. Data Quality Issues We Found & Fixed' },
  { id: 'version-control', label: '9. Version Control Strategy' },
  { id: 'file-inventory', label: '10. Final File Inventory' },
  { id: 'lessons', label: '11. Lessons Learned & Tips' },
  { id: 'appendix', label: '12. Appendix: Zeffy Import Field Reference' },
]

export default function MemberDataMigrationGuide() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/guides"
            className="inline-flex items-center text-violet-200 hover:text-white text-sm mb-4 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            All Guides
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Zeffy Member Data Migration Guide</h1>
          <p className="text-xl text-violet-100 mb-6">
            How to Migrate Nonprofit Membership Records into Zeffy CRM Using Claude AI &amp; Cowork
            Mode
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-white/20 rounded-full px-3 py-1">Version 2</span>
            <span className="bg-white/20 rounded-full px-3 py-1">February 2026</span>
            <span className="bg-white/20 rounded-full px-3 py-1">2,094 records migrated</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Table of Contents */}
        <nav className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-12">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Table of Contents</h2>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {tocItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Section 1: Project Overview */}
        <section id="overview" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            1. Project Overview
          </h2>
          <p className="text-gray-700 mb-6">
            This guide documents a real-world project to migrate 2,094 membership records from a
            legacy Excel spreadsheet into Zeffy, a free nonprofit CRM and payment platform. The
            entire project was completed using Claude AI through Anthropic&apos;s Cowork mode, which
            provides a desktop environment where Claude can read, write, and manipulate files
            directly on your computer.
          </p>
          <p className="text-gray-700 mb-8">
            The project involved cleaning messy data, resolving quality issues with the
            organization&apos;s input, generating properly formatted CSV import files, and building
            a comprehensive workbook with documentation tabs for audit trail and future reference.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4">What Was Accomplished</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-bold text-gray-900 border-b">Metric</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-900 border-b">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 text-gray-700">Starting Records</td>
                  <td className="px-4 py-3 text-gray-700">2,094 rows across 3 tabs, 26 columns</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700">Final Master List</td>
                  <td className="px-4 py-3 text-gray-700">
                    2,076 rows (18 minors separated, 4 non-person rows cleared)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700">Payment Import Files</td>
                  <td className="px-4 py-3 text-gray-700">
                    4 CSVs (1,358 total payments across Classes A, B, CA, CS)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700">Contact Import Files</td>
                  <td className="px-4 py-3 text-gray-700">
                    4 CSVs (1,358 contacts with Lists and newsletter preferences)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700">Data Issues Resolved</td>
                  <td className="px-4 py-3 text-gray-700">
                    13 categories of issues identified and fixed
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700">Workbook Versions</td>
                  <td className="px-4 py-3 text-gray-700">
                    9 versions (v1 through v9), all archived
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700">Workbook Tabs</td>
                  <td className="px-4 py-3 text-gray-700">
                    15 tabs including Import Plan, Change Log, Data Quality Audit
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2: Prerequisites */}
        <section id="prerequisites" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            2. What You Need Before Starting
          </h2>

          <h3 className="text-xl font-bold text-gray-900 mb-3">Your Source Data</h3>
          <p className="text-gray-700 mb-6">
            You need your membership data in an Excel file (.xlsx). Common fields include: member
            names, email addresses, mailing addresses, join dates, payment status, member
            class/type, and newsletter preferences. The data does not need to be clean — that&apos;s
            what this process handles.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-3">A Zeffy Account</h3>
          <p className="text-gray-700 mb-6">
            Create a free account at zeffy.com if you don&apos;t already have one. Zeffy is a
            nonprofit-focused platform that offers free CRM, payment processing, and email tools.
            You&apos;ll need access to the admin dashboard for the import steps.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Claude Desktop App with Cowork Mode
          </h3>
          <p className="text-gray-700 mb-4">
            Claude Cowork is a feature of the Claude desktop application that gives Claude the
            ability to work directly with files on your computer. It runs in a secure sandbox and
            can read, write, and edit files in a folder you choose.
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
            <li>Download the Claude desktop app from claude.ai</li>
            <li>Open a Cowork session and select the folder containing your data</li>
            <li>
              Claude will be able to read your Excel file and create all output files in that folder
            </li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mb-3">Understanding of Your Data</h3>
          <p className="text-gray-700 mb-4">
            Before starting, know the answers to these questions, as Claude will ask:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>What do your member class codes mean? (e.g., A, B, CA, CS)</li>
            <li>What does the Newsletter field indicate? (Yes/No for opt-in?)</li>
            <li>Are there shared email addresses between spouses or family members?</li>
            <li>What is the standard membership dues amount?</li>
            <li>Are there any minors in the data who need separate handling?</li>
          </ul>
        </section>

        {/* Section 3: Setting Up Claude Cowork */}
        <section id="setup" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            3. Setting Up Claude Cowork &amp; The Prompts That Matter
          </h2>
          <p className="text-gray-700 mb-6">
            This is the most important section of the guide. Claude is powerful but it works best
            when you give it clear, specific instructions upfront. In our project, many of the most
            useful features — the Data Quality Audit tab, version-controlled workbook tabs, the old
            folder structure — only happened because we explicitly asked for them. Claude won&apos;t
            assume you want these things.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4">The Opening Prompt</h3>
          <p className="text-gray-700 mb-4">
            Your first message to Claude sets the tone for the entire project. Here is a
            consolidated prompt based on what actually worked in our project. You can copy and adapt
            this:
          </p>
          <div className="bg-gray-900 text-gray-100 rounded-lg p-6 mb-6 text-sm font-mono whitespace-pre-wrap overflow-x-auto">
            {`I have a membership Excel file that I need to import into Zeffy CRM. The file is in this folder. Here are my requirements:

DATA HANDLING:
- NEVER modify the original Excel file. Only read from it.
- Create a working copy and make all changes there.
- Version number every file (v1, v2, etc). When you make
  changes, bump the version and move old versions into an
  'old' subfolder to keep the workspace clean.

WORKBOOK TABS I NEED:
- Change Log tab: track every change with date, version,
  and description so there is a full audit trail.
- Data Quality Audit tab: list every data issue you find
  with severity, count of records affected, and status
  (OPEN/RESOLVED). We will work through these together.
- Import Plan tab: step-by-step instructions for the
  actual Zeffy import process.
- For every CSV you generate, also add a matching tab in
  the workbook so I can review the data without opening
  separate files.

IMPORT FILES:
- Generate Zeffy payment import CSVs (one per member class)
- Generate Zeffy contact import CSVs with Lists column
- Clean all data issues before generating CSVs

DECISION MAKING:
- When you find data issues, present them to me with options
  rather than guessing. I will make the call.
- Research Zeffy's import requirements before building files.`}
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-amber-800">
              <strong>Why this matters:</strong> Without these explicit instructions, Claude will
              clean your data and generate CSVs, but it won&apos;t create documentation tabs,
              won&apos;t set up version control, and won&apos;t mirror CSV data inside the workbook.
              These are things we had to ask for during our project, and we&apos;re giving you the
              consolidated version here so you get them from the start.
            </p>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Prompts We Used Throughout the Project
          </h3>
          <p className="text-gray-700 mb-6">
            Beyond the opening prompt, here are the specific prompts that drove key outcomes. Each
            one addresses something Claude would not have done on its own.
          </p>

          <h4 className="text-lg font-bold text-gray-900 mb-2">Getting the Data Quality Audit</h4>
          <p className="text-gray-700 mb-3">
            Claude will fix obvious issues like email typos, but it won&apos;t create a formal
            tracking system unless you ask:
          </p>
          <div className="bg-gray-100 rounded-lg p-4 mb-4 text-sm italic text-gray-700">
            &quot;Look at all the open items in data quality and consider how to fix them. Give me
            as much info as you can and ask me questions so we can resolve them all.&quot;
          </div>
          <p className="text-gray-700 mb-6">
            This prompt triggered Claude to do a deep investigation of every issue, present findings
            with record counts, and ask targeted questions so we could make informed decisions
            together.
          </p>

          <h4 className="text-lg font-bold text-gray-900 mb-2">Getting Workbook Tabs for CSVs</h4>
          <p className="text-gray-700 mb-3">
            By default, Claude generates CSV files but doesn&apos;t add them as tabs in the
            workbook. We had to ask:
          </p>
          <div className="bg-gray-100 rounded-lg p-4 mb-4 text-sm italic text-gray-700">
            &quot;For every CSV you generate, also create a matching tab in the workbook so I can
            see the data in one place.&quot;
          </div>
          <p className="text-gray-700 mb-6">
            This gave us tabs like &quot;Zeffy Pay Class A,&quot; &quot;Contact A,&quot; etc. inside
            the workbook, which made review much easier than opening individual CSV files.
          </p>

          <h4 className="text-lg font-bold text-gray-900 mb-2">Getting the Old Folder Structure</h4>
          <p className="text-gray-700 mb-3">
            Claude will version files if you ask, but won&apos;t organize old versions unless told:
          </p>
          <div className="bg-gray-100 rounded-lg p-4 mb-4 text-sm italic text-gray-700">
            &quot;Move old versions into an &apos;old&apos; folder. Always do this going forward
            when you create a new version.&quot;
          </div>
          <p className="text-gray-700 mb-6">
            After this, Claude automatically moved superseded files to old/ every time it saved a
            new version.
          </p>

          <h4 className="text-lg font-bold text-gray-900 mb-2">Getting the Import Plan</h4>
          <div className="bg-gray-100 rounded-lg p-4 mb-4 text-sm italic text-gray-700">
            &quot;Make a new tab about the import plan and ensure all the steps are there. Now that
            we are doing the payments import we don&apos;t need the contacts-only import files as
            they are done at the same time. Move them to old and focus on making sure the remaining
            files are good and ready for import.&quot;
          </div>

          <h4 className="text-lg font-bold text-gray-900 mb-2">
            Discovering Zeffy Features via Screenshots
          </h4>
          <p className="text-gray-700 mb-4">
            Some of the most important changes came from exploring Zeffy&apos;s interface and
            sharing screenshots. Claude immediately understood the screenshots, researched how the
            features worked, and updated all the import files accordingly. This back-and-forth
            between you exploring the tool and Claude adapting the data is a natural part of the
            workflow.
          </p>
        </section>

        {/* Section 4: What Claude Won't Do Unless You Ask */}
        <section id="explicit-asks" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            4. What Claude Won&apos;t Do Unless You Ask
          </h2>
          <p className="text-gray-700 mb-6">
            Claude is highly capable but conservative by default. It focuses on what you explicitly
            request and avoids making assumptions about project management preferences. Here is a
            checklist of things you need to explicitly ask for:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-bold text-gray-900 border-b">Feature</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-900 border-b">
                    You Must Ask For It
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 text-gray-700 font-medium">Data Quality Audit tab</td>
                  <td className="px-4 py-3 text-gray-700">
                    Claude finds issues but won&apos;t create a formal tracking tab unless asked.
                    Tell it to create a tab with columns for issue, severity, count, status, and
                    resolution.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700 font-medium">Change Log tab</td>
                  <td className="px-4 py-3 text-gray-700">
                    Claude makes changes but won&apos;t document them in a log tab. Ask for a Change
                    Log with version, date, change, and detail columns.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700 font-medium">Import Plan tab</td>
                  <td className="px-4 py-3 text-gray-700">
                    Claude knows the import steps but won&apos;t write them into the workbook. Ask
                    for a step-by-step plan tab.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700 font-medium">Workbook tabs for CSVs</td>
                  <td className="px-4 py-3 text-gray-700">
                    Claude generates CSVs as files but doesn&apos;t automatically mirror them as
                    workbook tabs. Explicitly request matching tabs.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700 font-medium">Version numbering</td>
                  <td className="px-4 py-3 text-gray-700">
                    Claude will overwrite files unless you tell it to use version numbers (v1, v2,
                    etc.) on every file.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700 font-medium">Old folder</td>
                  <td className="px-4 py-3 text-gray-700">
                    Claude won&apos;t create a folder structure for old versions. Tell it to move
                    old files to an &quot;old&quot; subfolder after each version bump.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700 font-medium">Never touch the original</td>
                  <td className="px-4 py-3 text-gray-700">
                    Claude may edit the source file unless you explicitly say &quot;never modify the
                    original.&quot; State this in your first message.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700 font-medium">Ask before deciding</td>
                  <td className="px-4 py-3 text-gray-700">
                    Claude may auto-fix ambiguous issues. Tell it to present options and let you
                    decide on anything that requires judgment.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <p className="text-sm text-blue-800">
              <strong>Key takeaway:</strong> The more specific your opening prompt, the less
              back-and-forth you&apos;ll need later. Think of it as front-loading your project
              requirements.
            </p>
          </div>
        </section>

        {/* Section 5: Phase 1 */}
        <section id="phase-1" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            5. Phase 1: Data Assessment &amp; Cleanup
          </h2>
          <p className="text-gray-700 mb-6">
            This is the most time-intensive phase. Claude reads your Excel file, analyzes every
            column, and identifies issues that would cause problems during Zeffy import.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4">Initial Analysis</h3>
          <p className="text-gray-700 mb-4">
            Ask Claude to examine the original file and report what it finds. Claude will read every
            sheet, count rows, check for blanks, and identify patterns. In our project, Claude
            found:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
            <li>
              187 email fields corrupted with &quot;mailto:&quot; prefixes (an Excel artifact)
            </li>
            <li>
              Multiple email typos (missing @ signs, .com misspelled as ,com, gamil.com instead of
              gmail.com)
            </li>
            <li>Names with extra whitespace, commas in last names (Jr., Sr. suffixes)</li>
            <li>Mixed case in STATE fields (pa, Pa, PA)</li>
            <li>55 records with empty payment dates</li>
            <li>18 minors (under 18) who needed separate handling</li>
            <li>Shared email addresses between spouses</li>
            <li>Phone number fields containing dates of birth</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mb-4">Data Quality Audit Tab</h3>
          <p className="text-gray-700 mb-6">
            Once Claude creates the Data Quality Audit tab (remember, you must ask for this), it
            tracks every issue found, its severity, how many records are affected, and the
            resolution. Each item starts as OPEN and gets marked RESOLVED as you work through them
            together. This is your checklist — you&apos;re not done until everything shows RESOLVED.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4">Working Through Issues Together</h3>
          <p className="text-gray-700 mb-4">
            For each issue, Claude presents what it found and recommends a fix. You make the call.
            This collaborative approach is essential — Claude has the technical skills but you have
            the institutional knowledge. Examples from our project:
          </p>
          <div className="space-y-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Truncated names:</strong> Two members had very short first names
                (&quot;Mi&quot; and &quot;Ro&quot;). Claude asked if these were typos or real names.
                We decided to leave them as-is since we couldn&apos;t confirm.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Wrong class code:</strong> One member had CLASS=&quot;ACT&quot; instead of a
                valid class. Claude showed the member&apos;s position in the spreadsheet
                (alphabetically between other CS members) and recommended CS. We agreed.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Duplicate persons:</strong> Three sets of apparent duplicates turned out to
                be father/son pairs with different member numbers and DOBs. We kept all of them.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Spouse deduplication:</strong> When two members share an email address
                (typically married couples), Zeffy would create only one contact. Claude&apos;s
                approach: keep the male spouse&apos;s record for the email, since Zeffy needs unique
                emails per contact. The spouse data is still in the Master List.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-4">Automated Fixes</h3>
          <p className="text-gray-700 mb-4">
            Some fixes are straightforward and Claude applies them automatically (with documentation
            in the Change Log):
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Clearing mailto: corruption from all email fields</li>
            <li>Correcting known email typos (pattern-matched)</li>
            <li>Normalizing STATE to uppercase</li>
            <li>Removing commas from last names (CSV safety)</li>
            <li>Trimming whitespace and normalizing double spaces in names</li>
            <li>Filling empty dates with the current date as a fallback</li>
          </ul>
        </section>

        {/* Section 6: Phase 2 */}
        <section id="phase-2" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            6. Phase 2: Building Import Files
          </h2>
          <p className="text-gray-700 mb-6">
            Once the data is clean, Claude generates the CSV files Zeffy needs. There are two types
            of import: Payment Import (which also creates contacts) and Contact Import (which adds
            list assignments and newsletter preferences).
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Import CSVs</h3>
          <p className="text-gray-700 mb-4">
            Zeffy&apos;s payment import creates both a payment record and a contact profile for each
            row. We created one CSV per member class to keep imports manageable and to use the class
            name as the formTitle (which becomes a form label in Zeffy).
          </p>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-bold text-gray-900 border-b">Field</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-900 border-b">
                    What We Used
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 text-gray-700 font-mono text-xs">
                    firstName / lastName
                  </td>
                  <td className="px-4 py-3 text-gray-700">From FIRST and LAST columns, cleaned</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700 font-mono text-xs">amount</td>
                  <td className="px-4 py-3 text-gray-700">$40 (standard dues for all classes)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700 font-mono text-xs">email</td>
                  <td className="px-4 py-3 text-gray-700">
                    Cleaned email, deduplicated for shared addresses
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700 font-mono text-xs">
                    address / city / state / postalCode
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    From address fields, state normalized to uppercase
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700 font-mono text-xs">
                    type / paymentMethod
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    &quot;manual&quot; for all (not processed through Zeffy)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700 font-mono text-xs">formTitle</td>
                  <td className="px-4 py-3 text-gray-700">
                    Class name (e.g., &quot;Class A&quot;) — becomes form label in Zeffy
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700 font-mono text-xs">date</td>
                  <td className="px-4 py-3 text-gray-700">
                    From Paid Date, fallback to JoinDate, fallback to today&apos;s date
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700 font-mono text-xs">note</td>
                  <td className="px-4 py-3 text-gray-700">
                    Member #XXXXX | Joined: YYYY | N yrs continuous
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Import CSVs</h3>
          <p className="text-gray-700 mb-4">
            After payments are imported (which creates contacts), a second contact import updates
            those contacts with list assignments, subscription preferences, and additional data. We
            created one CSV per class. These CSVs cover ALL members in each class, not just the ones
            who opted out of newsletters.
          </p>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-bold text-gray-900 border-b">Field</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-900 border-b">
                    What We Used
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 text-gray-700 font-mono text-xs">
                    First Name / Last Name / Email
                  </td>
                  <td className="px-4 py-3 text-gray-700">Same cleaned values as payment files</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700 font-mono text-xs">
                    Address / City / Region / Postal Code
                  </td>
                  <td className="px-4 py-3 text-gray-700">Full mailing address</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700 font-mono text-xs">Subscription Status</td>
                  <td className="px-4 py-3 text-gray-700">
                    &quot;unsubscribed&quot; for No Newsletter members, blank for others
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700 font-mono text-xs">Lists</td>
                  <td className="px-4 py-3 text-gray-700">
                    Semicolon-separated: e.g., &quot;Class A;All Members&quot; or &quot;Class A;All
                    Members;No Newsletter&quot;
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700 font-mono text-xs">Note</td>
                  <td className="px-4 py-3 text-gray-700">
                    Same member info note as payment files
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-4">Lists Strategy</h3>
          <p className="text-gray-700 mb-4">
            We designed six lists that get created automatically when the contact CSV is imported:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
            <li>Class A, Class B, Class CA, Class CS — one list per membership class</li>
            <li>All Members — every imported contact belongs to this list</li>
            <li>
              No Newsletter — members who opted out of newsletters (also marked as
              &quot;unsubscribed&quot;)
            </li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mb-4">Tags vs. Lists</h3>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              During this project, Zeffy was transitioning from Tags to Lists. We initially used
              Tags for segmentation but discovered they were no longer mapping in the import
              interface. We removed the Tags column entirely and used Lists for all segmentation. If
              you&apos;re reading this in the future, Tags may be fully deprecated — use Lists.
            </p>
          </div>
        </section>

        {/* Section 7: Phase 3 */}
        <section id="phase-3" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            7. Phase 3: Importing into Zeffy
          </h2>
          <p className="text-gray-700 mb-6">
            The import follows a specific order. Payment imports must come first because they create
            the contact records, then contact imports update those records with list assignments.
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Step 1: Payment Import</h3>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                <li>In Zeffy, go to Settings &rarr; Import Data &rarr; Payment Import.</li>
                <li>Upload each payment CSV one at a time (Class A first, then B, CA, CS).</li>
                <li>
                  Map each column to the corresponding Zeffy field using the mapping interface.
                </li>
                <li>Review the preview and confirm the import.</li>
                <li>
                  After all 4 files are imported, verify: 1,358 total payments and 1,358 contacts in
                  the dashboard.
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Step 2: Contact Import</h3>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                <li>Go to Settings &rarr; Import Data &rarr; Contact Import.</li>
                <li>Upload each contact CSV one at a time.</li>
                <li>
                  Map the Lists column and Subscription Status column in the mapping interface.
                </li>
                <li>
                  Since these emails already exist from payment import, Zeffy will update the
                  existing contacts.
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Step 3: Verification</h3>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                <li>
                  Check that 6 lists were created: Class A, Class B, Class CA, Class CS, All
                  Members, No Newsletter.
                </li>
                <li>Verify All Members list has 1,358 contacts.</li>
                <li>
                  Verify No Newsletter list has approximately 232 contacts, all showing
                  &quot;unsubscribed&quot; status.
                </li>
                <li>
                  Spot-check 5-10 individual contacts to confirm names, emails, and addresses match.
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* Section 8: Data Quality Issues */}
        <section id="data-quality" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            8. Data Quality Issues We Found &amp; Fixed
          </h2>
          <p className="text-gray-700 mb-6">
            This section documents every data quality issue discovered during the project. If
            you&apos;re working with similar membership data, expect to encounter many of these same
            issues.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-bold text-gray-900 border-b">Issue</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-900 border-b">Records</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-900 border-b">Severity</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-900 border-b">
                    Resolution
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ['mailto: corruption', '187', 'High', 'Stripped mailto: prefix from all emails'],
                  ['Email typos', '5 patterns', 'High', 'Pattern-matched corrections'],
                  ['Name whitespace', '~50', 'Medium', 'Trimmed and normalized double spaces'],
                  ['Last name commas', '64', 'Medium', 'Removed commas (Jr, Sr suffixes kept)'],
                  ['Empty payment dates', '55', 'Medium', 'Filled with current date'],
                  ['Mixed case STATE', 'All rows', 'Low', 'Normalized to uppercase'],
                  ['Minors in data', '18', 'High', 'Separated to dedicated Minors tab'],
                  [
                    'Shared spouse emails',
                    '~47 pairs',
                    'High',
                    'Kept male spouse record for import',
                  ],
                  ['Non-person rows', '4', 'Medium', 'Cleared (org entries, not individuals)'],
                  ['DOBs in phone field', '4', 'Medium', 'Moved values to DOB column'],
                  ['Wrong class code', '1', 'Medium', 'Corrected ACT to CS'],
                  ['Email domain typo', '1', 'Medium', 'gamil.com corrected to gmail.com'],
                  ['Duplicate persons', '3 pairs', 'Low', 'Confirmed father/son — kept all'],
                ].map(([issue, records, severity, resolution]) => (
                  <tr key={issue}>
                    <td className="px-4 py-3 text-gray-700">{issue}</td>
                    <td className="px-4 py-3 text-gray-700">{records}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${severity === 'High' ? 'bg-red-100 text-red-700' : severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}
                      >
                        {severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{resolution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 9: Version Control */}
        <section id="version-control" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            9. Version Control Strategy
          </h2>
          <p className="text-gray-700 mb-6">
            Every change to the workbook or CSV files was versioned. This is essential for
            accountability and for being able to roll back if something goes wrong. This entire
            system only exists because we explicitly asked Claude to implement it.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4">How It Works</h3>
          <ul className="list-disc pl-6 text-gray-700 mb-8 space-y-1">
            <li>
              The original file is never modified. It stays in the project folder as the source of
              truth.
            </li>
            <li>
              Each time Claude makes changes, the workbook gets a new version number (v1, v2, ...
              v9).
            </li>
            <li>CSV files also get version numbers that increment independently.</li>
            <li>
              When a new version is created, the old version is moved to an &quot;old&quot;
              subfolder.
            </li>
            <li>
              The Change Log tab inside the workbook documents exactly what changed in each version.
            </li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mb-4">Version History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-bold text-gray-900 border-b w-16">Ver</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-900 border-b">Changes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  [
                    'v1',
                    'Initial working copy. Cleared mailto: corruption, applied safe fixes, created base CSVs.',
                  ],
                  ['v2', 'Rebuilt Minors tab with all 26 columns (was missing 18 fields).'],
                  [
                    'v3',
                    'Added No Newsletter handling: tags, separate files, and dedicated workbook tabs.',
                  ],
                  ['v4', 'Created Import Plan tab. Removed redundant contact-only CSVs.'],
                  [
                    'v5',
                    'Fixed last name commas (64 names) and empty dates (55 records). Regenerated all CSVs.',
                  ],
                  [
                    'v6',
                    'Resolved all remaining data quality items: email typo, class code, phone DOBs, non-person rows.',
                  ],
                  ['v7', 'Added Subscription Status column for auto-unsubscribe on import.'],
                  [
                    'v8',
                    'Created full contact import CSVs with Lists column. Replaced NoNewsletter-only files.',
                  ],
                  ['v9', 'Removed Tags column (OBE — replaced by Lists in Zeffy). Final version.'],
                ].map(([ver, changes]) => (
                  <tr key={ver}>
                    <td className="px-4 py-3 text-gray-700 font-mono font-bold">{ver}</td>
                    <td className="px-4 py-3 text-gray-700">{changes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 10: File Inventory */}
        <section id="file-inventory" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            10. Final File Inventory
          </h2>

          <h3 className="text-xl font-bold text-gray-900 mb-4">Active Files</h3>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-bold text-gray-900 border-b">File</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-900 border-b">Records</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-900 border-b">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono text-xs">
                {[
                  ['2026 Member Data (Original).xlsx', '2,094', 'Original — NEVER MODIFIED'],
                  ['2026 Member Data v9.xlsx', '2,076', 'Working workbook (15 tabs)'],
                  ['Zeffy_Payment_Import_Class_A_v4.csv', '493', 'Payment import — Class A'],
                  ['Zeffy_Payment_Import_Class_B_v4.csv', '109', 'Payment import — Class B'],
                  ['Zeffy_Payment_Import_Class_CA_v4.csv', '283', 'Payment import — Class CA'],
                  ['Zeffy_Payment_Import_Class_CS_v4.csv', '473', 'Payment import — Class CS'],
                  ['Zeffy_Contact_Import_Class_A_v2.csv', '493', 'Contact import with Lists'],
                  ['Zeffy_Contact_Import_Class_B_v2.csv', '109', 'Contact import with Lists'],
                  ['Zeffy_Contact_Import_Class_CA_v2.csv', '281', 'Contact import with Lists'],
                  ['Zeffy_Contact_Import_Class_CS_v2.csv', '475', 'Contact import with Lists'],
                ].map(([file, records, purpose]) => (
                  <tr key={file}>
                    <td className="px-4 py-3 text-gray-700">{file}</td>
                    <td className="px-4 py-3 text-gray-700">{records}</td>
                    <td className="px-4 py-3 text-gray-700 font-sans">{purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-4">Workbook Tabs (v9)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-bold text-gray-900 border-b">Tab</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-900 border-b">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ['Import Plan', 'Step-by-step import workflow with verification checklist'],
                  ['Change Log', 'Every change across all 9 versions with dates and details'],
                  ['Data Quality Audit', 'All 13 issues tracked from discovery to resolution'],
                  ['Master List', 'Full cleaned dataset (2,076 rows, 26 columns)'],
                  ['New Members / All Emails', 'Original supplementary tabs preserved from source'],
                  [
                    'Zeffy Pay Class A/B/CA/CS',
                    'Mirror of payment CSV data for in-workbook review',
                  ],
                  ['Minors', '18 minor records with full 26 columns'],
                  ['Contact A/B/CA/CS', 'Mirror of contact CSV data with Lists column'],
                ].map(([tab, description]) => (
                  <tr key={tab}>
                    <td className="px-4 py-3 text-gray-700 font-medium">{tab}</td>
                    <td className="px-4 py-3 text-gray-700">{description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 11: Lessons Learned */}
        <section id="lessons" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            11. Lessons Learned &amp; Tips
          </h2>

          <h3 className="text-xl font-bold text-gray-900 mb-4">Working with Claude Cowork</h3>
          <ul className="space-y-3 mb-8">
            {[
              "Front-load your requirements. The consolidated prompt in Section 3 represents everything we learned over 9 versions. Give Claude all your project management requirements upfront and you'll save significant back-and-forth.",
              "Claude is conservative by default. It won't create documentation tabs, set up folder structures, or implement version control unless you ask. See Section 4 for the full list.",
              "Review Claude's work at each step. Claude shows you what it's doing and asks for decisions on ambiguous items. Take the time to review — this is where your institutional knowledge matters.",
              "Use screenshots to share what you find in Zeffy. We discovered Subscription Status and Lists features by exploring Zeffy's import interface. Sharing screenshots with Claude let it immediately adapt the files.",
              "The conversation context has limits. For very long projects, Claude's context window may fill up and the session may need to continue in a new conversation. When this happens, Claude can read a summary of the prior conversation and continue.",
              'Check the Minors tab (or any separated data). When Claude creates subset tabs, verify they have all the columns from the original. Our Minors tab initially only had 8 columns instead of 26.',
            ].map((tip) => (
              <li key={tip.substring(0, 30)} className="flex items-start text-gray-700 text-sm">
                <svg
                  className="w-5 h-5 text-violet-500 mt-0.5 mr-3 flex-shrink-0"
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
                <span>{tip}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mb-4">Data Cleaning Tips</h3>
          <ul className="space-y-3 mb-8">
            {[
              'mailto: corruption is common. If your Excel has been used to send emails, email cells often get corrupted with mailto: prefixes. Always check for this.',
              'Commas in names break CSVs. Names like "Smith, Jr." will split incorrectly when imported as CSV. Remove commas but keep the suffix.',
              "Empty dates need a strategy. Decide upfront what to use as a fallback date. We used the current date, but you might prefer the member's join date or a specific default.",
              'Shared email addresses are a real problem. CRM systems use email as the unique identifier. If spouses share an email, you need a deduplication strategy before import.',
              "Don't delete rows — clear them. We learned the hard way that deleting rows in Excel programmatically can corrupt data. Clearing cell values is safer.",
            ].map((tip) => (
              <li key={tip.substring(0, 30)} className="flex items-start text-gray-700 text-sm">
                <svg
                  className="w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>{tip}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mb-4">Zeffy-Specific Tips</h3>
          <ul className="space-y-3">
            {[
              "Payment import creates contacts. You don't need a separate contact import to get people into Zeffy. The payment import does both. Use the contact import only for adding Lists and newsletter preferences.",
              'Email is the primary key. Everything in Zeffy revolves around the email address. Duplicate emails will be merged. Make sure emails are unique and correct before importing.',
              "Tags are being replaced by Lists. As of early 2026, Zeffy's Tags feature is transitioning to Lists. Use Lists for segmentation.",
              'Lists use semicolons in the CSV. When assigning contacts to multiple lists, separate list names with semicolons (e.g., "Class A;All Members").',
              'Subscription Status controls newsletter opt-out. Setting it to "unsubscribed" opts the contact out of newsletters while still allowing transactional emails.',
              'Import one file at a time. Even if your files are small, importing one class at a time makes troubleshooting easier.',
            ].map((tip) => (
              <li key={tip.substring(0, 30)} className="flex items-start text-gray-700 text-sm">
                <svg
                  className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Section 12: Appendix */}
        <section id="appendix" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
            12. Appendix: Zeffy Import Field Reference
          </h2>

          <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Import Template</h3>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-bold text-gray-900 border-b">Field</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-900 border-b">Required</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-900 border-b">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ['firstName', 'Yes', 'Contact first name'],
                  ['lastName', 'Yes', 'Contact last name'],
                  ['amount', 'Yes', 'Payment amount in dollars'],
                  ['address', 'No', 'Street address'],
                  ['city', 'No', 'City'],
                  ['postalCode', 'No', 'ZIP or postal code'],
                  ['country', 'Yes', '2-letter country code (US)'],
                  ['type', 'Yes', '"manual" for imported data'],
                  ['formTitle', 'Yes', 'Form name — use for class segmentation'],
                  ['rateTitle', 'No', 'Rate/tier name'],
                  ['email', 'Yes', 'Primary contact identifier'],
                  ['language', 'No', '"en" for English'],
                  ['date', 'Yes', 'Payment date (MM/DD/YYYY)'],
                  ['state/province', 'No', '2-letter state code'],
                  ['paymentMethod', 'Yes', '"manual" for imported data'],
                  ['receiptUrl', 'No', 'Leave empty'],
                  ['ticketUrl', 'No', 'Leave empty'],
                  ['receiptNumber', 'No', 'Leave empty'],
                  ['companyName', 'No', 'Organization name if applicable'],
                  ['note', 'No', 'Free text note'],
                  ['annotation', 'No', 'Internal annotation'],
                ].map(([field, required, notes]) => (
                  <tr key={field}>
                    <td className="px-4 py-2 text-gray-700 font-mono text-xs">{field}</td>
                    <td className="px-4 py-2">
                      {required === 'Yes' ? (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                          Required
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Optional</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-gray-700">{notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Import Template</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-bold text-gray-900 border-b">Field</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-900 border-b">Required</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-900 border-b">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ['First Name', 'Yes', 'Contact first name'],
                  ['Last Name', 'Yes', 'Contact last name'],
                  ['Email', 'Yes', 'Primary identifier — matches existing contacts'],
                  ['Language', 'No', '"en" for English'],
                  ['Address', 'No', 'Street address'],
                  ['City', 'No', 'City'],
                  ['Region', 'No', 'State/province'],
                  ['Postal Code', 'No', 'ZIP code'],
                  ['Country', 'No', '2-letter country code'],
                  ['Phone', 'No', 'Phone number'],
                  ['Note', 'No', 'Free text note'],
                  ['Company name', 'No', 'Organization name'],
                  ['Subscription Status', 'No', '"unsubscribed" to opt out of newsletters'],
                  ['Lists', 'No', 'Semicolon-separated list names'],
                ].map(([field, required, notes]) => (
                  <tr key={field}>
                    <td className="px-4 py-2 text-gray-700 font-mono text-xs">{field}</td>
                    <td className="px-4 py-2">
                      {required === 'Yes' ? (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                          Required
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Optional</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-gray-700">{notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer note */}
        <div className="border-t border-gray-200 pt-8 mt-16 text-center">
          <p className="text-sm text-gray-500 italic">
            This document was created using Claude AI (Cowork mode) as part of the member data
            migration project.
          </p>
          <Link
            href="/guides"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm mt-4"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to All Guides
          </Link>
        </div>
      </div>
    </div>
  )
}

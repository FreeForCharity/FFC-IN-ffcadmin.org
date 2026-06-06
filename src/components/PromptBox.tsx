import type { ReactNode } from 'react'

/**
 * PromptBox renders a copy-and-paste prompt that a volunteer types directly
 * into their in-IDE AI agent (Antigravity Agent Manager or VS Code Copilot
 * agent mode). Used throughout the developer environment setup guides so each
 * step has a ready-made instruction for the agent.
 */
const ACCENTS = {
  emerald: {
    container: 'border-emerald-300 bg-emerald-50',
    label: 'text-emerald-700',
    text: 'text-emerald-900',
  },
  blue: {
    container: 'border-blue-300 bg-blue-50',
    label: 'text-blue-700',
    text: 'text-blue-900',
  },
  amber: {
    container: 'border-amber-300 bg-amber-50',
    label: 'text-amber-700',
    text: 'text-amber-900',
  },
  slate: {
    container: 'border-slate-300 bg-slate-100',
    label: 'text-slate-600',
    text: 'text-slate-900',
  },
} as const

interface PromptBoxProps {
  /**
   * Accent color, usually matching the guide:
   * emerald = Antigravity, blue = VS Code, amber = Claude Desktop, slate = Codex.
   */
  accent?: keyof typeof ACCENTS
  /** Optional override for the label above the prompt. */
  label?: string
  /** The prompt text the volunteer should paste into the AI agent. */
  children: ReactNode
}

export default function PromptBox({
  accent = 'emerald',
  label = 'Copy this prompt into your AI agent',
  children,
}: PromptBoxProps) {
  const c = ACCENTS[accent]
  return (
    <div className={`mt-4 rounded-lg border ${c.container} p-4`}>
      <div className="mb-2 flex items-center gap-2">
        <span aria-hidden="true">💬</span>
        <span className={`text-xs font-semibold uppercase tracking-wide ${c.label}`}>{label}</span>
      </div>
      <p className={`font-mono text-sm leading-relaxed ${c.text}`}>{children}</p>
    </div>
  )
}

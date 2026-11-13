import { FOCUS_EMPHASIS, FOCUS_STATEMENT } from '@/data/charity-messaging'

/**
 * The Clarke-approved focus statement, word for word, with "food, water or
 * shelter" in bold. Never edit the wording here — change FOCUS_STATEMENT.
 */
export default function FocusStatement({ className }: { className?: string }) {
  const [before, after] = FOCUS_STATEMENT.split(FOCUS_EMPHASIS)
  return (
    <p className={className}>
      {before}
      <strong>{FOCUS_EMPHASIS}</strong>
      {after}
    </p>
  )
}

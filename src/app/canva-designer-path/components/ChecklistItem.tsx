'use client'

interface ChecklistItemProps {
  id: string
  text: string
  isCompleted: boolean
  onToggle: () => void
  link?: { url: string; label: string }
}

export function ChecklistItem({ text, isCompleted, onToggle, link }: ChecklistItemProps) {
  return (
    <li className="flex items-start group cursor-pointer" onClick={onToggle}>
      <div className="flex items-center h-6 mr-3">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => {}}
          className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500 cursor-pointer"
          aria-label={text}
        />
      </div>
      <div className={`text-gray-700 ${isCompleted ? 'line-through opacity-50' : ''}`}>
        <span>{text}</span>
        {link && (
          <>
            {' '}
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline ml-1"
              onClick={(e) => e.stopPropagation()}
            >
              ({link.label})
            </a>
          </>
        )}
      </div>
    </li>
  )
}

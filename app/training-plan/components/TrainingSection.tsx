'use client'

import { Directive, TrainingBlock } from '../data'

interface TrainingSectionProps {
  block: TrainingBlock
  completedItems: Set<string>
  onToggle: (id: string) => void
}

export function TrainingSection({ block, completedItems, onToggle }: TrainingSectionProps) {
  const isBlockComplete = block.directives.every((d) => completedItems.has(d.id))

  return (
    <div
      className={`mb-8 rounded-xl shadow-lg overflow-hidden transition-colors duration-300 ${
        isBlockComplete ? 'bg-blue-50 ring-2 ring-blue-500' : 'bg-white'
      }`}
    >
      <div className="p-6 md:p-8">
        {/* Header */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
          {block.badge && (
            <span
              className={`rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold transition-colors ${
                isBlockComplete ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {isBlockComplete ? '✓' : block.badge}
            </span>
          )}
          {block.title}
        </h3>

        {/* Description */}
        <div className="ml-11 space-y-4">
          <p className="text-gray-700">
            <strong>Concept:</strong> {block.description}
          </p>

          <div className="bg-white/50 p-4 rounded-lg border border-gray-100">
            <p className="text-gray-900 font-semibold mb-2">Objective:</p>
            <p className="text-gray-700 mb-4">{block.objective}</p>

            <p className="text-gray-900 font-semibold mb-2">Directives:</p>
            <ul className="space-y-3">
              {block.directives.map((directive) => (
                <DirectiveItem
                  key={directive.id}
                  directive={directive}
                  isCompleted={completedItems.has(directive.id)}
                  onToggle={() => onToggle(directive.id)}
                />
              ))}
            </ul>

            {block.promotionEvent && (
              <div className="bg-green-50 border-l-4 border-green-600 p-3 rounded mt-6">
                <p className="text-green-900 font-semibold">
                  Promotion Event: {block.promotionEvent}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function DirectiveItem({
  directive,
  isCompleted,
  onToggle,
}: {
  directive: Directive
  isCompleted: boolean
  onToggle: () => void
}) {
  return (
    <li className="flex items-start group cursor-pointer" onClick={onToggle}>
      <div className="flex items-center h-6 mr-3">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => {}} // Handled by parent div click
          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
        />
      </div>
      <div className={`text-gray-700 ${isCompleted ? 'line-through opacity-50' : ''}`}>
        <span>{directive.text}</span>
        {directive.link && (
          <>
            {' '}
            <a
              href={directive.link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline ml-1"
              onClick={(e) => e.stopPropagation()} // Prevent toggling when clicking link
            >
              ({directive.link.label})
            </a>
          </>
        )}
      </div>
    </li>
  )
}

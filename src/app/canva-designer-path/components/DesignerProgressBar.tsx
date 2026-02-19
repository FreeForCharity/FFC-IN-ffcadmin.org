'use client'

interface DesignerProgressBarProps {
  percentage: number
  onReset: () => void
}

export function DesignerProgressBar({ percentage, onReset }: DesignerProgressBarProps) {
  return (
    <div className="sticky top-16 z-40 bg-white/95 backdrop-blur shadow-md border-b border-gray-200 px-4 py-3 mb-8">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
            <span>Designer Progress</span>
            <span>{percentage}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-pink-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-gray-500 hover:text-red-600 underline whitespace-nowrap"
        >
          Reset Progress
        </button>
      </div>
    </div>
  )
}

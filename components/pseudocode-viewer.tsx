'use client'

import { cn } from '@/lib/utils'

interface PseudocodeViewerProps {
  code: string[]
  currentLine: number
}

export function PseudocodeViewer({ code, currentLine }: PseudocodeViewerProps) {
  return (
    <div className="bg-secondary/50 rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-x-auto">
      <h4 className="text-xs font-medium text-muted-foreground mb-2 font-sans">Pseudocódigo</h4>
      <div className="space-y-0.5">
        {code.map((line, index) => (
          <div
            key={index}
            className={cn(
              'px-2 py-0.5 rounded transition-all duration-200 whitespace-pre',
              currentLine === index && 'bg-primary text-primary-foreground font-medium'
            )}
          >
            <span className="text-muted-foreground mr-2 text-[10px] sm:text-xs inline-block w-4">{index + 1}</span>
            {line}
          </div>
        ))}
      </div>
    </div>
  )
}

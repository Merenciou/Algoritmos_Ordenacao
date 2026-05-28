'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface SortingBarsProps {
  array: { value: number; label: string }[]
  comparing: number[]
  swapping: number[]
  sorted: number[]
  pivot?: number
  maxValue: number
}

export function SortingBars({ 
  array, 
  comparing, 
  swapping, 
  sorted, 
  pivot,
  maxValue 
}: SortingBarsProps) {
  const getBarColor = (index: number) => {
    if (sorted.includes(index)) return 'bg-sorted'
    if (swapping.includes(index)) return 'bg-swapping'
    if (comparing.includes(index)) return 'bg-comparing'
    if (pivot === index) return 'bg-pivot'
    return 'bg-primary/60'
  }

  const barWidth = useMemo(() => {
    const count = array.length
    if (count <= 10) return 'w-12 sm:w-16 md:w-20'
    if (count <= 20) return 'w-8 sm:w-10 md:w-12'
    if (count <= 30) return 'w-6 sm:w-8 md:w-10'
    if (count <= 50) return 'w-4 sm:w-5 md:w-6'
    return 'w-2 sm:w-3 md:w-4'
  }, [array.length])

  const showLabels = array.length <= 20

  return (
    <div className="flex items-end justify-center gap-0.5 sm:gap-1 h-48 sm:h-64 md:h-80 w-full overflow-x-auto px-2">
      {array.map((item, index) => {
        const heightPercent = (item.value / maxValue) * 100
        return (
          <div
            key={index}
            className="flex flex-col items-center gap-1"
          >
            <div
              className={cn(
                barWidth,
                'rounded-t-sm transition-all duration-200 relative group',
                getBarColor(index)
              )}
              style={{ height: `${Math.max(heightPercent, 5)}%` }}
            >
              {showLabels && (
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs font-medium text-foreground">
                  {item.value}
                </span>
              )}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 hidden group-hover:block z-10">
                <div className="bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                  {item.label}: {item.value}
                </div>
              </div>
            </div>
            {showLabels && array.length <= 15 && (
              <span className="text-[8px] sm:text-[10px] text-muted-foreground truncate w-12 text-center hidden sm:block">
                {item.label.slice(0, 8)}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

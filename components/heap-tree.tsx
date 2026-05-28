'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface HeapTreeProps {
  array: { value: number; label: string }[]
  comparing: number[]
  swapping: number[]
  sorted: number[]
}

export function HeapTree({ array, comparing, swapping, sorted }: HeapTreeProps) {
  const levels = useMemo(() => {
    if (array.length === 0) return []
    
    const result: number[][] = []
    let start = 0
    let levelSize = 1
    
    while (start < array.length) {
      const end = Math.min(start + levelSize, array.length)
      result.push(Array.from({ length: end - start }, (_, i) => start + i))
      start = end
      levelSize *= 2
    }
    
    return result
  }, [array.length])

  const getNodeColor = (index: number) => {
    if (sorted.includes(index)) return 'bg-sorted text-primary-foreground'
    if (swapping.includes(index)) return 'bg-swapping text-white'
    if (comparing.includes(index)) return 'bg-comparing text-black'
    return 'bg-secondary text-secondary-foreground'
  }

  if (array.length === 0) return null

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-4 py-4 overflow-x-auto w-full">
      <h4 className="text-xs sm:text-sm font-medium text-muted-foreground">Representação do Heap Binário</h4>
      <div className="flex flex-col items-center gap-2 sm:gap-4 min-w-fit px-4">
        {levels.map((level, levelIdx) => (
          <div 
            key={levelIdx} 
            className="flex justify-center gap-1 sm:gap-2"
            style={{ 
              width: `${Math.pow(2, levels.length - 1) * (array.length > 15 ? 2.5 : 3.5)}rem`
            }}
          >
            {level.map((index) => (
              <div
                key={index}
                className={cn(
                  'flex items-center justify-center rounded-full transition-all duration-200',
                  array.length > 15 
                    ? 'w-6 h-6 sm:w-8 sm:h-8 text-[10px] sm:text-xs' 
                    : 'w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm',
                  'font-medium',
                  getNodeColor(index)
                )}
                style={{
                  marginLeft: levelIdx === 0 ? 0 : `${100 / (level.length * 2)}%`,
                  marginRight: levelIdx === 0 ? 0 : `${100 / (level.length * 2)}%`
                }}
              >
                {array[index].value}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

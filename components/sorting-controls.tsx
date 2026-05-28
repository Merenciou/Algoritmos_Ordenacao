'use client'

import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react'

interface ControlsProps {
  isPlaying: boolean
  isComplete: boolean
  speed: number
  onPlay: () => void
  onPause: () => void
  onStep: () => void
  onReset: () => void
  onSpeedChange: (value: number) => void
}

export function SortingControls({
  isPlaying,
  isComplete,
  speed,
  onPlay,
  onPause,
  onStep,
  onReset,
  onSpeedChange
}: ControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full">
      <div className="flex items-center gap-2">
        {isPlaying ? (
          <Button 
            onClick={onPause} 
            variant="secondary" 
            size="sm"
            className="gap-2"
          >
            <Pause className="h-4 w-4" />
            <span className="hidden sm:inline">Pausar</span>
          </Button>
        ) : (
          <Button 
            onClick={onPlay} 
            variant="default" 
            size="sm"
            disabled={isComplete}
            className="gap-2"
          >
            <Play className="h-4 w-4" />
            <span className="hidden sm:inline">Iniciar</span>
          </Button>
        )}
        <Button 
          onClick={onStep} 
          variant="outline" 
          size="sm"
          disabled={isPlaying || isComplete}
          className="gap-2"
        >
          <SkipForward className="h-4 w-4" />
          <span className="hidden sm:inline">Passo</span>
        </Button>
        <Button 
          onClick={onReset} 
          variant="outline" 
          size="sm"
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="hidden sm:inline">Reiniciar</span>
        </Button>
      </div>

      <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
        <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
          Velocidade:
        </span>
        <Slider
          value={[speed]}
          onValueChange={(values) => onSpeedChange(values[0])}
          min={10}
          max={2000}
          step={10}
          className="w-full sm:w-32 md:w-40"
        />
        <span className="text-xs text-muted-foreground w-14 text-right">
          {speed}ms
        </span>
      </div>
    </div>
  )
}

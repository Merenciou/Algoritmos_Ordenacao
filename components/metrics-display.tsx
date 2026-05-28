'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowDown, ArrowUp, Clock, Repeat, GitCompare } from 'lucide-react'

interface MetricsDisplayProps {
  comparisons: number
  swaps: number
  elapsedTime: number
  isComplete: boolean
}

export function MetricsDisplay({ comparisons, swaps, elapsedTime, isComplete }: MetricsDisplayProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      <Card className="bg-secondary/50 border-border">
        <CardContent className="p-2 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
            <GitCompare className="h-4 w-4 text-comparing hidden sm:block" />
            <div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Comparações</p>
              <p className="text-lg sm:text-2xl font-bold text-foreground">{comparisons}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-secondary/50 border-border">
        <CardContent className="p-2 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
            <Repeat className="h-4 w-4 text-swapping hidden sm:block" />
            <div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Trocas</p>
              <p className="text-lg sm:text-2xl font-bold text-foreground">{swaps}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-secondary/50 border-border">
        <CardContent className="p-2 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
            <Clock className="h-4 w-4 text-primary hidden sm:block" />
            <div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Tempo</p>
              <p className="text-lg sm:text-2xl font-bold text-foreground">{elapsedTime.toFixed(0)}ms</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface ComparisonResult {
  algorithm: string
  comparisons: number
  swaps: number
  time: number
  bestCase: string
  averageCase: string
  worstCase: string
}

interface ComparisonTableProps {
  results: ComparisonResult[]
}

export function ComparisonTable({ results }: ComparisonTableProps) {
  if (results.length === 0) return null

  const sortedByTime = [...results].sort((a, b) => a.time - b.time)
  const fastestTime = sortedByTime[0]?.time || 0
  const slowestTime = sortedByTime[sortedByTime.length - 1]?.time || 0

  return (
    <div className="overflow-x-auto -mx-3 sm:mx-0">
      <table className="w-full text-xs sm:text-sm min-w-[600px]">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 px-2 sm:px-3 text-muted-foreground font-medium">Algoritmo</th>
            <th className="text-right py-2 px-2 sm:px-3 text-muted-foreground font-medium">Comparações</th>
            <th className="text-right py-2 px-2 sm:px-3 text-muted-foreground font-medium">Trocas</th>
            <th className="text-right py-2 px-2 sm:px-3 text-muted-foreground font-medium">Tempo (ms)</th>
            <th className="text-center py-2 px-2 sm:px-3 text-muted-foreground font-medium">Complexidade</th>
          </tr>
        </thead>
        <tbody>
          {sortedByTime.map((result, index) => (
            <tr key={result.algorithm} className="border-b border-border/50 hover:bg-secondary/30">
              <td className="py-2 px-2 sm:px-3 font-medium">
                <div className="flex items-center gap-2">
                  {result.algorithm}
                  {index === 0 && (
                    <Badge className="bg-sorted text-primary-foreground text-[10px]">
                      <ArrowUp className="h-2 w-2 mr-1" />
                      Mais rápido
                    </Badge>
                  )}
                  {index === sortedByTime.length - 1 && results.length > 1 && (
                    <Badge variant="destructive" className="text-[10px]">
                      <ArrowDown className="h-2 w-2 mr-1" />
                      Mais lento
                    </Badge>
                  )}
                </div>
              </td>
              <td className="text-right py-2 px-2 sm:px-3 tabular-nums">{result.comparisons.toLocaleString()}</td>
              <td className="text-right py-2 px-2 sm:px-3 tabular-nums">{result.swaps.toLocaleString()}</td>
              <td className="text-right py-2 px-2 sm:px-3 tabular-nums">{result.time.toFixed(2)}</td>
              <td className="py-2 px-2 sm:px-3">
                <div className="flex justify-center gap-1 flex-wrap">
                  <Badge variant="outline" className="text-[8px] sm:text-[10px]">{result.bestCase}</Badge>
                  <Badge variant="outline" className="text-[8px] sm:text-[10px]">{result.averageCase}</Badge>
                  <Badge variant="outline" className="text-[8px] sm:text-[10px]">{result.worstCase}</Badge>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

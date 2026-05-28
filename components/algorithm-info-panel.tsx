'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { algorithmInfo } from '@/lib/sorting-algorithms'

interface AlgorithmInfoPanelProps {
  algorithmKey: string
}

export function AlgorithmInfoPanel({ algorithmKey }: AlgorithmInfoPanelProps) {
  const info = algorithmInfo[algorithmKey]
  if (!info) return null

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3 px-3 sm:px-6 pt-4 sm:pt-6">
        <CardTitle className="text-base sm:text-lg">{info.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-3 sm:px-6 pb-4 sm:pb-6">
        <div>
          <h4 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Como funciona</h4>
          <p className="text-xs sm:text-sm text-foreground leading-relaxed">{info.description}</p>
        </div>

        <div>
          <h4 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Estrutura de dados</h4>
          <p className="text-xs sm:text-sm text-foreground leading-relaxed">{info.dataStructure}</p>
        </div>

        <div>
          <h4 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Complexidade</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-[10px] sm:text-xs">
              Melhor: {info.bestCase}
            </Badge>
            <Badge variant="secondary" className="text-[10px] sm:text-xs">
              Médio: {info.averageCase}
            </Badge>
            <Badge variant="secondary" className="text-[10px] sm:text-xs">
              Pior: {info.worstCase}
            </Badge>
            <Badge variant="outline" className="text-[10px] sm:text-xs">
              Espaço: {info.spaceComplexity}
            </Badge>
          </div>
        </div>

        <div>
          <h4 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Por quê?</h4>
          <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">{info.explanation}</p>
        </div>
      </CardContent>
    </Card>
  )
}

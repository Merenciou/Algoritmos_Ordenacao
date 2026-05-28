'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ComparisonResult {
  algorithm: string
  comparisons: number
  swaps: number
  time: number
}

interface ComparisonChartProps {
  results: ComparisonResult[]
}

const COLORS = [
  'hsl(165, 80%, 50%)', // primary teal
  'hsl(200, 60%, 50%)', // blue
  'hsl(80, 60%, 55%)',  // yellow-green
  'hsl(25, 70%, 50%)',  // orange
  'hsl(280, 60%, 55%)', // purple
  'hsl(350, 70%, 50%)', // red
]

export function ComparisonChart({ results }: ComparisonChartProps) {
  if (results.length === 0) return null

  const chartConfig = {
    comparisons: {
      label: 'Comparações',
      color: 'hsl(var(--chart-1))',
    },
    swaps: {
      label: 'Trocas',
      color: 'hsl(var(--chart-2))',
    },
    time: {
      label: 'Tempo (ms)',
      color: 'hsl(var(--chart-3))',
    },
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="bg-card border-border">
        <CardHeader className="p-3 sm:p-4">
          <CardTitle className="text-sm sm:text-base">Comparações e Trocas</CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-4 pt-0">
          <ChartContainer config={chartConfig} className="h-48 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="algorithm" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="comparisons" fill="hsl(var(--chart-1))" name="Comparações" radius={[4, 4, 0, 0]} />
                <Bar dataKey="swaps" fill="hsl(var(--chart-2))" name="Trocas" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="p-3 sm:p-4">
          <CardTitle className="text-sm sm:text-base">Tempo de Execução (ms)</CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-4 pt-0">
          <ChartContainer config={chartConfig} className="h-48 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="algorithm" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="time" name="Tempo (ms)" radius={[4, 4, 0, 0]}>
                  {results.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

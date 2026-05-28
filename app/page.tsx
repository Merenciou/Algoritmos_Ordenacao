'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Loader2, Database, Shuffle, BarChart3, PlayCircle, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

import { SortingBars } from '@/components/sorting-bars'
import { HeapTree } from '@/components/heap-tree'
import { PseudocodeViewer } from '@/components/pseudocode-viewer'
import { AlgorithmInfoPanel } from '@/components/algorithm-info-panel'
import { SortingControls } from '@/components/sorting-controls'
import { MetricsDisplay, ComparisonTable } from '@/components/metrics-display'
import { ComparisonChart } from '@/components/comparison-chart'

import { sortingAlgorithms, algorithmInfo, type SortStep } from '@/lib/sorting-algorithms'
import { apiSources, fetchApiData, generateRandomData } from '@/lib/api-sources'

type AlgorithmKey = keyof typeof sortingAlgorithms

interface DataItem {
  value: number
  label: string
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

export default function SortingVisualizerPage() {
  // Data state
  const [dataSource, setDataSource] = useState('random')
  const [dataField, setDataField] = useState('')
  const [dataSize, setDataSize] = useState(15)
  const [originalData, setOriginalData] = useState<DataItem[]>([])
  const [currentData, setCurrentData] = useState<DataItem[]>([])
  const [isLoadingData, setIsLoadingData] = useState(false)

  // Algorithm state
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmKey>('bubble')
  const [currentStep, setCurrentStep] = useState<SortStep | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [speed, setSpeed] = useState(300)

  // Metrics state
  const [comparisons, setComparisons] = useState(0)
  const [swaps, setSwaps] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)

  // Comparison state
  const [comparisonResults, setComparisonResults] = useState<ComparisonResult[]>([])
  const [isRunningComparison, setIsRunningComparison] = useState(false)

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Refs
  const generatorRef = useRef<Generator<SortStep> | null>(null)
  const animationRef = useRef<number | null>(null)
  const lastStepTimeRef = useRef<number>(0)

  // Get current API source fields
  const currentSource = apiSources.find(s => s.id === dataSource)
  const availableFields = currentSource?.fields || []

  // Load data
  const loadData = useCallback(async () => {
    setIsLoadingData(true)
    setIsComplete(false)
    setComparisons(0)
    setSwaps(0)
    setElapsedTime(0)
    setCurrentStep(null)
    generatorRef.current = null

    try {
      let data: DataItem[]
      if (dataSource === 'random') {
        data = generateRandomData(dataSize)
      } else {
        data = await fetchApiData(dataSource, dataField || availableFields[0]?.key || '', dataSize)
      }
      setOriginalData(data)
      setCurrentData(data)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      const fallbackData = generateRandomData(dataSize)
      setOriginalData(fallbackData)
      setCurrentData(fallbackData)
    } finally {
      setIsLoadingData(false)
      setMobileMenuOpen(false)
    }
  }, [dataSource, dataField, dataSize, availableFields])

  // Initialize data on mount
  useEffect(() => {
    loadData()
  }, [])

  // Shuffle data
  const shuffleData = useCallback(() => {
    const shuffled = [...originalData].sort(() => Math.random() - 0.5)
    setOriginalData(shuffled)
    setCurrentData(shuffled)
    setIsComplete(false)
    setComparisons(0)
    setSwaps(0)
    setElapsedTime(0)
    setCurrentStep(null)
    generatorRef.current = null
  }, [originalData])

  // Reset to original
  const resetSort = useCallback(() => {
    setCurrentData([...originalData])
    setIsComplete(false)
    setIsPlaying(false)
    setComparisons(0)
    setSwaps(0)
    setElapsedTime(0)
    setStartTime(null)
    setCurrentStep(null)
    generatorRef.current = null
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }, [originalData])

  // Execute single step
  const executeStep = useCallback(() => {
    if (!generatorRef.current) {
      const values = currentData.map(d => d.value)
      const sortFn = sortingAlgorithms[selectedAlgorithm]
      generatorRef.current = sortFn(values)
      setStartTime(Date.now())
    }

    const result = generatorRef.current.next()
    if (result.done) {
      setIsComplete(true)
      setIsPlaying(false)
      if (startTime) {
        setElapsedTime(Date.now() - startTime)
      }
      return false
    }

    const step = result.value
    setCurrentStep(step)
    setCurrentData(prev => prev.map((item, i) => ({ ...item, value: step.array[i] })))
    
    if (step.comparing.length > 0) {
      setComparisons(c => c + 1)
    }
    if (step.swapping.length > 0) {
      setSwaps(s => s + 1)
    }
    if (startTime) {
      setElapsedTime(Date.now() - startTime)
    }

    return true
  }, [currentData, selectedAlgorithm, startTime])

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return

    const animate = (timestamp: number) => {
      if (timestamp - lastStepTimeRef.current >= speed) {
        const shouldContinue = executeStep()
        lastStepTimeRef.current = timestamp
        if (!shouldContinue) {
          return
        }
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, speed, executeStep])

  // Run comparison
  const runComparison = useCallback(async () => {
    setIsRunningComparison(true)
    setComparisonResults([])

    const results: ComparisonResult[] = []
    const algorithms = Object.keys(sortingAlgorithms) as AlgorithmKey[]

    for (const algo of algorithms) {
      const values = originalData.map(d => d.value)
      const sortFn = sortingAlgorithms[algo]
      const generator = sortFn(values)

      let compCount = 0
      let swapCount = 0
      const start = performance.now()

      let result = generator.next()
      while (!result.done) {
        if (result.value.comparing.length > 0) compCount++
        if (result.value.swapping.length > 0) swapCount++
        result = generator.next()
      }

      const end = performance.now()
      const info = algorithmInfo[algo]

      results.push({
        algorithm: info.name,
        comparisons: compCount,
        swaps: swapCount,
        time: end - start,
        bestCase: info.bestCase,
        averageCase: info.averageCase,
        worstCase: info.worstCase
      })
    }

    setComparisonResults(results)
    setIsRunningComparison(false)
  }, [originalData])

  const maxValue = Math.max(...currentData.map(d => d.value), 1)

  const ConfigPanel = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Fonte de Dados</label>
        <Select value={dataSource} onValueChange={(v) => { setDataSource(v); setDataField(''); }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione uma fonte" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="random">Dados Aleatórios</SelectItem>
            {apiSources.map(source => (
              <SelectItem key={source.id} value={source.id}>
                {source.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {availableFields.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Campo</label>
          <Select value={dataField || availableFields[0]?.key} onValueChange={setDataField}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um campo" />
            </SelectTrigger>
            <SelectContent>
              {availableFields.map(field => (
                <SelectItem key={field.key} value={field.key}>
                  {field.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Quantidade</label>
        <Select value={dataSize.toString()} onValueChange={(v) => setDataSize(parseInt(v))}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 15, 20, 30, 50].map(size => (
              <SelectItem key={size} value={size.toString()}>
                {size} elementos
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button onClick={loadData} disabled={isLoadingData} className="flex-1">
          {isLoadingData ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Database className="h-4 w-4 mr-2" />
          )}
          Carregar
        </Button>
        <Button onClick={shuffleData} variant="outline" disabled={isLoadingData || originalData.length === 0}>
          <Shuffle className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2 pt-4 border-t border-border">
        <label className="text-sm font-medium text-foreground">Algoritmo</label>
        <Select value={selectedAlgorithm} onValueChange={(v) => { setSelectedAlgorithm(v as AlgorithmKey); resetSort(); }}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(algorithmInfo).map(([key, info]) => (
              <SelectItem key={key} value={key}>
                {info.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground">Algoritmos de Ordenação</h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Visualização Interativa</p>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto">
              <div className="py-4">
                <h3 className="font-semibold mb-4">Configurações</h3>
                <ConfigPanel />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 sm:py-6">
        <Tabs defaultValue="visualize" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="visualize" className="text-xs sm:text-sm">
              <PlayCircle className="h-4 w-4 mr-1 sm:mr-2" />
              Visualizar
            </TabsTrigger>
            <TabsTrigger value="compare" className="text-xs sm:text-sm">
              <BarChart3 className="h-4 w-4 mr-1 sm:mr-2" />
              Comparar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visualize" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Sidebar - Desktop */}
              <div className="hidden lg:block lg:col-span-1 space-y-4">
                <Card className="bg-card border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Configurações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ConfigPanel />
                  </CardContent>
                </Card>

                <AlgorithmInfoPanel algorithmKey={selectedAlgorithm} />
              </div>

              {/* Main content */}
              <div className="lg:col-span-3 space-y-4">
                {/* Controls and Metrics */}
                <Card className="bg-card border-border">
                  <CardContent className="p-3 sm:p-6 space-y-4">
                    <SortingControls
                      isPlaying={isPlaying}
                      isComplete={isComplete}
                      speed={speed}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onStep={executeStep}
                      onReset={resetSort}
                      onSpeedChange={setSpeed}
                    />
                    <MetricsDisplay
                      comparisons={comparisons}
                      swaps={swaps}
                      elapsedTime={elapsedTime}
                      isComplete={isComplete}
                    />
                  </CardContent>
                </Card>

                {/* Visualization */}
                <Card className="bg-card border-border">
                  <CardHeader className="pb-2 px-3 sm:px-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <CardTitle className="text-base sm:text-lg">
                        {algorithmInfo[selectedAlgorithm].name}
                      </CardTitle>
                      {isComplete && (
                        <Badge className="bg-sorted text-primary-foreground w-fit">
                          Ordenação Concluída!
                        </Badge>
                      )}
                    </div>
                    {currentStep && (
                      <CardDescription className="text-xs sm:text-sm text-primary">
                        {currentStep.message}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="px-2 sm:px-6">
                    <SortingBars
                      array={currentData}
                      comparing={currentStep?.comparing || []}
                      swapping={currentStep?.swapping || []}
                      sorted={currentStep?.sorted || []}
                      pivot={currentStep?.pivot}
                      maxValue={maxValue}
                    />

                    {selectedAlgorithm === 'heap' && currentData.length <= 31 && (
                      <HeapTree
                        array={currentData}
                        comparing={currentStep?.comparing || []}
                        swapping={currentStep?.swapping || []}
                        sorted={currentStep?.sorted || []}
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Pseudocode - Mobile */}
                <div className="lg:hidden">
                  <Card className="bg-card border-border">
                    <CardContent className="p-3 sm:p-4">
                      <PseudocodeViewer
                        code={algorithmInfo[selectedAlgorithm].pseudocode}
                        currentLine={currentStep?.currentLine ?? -1}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Algorithm Info - Mobile */}
                <div className="lg:hidden">
                  <AlgorithmInfoPanel algorithmKey={selectedAlgorithm} />
                </div>

                {/* Pseudocode - Desktop */}
                <div className="hidden lg:block">
                  <Card className="bg-card border-border">
                    <CardContent className="p-4">
                      <PseudocodeViewer
                        code={algorithmInfo[selectedAlgorithm].pseudocode}
                        currentLine={currentStep?.currentLine ?? -1}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Legend */}
                <Card className="bg-card border-border">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-wrap gap-3 sm:gap-4 justify-center text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-comparing" />
                        <span className="text-muted-foreground">Comparando</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-swapping" />
                        <span className="text-muted-foreground">Trocando</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-sorted" />
                        <span className="text-muted-foreground">Ordenado</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-pivot" />
                        <span className="text-muted-foreground">Pivô</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="compare" className="space-y-4 sm:space-y-6">
            <Card className="bg-card border-border">
              <CardHeader className="px-3 sm:px-6">
                <CardTitle className="text-base sm:text-lg">Comparação de Desempenho</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Execute todos os algoritmos com o mesmo conjunto de dados para comparar seu desempenho.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <Button onClick={runComparison} disabled={isRunningComparison || originalData.length === 0}>
                    {isRunningComparison ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Executando...
                      </>
                    ) : (
                      <>
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Executar Todos
                      </>
                    )}
                  </Button>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {originalData.length} elementos • Dados: {dataSource === 'random' ? 'Aleatórios' : apiSources.find(s => s.id === dataSource)?.name}
                  </p>
                </div>

                {comparisonResults.length > 0 && (
                  <>
                    <ComparisonTable results={comparisonResults} />
                    <ComparisonChart results={comparisonResults} />
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

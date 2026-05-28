export interface SortStep {
  array: number[]
  comparing: number[]
  swapping: number[]
  sorted: number[]
  pivot?: number
  message: string
  currentLine: number
}

export interface AlgorithmInfo {
  name: string
  description: string
  dataStructure: string
  bestCase: string
  averageCase: string
  worstCase: string
  spaceComplexity: string
  explanation: string
  pseudocode: string[]
}

export const algorithmInfo: Record<string, AlgorithmInfo> = {
  bubble: {
    name: 'Bubble Sort',
    description: 'Compara elementos adjacentes e os troca se estiverem na ordem errada. O processo se repete até que nenhuma troca seja necessária.',
    dataStructure: 'Array linear - os elementos são acessados sequencialmente, comparando pares adjacentes.',
    bestCase: 'O(n)',
    averageCase: 'O(n²)',
    worstCase: 'O(n²)',
    spaceComplexity: 'O(1)',
    explanation: 'No melhor caso (array já ordenado), apenas uma passagem é necessária. Nos casos médio e pior, são necessárias n-1 passagens com n-i comparações cada, resultando em O(n²). Usa apenas memória constante para trocas.',
    pseudocode: [
      'para i de 0 até n-1:',
      '  para j de 0 até n-i-1:',
      '    se array[j] > array[j+1]:',
      '      trocar(array[j], array[j+1])',
    ]
  },
  selection: {
    name: 'Selection Sort',
    description: 'Encontra o menor elemento da parte não ordenada e o coloca no início. Repete até ordenar todo o array.',
    dataStructure: 'Array linear - divide logicamente em parte ordenada (início) e não ordenada (restante).',
    bestCase: 'O(n²)',
    averageCase: 'O(n²)',
    worstCase: 'O(n²)',
    spaceComplexity: 'O(1)',
    explanation: 'Sempre faz n-1 passagens, e em cada passagem i, faz n-i comparações para encontrar o mínimo. O número total de comparações é sempre n(n-1)/2, independente da ordem inicial.',
    pseudocode: [
      'para i de 0 até n-1:',
      '  minIdx = i',
      '  para j de i+1 até n:',
      '    se array[j] < array[minIdx]:',
      '      minIdx = j',
      '  trocar(array[i], array[minIdx])',
    ]
  },
  insertion: {
    name: 'Insertion Sort',
    description: 'Constrói o array ordenado um elemento por vez, inserindo cada novo elemento na posição correta.',
    dataStructure: 'Array linear - similar a ordenar cartas na mão, elementos são deslocados para abrir espaço.',
    bestCase: 'O(n)',
    averageCase: 'O(n²)',
    worstCase: 'O(n²)',
    spaceComplexity: 'O(1)',
    explanation: 'No melhor caso (array ordenado), cada elemento já está na posição correta, fazendo apenas n-1 comparações. No pior caso (array invertido), cada elemento precisa percorrer toda a parte ordenada.',
    pseudocode: [
      'para i de 1 até n:',
      '  chave = array[i]',
      '  j = i - 1',
      '  enquanto j >= 0 e array[j] > chave:',
      '    array[j+1] = array[j]',
      '    j = j - 1',
      '  array[j+1] = chave',
    ]
  },
  merge: {
    name: 'Merge Sort',
    description: 'Divide o array pela metade recursivamente até ter elementos únicos, depois mescla as partes ordenadamente.',
    dataStructure: 'Arrays auxiliares - usa espaço extra proporcional a n para mesclar as sub-partes ordenadas.',
    bestCase: 'O(n log n)',
    averageCase: 'O(n log n)',
    worstCase: 'O(n log n)',
    spaceComplexity: 'O(n)',
    explanation: 'A divisão cria log(n) níveis de recursão. Em cada nível, todas as n posições são processadas durante o merge. Portanto, sempre O(n log n), independente da ordem inicial. Requer O(n) espaço auxiliar.',
    pseudocode: [
      'mergeSort(array, inicio, fim):',
      '  se inicio < fim:',
      '    meio = (inicio + fim) / 2',
      '    mergeSort(array, inicio, meio)',
      '    mergeSort(array, meio+1, fim)',
      '    merge(array, inicio, meio, fim)',
    ]
  },
  quick: {
    name: 'Quick Sort',
    description: 'Escolhe um pivô, particiona o array em elementos menores e maiores que o pivô, e ordena recursivamente.',
    dataStructure: 'Array in-place - usa particionamento para reorganizar elementos em torno do pivô sem arrays auxiliares.',
    bestCase: 'O(n log n)',
    averageCase: 'O(n log n)',
    worstCase: 'O(n²)',
    spaceComplexity: 'O(log n)',
    explanation: 'No melhor/médio caso, o pivô divide o array em partes equilibradas, gerando log(n) níveis. No pior caso (pivô sempre mínimo/máximo), gera n níveis. O espaço é para a pilha de recursão.',
    pseudocode: [
      'quickSort(array, inicio, fim):',
      '  se inicio < fim:',
      '    pivotIdx = particionar(array, inicio, fim)',
      '    quickSort(array, inicio, pivotIdx-1)',
      '    quickSort(array, pivotIdx+1, fim)',
    ]
  },
  heap: {
    name: 'Heap Sort',
    description: 'Constrói um heap máximo e extrai repetidamente o maior elemento para ordenar o array.',
    dataStructure: 'Heap binário (árvore) - array é tratado como árvore binária completa onde pai > filhos.',
    bestCase: 'O(n log n)',
    averageCase: 'O(n log n)',
    worstCase: 'O(n log n)',
    spaceComplexity: 'O(1)',
    explanation: 'A construção do heap inicial custa O(n). Depois, n-1 extrações são feitas, cada uma com custo O(log n) para restaurar a propriedade do heap. Total: O(n log n) em todos os casos.',
    pseudocode: [
      'buildMaxHeap(array)',
      'para i de n-1 até 1:',
      '  trocar(array[0], array[i])',
      '  heapify(array, 0, i)',
    ]
  }
}

// Bubble Sort Generator
export function* bubbleSort(arr: number[]): Generator<SortStep> {
  const array = [...arr]
  const n = array.length
  const sorted: number[] = []

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield {
        array: [...array],
        comparing: [j, j + 1],
        swapping: [],
        sorted: [...sorted],
        message: `Comparando índices ${j} e ${j + 1}: ${array[j]} ${array[j] > array[j + 1] ? '>' : '≤'} ${array[j + 1]}`,
        currentLine: 2
      }

      if (array[j] > array[j + 1]) {
        yield {
          array: [...array],
          comparing: [],
          swapping: [j, j + 1],
          sorted: [...sorted],
          message: `Trocando ${array[j]} com ${array[j + 1]}`,
          currentLine: 3
        }
        ;[array[j], array[j + 1]] = [array[j + 1], array[j]]
      }
    }
    sorted.unshift(n - 1 - i)
  }
  sorted.unshift(0)

  yield {
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    message: 'Ordenação concluída!',
    currentLine: -1
  }
}

// Selection Sort Generator
export function* selectionSort(arr: number[]): Generator<SortStep> {
  const array = [...arr]
  const n = array.length
  const sorted: number[] = []

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i
    yield {
      array: [...array],
      comparing: [minIdx],
      swapping: [],
      sorted: [...sorted],
      message: `Iniciando busca do mínimo a partir do índice ${i}`,
      currentLine: 1
    }

    for (let j = i + 1; j < n; j++) {
      yield {
        array: [...array],
        comparing: [minIdx, j],
        swapping: [],
        sorted: [...sorted],
        message: `Comparando ${array[j]} com mínimo atual ${array[minIdx]}`,
        currentLine: 3
      }

      if (array[j] < array[minIdx]) {
        minIdx = j
        yield {
          array: [...array],
          comparing: [minIdx],
          swapping: [],
          sorted: [...sorted],
          message: `Novo mínimo encontrado: ${array[minIdx]} no índice ${minIdx}`,
          currentLine: 4
        }
      }
    }

    if (minIdx !== i) {
      yield {
        array: [...array],
        comparing: [],
        swapping: [i, minIdx],
        sorted: [...sorted],
        message: `Trocando ${array[i]} com ${array[minIdx]}`,
        currentLine: 5
      }
      ;[array[i], array[minIdx]] = [array[minIdx], array[i]]
    }
    sorted.push(i)
  }
  sorted.push(n - 1)

  yield {
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    message: 'Ordenação concluída!',
    currentLine: -1
  }
}

// Insertion Sort Generator
export function* insertionSort(arr: number[]): Generator<SortStep> {
  const array = [...arr]
  const n = array.length
  const sorted: number[] = [0]

  for (let i = 1; i < n; i++) {
    const key = array[i]
    let j = i - 1

    yield {
      array: [...array],
      comparing: [i],
      swapping: [],
      sorted: [...sorted],
      message: `Inserindo elemento ${key} (índice ${i}) na posição correta`,
      currentLine: 1
    }

    while (j >= 0 && array[j] > key) {
      yield {
        array: [...array],
        comparing: [j, j + 1],
        swapping: [],
        sorted: [...sorted],
        message: `${array[j]} > ${key}, deslocando ${array[j]} para direita`,
        currentLine: 3
      }

      array[j + 1] = array[j]
      
      yield {
        array: [...array],
        comparing: [],
        swapping: [j, j + 1],
        sorted: [...sorted],
        message: `Deslocando elemento para índice ${j + 1}`,
        currentLine: 4
      }
      j--
    }

    array[j + 1] = key
    sorted.push(i)
    
    yield {
      array: [...array],
      comparing: [],
      swapping: [j + 1],
      sorted: [...sorted],
      message: `Inserindo ${key} na posição ${j + 1}`,
      currentLine: 6
    }
  }

  yield {
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    message: 'Ordenação concluída!',
    currentLine: -1
  }
}

// Merge Sort Generator
export function* mergeSort(arr: number[]): Generator<SortStep> {
  const array = [...arr]
  const n = array.length
  const sorted: number[] = []

  function* mergeSortHelper(start: number, end: number): Generator<SortStep> {
    if (start >= end) return

    const mid = Math.floor((start + end) / 2)

    yield {
      array: [...array],
      comparing: Array.from({ length: end - start + 1 }, (_, i) => start + i),
      swapping: [],
      sorted: [...sorted],
      message: `Dividindo array de ${start} a ${end}, meio = ${mid}`,
      currentLine: 2
    }

    yield* mergeSortHelper(start, mid)
    yield* mergeSortHelper(mid + 1, end)

    // Merge
    const left = array.slice(start, mid + 1)
    const right = array.slice(mid + 1, end + 1)
    let i = 0, j = 0, k = start

    yield {
      array: [...array],
      comparing: Array.from({ length: end - start + 1 }, (_, idx) => start + idx),
      swapping: [],
      sorted: [...sorted],
      message: `Mesclando subarrays [${left.join(', ')}] e [${right.join(', ')}]`,
      currentLine: 5
    }

    while (i < left.length && j < right.length) {
      yield {
        array: [...array],
        comparing: [start + i, mid + 1 + j],
        swapping: [],
        sorted: [...sorted],
        message: `Comparando ${left[i]} e ${right[j]}`,
        currentLine: 5
      }

      if (left[i] <= right[j]) {
        array[k] = left[i]
        i++
      } else {
        array[k] = right[j]
        j++
      }

      yield {
        array: [...array],
        comparing: [],
        swapping: [k],
        sorted: [...sorted],
        message: `Posicionando ${array[k]} no índice ${k}`,
        currentLine: 5
      }
      k++
    }

    while (i < left.length) {
      array[k] = left[i]
      yield {
        array: [...array],
        comparing: [],
        swapping: [k],
        sorted: [...sorted],
        message: `Copiando ${left[i]} restante para índice ${k}`,
        currentLine: 5
      }
      i++
      k++
    }

    while (j < right.length) {
      array[k] = right[j]
      yield {
        array: [...array],
        comparing: [],
        swapping: [k],
        sorted: [...sorted],
        message: `Copiando ${right[j]} restante para índice ${k}`,
        currentLine: 5
      }
      j++
      k++
    }
  }

  yield* mergeSortHelper(0, n - 1)

  yield {
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    message: 'Ordenação concluída!',
    currentLine: -1
  }
}

// Quick Sort Generator
export function* quickSort(arr: number[]): Generator<SortStep> {
  const array = [...arr]
  const n = array.length
  const sorted: number[] = []

  function* quickSortHelper(low: number, high: number): Generator<SortStep> {
    if (low >= high) {
      if (low === high) sorted.push(low)
      return
    }

    const pivotValue = array[high]
    yield {
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: [...sorted],
      pivot: high,
      message: `Selecionando pivô: ${pivotValue} (índice ${high})`,
      currentLine: 2
    }

    let i = low - 1

    for (let j = low; j < high; j++) {
      yield {
        array: [...array],
        comparing: [j],
        swapping: [],
        sorted: [...sorted],
        pivot: high,
        message: `Comparando ${array[j]} com pivô ${pivotValue}`,
        currentLine: 2
      }

      if (array[j] < pivotValue) {
        i++
        if (i !== j) {
          yield {
            array: [...array],
            comparing: [],
            swapping: [i, j],
            sorted: [...sorted],
            pivot: high,
            message: `${array[j]} < ${pivotValue}, trocando índices ${i} e ${j}`,
            currentLine: 2
          }
          ;[array[i], array[j]] = [array[j], array[i]]
        }
      }
    }

    const pivotIdx = i + 1
    if (pivotIdx !== high) {
      yield {
        array: [...array],
        comparing: [],
        swapping: [pivotIdx, high],
        sorted: [...sorted],
        pivot: high,
        message: `Posicionando pivô na posição final ${pivotIdx}`,
        currentLine: 2
      }
      ;[array[pivotIdx], array[high]] = [array[high], array[pivotIdx]]
    }

    sorted.push(pivotIdx)

    yield {
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: [...sorted],
      message: `Pivô ${pivotValue} está na posição correta ${pivotIdx}`,
      currentLine: 3
    }

    yield* quickSortHelper(low, pivotIdx - 1)
    yield* quickSortHelper(pivotIdx + 1, high)
  }

  yield* quickSortHelper(0, n - 1)

  yield {
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    message: 'Ordenação concluída!',
    currentLine: -1
  }
}

// Heap Sort Generator
export function* heapSort(arr: number[]): Generator<SortStep> {
  const array = [...arr]
  const n = array.length
  const sorted: number[] = []

  function* heapify(size: number, root: number): Generator<SortStep> {
    let largest = root
    const left = 2 * root + 1
    const right = 2 * root + 2

    if (left < size) {
      yield {
        array: [...array],
        comparing: [largest, left],
        swapping: [],
        sorted: [...sorted],
        message: `Heapify: comparando raiz ${array[largest]} com filho esquerdo ${array[left]}`,
        currentLine: 3
      }
      if (array[left] > array[largest]) {
        largest = left
      }
    }

    if (right < size) {
      yield {
        array: [...array],
        comparing: [largest, right],
        swapping: [],
        sorted: [...sorted],
        message: `Heapify: comparando ${array[largest]} com filho direito ${array[right]}`,
        currentLine: 3
      }
      if (array[right] > array[largest]) {
        largest = right
      }
    }

    if (largest !== root) {
      yield {
        array: [...array],
        comparing: [],
        swapping: [root, largest],
        sorted: [...sorted],
        message: `Trocando ${array[root]} com ${array[largest]} para manter propriedade do heap`,
        currentLine: 3
      }
      ;[array[root], array[largest]] = [array[largest], array[root]]
      yield* heapify(size, largest)
    }
  }

  // Build max heap
  yield {
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [],
    message: 'Construindo heap máximo...',
    currentLine: 0
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(n, i)
  }

  yield {
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [],
    message: 'Heap máximo construído! Iniciando extração...',
    currentLine: 1
  }

  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    yield {
      array: [...array],
      comparing: [],
      swapping: [0, i],
      sorted: [...sorted],
      message: `Extraindo máximo ${array[0]} para posição ${i}`,
      currentLine: 2
    }
    ;[array[0], array[i]] = [array[i], array[0]]
    sorted.unshift(i)

    yield* heapify(i, 0)
  }
  sorted.unshift(0)

  yield {
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    message: 'Ordenação concluída!',
    currentLine: -1
  }
}

export const sortingAlgorithms = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  merge: mergeSort,
  quick: quickSort,
  heap: heapSort
}

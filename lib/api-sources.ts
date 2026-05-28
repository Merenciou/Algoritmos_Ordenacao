export interface ApiSource {
  id: string
  name: string
  description: string
  endpoint: string
  fields: { key: string; label: string }[]
  transform: (data: unknown) => { value: number; label: string }[]
}

export const apiSources: ApiSource[] = [
  {
    id: 'pokemon',
    name: 'PokéAPI',
    description: 'Pokémons ordenados por experiência base, peso ou altura',
    endpoint: 'https://pokeapi.co/api/v2/pokemon?limit=100',
    fields: [
      { key: 'base_experience', label: 'Experiência Base' },
      { key: 'weight', label: 'Peso' },
      { key: 'height', label: 'Altura' }
    ],
    transform: (data: unknown) => {
      const results = (data as { results: { name: string; url: string }[] }).results
      return results.map((p, i) => ({ value: i + 1, label: p.name }))
    }
  },
  {
    id: 'countries',
    name: 'REST Countries',
    description: 'Países ordenados por população ou área',
    endpoint: 'https://restcountries.com/v3.1/all?fields=name,population,area',
    fields: [
      { key: 'population', label: 'População' },
      { key: 'area', label: 'Área (km²)' }
    ],
    transform: (data: unknown) => {
      const countries = data as { name: { common: string }; population: number; area: number }[]
      return countries.slice(0, 100).map(c => ({
        value: c.population,
        label: c.name.common
      }))
    }
  },
  {
    id: 'rickmorty',
    name: 'Rick and Morty',
    description: 'Personagens ordenados por número de episódios',
    endpoint: 'https://rickandmortyapi.com/api/character',
    fields: [
      { key: 'episode_count', label: 'Nº de Episódios' }
    ],
    transform: (data: unknown) => {
      const results = (data as { results: { name: string; episode: string[] }[] }).results
      return results.map(c => ({
        value: c.episode.length,
        label: c.name
      }))
    }
  },
  {
    id: 'spacex',
    name: 'SpaceX API',
    description: 'Lançamentos ordenados por número de voo',
    endpoint: 'https://api.spacexdata.com/v4/launches',
    fields: [
      { key: 'flight_number', label: 'Número do Voo' }
    ],
    transform: (data: unknown) => {
      const launches = data as { name: string; flight_number: number }[]
      return launches.slice(0, 50).map(l => ({
        value: l.flight_number,
        label: l.name
      }))
    }
  },
  {
    id: 'crypto',
    name: 'CoinGecko',
    description: 'Criptomoedas ordenadas por ranking de mercado',
    endpoint: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1',
    fields: [
      { key: 'market_cap_rank', label: 'Ranking' },
      { key: 'current_price', label: 'Preço (USD)' }
    ],
    transform: (data: unknown) => {
      const coins = data as { name: string; market_cap_rank: number }[]
      return coins.map(c => ({
        value: c.market_cap_rank,
        label: c.name
      }))
    }
  }
]

export async function fetchApiData(sourceId: string, field: string, limit: number): Promise<{ value: number; label: string }[]> {
  const source = apiSources.find(s => s.id === sourceId)
  if (!source) throw new Error('Fonte de dados não encontrada')

  try {
    const response = await fetch(source.endpoint)
    if (!response.ok) throw new Error('Erro ao buscar dados')
    
    const data = await response.json()
    let items: { value: number; label: string }[] = []

    switch (sourceId) {
      case 'pokemon': {
        const results = data.results as { name: string; url: string }[]
        const pokemonDetails = await Promise.all(
          results.slice(0, limit).map(async (p) => {
            const res = await fetch(p.url)
            return res.json()
          })
        )
        items = pokemonDetails.map((p: { name: string; base_experience: number; weight: number; height: number }) => ({
          value: p[field as keyof typeof p] as number,
          label: p.name
        }))
        break
      }
      case 'countries': {
        const countries = data as { name: { common: string }; population: number; area: number }[]
        items = countries
          .filter(c => c[field as keyof typeof c] != null)
          .slice(0, limit)
          .map(c => ({
            value: c[field as keyof typeof c] as number,
            label: c.name.common
          }))
        break
      }
      case 'rickmorty': {
        const results = data.results as { name: string; episode: string[] }[]
        items = results.slice(0, limit).map(c => ({
          value: c.episode.length,
          label: c.name
        }))
        break
      }
      case 'spacex': {
        const launches = data as { name: string; flight_number: number }[]
        items = launches.slice(0, limit).map(l => ({
          value: l.flight_number,
          label: l.name
        }))
        break
      }
      case 'crypto': {
        const coins = data as { name: string; market_cap_rank: number; current_price: number }[]
        items = coins.slice(0, limit).map(c => ({
          value: field === 'current_price' ? Math.round(c.current_price) : c.market_cap_rank,
          label: c.name
        }))
        break
      }
    }

    return items
  } catch (error) {
    console.error('Erro ao buscar dados da API:', error)
    // Fallback: gerar dados aleatórios
    return generateRandomData(limit)
  }
}

export function generateRandomData(count: number): { value: number; label: string }[] {
  return Array.from({ length: count }, (_, i) => ({
    value: Math.floor(Math.random() * 100) + 1,
    label: `Item ${i + 1}`
  }))
}

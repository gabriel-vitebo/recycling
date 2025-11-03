export function useApi() {
  const config = useRuntimeConfig()

  const apiBase: string | undefined =
    typeof config?.public?.apiBase === 'string' ? config.public.apiBase : undefined

  async function get(endpoint: string) {
    return await $fetch(endpoint)
  }

  async function post(endpoint: string, data: any) {
    return await $fetch(endpoint, {
      method: 'POST',
      body: data,
      baseURL: apiBase
    })
  }

  // ✅ Função para buscar os itens
  async function fetchItems() {
    try {
      const response: any = await get('/items')
      return response?.serializedItems ?? response?.items ?? response ?? []
    } catch (error) {
      console.error('Erro ao buscar itens:', error)
      throw error
    }
  }

  // ✅ Função para criar um ponto de coleta
  async function createPoint(data: FormData) {
    try {
      await post('/points', data)
      return { success: true }
    } catch (error: any) {
      if (error?.data) {
        console.error('Erro ao criar ponto de coleta:', error.data)
        throw new Error(error.data.message || 'Erro desconhecido ao criar ponto de coleta')
      } else {
        console.error('Erro inesperado:', error)
        throw new Error('Erro inesperado ao criar ponto de coleta')
      }
    }
  }

  async function fetchPoints(params: { city: string; uf: string; items: string }) {
    try {
      const response: any = await get('/points', { params })
      return response?.recyclingPoint ?? []
    } catch (error) {
      console.error('Erro ao buscar pontos de coleta:', error)
      throw error
    }
  }

  async function fetchPointDetails(id: string) {
    try {
      const response: any = await get(`/points/${id}`)
      return response
    } catch (error) {
      console.error('Erro ao buscar detalhes do ponto de coleta:', error)
      throw error
    }
  }

  return { get, post, fetchItems, createPoint, fetchPoints, fetchPointDetails }
}

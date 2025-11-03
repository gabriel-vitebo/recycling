export function useApi() {
  const config = useRuntimeConfig()

  const get = async (endpoint: string, options?: any) => {
    return await $fetch(endpoint, {
      baseURL: config.public.apiBase,
      ...options
    })
  }

  return { get }
}

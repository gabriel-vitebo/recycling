// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon'],
  css: ["leaflet/dist/leaflet.css"],
  runtimeConfig: {
    public: {
      apiBaseUrl: 'https://localhost:3333'
    }
  },
  alias: {
    '@services': '/home/gabriel/Documentos/projetos/recycling/services',
  },
})
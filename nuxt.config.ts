// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon', 'nuxt-maplibre'],
  css: ["leaflet/dist/leaflet.css"],
  runtimeConfig: {
    public: {
      apiBaseUrl: 'https://localhost:3333',
      maptilerKey: `pegar-no-site`,
    }
  },
   maplibre: {
    // chave gratuita da MapTiler (registre em maptiler.com)
    apiKey: process.env.NUXT_PUBLIC_MAPTILER_KEY, 
    style: `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NUXT_PUBLIC_MAPTILER_KEY}`
  },
})
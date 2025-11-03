import { defineNuxtPlugin } from 'nuxt/app'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      maplibre: maplibregl
    }
  }
})

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const emit = defineEmits<{
  (e: 'update:coords', coords: { lat: number; lng: number }): void
}>()

const props = defineProps<{
  initialPosition?: [number, number]
}>()

const mapContainer = ref<HTMLElement | null>(null)
const map = ref<maplibregl.Map | null>(null)
const marker = ref<maplibregl.Marker | null>(null)
const loading = ref(true)

// 📍 Fallback para São José dos Campos - SP
const DEFAULT_CENTER: [number, number] = [-45.8872, -23.2237] // [lng, lat]

// 🗺️ Centro inicial reativo
const center = ref<[number, number]>(props.initialPosition || DEFAULT_CENTER)

const MAPTILER_KEY = '7A0JwWlh8S2cRYqlDgpb'

onMounted(() => {
  nextTick(() => {
    // tenta pegar a geolocalização do usuário
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        center.value = [pos.coords.longitude, pos.coords.latitude]
        initMap()
      },
      () => {
        // se o usuário negar ou houver erro, usa São José dos Campos
        center.value = DEFAULT_CENTER
        initMap()
      },
      {
        timeout: 8000,
      }
    )
  })
})

function initMap() {
  if (!mapContainer.value) return

  map.value = new maplibregl.Map({
    container: mapContainer.value,
    style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`,
    center: center.value,
    zoom: 13,
  })

  map.value.addControl(new maplibregl.NavigationControl(), 'top-right')

  // adiciona marcador na posição inicial
  marker.value = new maplibregl.Marker({ color: '#22c55e' })
    .setLngLat(center.value)
    .addTo(map.value)

  // emite coordenadas iniciais para o pai
  emit('update:coords', { lat: center.value[1], lng: center.value[0] })

  // atualiza marcador ao clicar no mapa
  map.value.on('click', (e) => {
    const { lng, lat } = e.lngLat
    if (marker.value) marker.value.remove()
    marker.value = new maplibregl.Marker({ color: '#22c55e' })
      .setLngLat([lng, lat])
      .addTo(map.value!)
    emit('update:coords', { lat, lng })
  })

  loading.value = false
}
</script>

<template>
  <div class="relative w-full h-96 rounded-lg overflow-hidden">
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-gray-100">
      <p class="text-gray-600 font-medium">Carregando mapa...</p>
    </div>
    <div ref="mapContainer" class="w-full h-full"></div>
  </div>
</template>

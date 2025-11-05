<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import useLocation from '../../composable/use-location'

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

// composable de localização — pode fornecer posição salva no localStorage
const { latitude, longitude, requestLocation } = useLocation()

const MAPTILER_KEY = '7A0JwWlh8S2cRYqlDgpb'

onMounted(() => {
  nextTick(async () => {
    // se já existir latitude/longitude salvas, usa elas
    if (latitude.value !== null && longitude.value !== null) {
      center.value = [longitude.value, latitude.value]
      initMap()
      return
    }

    // caso não exista, tenta pedir permissão e obter a posição
    const loc = await requestLocation({ timeout: 8000 })
    if (loc) {
      center.value = [loc.lng, loc.lat]
    } else {
      // fallback
      center.value = DEFAULT_CENTER
    }
    initMap()
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

  map.value.addControl(new (maplibregl as any).NavigationControl(), 'top-right')

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

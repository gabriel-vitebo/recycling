<script setup>
// filepath: /home/gabriel/Documentos/projetos/recycling/app/pages/points/view/index.vue

import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import loadingLogo from '../../../public/assets/loading-logo.svg'
import logo from '../../../public/assets/logo.svg'
import { useApi } from '~/composable/use-api'
import MapLibrePicker from '../../../components/map-libre-picker/index.vue'
import useLocation from '../../../composable/use-location'


const { fetchItems } = useApi()

const items = ref([])
const points = ref([])
const selectedItems = ref([])
const initialPosition = ref([0, 0])
const isLoading = ref(true)

const route = useRoute()

onMounted(async () => {
  // Fetch items
  items.value = await fetchItems()

  // Get user location — prefer saved value, senão pede permissão e salva via composable
  const { latitude, longitude, requestLocation } = useLocation()

  if (latitude.value !== null && longitude.value !== null) {
    // composable já carregou do localStorage
    initialPosition.value = [latitude.value, longitude.value]
    isLoading.value = false
  } else {
    // pede permissão e salva internamente no composable
    try {
      const loc = await requestLocation({ timeout: 8000 })
      if (loc) {
        initialPosition.value = [loc.lat, loc.lng]
      } else {
        initialPosition.value = [-23.1799079, -45.8253392]
      }
    } catch (err) {
      initialPosition.value = [-23.1799079, -45.8253392]
      console.error('Erro ao obter localização:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Fetch points based on query params
  const params = route.query
  try {
    points.value = await fetchPoints({
      city: params.city,
      uf: params.uf,
      items: selectedItems.value.join(','),
    })
  } catch (error) {
    console.error(error)
  }
})

watch(selectedItems, async () => {
  const params = route.query
  try {
    points.value = await fetchPoints({
      city: params.city,
      uf: params.uf,
      items: selectedItems.value.join(','),
    })
  } catch (error) {
    console.error(error)
  }
})

function handleSelectItem(title) {
  const alreadySelected = selectedItems.value.includes(title)
  if (alreadySelected) {
    selectedItems.value = selectedItems.value.filter((item) => item !== title)
  } else {
    selectedItems.value.push(title)
  }
}
</script>

<template>
  <div id="page-view-points" class="max-w-5xl mx-auto">
    <header class="mt-12 flex justify-between items-center">
      <img :src="logo" alt="Recycling Logo" />
      <nuxt-link to="/" class="text-primary font-bold flex items-center">
        <i class="fi fi-arrow-left mr-2"></i> Voltar para home
      </nuxt-link>
    </header>

    <div v-if="isLoading" class="flex flex-col items-center justify-center h-screen">
      <img :src="loadingLogo" alt="Carregando" />
      <span class="mt-4 text-lg">Carregando app...</span>
    </div>

    <form v-else class="bg-white p-8 rounded-lg shadow-md mt-8">
      <h1 class="text-3xl font-bold mb-8">Bem-Vindo</h1>
      <p class="text-lg text-gray-600">Encontre no mapa um ponto de coleta.</p>

      <fieldset class="mt-8">
        <MapLibrePicker :initialPosition="initialPosition" />
      </fieldset>

      <fieldset class="mt-8">
        <ul class="grid grid-cols-3 gap-4">
          <li
            v-for="item in items"
            :key="item.id"
            @click="handleSelectItem(item.title)"
            :class="{ 'border-green-500 bg-green-100': selectedItems.includes(item.title) }"
            class="p-4 border rounded cursor-pointer"
          >
            <img :src="item.image_url" :alt="item.title" class="w-full h-24 object-cover" />
            <span class="block mt-2 text-center">{{ item.title }}</span>
          </li>
        </ul>
      </fieldset>
    </form>
  </div>
</template>
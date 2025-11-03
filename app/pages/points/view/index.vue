<script setup>
// filepath: /home/gabriel/Documentos/projetos/recycling/app/pages/points/view/index.vue

import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import loadingLogo from '../../../public/assets/loading-logo.svg'
import logo from '../../../public/assets/logo.svg'
import { LMap, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import { useApi } from '~/composable/use-api'


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

  // Get user location
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords
      initialPosition.value = [latitude, longitude]
      isLoading.value = false
    },
    () => {
      initialPosition.value = [-23.1799079, -45.8253392]
      isLoading.value = false
    }
  )

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
        <LMap
          :zoom="15"
          :center="initialPosition"
          class="w-full h-96 rounded mb-4"
        >
          <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LMarker
            v-for="point in points"
            :key="point.id"
            :lat-lng="[point.latitude, point.longitude]"
          >
            <LPopup>
              <div class="flex flex-col items-center">
                <img
                  :src="point.image"
                  :alt="point.name"
                  class="w-24 h-24 object-cover rounded"
                />
                <h2 class="text-sm font-bold mt-2">{{ point.name }}</h2>
              </div>
            </LPopup>
          </LMarker>
        </LMap>
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
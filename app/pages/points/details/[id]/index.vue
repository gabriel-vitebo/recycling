<script setup>
// filepath: /home/gabriel/Documentos/projetos/recycling/app/pages/details/index.vue

import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import logo from '../../../public/assets/logo.svg'
import { fetchPointDetails } from '../../../../composable/use-api'

const data = ref({
  recyclingPoint: {
    image: '',
    name: '',
    email: '',
    whatsapp: '',
    city: '',
    uf: '',
  },
  items: [],
})

const isLoading = ref(true)
const route = useRoute()
const id = route.query.id // Obtém o ID da query string

onMounted(async () => {
  if (!id) {
    console.error('ID do ponto de coleta não fornecido na query string.')
    return
  }

  try {
    const response = await fetchPointDetails(id)
    data.value = response.data
    isLoading.value = false
  } catch (error) {
    console.error('Erro ao carregar os detalhes:', error)
    isLoading.value = false
  }
})

function handleSendEmail(recipient, subject) {
  window.open(`mailto:${recipient}?subject=${encodeURIComponent(subject)}`, '_blank')
}

function handleWhatsapp() {
  window.open(`https://wa.me/${data.value.recyclingPoint.whatsapp}`, '_blank')
}
</script>

<template>
  <div id="page-details" class="min-h-screen flex flex-col items-center">
    <header class="w-full max-w-5xl mt-12 flex justify-between items-center">
      <img :src="logo" alt="Recycling Logo" />
      <nuxt-link to="/" class="text-primary font-bold flex items-center">
        <i class="fi fi-arrow-left mr-2"></i> Voltar para home
      </nuxt-link>
    </header>

    <div v-if="isLoading" class="flex flex-col items-center justify-center h-screen">
      <span class="text-lg">Carregando...</span>
    </div>

    <div v-else class="w-full max-w-5xl p-4">
      <main class="flex flex-col items-center">
        <img
          :src="data.recyclingPoint.image"
          :alt="`Imagem do ponto de coleta ${data.recyclingPoint.name}`"
          class="w-full h-72 object-cover rounded-lg"
        />
        <h1 class="text-3xl font-bold mt-6">{{ data.recyclingPoint.name }}</h1>

        <ul class="grid grid-cols-3 gap-4 mt-6">
          <li
            v-for="item in data.items"
            :key="item.title"
            class="flex flex-col items-center bg-gray-100 border border-gray-200 rounded-lg p-4"
          >
            <img :src="item.image_url" :alt="`Imagem do item ${item.title}`" class="w-16 h-16" />
            <span class="mt-2 text-sm font-medium">{{ item.title }}</span>
          </li>
        </ul>

        <div class="mt-8 text-left w-full">
          <h2 class="text-lg font-semibold">Endereço</h2>
          <p class="text-sm text-gray-600">{{ data.recyclingPoint.city }}, {{ data.recyclingPoint.uf }}</p>
        </div>

        <div class="flex gap-4 mt-8">
          <button
            @click="handleWhatsapp"
            class="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            <i class="fi fi-whatsapp mr-2"></i>
            <strong>Whatsapp</strong>
          </button>
          <button
            @click="handleSendEmail(data.recyclingPoint.email, `Interesse na coleta no ponto ${data.recyclingPoint.name}`)"
            class="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            <i class="fi fi-email mr-2"></i>
            <strong>Email</strong>
          </button>
        </div>
      </main>
    </div>
  </div>
</template>
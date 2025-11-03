<script setup>
// filepath: /home/gabriel/Documentos/projetos/recycling/app/pages/points/find/index.vue

import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import logo from '../../../public/assets/logo.svg'
import { useApi } from '~/composable/use-api'
const { get } = useApi()

const ufs = ref([])
const cities = ref([])
const selectedUf = ref('0')
const selectedCity = ref('0')
const error = ref(null)

const router = useRouter()

onMounted(async () => {
  const ufsResponse = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
  const ufsData = await ufsResponse.json()
  ufs.value = ufsData.map(uf => uf.sigla)
})

watch(selectedUf, (newUf) => {
  if (newUf === '0') {
    cities.value = []
    return
  }
  axios
    .get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${newUf}/municipios`)
    .then((response) => {
      cities.value = response.data.map((city) => city.nome)
    })
})

function createUrl() {
  const params = new URLSearchParams({
    city: selectedCity.value,
    uf: selectedUf.value,
  })
  return `/view-points?${params.toString()}`
}

function handleSearchClick(event) {
  if (selectedUf.value === '0' || selectedCity.value === '0') {
    event.preventDefault()
    error.value = 'Por favor, selecione um estado e uma cidade.'
  } else {
    error.value = null
    router.push(createUrl())
  }
}
</script>

<template>
  <div id="page-find-point" class="min-h-screen flex flex-col items-center">
    <header class="w-full max-w-5xl mt-12 flex justify-between items-center">
      <img :src="logo" alt="Recycling Logo" />
      <nuxt-link to="/" class="text-primary font-bold flex items-center">
        <i class="fi fi-arrow-left mr-2"></i> Voltar para home
      </nuxt-link>
    </header>

    <main class="flex flex-col items-center mt-12">
      <h1 class="text-4xl font-bold text-center">O melhor lugar para encontrar coleta de resíduos.</h1>
      <p class="text-lg text-gray-600 mt-4 text-center">
        Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
      </p>

      <form class="flex flex-col gap-4 mt-8 w-full max-w-md">
        <div class="field">
          <label for="uf" class="block text-sm font-medium">Estado (UF)</label>
          <select
            id="uf"
            v-model="selectedUf"
            class="w-full p-3 border rounded"
          >
            <option value="0">Selecione uma UF</option>
            <option v-for="uf in ufs" :key="uf" :value="uf">{{ uf }}</option>
          </select>
        </div>

        <div class="field">
          <label for="city" class="block text-sm font-medium">Cidade</label>
          <select
            id="city"
            v-model="selectedCity"
            class="w-full p-3 border rounded"
          >
            <option value="0">Selecione uma cidade</option>
            <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
          </select>
        </div>
      </form>

      <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>

      <nuxt-link
        :to="createUrl()"
        @click="handleSearchClick"
        class="flex items-center bg-primary text-white px-6 py-3 rounded-lg mt-6 hover:bg-green-600"
      >
        <i class="fi fi-search mr-2"></i>
        <strong>Procurar Ponto de Coleta</strong>
      </nuxt-link>
    </main>
  </div>
</template>
<script setup>
// filepath: /home/gabriel/Documentos/projetos/recycling/app/pages/create-point/index.vue

import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
// import { useLeaflet } from '@vue-leaflet/vue-leaflet'
import axios from 'axios'
// import { api } from '~/services/api'
import logo from '../../../public/assets/logo.svg'
import loadingLogo from '../../../public/assets/loading-logo.svg'
import successImage from '../../../public/assets/success.svg'

const items = ref([])
const ufs = ref([])
const cities = ref([])
const selectedPosition = ref([0, 0])
const initialPosition = ref([0, 0])
const isLoading = ref(true)
const showSuccessModal = ref(false)

const inputData = reactive({
  name: '',
  email: '',
  whatsapp: '',
})

const selectedUf = ref('0')
const selectedCity = ref('0')
const selectedItems = ref([])
const selectedFile = ref(null)

const router = useRouter()

onMounted(() => {
  // api.get('items').then((response) => {
    // items.value = response.data.serializedItems
  // })

  axios
    .get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
    .then((response) => {
      ufs.value = response.data.map((uf) => uf.sigla)
    })

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
})

watch(selectedUf, (newUf) => {
  if (newUf === '0') return
  axios
    .get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${newUf}/municipios`)
    .then((response) => {
      cities.value = response.data.map((city) => city.nome)
    })
})

function handleSelectUf(event) {
  selectedUf.value = event.target.value
}

function handleSelectCity(event) {
  selectedCity.value = event.target.value
}

function handleInputChange(event) {
  const { name, value } = event.target
  inputData[name] = value
}

function handleSelectItem(id) {
  const alreadySelected = selectedItems.value.includes(id)
  if (alreadySelected) {
    selectedItems.value = selectedItems.value.filter((item) => item !== id)
  } else {
    selectedItems.value.push(id)
  }
}

function handleMapClick(event) {
  selectedPosition.value = [event.latlng.lat, event.latlng.lng]
}

async function handleSubmit(event) {
  event.preventDefault()

  const { name, email, whatsapp } = inputData
  const uf = selectedUf.value
  const city = selectedCity.value
  const [latitude, longitude] = selectedPosition.value
  const itemsIds = selectedItems.value

  if (!name || !email || !whatsapp || uf === '0' || city === '0' || latitude === 0 || longitude === 0 || items.value.length === 0) {
    alert('Por favor, preencha todos os campos obrigatórios.')
    return
  }

  const data = new FormData()
  data.append('name', name)
  data.append('email', email)
  data.append('whatsapp', whatsapp)
  data.append('uf', uf)
  data.append('city', city)
  data.append('latitude', String(latitude))
  data.append('longitude', String(longitude))
  itemsIds.forEach((item) => data.append('itemsIds[]', item))

  if (selectedFile.value) {
    data.append('image', selectedFile.value)
  }

  try {
    // await api.post('points', data)
    showSuccessModal.value = true
    setTimeout(() => {
      showSuccessModal.value = false
      router.push('/')
    }, 4000)
  } catch (error) {
    console.error('Erro ao cadastrar o ponto de coleta:', error)
    alert('Houve um erro ao cadastrar o ponto de coleta.')
  }
}
</script>

<template>
  <div id="page-create-point" class="max-w-5xl mx-auto">
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

    <form v-else @submit="handleSubmit" class="bg-white p-8 rounded-lg shadow-md mt-8">
      <h1 class="text-3xl font-bold mb-8">Cadastro do ponto de coleta</h1>

      <dropzone @file-uploaded="(file) => (selectedFile = file)" />

      <fieldset class="mt-8">
        <legend class="text-xl font-semibold mb-4">Dados</legend>
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium">Nome da Entidade</label>
          <input
            type="text"
            id="name"
            name="name"
            v-model="inputData.name"
            class="w-full p-3 border rounded"
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="email" class="block text-sm font-medium">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              v-model="inputData.email"
              class="w-full p-3 border rounded"
            />
          </div>
          <div>
            <label for="whatsapp" class="block text-sm font-medium">Whatsapp</label>
            <input
              type="text"
              id="whatsapp"
              name="whatsapp"
              v-model="inputData.whatsapp"
              class="w-full p-3 border rounded"
            />
          </div>
        </div>
      </fieldset>

      <fieldset class="mt-8">
        <legend class="text-xl font-semibold mb-4">Endereço</legend>
        <span class="block text-sm mb-4">Selecione o endereço no mapa</span>
        <l-map
          :zoom="15"
          :center="initialPosition"
          class="w-full h-96 rounded mb-4"
          @click="handleMapClick"
        >
          <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <l-marker :lat-lng="selectedPosition" />
        </l-map>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="uf" class="block text-sm font-medium">Estado (UF)</label>
            <select
              id="uf"
              v-model="selectedUf"
              class="w-full p-3 border rounded"
              @change="handleSelectUf"
            >
              <option value="0">Selecione uma UF</option>
              <option v-for="uf in ufs" :key="uf" :value="uf">{{ uf }}</option>
            </select>
          </div>
          <div>
            <label for="city" class="block text-sm font-medium">Cidade</label>
            <select
              id="city"
              v-model="selectedCity"
              class="w-full p-3 border rounded"
              @change="handleSelectCity"
            >
              <option value="0">Selecione uma cidade</option>
              <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset class="mt-8">
        <legend class="text-xl font-semibold mb-4">Itens de Coleta</legend>
        <ul class="grid grid-cols-3 gap-4">
          <li
            v-for="item in items"
            :key="item.id"
            @click="handleSelectItem(item.id)"
            :class="{ 'border-green-500 bg-green-100': selectedItems.includes(item.id) }"
            class="p-4 border rounded cursor-pointer"
          >
            <img :src="item.image_url" :alt="item.title" class="w-full h-24 object-cover" />
            <span class="block mt-2 text-center">{{ item.title }}</span>
          </li>
        </ul>
      </fieldset>

      <button
        type="submit"
        class="mt-8 bg-primary text-white font-bold py-3 px-6 rounded hover:bg-green-600"
      >
        Cadastrar Ponto de Coleta
      </button>
    </form>

    <div
      v-if="showSuccessModal"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
    >
      <div class="bg-white p-8 rounded-lg text-center">
        <img :src="successImage" alt="Sucesso" class="mx-auto mb-4" />
        <p class="text-xl font-bold">Cadastro concluído!</p>
      </div>
    </div>
  </div>
</template>

<style>
/* Adicione estilos globais ou específicos aqui, se necessário */
</style>
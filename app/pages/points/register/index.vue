<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '~/composable/use-api'
import logo from '../../../../public/assets/logo.svg'
import successImage from '../../../../public/assets/success.svg'


const { createPoint } = useApi()
const router = useRouter()

interface Item {
  id: number
  title: string
  image_url: string
}

const items = ref<Item[]>([])
const ufs = ref<string[]>([])
const cities = ref<string[]>([])
const selectedPosition = ref<[number, number]>([0, 0])
const initialPosition = ref<[number, number]>([0, 0])
const isLoading = ref(true)
const showSuccessModal = ref(false)

const inputData = reactive<Record<string, string>>({
  name: '',
  email: '',
  whatsapp: '',
})

const selectedUf = ref('0')
const selectedCity = ref('0')
const selectedItems = ref<number[]>([])
const selectedFile = ref<File | null>(null)

onMounted(async () => {
  try {
    // ✅ Buscando UFs (via IBGE)
    const ufsResponse = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
    const ufsData = await ufsResponse.json()
    ufs.value = ufsData.map((uf: any) => uf.sigla)

    // ✅ Pega localização inicial
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
  } catch (error) {
    console.error('Erro ao carregar dados iniciais:', error)
    isLoading.value = false
  }
})

watch(selectedUf, async (newUf) => {
  if (newUf === '0') return
  const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${newUf}/municipios`)
  const data = await response.json()
  cities.value = data.map((city: any) => city.nome)
})

function handleSelectUf(event: Event) {
  selectedUf.value = (event.target as HTMLSelectElement).value
}

function handleSelectCity(event: Event) {
  selectedCity.value = (event.target as HTMLSelectElement).value
}

function handleInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  inputData[target.name] = target.value
}

// typed handler for the Dropzone component event
function onFileUploaded(file: File) {
  selectedFile.value = file
}

function handleSelectItem(id: number) {
  const alreadySelected = selectedItems.value.includes(id)
  selectedItems.value = alreadySelected
    ? selectedItems.value.filter((item) => item !== id)
    : [...selectedItems.value, id]
}

function handleMapClick(event: any) {
  selectedPosition.value = [event.latlng.lat, event.latlng.lng]
}

async function handleSubmit(event: Event) {
  event.preventDefault()

  const { name, email, whatsapp } = inputData
  const uf = selectedUf.value
  const city = selectedCity.value
  const [latitude, longitude] = selectedPosition.value
  const itemsIds = selectedItems.value

  if (!name || !email || !whatsapp || uf === '0' || city === '0' || latitude === 0 || longitude === 0 || itemsIds.length === 0) {
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
  itemsIds.forEach((item) => data.append('itemsIds[]', String(item)))

  if (selectedFile.value) data.append('image', selectedFile.value)

  try {
    await createPoint(data)
    showSuccessModal.value = true

    setTimeout(() => {
      showSuccessModal.value = false
      router.push('/')
    }, 4000)
  } catch (error: any) {
    alert('Erro ao cadastrar o ponto de coleta: ' + error.message)
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

    <!-- Mostra um indicador de carregamento enquanto está carregando -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center h-screen">
      <h1 class="text-3xl font-bold mb-8">Carregando...</h1>
    </div>

    <!-- Mostra o conteúdo principal quando o carregamento termina -->
    <div v-else>
      <h1 class="text-3xl font-bold mb-8">Cadastro do ponto de coleta</h1>

      <DropZone @file-uploaded="onFileUploaded" />

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
       <ClientOnly>
         <MapLibrePicker
           v-if="!isLoading"
          :initialPosition="initialPosition"
          @update:coords="(v) => selectedPosition = [v.lat, v.lng]"
        />
      </ClientOnly>

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
    </div>

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
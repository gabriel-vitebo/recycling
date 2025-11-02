<script setup lang="ts">
import { ref } from 'vue'

const selectedFileUrl = ref<string | null>(null)

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    selectedFileUrl.value = URL.createObjectURL(file)
    // Emite o arquivo para o pai
    // @ts-ignore
    defineProps().onFileUploaded(file)
  }
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    const file = event.dataTransfer.files[0]
    selectedFileUrl.value = URL.createObjectURL(file)
    // @ts-ignore
    defineProps().onFileUploaded(file)
  }
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
}
</script>

<template>
  <div
    class="dropzone h-72 bg-green-100 rounded-lg flex justify-center items-center mt-12 outline-none"
    @drop="handleDrop"
    @dragover="handleDragOver"
  >
    <input 
      type="file" 
      accept="image/*" 
      class="hidden" 
      @change="handleFileChange" 
      ref="fileInput"
    />

    <div v-if="selectedFileUrl" class="w-full h-full">
      <img :src="selectedFileUrl" alt="Imagem do ponto de coleta inserida pelo usuário" class="w-full h-full object-cover rounded-lg" />
    </div>
    <p
      v-else
      class="w-[calc(100%-60px)] h-[calc(100%-60px)] border-2 border-dashed border-green-400 rounded-lg flex flex-col justify-center items-center text-gray-800 cursor-pointer"
      @click="$refs.fileInput.click()"
    >
      <Icon 
        name="material-symbols:upload"
        size="3em"
      />
      Imagem do ponto de coleta
    </p>
  </div>
</template>

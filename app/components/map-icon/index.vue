<script setup lang="ts">
defineProps<{
  image: string
  title: string
  id: string
}>()
</script>

<template>
  <NuxtLink
    :to="`/points/${id}`"
    id="map-icon-container"
    class="flex flex-col items-center gap-1 no-underline"
  >
    <img
      :src="image"
      :alt="`Imagem do ponto do coleta do ${title}`"
      class="w-full max-h-[100px] object-cover rounded-md"
    />
    <h2 class="text-[10px] text-center w-full text-white">
      {{ title }}
    </h2>
  </NuxtLink>
</template>

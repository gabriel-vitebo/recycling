<template>
  <div class="w-full min-h-screen max-w-[1100px] mx-auto px-4 flex items-center justify-center flex-col">
      <img :src="logo" alt="Recycling Logo" class="w-56 md:w-52" />

      <main class="flex-1 w-full flex flex-col justify-center items-center text-center px-0 md:px-4">
        <h1 class="text-[54px] md:text-[54px] sm:text-4xl text-gray-800">
          O melhor lugar para encontrar <br /> coleta de resíduos.
        </h1>

        <p class="text-2xl sm:text-xl mt-6 leading-[38px] text-gray-600 max-w-[600px]">
          Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
        </p>

        <NuxtLink to="/create-point" class="w-full max-w-[360px] h-18 bg-green-600 rounded-md no-underline flex items-center overflow-hidden mt-10 hover:bg-green-500">
          <span class="w-18 h-18 bg-black/10 flex items-center justify-center transition-colors">
            <svg class="text-white w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
          </span>
          <strong class="flex-1 text-center text-white text-base font-bold">Cadastre um ponto de coleta</strong>
        </NuxtLink>

        <NuxtLink to="/find-point" class="w-full max-w-[360px] h-18 bg-green-600 rounded-md no-underline flex items-center overflow-hidden mt-4 hover:bg-green-500">
          <span class="w-18 h-18 bg-black/10 flex items-center justify-center transition-colors">
            <svg class="text-white w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <strong class="flex-1 text-center text-white text-base font-bold">Encontre um ponto de coleta</strong>
        </NuxtLink>
      </main>
    </div>
</template>

<script setup lang="ts">
import logo from '../../public/assets/logo.svg'
</script>
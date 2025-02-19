<template>
  <header class="bg-gray-800 px-4 py-2 flex justify-between items-center">
    <div class="flex items-center gap-4">
      <button @click="$emit('toggle-sidebar')" class="p-2 hover:bg-gray-700 rounded">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h18M3 12h18M3 21h18" />
        </svg>
      </button>
      <a href="https://www.maersk.com/" target="_blank" class="flex items-center gap-2">
        <img
          src="../assets/Maersk_Oil_logo.svg_-350x316.png"
          alt="MPL Bot Logo"
          class="w-8 h-8"
        />
      </a>
        <span class="text-white font-semibold text-lg">Maersk Project Logistics</span>
   
    </div>
    <div class="text-white">{{ userName }}</div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const userName = ref("Samarth M R");
</script>

<style scoped>
/* Add any additional styling if needed */
</style>
<template>
    <header class="bg-gray-800 px-4 py-2 flex justify-between items-center">
      <div class="flex items-center gap-4">
        <a href="https://www.maersk.com/" target="_blank" class="flex items-center gap-2">
          <img
            src="../assets/Maersk_Oil_logo.svg_-350x316.png"
            alt="MPL Bot Logo"
            class="w-8 h-8"
          />
          <span class="text-white font-semibold text-lg">Maersk Project Logistics - AI Assistant</span>
        </a>
      </div>
      <div class="text-white">{{ userName }}</div>
    </header>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';

  const userName = ref("Samarth M R");
  </script>
  
  <style scoped>

  </style>
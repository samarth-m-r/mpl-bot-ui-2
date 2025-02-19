<template>
  <div :class="['text-white h-full flex flex-col py-4 transition-all duration-300', { 'w-16': !isExpanded, 'w-56': isExpanded }]" :style="{ backgroundColor: '#353535' }">
    <button class="mb-4 p-2 hover:bg-gray-600 rounded flex items-center justify-center">
      <img src="../assets/icons8-home.svg" alt="Dashboard" class="h-6 w-6 filter-white" />
      <span v-if="isExpanded" class="ml-2 font-bold">Dashboard</span>
    </button>
    <button class="mb-4 p-2 hover:bg-gray-600 rounded flex items-center justify-center" @click="redirectToPowerBI">
      <img src="../assets/icons8-power-bi-2021.svg" alt="Power BI" class="h-6 w-6 filter-white" />
      <span v-if="isExpanded" class="ml-2 flex items-center font-bold">
        Power BI
        <img src="../assets/icons8-external-link.svg" alt="External Link" class="h-4 w-5 ml-4 filter-white" />
      </span>
    </button>
    <button class="p-2 hover:bg-gray-600 rounded flex items-center justify-center">
      <img src="../assets/icons8-configuration.svg" alt="Virtual Assistants" class="h-6 w-6 filter-white" />
      <span v-if="isExpanded" class="ml-2 font-bold">Virtual Assistants</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ isExpanded: boolean }>();

function redirectToPowerBI() {
  window.open("https://app.powerbi.com/home?experience=power-bi", "_blank");
}
</script>

<style scoped>
.filter-white {
  filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(103%) contrast(103%);
}
</style>

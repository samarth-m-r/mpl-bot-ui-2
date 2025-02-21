<template>
  <div 
    :class="['text-white h-full flex flex-col py-4 transition-all duration-300', { 'w-16': !isExpanded, 'w-56': isExpanded }]" 
    :style="{ backgroundColor: '#353535' }"
  >
    <router-link 
      to="/dashboard" 
      class="menu-item mb-4 p-2 hover:bg-gray-600 rounded flex items-center"
    >
      <div class="icon-wrapper">
        <img src="@/assets/icons8-home.svg" alt="Dashboard" class="h-6 w-6 filter-white" />
      </div>
      <div class="text-container" :class="{ 'text-collapsed': !isExpanded, 'text-expanded': isExpanded }">
        <span class="font-bold whitespace-nowrap">Dashboard</span>
      </div>
    </router-link>

    <button 
      class="menu-item mb-4 p-2 w-full hover:bg-gray-600 rounded flex items-center"
      @click="redirectToPowerBI"
    >
      <div class="icon-wrapper">
        <img src="@/assets/icons8-power-bi-2021.svg" alt="Power BI" class="h-6 w-6 filter-white" />
      </div>
      <div class="text-container" :class="{ 'text-collapsed': !isExpanded, 'text-expanded': isExpanded }">
        <span class="font-bold whitespace-nowrap flex items-center justify-between w-full">
          Power&nbsp;BI
          <img src="@/assets/icons8-external-link.svg" alt="External Link" class="h-4 w-4 ml-2 filter-white" />
        </span>
      </div>
    </button>

    <router-link 
      to="/virtual-assistants" 
      class="menu-item p-2 hover:bg-gray-600 rounded flex items-center"
    >
      <div class="icon-wrapper">
        <img src="@/assets/icons8-configuration.svg" alt="Virtual Assistants" class="h-6 w-6 filter-white" />
      </div>
      <div class="text-container" :class="{ 'text-collapsed': !isExpanded, 'text-expanded': isExpanded }">
        <span class="font-bold whitespace-nowrap">Virtual&nbsp;Assistants</span>
      </div>
    </router-link>
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

.menu-item {
  position: relative;
  height: 40px;
  display: flex;
  align-items: center;
}

.icon-wrapper {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  left: calc(32px - 12px); /* Fixed center position (64px/2 - icon_width/2) */
}

.text-container {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: 64px; /* Double the left space to keep text after centered icon */
  overflow: hidden;
}

.text-collapsed {
  opacity: 0;
  width: 0;
}

.text-expanded {
  opacity: 1;
  width: auto;
}
</style>

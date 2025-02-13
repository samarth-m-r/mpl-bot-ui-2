
<script setup lang="ts">
import ChatBox from "./components/ChatBox.vue";
import ChatsContainer from "./components/ChatsContainer.vue";
import Sidebar from "./components/Sidebar.vue";
import { ref } from 'vue';

const userName = "Samarth M R";
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>

<template>
  <div class="h-screen w-full flex">
    <!-- Sidebar -->
    <Sidebar 
      :is-open="isSidebarOpen"
      @close="isSidebarOpen = false"
      @new-chat="isSidebarOpen = false"
    />

    <!-- Main Content -->
    <div :class="{'ml-72': isSidebarOpen}" class="flex-1 flex flex-col bg-gray-50 transition-all duration-300">
      <!-- Header -->
      <header class="bg-[rgb(53,146,195)] px-4 py-2 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <button 
            @click="toggleSidebar"
            class="text-white hover:bg-[rgba(255,255,255,0.1)] p-2 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div class="flex items-center gap-2">
            <img
              src="./assets/Maersk_Oil_logo.svg_-350x316.png"
              alt="MPL Bot Logo"
              class="w-8 h-8"
            />
            <span class="text-white font-semibold text-lg">MPL Bot</span>
          </div>
        </div>
        <div class="text-white">{{ userName }}</div>
      </header>

      <!-- Chat Area -->
      <div class="flex-1 relative">
        <div class="absolute inset-0 flex flex-col">
          <div class="flex-1 overflow-y-auto px-4 custom-scrollbar">
            <div class="max-w-3xl mx-auto py-4">
              <ChatsContainer />
            </div>
          </div>
          <div class="w-full bg-gray-50 border-t p-4">
            <div class="max-w-3xl mx-auto">
              <ChatBox />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.h-screen {
  height: 100vh;
  overflow: hidden;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgb(53, 146, 195, 0.5);
  border-radius: 4px;
  transition: background 0.2s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgb(53, 146, 195, 0.8);
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgb(53, 146, 195, 0.5) transparent;
}
</style>
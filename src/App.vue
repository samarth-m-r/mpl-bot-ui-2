<script setup lang="ts">
import Header from "@/components/header/Header.vue";
import Sidebar from "@/components/sidebar/Sidebar.vue";
import { ref } from 'vue';

const isSidebarExpanded = ref(false);

function toggleSidebar() {
  isSidebarExpanded.value = !isSidebarExpanded.value;
}
</script>

<template>
  <div class="h-screen w-full flex flex-col">
    <Header @toggle-sidebar="toggleSidebar" />
    <div class="flex flex-1">
      <Sidebar :is-expanded="isSidebarExpanded" />
      <div class="flex-1 flex flex-col bg-gray-50 transition-all duration-300">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style>
.h-screen {
  height: 100vh;
  overflow: hidden;
}
</style>
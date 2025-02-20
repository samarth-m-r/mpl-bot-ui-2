<script setup lang="ts">
import CxAgentMva from "@/components/virtual-assistants/cx-agent-mva/CxAgentMva.vue";
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
    <!-- Header -->
    <Header @toggle-sidebar="toggleSidebar" />
    <div class="flex flex-1">
      <!-- Sidebar -->
      <Sidebar :is-expanded="isSidebarExpanded" />
      <!-- Main Content -->
      <div class="flex-1 flex flex-col bg-gray-50 transition-all duration-300">
        <CxAgentMva />
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
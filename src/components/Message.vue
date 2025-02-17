
<template>
  <div class="flex gap-2 my-1 p-2" :class="{ 'justify-end': isUser }">
    <template v-if="!isUser">
      <img
        src="../assets/Maersk_Oil_logo.svg_-350x316.png"
        alt="MPL Bot Logo"
        class="w-5 h-5 mt-1"
      />
      <div class="bg-gray-100 p-3 rounded-lg w-fit max-w-[90%] shadow-sm">
        <div class="font-bold text-gray-800 mb-1">MPL Bot</div>
        <div class="message-content whitespace-pre-wrap text-gray-700 leading-relaxed">{{ content }}</div>
      </div>
    </template>
    <template v-else>
      <div class="bg-[#2196f3] bg-opacity-10 p-3 rounded-lg w-fit max-w-[90%] shadow-sm">
        <div class="font-bold text-gray-800 mb-1">You</div>
        <div class="message-content whitespace-pre-wrap text-gray-700 leading-relaxed">{{ content }}</div>
      </div>
      <span class="text-[rgb(53,146,195)]">👤</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  content: string;
  role: string;
}>();

const isUser = computed(() => props.role === "user");
</script>
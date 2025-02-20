<template>
  <div ref="chatContainer" class="h-full py-4 overflow-y-auto">
    <Message
      v-for="(chat, index) in CHATS"
      :key="index"
      :content="chat.content"
      :role="chat.role"
    />
    <div ref="bottomMarker" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from "vue";
import Message from "../cx-agent-component/Message.vue";
import { CHATS } from "@/stores/chat";

// References
const chatContainer = ref<HTMLElement | null>(null);
const bottomMarker = ref<HTMLElement | null>(null);

// Compute the last message content
const lastMessage = computed(() => CHATS.value[CHATS.value.length - 1]?.content || "");

// Watch for changes in the last message's content
watch(lastMessage, async () => {
  await nextTick(); // Ensure DOM updates before scrolling
  bottomMarker.value?.scrollIntoView({ behavior: "smooth" });
});
</script>

<style>
.h-full {
  height: 100%;
}
.overflow-y-auto {
  overflow-y: auto;
}
</style>
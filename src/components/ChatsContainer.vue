<template>
  <div class="h-full py-4">
    <Message
      v-for="(chat, index) in CHATS"
      :key="index"
      :content="chat.content"
      :role="chat.role"
    />
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import Message from "./Message.vue";
import { CHATS } from "@/stores/chat";

// Auto scroll to bottom when new messages are added
watch(CHATS, () => {
  setTimeout(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, 100);
});
</script>
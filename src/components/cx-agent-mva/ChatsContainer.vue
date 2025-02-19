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
import Message from "@/components/cx-agent-mva/Message.vue";
import { CHATS } from "@/stores/chat";


</script>
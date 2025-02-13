<template>
  <div class="relative">
    <textarea
      v-model="message"
      ref="textarea"
      rows="1"
      :placeholder="isListening ? 'Listening...' : 'Type your message here...'"
      class="w-full rounded-lg border border-gray-300 px-4 py-2 pr-24 focus:border-[#2196f3] focus:outline-none resize-none no-scrollbar"
      @keydown.enter.exact.prevent="sendChats"
      @keydown.shift.enter.prevent="message += '\n'"
      @input="autoGrow"
    ></textarea>
    <div class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
      <button
        @click="toggleVoiceInput"
        :class="{ 'text-[#2196f3]': isListening }"
        class="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      </button>
      <button
        @click="sendChats"
        class="p-2 hover:bg-gray-100 rounded-full transition-colors text-[#2196f3]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { CHATS } from "@/stores/chat";
import { useSpeechRecognition } from "@vueuse/core";

const message = ref("");
const textarea = ref<HTMLTextAreaElement | null>(null);

const {
  isListening,
  result,
  start,
  stop,
  isSupported
} = useSpeechRecognition({
  lang: "en-US",
  continuous: true,
  interimResults: true
});

watch(result, (value) => {
  if (value && isListening.value) {
    message.value = value;
    nextTick(() => autoGrow());
  }
});

function autoGrow() {
  if (textarea.value) {
    textarea.value.style.height = 'auto';
    textarea.value.style.height = (textarea.value.scrollHeight) + 'px';
  }
}

function toggleVoiceInput() {
  if (!isSupported.value) return;
  
  if (isListening.value) {
    stop();
  } else {
    message.value = "";
    start();
  }
}

function sendChats() {
  if (!message.value.trim()) return;

  if (isListening.value) {
    stop();
  }

  CHATS.value.push({ role: "user", content: message.value });
  message.value = "";
  
  // Reset textarea height
  if (textarea.value) {
    textarea.value.style.height = 'auto';
  }

  nextTick(() => {
    const chatContainer = document.querySelector(".overflow-auto");
    chatContainer?.scrollTo(0, chatContainer.scrollHeight);
  });

  setTimeout(() => {
    CHATS.value.push({ role: "bot", content: "This is a dummy response." });
    nextTick(() => {
      const chatContainer = document.querySelector(".overflow-auto");
      chatContainer?.scrollTo(0, chatContainer.scrollHeight);
    });
  }, 1000);
}
</script>

<style>
.no-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
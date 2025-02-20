<template>
  <div class="relative">
    <!-- textbox.where only texts are allowed -->
    <textarea
      v-model="message"
      ref="textarea"
      rows="1"
      :placeholder="isListening ? 'Listening...' : 'Type your message here...'"
      class="w-full rounded-lg border border-gray-300 px-4 py-2 pr-24 focus:border-[#2196f3] focus:outline-none resize-none no-scrollbar"
      @keydown.enter.exact.prevent="fetchResponse"
      @keydown.shift.enter.prevent="handleNewLine"
      @input="autoGrow"
    ></textarea>
    <!-- voice icon -->
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

      <!-- send icon -->
      <button
        @click="fetchResponse"
        :disabled="isResponding"
        class="p-2 hover:bg-gray-100 rounded-full transition-colors"
        :class="{
          'text-[#2196f3]': !isResponding && message.trim(),
          'text-gray-400': isResponding || !message.trim(),
          'cursor-not-allowed': isResponding
        }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from "vue";
import { CHATS } from "@/stores/chat";
import { useSpeechRecognition } from "@vueuse/core";
import { getMplBotResponse, type IMPLBotApiRequest } from "@/api/server";
import { AppConfig } from "@/AppConfig";

const message = ref("");
const textarea = ref<HTMLTextAreaElement | null>(null);
const conversationId = ref<string | undefined>(undefined);
const parentMessageId = ref<string | undefined>(undefined);

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

const isTyping = ref(false);   // Typing indicator
const isResponding = ref(false); // Responding indicator

const isMac = computed(() => /Mac/.test(navigator.userAgent)).value;
const isWindows = computed(() => /Win/.test(navigator.userAgent)).value;

function pushUserMessage(userMessage: string) {
  CHATS.value.push({ role: "user", content: userMessage });
}

function fetchResponse() {
  if (!message.value.trim()) return;

  if (isListening.value) {
    stop();
  }

  pushUserMessage(message.value);
  const queryMessage = message.value;
  message.value = "";
  
  // Reset textarea height
  if (textarea.value) {
    textarea.value.style.height = 'auto';
  }

  nextTick(() => {
    const chatContainer = document.querySelector(".overflow-auto");
    chatContainer?.scrollTo(0, chatContainer.scrollHeight);
  });

  if (isMac) {
    fetchResponseBlocking(queryMessage);
  } else {
    fetchResponseStreaming(queryMessage);
  }
}

function fetchResponseBlocking(queryMessage: string) {
  isResponding.value = true;
  CHATS.value.push({ role: "bot", content: "Loading..." });

  getMplBotResponse(queryMessage, "blocking", conversationId.value, parentMessageId.value).then((res) => {
    const loadingMessageIndex = CHATS.value.findIndex(chat => chat.content === "Loading...");
    if (loadingMessageIndex !== -1) {
      CHATS.value[loadingMessageIndex] = {
        role: "bot",
        content: res.answer
      };
    }
    conversationId.value = res.conversation_id; 
    parentMessageId.value = res.message_id; 
  }).finally(() => {
    isResponding.value = false;
  });
}

const fetchResponseStreaming = async (queryMessage: string) => {
  isResponding.value = true;
  CHATS.value.push({ role: "bot", content: "Loading..." });

  try {
    const requestData: IMPLBotApiRequest = {
      query: queryMessage,
      user: "abc-123", // get the user from Azure Ad and pass it here
      response_mode: "streaming",
      inputs: {},
      conversation_id: conversationId.value,
      parent_message_id: parentMessageId.value,
    };
    
    const response = await fetch(AppConfig.MPL_BOT_API_REQUEST_URL + "/ask_bot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    if (!response.ok || !response.body) throw new Error("Failed to send message");

    const lastIdx = CHATS.value.length - 1;
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    const readStream = async () => {
      const { done, value } = await reader.read();
      if (done) {
        isTyping.value = false;
        isResponding.value = false;
        return;
      }

      const chunk = decoder.decode(value, { stream: true });
      chunk.split("\n\n").forEach((line) => {
        if (line.startsWith("data: ")) {
          try {
            const parsedData = JSON.parse(line.replace("data: ", "").trim());
            if(!!parsedData.event && parsedData.event === "message") {
              if (CHATS.value[lastIdx].content === "Loading...") {
                CHATS.value[lastIdx].content = parsedData.answer;
              } else {
                CHATS.value[lastIdx].content += parsedData.answer;
              }

              if(!!parsedData.conversation_id)
                conversationId.value = parsedData.conversation_id; 

              if(!!parsedData.message_id)
                parentMessageId.value = parsedData.message_id; 
            }
          } catch (error) {
            console.error("Error parsing SSE data:", error);
          }
        }
      });

      // Recursively read the next chunk
      readStream();
    };

    readStream();
  } catch (error) {
    console.error("Error:", error);
    isResponding.value = false;
  }
};

function handleNewLine() {
  message.value += '\n';
  nextTick(() => autoGrow());
}
</script>

<style scoped>
.message {
  margin-bottom: 10px;
}
.bot-message {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
}
.user-message {
  background-color: #d1e7dd;
  padding: 10px;
  border-radius: 5px;
  text-align: right;
}
.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
  color: #888;
}

/* Hide scrollbar for Chrome, Safari and Opera */
textarea::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
textarea {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
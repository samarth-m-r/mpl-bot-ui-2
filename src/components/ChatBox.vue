<template>
  <div class="relative">
    <textarea
      v-model="message"
      ref="textarea"
      rows="1"
      :placeholder="isListening ? 'Listening...' : 'Type your message here...'"
      class="w-full rounded-lg border border-gray-300 px-4 py-2 pr-24 focus:border-[#2196f3] focus:outline-none resize-none no-scrollbar"
      @keydown.enter.exact.prevent="fetchResponse"
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
        @click="fetchResponse"
        class="p-2 hover:bg-gray-100 rounded-full transition-colors text-[#2196f3]"
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

const isMac = computed(() => /Mac/.test(navigator.userAgent)).value;
const isWindows = computed(() => /Win/.test(navigator.userAgent)).value;

function pushUserMessage(userMessage: string) {
  CHATS.value.push({ role: "user", content: userMessage });
}

function fetchResponse() {
  if (isMac) {
    fetchResponseBlocking();
  }
  else {
    fetchResponseStreaming();
  }
}

function fetchResponseBlocking() {
  if (!message.value.trim()) return;

  if (isListening.value) {
    stop();
  }

  pushUserMessage(message.value)

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

  // setTimeout(() => {
  //   CHATS.value.push({ role: "bot", content: "This is a dummy response." });
  //   nextTick(() => {
  //     const chatContainer = document.querySelector(".overflow-auto");
  //     chatContainer?.scrollTo(0, chatContainer.scrollHeight);
  //   });
  // }, 1000);

  getMplBotResponse(queryMessage, "blocking").then((res) => {
    CHATS.value.push({
      role: "bot",
      content: res.answer
    })
  })

}

  // Function to send message and receive SSE response

const fetchResponseStreaming = async () => {
  if (!message.value.trim()) return;
  isTyping.value = true;

  try {

    pushUserMessage(message.value)

    const requestData: IMPLBotApiRequest = {
      query: message.value,
      user: "abc-123", // get the user from Azure Ad and pass it here
      response_mode: "streaming",
      inputs: {},
      // conversation_id: conversation_id,
      // parent_message_id: parent_message_id,
      // files: []
    }
    
    message.value = "";

    const response = await fetch(AppConfig.MPL_BOT_API_REQUEST_URL + "/ask_bot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    if (!response.ok || !response.body) throw new Error("Failed to send message");

    const lastIdx = CHATS.value.length;
    CHATS.value.push({ role: "bot", content: "Loading..." });

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    const readStream = async () => {
      const { done, value } = await reader.read();
      if (done) {
        isTyping.value = false;
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
  }

};
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
</style>
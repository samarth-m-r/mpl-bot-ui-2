<template>
  <div
    class="fixed inset-y-0 left-0 w-72 bg-white border-r transform transition-transform duration-300 ease-in-out z-50"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="flex flex-col h-full">
      <!-- Header -->
      <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-xl font-semibold">MPL Bot</h2>
        <button
          @click="$emit('close')"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- New Chat Button -->
      <button
        @click="startNewChat"
        class="mx-4 mt-4 mb-2 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Chat
      </button>

      <!-- Chat History -->
      <div class="flex-1 overflow-y-auto">
        <div class="p-4">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-sm font-semibold text-gray-500">Chat History</h3>
            <button
              v-if="chatHistory.length"
              @click="clearHistory"
              class="text-sm text-red-500 hover:text-red-600 transition-colors"
            >
              Clear All
            </button>
          </div>
          
          <div v-if="!chatHistory.length" class="text-sm text-gray-500 text-center py-4">
            No chat history yet
          </div>
          
          <div v-else class="space-y-2">
            <div
              v-for="chat in chatHistory"
              :key="chat.id"
              @click="selectChat(chat)"
              class="p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer relative group"
              :class="{ 'bg-gray-100': activeChatId === chat.id }"
            >
              <div class="flex justify-between items-start">
                <div class="pr-8">
                  <div class="font-medium">{{ chat.title }}</div>
                  <div class="text-sm text-gray-500">
                    {{ new Date(chat.date).toLocaleString() }}
                  </div>
                </div>
                <button
                  @click="deleteChat(chat, $event)"
                  class="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Overlay -->
  <div 
    v-if="isOpen" 
    class="fixed inset-0 bg-black bg-opacity-30 z-10"
    @click="$emit('close')"
  ></div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { CHATS } from '@/stores/chat';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['close', 'new-chat']);

// Chat management
const chatHistory = ref<Array<{
  id: string;
  title: string;
  date: Date;
  messages: Array<{ role: string; content: string; }>;
}>>([]);

const activeChatId = ref<string | null>(null);

function generateUniqueId() {
  return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function startNewChat() {
  // Check if there's already an empty new chat
  const hasEmptyNewChat = chatHistory.value.some(chat => 
    chat.title === 'New Chat' && 
    chat.messages.length === 1 && 
    chat.messages[0].role === 'bot' && 
    chat.messages[0].content === 'Welcome to the chat!'
  );

  if (hasEmptyNewChat) {
    return; // Don't create another new chat if one exists
  }

  // Save current chat first if it has messages
  if (CHATS.value.length > 1) { // More than just the welcome message
    const firstUserMessage = CHATS.value.find(msg => msg.role === 'user');
    const currentChat = {
      id: generateUniqueId(),
      title: firstUserMessage ? firstUserMessage.content.slice(0, 30) + (firstUserMessage.content.length > 30 ? '...' : '') : 'New Chat',
      date: new Date(),
      messages: [...CHATS.value]
    };
    
    // Only add if it's not a duplicate
    const isDuplicate = chatHistory.value.some(chat => 
      JSON.stringify(chat.messages) === JSON.stringify(currentChat.messages)
    );
    
    if (!isDuplicate) {
      chatHistory.value.unshift(currentChat);
      if (chatHistory.value.length > 5) {
        chatHistory.value.pop(); // Limit to 5 entries
      }
    }
  }
  
  // Create new chat
  CHATS.value = [{ role: "bot", content: "Welcome to the chat!" }];
  const newChat = {
    id: generateUniqueId(),
    title: 'New Chat',
    date: new Date(),
    messages: [...CHATS.value]
  };
  
  activeChatId.value = newChat.id;
  chatHistory.value.unshift(newChat);
  emit('new-chat');
  emit('close');
}

function selectChat(chat: any) {
  activeChatId.value = chat.id;
  CHATS.value = [...chat.messages];
  emit('close');
}

function deleteChat(chatToDelete: any, event: Event) {
  event.preventDefault();
  event.stopPropagation();
  
  if (confirm('Are you sure you want to delete this chat?')) {
    // Find the exact index of the chat to delete
    const exactIndex = chatHistory.value.findIndex(chat => 
      chat.id === chatToDelete.id && 
      JSON.stringify(chat.messages) === JSON.stringify(chatToDelete.messages)
    );
    
    if (exactIndex !== -1) {
      // Remove only this specific chat
      chatHistory.value.splice(exactIndex, 1);
      
      // Reset if it was the active chat
      if (activeChatId.value === chatToDelete.id) {
        activeChatId.value = null;
        CHATS.value = [{ role: "bot", content: "Welcome to the chat!" }];
      }
    }
  }
}

function clearHistory() {
  if (confirm('Are you sure you want to clear all chat history?')) {
    chatHistory.value = [];
    activeChatId.value = null;
    CHATS.value = [{ role: "bot", content: "Welcome to the chat!" }];
  }
}

// Watch for changes in the chat store to update history
watch(CHATS, (newChats) => {
  if (activeChatId.value) {
    const activeChat = chatHistory.value.find(chat => chat.id === activeChatId.value);
    if (activeChat) {
      activeChat.messages = [...newChats];
      // Update title based on first user message if it exists
      const firstUserMessage = newChats.find(msg => msg.role === 'user');
      if (firstUserMessage && activeChat.title === 'New Chat') {
        activeChat.title = firstUserMessage.content.slice(0, 30) + (firstUserMessage.content.length > 30 ? '...' : '');
      }
    }
  }
}, { deep: true });
</script>
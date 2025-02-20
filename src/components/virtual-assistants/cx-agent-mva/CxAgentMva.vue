<script setup lang="ts">
import ChatBox from "./cx-agent-component/ChatBox.vue";
import ChatsContainer from "./cx-agent-component/ChatsContainer.vue";
</script>
<template>
    <div class="flex-1 flex flex-col bg-gray-50 transition-all duration-300">
        <!-- Chat Area -->
        <div class="flex-1 relative">
          <div class="absolute inset-0 flex flex-col">
            <div class="flex-1 overflow-y-auto px-4 custom-scrollbar">
              <div class="max-w-3xl mx-auto py-4">
                <ChatsContainer />
              </div>
            </div>
            <div class="w-full bg-gray-50 border-t p-4">
              <div class="max-w-3xl mx-auto">
                <ChatBox />
              </div>
            </div>
          </div>
        </div>
      </div>
</template>
<style>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgb(53, 146, 195, 0.5);
  border-radius: 4px;
  transition: background 0.2s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgb(53, 146, 195, 0.8);
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgb(53, 146, 195, 0.5) transparent;
}
</style>
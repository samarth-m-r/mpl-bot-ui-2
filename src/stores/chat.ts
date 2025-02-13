
import type { CHAT } from "@/types";
import { ref } from "vue";

export const CHATS = ref<CHAT[]>([
  { role: "bot", content: "Hello! How can I help you?" },
]);
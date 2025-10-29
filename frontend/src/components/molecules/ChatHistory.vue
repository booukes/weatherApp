<template>
  <div ref="container" class="flex-1 space-y-4 overflow-y-auto p-4 bg-white/5 rounded-lg scroll-smooth mb-4">
    <ChatMessage
      v-for="(msg, index) in chatHistory"
      :key="index"
      :content="msg.content"
      :is-user="msg.role === 'user'"
    />

    <div v-if="isThinking" class="flex justify-start">
      <div class="bg-white/10 p-3 rounded-xl shadow-md">
        <span class="inline-block animate-spin text-xl">⚙️</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import ChatMessage from '@/components/molecules/ChatMessage.vue'

interface ChatMsg {
  role: 'user' | 'ai'
  content: string
}

const props = defineProps<{
  chatHistory: ChatMsg[]
  isThinking: boolean
}>()

const container = ref<HTMLDivElement | null>(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (container.value) {
      container.value.scrollTop = container.value.scrollHeight
    }
  })
}

watch(() => props.chatHistory, () => {
  scrollToBottom()
}, { deep: true })
</script>


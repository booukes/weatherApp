<template>
  <div v-if="isThinking && chatHistory.length === 0" class="flex items-center justify-center py-12">
    <LoadingSpinner />
  </div>

  <div v-else-if="error && chatHistory.length === 0" class="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
    <ErrorMessage :message="error" />
  </div>

  <div v-else class="flex flex-col h-[70vh] max-h-[700px]">
    <ChatHistory
      :chat-history="chatHistory"
      :is-thinking="isThinking"
    />

    <div v-if="error" class="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
      <ErrorMessage :message="error" />
    </div>

    <ChatInput
      :model-value="userMessage"
      :disabled="isThinking"
      @update:model-value="emit('update:userMessage', $event)"
      @send="emit('send-message')"
    />
  </div>
</template>

<script setup lang="ts">
import LoadingSpinner from '@/components/atoms/LoadingSpinner.vue'
import ErrorMessage from '@/components/atoms/ErrorMessage.vue'
import ChatHistory from '@/components/molecules/ChatHistory.vue'
import ChatInput from '@/components/molecules/ChatInput.vue'

interface ChatMessage {
  role: 'user' | 'ai'
  content: string
}

defineProps<{
  chatHistory: ChatMessage[]
  isThinking: boolean
  error: string
  userMessage: string
}>()

const emit = defineEmits<{
  'update:userMessage': [value: string]
  'send-message': []
}>()
</script>

<template>
  <Transition name="modal-fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <div class="max-w-2xl w-full">
        <GlassCard class="p-6 relative" :delay="0">
          <button
            @click="emit('close')"
            class="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors z-10"
            title="Close"
          >
            <CloseIcon />
          </button>

          <AIAssistantHeader />

          <AIAssistantContent
            :chat-history="chatHistory"
            :is-thinking="isThinking"
            :error="error"
            :user-message="userMessage"
            @update:user-message="emit('update:userMessage', $event)"
            @send-message="emit('send-message')"
          />
        </GlassCard>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import GlassCard from '@/components/atoms/GlassCard.vue'
import CloseIcon from '@/components/atoms/CloseIcon.vue'
import AIAssistantHeader from '@/components/molecules/AIAssistantHeader.vue'
import AIAssistantContent from '@/components/molecules/AIAssistantContent.vue'

interface ChatMessage {
  role: 'user' | 'ai'
  content: string
}

defineProps<{
  show: boolean
  chatHistory: ChatMessage[]
  isThinking: boolean
  error: string
  userMessage: string
}>()

const emit = defineEmits<{
  'close': []
  'update:userMessage': [value: string]
  'send-message': []
}>()
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-active .max-w-2xl,
.modal-fade-leave-active .max-w-2xl {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .max-w-2xl {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}

.modal-fade-leave-to .max-w-2xl {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}
</style>

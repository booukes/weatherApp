<template>
  <form @submit.prevent="handleSubmit" class="flex gap-3">
    <input
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :disabled="disabled"
      type="text"
      placeholder="Ask a follow-up question..."
      class="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      type="submit"
      :disabled="disabled || !modelValue.trim()"
      class="flex-shrink-0 px-5 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-zinc-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
      title="Send"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.941l18-9a.75.75 0 0 0 0-1.882l-18-9Z" />
      </svg>
    </button>
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  disabled: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'send': []
}>()

const handleSubmit = () => {
  if (!props.disabled && props.modelValue.trim()) {
    emit('send')
  }
}
</script>

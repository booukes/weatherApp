<!-- New component: src/components/FooterNavigation.vue -->

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  canGoPrevious: boolean
  canGoNext: boolean
  currentDateTime: { date: string; time: string }
}>()

const emit = defineEmits<{
  (e: 'to-start'): void
  (e: 'previous-hour'): void
  (e: 'next-hour'): void
  (e: 'to-end'): void
}>()
</script>

<template>
  <footer
    class="fixed w-max md:w-128 bottom-2 left-1/2 -translate-x-1/2 rounded-lg drop-shadow-2xl blur-target border-white/30 md:bg-[rgba(30,30,30,0.25)] backdrop-blur-2xl border px-2"
  >
    <div class="flex items-center justify-between">
      <!-- Left Navigation -->
      <div class="flex items-center gap-4">
        <button
          @click="emit('to-start')"
          :disabled="!props.canGoPrevious"
          :class="[
            'p-2 rounded-lg transition-all duration-200',
            props.canGoPrevious
              ? 'hover:bg-white/10 text-white cursor-pointer'
              : 'text-zinc-600 cursor-not-allowed'
          ]"
          title="Go to start"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="11 17 6 12 11 7"></polyline>
            <polyline points="18 17 13 12 18 7"></polyline>
          </svg>
        </button>

        <button
          @click="emit('previous-hour')"
          :disabled="!props.canGoPrevious"
          :class="[
            'p-2 rounded-lg transition-all duration-200',
            props.canGoPrevious
              ? 'hover:bg-white/10 text-white cursor-pointer'
              : 'text-zinc-600 cursor-not-allowed'
          ]"
          title="Previous hour"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      </div>

      <!-- Center - Date & Time -->
      <div class="text-center">
        <p class="text-white font-semibold text-lg">{{ props.currentDateTime.time }}</p>
        <p class="text-zinc-400 text-sm">{{ props.currentDateTime.date }}</p>
      </div>

      <!-- Right Navigation -->
      <div class="flex items-center gap-4">
        <button
          @click="emit('next-hour')"
          :disabled="!props.canGoNext"
          :class="[
            'p-2 rounded-lg transition-all duration-200',
            props.canGoNext
              ? 'hover:bg-white/10 text-white cursor-pointer'
              : 'text-zinc-600 cursor-not-allowed'
          ]"
          title="Next hour"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <button
          @click="emit('to-end')"
          :disabled="!props.canGoNext"
          :class="[
            'p-2 rounded-lg transition-all duration-200',
            props.canGoNext
              ? 'hover:bg-white/10 text-white cursor-pointer'
              : 'text-zinc-600 cursor-not-allowed'
          ]"
          title="Go to end"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="13 17 18 12 13 7"></polyline>
            <polyline points="6 17 11 12 6 7"></polyline>
          </svg>
        </button>
      </div>
    </div>
  </footer>
</template>

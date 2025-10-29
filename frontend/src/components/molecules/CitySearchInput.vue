  <template>
    <div class="flex flex-col gap-3 w-full">
      <div class="flex flex-col sm:flex-row gap-2">
        <input
          v-model="localSearch"
          @keypress="handleKeypress"
          type="text"
          placeholder="Enter city name"
          class="flex-1 px-3 sm:px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          :disabled="isSearching"
        />
        <div class="flex gap-2">
          <button
            @click="emit('search', localSearch)"
            :disabled="isSearching || !localSearch.trim()"
            class="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-zinc-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors text-sm sm:text-base"
          >
            {{ isSearching ? 'Searching...' : 'Search' }}
          </button>
          <button
            @click="emit('use-location')"
            :disabled="isSearching"
            class="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-zinc-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
            title="Use current location"
          >
            📍
          </button>
          <button
            @click="emit('close')"
            class="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
      <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>
    </div>
  </template>

  <script setup lang="ts">
  import { ref, watch } from 'vue'

  const props = defineProps<{
    modelValue: string
    isSearching: boolean
    error: string
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: string]
    'search': [city: string]
    'use-location': []
    'close': []
  }>()

  const localSearch = ref(props.modelValue)

  watch(() => props.modelValue, (val) => {
    localSearch.value = val
  })

  watch(localSearch, (val) => {
    emit('update:modelValue', val)
  })

  const handleKeypress = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !props.isSearching) {
      emit('search', localSearch.value)
    }
  }
  </script>
  <style scoped>
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all 0.3s ease;
  }

  .slide-fade-enter-from {
    transform: translateX(-20px);
    opacity: 0;
  }

  .slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
  }
  </style>

<template>
  <footer
    class="fixed bottom-0 left-0 right-0 bg-zinc-900/50 backdrop-blur-md border-t border-zinc-800 text-white flex items-center justify-center gap-6 py-3 z-50"
  >
    <button
      @click="changeTime(-24)"
      class="text-2xl hover:text-sky-400 transition-all disabled:text-zinc-600"
      :disabled="!canGoBackDay"
      title="Previous Day"
    >
      ≪
    </button>

    <button
      @click="changeTime(-1)"
      class="text-3xl hover:text-sky-400 transition-all disabled:text-zinc-600"
      :disabled="!canGoBackHour"
      title="Previous Hour"
    >
      ‹
    </button>

    <div class="text-center text-lg select-none">
      <p class="font-mono tracking-tight">{{ formattedDate }}</p>
      <p class="text-sm text-zinc-400">Forecast time</p>
    </div>

    <button
      @click="changeTime(1)"
      class="text-3xl hover:text-sky-400 transition-all disabled:text-zinc-600"
      :disabled="!canGoForwardHour"
      title="Next Hour"
    >
      ›
    </button>

    <button
      @click="changeTime(24)"
      class="text-2xl hover:text-sky-400 transition-all disabled:text-zinc-600"
      :disabled="!canGoForwardDay"
      title="Next Day"
    >
      ≫
    </button>
  </footer>
</template>

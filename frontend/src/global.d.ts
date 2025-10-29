declare global {
  // global.d.ts
  interface PuterAI {
    chat(prompt: string, options?: { model?: string }): Promise<string>
  }

  interface Puter {
    ai: PuterAI
  }

  interface Window {
    puter?: Puter
  }
}

export {};

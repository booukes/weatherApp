import { reactive } from 'vue'
import type { WeatherData } from '@/components/composables/useWeatherData.ts'

interface ChatMessage {
    role: 'user' | 'ai'
    content: string
}

export function useAIAssistant() {
    const state = reactive({
        showAssistant: false,
        chatHistory: [] as ChatMessage[],
        userMessage: '',
        initialPrompt: '',
        isThinking: false,
        error: '',
        puterLoaded: false,
        requestCount: 0,
        lastRequestTime: 0,
        rateLimitCooldown: false,
    })

    const loadPuterScript = () => {
        return new Promise((resolve, reject) => {
            if (window.puter) {
                state.puterLoaded = true
                resolve(true)
                return
            }

            const script = document.createElement('script')
            script.src = 'https://js.puter.com/v2/'
            script.async = true
            script.onload = () => {
                state.puterLoaded = true
                resolve(true)
            }
            script.onerror = () => reject(new Error('Failed to load Puter.js'))
            document.head.appendChild(script)
        })
    }

    const getWeatherAdvice = async (weatherData: WeatherData) => {
        if (!weatherData) return

        if (state.rateLimitCooldown) {
            state.showAssistant = true
            state.error = '⏱️ Please wait a moment before making another request.'
            return
        }

        state.isThinking = true
        state.error = ''
        state.chatHistory = []
        state.userMessage = ''
        state.showAssistant = true

        try {
            if (!state.puterLoaded) {
                await loadPuterScript()
            }

          if (!window.puter || !window.puter.ai) {
            state.error = 'AI service not available. Please refresh the page and try again.'
            return
          }

            const prompt = `You are a helpful, friendly weather assistant. You must never deviate from weather-related topics. Only provide information about weather conditions, forecasts, or practical advice for appropriate clothing, gear, or precautions. Avoid heavy or unrelated topics—your tone should always be suitable for children and general users.

When given weather data:

Give brief, practical advice in 1–2 sentences.

Only extend to 2–3 sentences if the user’s question clearly benefits from a slightly longer explanation.

Keep answers clear, cheerful, and easy to understand.:

Location: ${weatherData.location}
Temperature: ${weatherData.temperature}°C (feels like ${weatherData.feels_like}°C)
Condition: ${weatherData.description}
Humidity: ${weatherData.humidity}%
Wind: ${weatherData.wind_speed} km/h

Give friendly, actionable advice about what to wear or activities to consider. Be very concise and helpful.`

            state.initialPrompt = prompt

            const response = await window.puter.ai.chat(prompt, { model: 'gpt-4o-mini' })
            state.chatHistory.push({ role: 'ai', content: response })

            state.requestCount++
            state.lastRequestTime = Date.now()

            if (state.requestCount >= 10) {
                state.rateLimitCooldown = true
                setTimeout(() => {
                    state.rateLimitCooldown = false
                    state.requestCount = 0
                }, 60000)
            }

        } catch (error: unknown) {
          console.error('AI Error:', error)

          if (error instanceof Error) {
            state.error = error.message || 'Could not get AI advice. Please try again.'
          } else {
            state.error = 'An unexpected error occurred.'
          }
        } finally {
          state.isThinking = false
        }
    }

    const sendFollowUpMessage = async () => {
        const message = state.userMessage.trim()
        if (!message || state.isThinking) return

        state.error = ''
        state.chatHistory.push({ role: 'user', content: message })
        state.userMessage = ''
        state.isThinking = true

        try {
            let fullPrompt = state.initialPrompt + '\n\nHere is our conversation so far:\n'

            for (const msg of state.chatHistory) {
                fullPrompt += msg.role === 'user' ? `User: ${msg.content}\n` : `AI: ${msg.content}\n`
            }
            fullPrompt += 'AI: '

            const response = await window.puter!.ai.chat(fullPrompt, { model: 'gpt-4o-mini' })
            state.chatHistory.push({ role: 'ai', content: response })

        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error('AI Follow-up Error:', error)
            state.error = error.message || 'Could not get AI response. Please try again.'
          } else {
            console.error("Unexpected error occurred.")
            state.error = "Unexpected error occurred."
          }
        } finally {
            state.isThinking = false
        }
    }

    const closeAssistant = () => {
        state.showAssistant = false
        state.error = ''
        state.chatHistory = []
        state.userMessage = ''
        state.initialPrompt = ''
    }

    return {
        state,
        getWeatherAdvice,
        sendFollowUpMessage,
        closeAssistant,
        loadPuterScript,
    }
}

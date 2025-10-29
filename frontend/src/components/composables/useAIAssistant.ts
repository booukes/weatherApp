import { reactive, nextTick } from 'vue'

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

    const getWeatherAdvice = async (weatherData: any) => {
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
                throw new Error('AI service not available. Please refresh the page and try again.')
            }

            const prompt = `You are a helpful weather assistant. Based on this weather data, give brief, practical advice (1-2 sentences max, BUT if the query requires it, or it seems much better for a longer response, do it):

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

        } catch (error: any) {
            console.error('AI Error:', error)
            // Error handling logic here
            state.error = error.message || 'Could not get AI advice. Please try again.'
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

            const response = await window.puter.ai.chat(fullPrompt, { model: 'gpt-4o-mini' })
            state.chatHistory.push({ role: 'ai', content: response })

        } catch (error: any) {
            console.error('AI Follow-up Error:', error)
            state.error = error.message || 'Could not get AI response. Please try again.'
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

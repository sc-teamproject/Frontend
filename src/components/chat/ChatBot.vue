<template>
  <div class="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full min-h-[500px] relative">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-slate-100 px-4 py-2.5 flex items-center justify-between rounded-t-xl">
      <div class="flex items-center gap-2">
        <MessageCircle class="text-purple-600 w-5 h-5" />
        <div>
          <p class="font-bold text-sm text-slate-800">Gwangju AI Gourmet Guide</p>
          <p class="text-[10px] text-slate-500">FastAPI 챗봇 (내일 연결됨)</p>
        </div>
      </div>
      <div v-if="isConnected" class="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
        <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
        연결됨
      </div>
      <div v-else class="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
        <div class="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
        대기 중
      </div>
    </div>

    <!-- Chat Messages -->
    <div class="flex-grow overflow-y-auto p-3 space-y-3 bg-slate-50">
      <!-- Welcome Message -->
      <div class="flex justify-center">
        <div class="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 text-center max-w-xs">
          <p class="font-semibold text-purple-700">안녕하세요! 🎉</p>
          <p class="mt-1">광주의 맛집에 대해 궁금한 점을 물어봐주세요.</p>
        </div>
      </div>

      <!-- Chat Messages List -->
      <div v-for="(msg, idx) in messages" :key="idx">
        <div v-if="msg.role === 'user'" class="flex justify-end">
          <div class="bg-blue-600 text-white rounded-lg px-3 py-2 text-xs max-w-xs break-words">
            {{ msg.content }}
          </div>
        </div>
        <div v-else class="flex justify-start">
          <div class="bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs max-w-xs break-words">
            {{ msg.content }}
          </div>
        </div>
      </div>

      <!-- Loading Indicator -->
      <div v-if="isLoading" class="flex justify-start">
        <div class="bg-white border border-slate-200 rounded-lg px-3 py-2">
          <div class="flex gap-1">
            <span class="inline-block w-2 h-2 bg-slate-300 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
            <span class="inline-block w-2 h-2 bg-slate-300 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
            <span class="inline-block w-2 h-2 bg-slate-300 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
          </div>
        </div>
      </div>

      <!-- Scroll anchor -->
      <div ref="messagesEndRef"></div>
    </div>

    <!-- Input Area -->
    <div class="border-t border-slate-100 p-3 bg-white rounded-b-xl">
      <form @submit.prevent="sendMessage" class="flex gap-2">
        <input
          v-model="inputMessage"
          type="text"
          placeholder="광주 맛집에 대해 물어보세요..."
          :disabled="isLoading"
          class="flex-grow bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none disabled:bg-slate-100"
        />
        <button
          type="submit"
          :disabled="isLoading || !inputMessage.trim()"
          class="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white font-semibold px-3 py-2 rounded-lg transition text-xs flex items-center gap-1"
        >
          <Send class="w-3 h-3" />
          <span class="hidden sm:inline">전송</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { MessageCircle, Send } from 'lucide-vue-next'

const messages = ref([])
const inputMessage = ref('')
const isLoading = ref(false)
const isConnected = ref(false)
const messagesEndRef = ref(null)

const sendMessage = async () => {
  if (!inputMessage.value.trim()) return

  const userMessage = inputMessage.value
  messages.value.push({
    role: 'user',
    content: userMessage
  })

  inputMessage.value = ''
  isLoading.value = true

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: userMessage })
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()
    messages.value.push({
      role: 'assistant',
      content: data.reply || '응답을 받지 못했습니다.'
    })
  } catch (error) {
    console.error('Chat error:', error)
    messages.value.push({
      role: 'assistant',
      content: '죄송합니다. 현재 서버에 연결할 수 없습니다.'
    })
  } finally {
    isLoading.value = false
    await nextTick()
    messagesEndRef.value?.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  isConnected.value = true
})
</script>

<style scoped>
</style>

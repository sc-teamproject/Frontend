<template>
  <div class="bg-blue-50 border-b border-blue-200 px-4 py-4 shadow-inner transition-all duration-300">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- FastAPI URL -->
      <div>
        <label class="block text-xs font-bold text-[#1e3a8a] uppercase tracking-wider mb-1">
          {{ uiText.fastApiLabel }}
        </label>
        <div class="flex gap-1.5">
          <input
            v-model="settings.fastApiUrl"
            type="text"
            :placeholder="uiText.fastApiPlaceholder"
            class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <p class="text-[10px] text-slate-400 mt-1">
          {{ uiText.fastApiHelp }}
        </p>
      </div>

      <!-- Google Maps API Key -->
      <div>
        <label class="block text-xs font-bold text-[#1e3a8a] uppercase tracking-wider mb-1">
          {{ uiText.googleKeyLabel }}
        </label>
        <input
          v-model="settings.googleApiKey"
          type="password"
          :placeholder="uiText.googleKeyPlaceholder"
          class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
        <p class="text-[10px] text-slate-400 mt-1">
          {{ uiText.googleKeyHelp }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-end gap-2">
        <button
          @click="saveSettings"
          class="bg-[#1e3a8a] hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition flex-1"
        >
          {{ uiText.saveButton }}
        </button>
        <button
          @click="resetSettings"
          class="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg transition"
        >
          {{ uiText.resetButton }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { isKorean } from '../../composables/useUiPreferences'

const settings = ref({
  fastApiUrl: 'http://localhost:8000',
  googleApiKey: ''
})

const uiText = computed(() => {
  if (isKorean.value) {
    return {
      fastApiLabel: 'FastAPI Backend URL (내일 연결할 서버 주소)',
      fastApiPlaceholder: '예: http://localhost:8000',
      fastApiHelp: '포트번호 또는 배포받으실 Render 서버의 주소를 입력하면 /api/chat과 직접 통신합니다.',
      googleKeyLabel: 'Google Maps API Key (매장 사진 및 보조 길찾기용)',
      googleKeyPlaceholder: 'AI-xxxx-xxxx-xxxx API Key를 입력하세요',
      googleKeyHelp: '입력하지 않아도 Google 공식 Static 이미지 주소와 구글 길찾기 API 링크가 기본 활성화됩니다.',
      saveButton: '설정값 적용 및 저장',
      resetButton: '초기화'
    }
  }

  return {
    fastApiLabel: 'FastAPI Backend URL (server to connect next)',
    fastApiPlaceholder: 'e.g. http://localhost:8000',
    fastApiHelp: 'Enter a port number or a deployed Render server URL to communicate directly with /api/chat.',
    googleKeyLabel: 'Google Maps API Key (for images and fallback directions)',
    googleKeyPlaceholder: 'Enter your AI-xxxx-xxxx-xxxx API key',
    googleKeyHelp: 'If left blank, Google official static image URLs and Maps direction links remain active by default.',
    saveButton: 'Save Settings',
    resetButton: 'Reset'
  }
})

const loadSettings = () => {
  const saved = localStorage.getItem('gwangju_gourmet_settings')
  if (saved) {
    settings.value = JSON.parse(saved)
  }
}

const saveSettings = () => {
  localStorage.setItem('gwangju_gourmet_settings', JSON.stringify(settings.value))
  // TODO: Show toast message
  console.log('Settings saved')
}

const resetSettings = () => {
  settings.value = {
    fastApiUrl: 'http://localhost:8000',
    googleApiKey: ''
  }
  localStorage.removeItem('gwangju_gourmet_settings')
  // TODO: Show toast message
  console.log('Settings reset')
}

onMounted(() => {
  loadSettings()
})
</script>

<style scoped>
</style>

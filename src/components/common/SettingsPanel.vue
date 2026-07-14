<template>
  <div class="bg-blue-50 border-b border-blue-200 px-4 py-4 shadow-inner transition-all duration-300">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- FastAPI URL -->
      <div>
        <label class="block text-xs font-bold text-[#1e3a8a] uppercase tracking-wider mb-1">
          FastAPI Backend URL (내일 연결할 서버 주소)
        </label>
        <div class="flex gap-1.5">
          <input
            v-model="settings.fastApiUrl"
            type="text"
            placeholder="예: http://localhost:8000"
            class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <p class="text-[10px] text-slate-400 mt-1">
          포트번호 또는 배포받으실 Render 서버의 주소를 입력하면 /api/chat과 직접 통신합니다.
        </p>
      </div>

      <!-- Google Maps API Key -->
      <div>
        <label class="block text-xs font-bold text-[#1e3a8a] uppercase tracking-wider mb-1">
          Google Maps API Key (매장 사진 및 보조 길찾기용)
        </label>
        <input
          v-model="settings.googleApiKey"
          type="password"
          placeholder="AI-xxxx-xxxx-xxxx API Key를 입력하세요"
          class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
        <p class="text-[10px] text-slate-400 mt-1">
          입력하지 않아도 Google 공식 Static 이미지 주소와 구글 길찾기 API 링크가 기본 활성화됩니다.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-end gap-2">
        <button
          @click="saveSettings"
          class="bg-[#1e3a8a] hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition flex-1"
        >
          설정값 적용 및 저장
        </button>
        <button
          @click="resetSettings"
          class="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg transition"
        >
          초기화
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const settings = ref({
  fastApiUrl: 'http://localhost:8000',
  googleApiKey: ''
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

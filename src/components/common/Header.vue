<template>
  <header class="bg-[#1e3a8a] text-white shadow-md px-4 py-3 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
      <!-- Logo -->
      <div class="flex items-center gap-2 cursor-pointer" @click="goHome">
        <div class="bg-white p-1.5 rounded-full text-[#1e3a8a]">
          <Utensils class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-xl font-bold tracking-tight">광주 맛집 파인더</h1>
          <p class="text-[9px] text-blue-200 tracking-wider">LOCAL DATA + GOOGLE API + FASTAPI CHATBOT</p>
        </div>
      </div>

      <!-- Navigation Menus -->
      <nav class="flex items-center gap-1 md:gap-4 text-sm font-medium">
        <button
          @click="goHome"
          :class="['px-3 py-1.5 rounded-md transition', isHome ? 'bg-[#172554] text-white' : 'hover:bg-blue-800 text-blue-100']"
        >
          홈
        </button>
        <button
          @click="goHome"
          :class="['px-3 py-1.5 rounded-md transition', isHome ? 'bg-[#172554] text-white' : 'hover:bg-blue-800 text-blue-100']"
        >
          맛집 목록
        </button>
        <button @click="focusOnMap" class="px-3 py-1.5 rounded-md text-blue-100 hover:bg-blue-800 transition">
          지도 보기
        </button>
        <button
          @click="goCommunity"
          :class="['px-3 py-1.5 rounded-md transition', isCommunity ? 'bg-[#172554] text-white' : 'hover:bg-blue-800 text-blue-100']"
        >
          커뮤니티
        </button>
        <button class="px-3 py-1.5 rounded-md text-blue-100 hover:bg-blue-800 transition flex items-center gap-1">
          AI 챗봇 <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>
        <button @click="showDirectionsGuide" class="px-3 py-1.5 rounded-md text-blue-100 hover:bg-blue-800 transition">
          길안내
        </button>
      </nav>

      <!-- Right Side: Search & Settings -->
      <div class="flex items-center gap-2 w-full md:w-auto">
        <!-- Search Bar -->
        <div class="relative flex-grow md:w-60">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search class="w-4 h-4" />
          </span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="식당명, 동네 이름 검색..."
            class="w-full bg-blue-950/40 border border-blue-400/30 text-white rounded-full py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-blue-200/60"
          />
        </div>
        <!-- Settings Button -->
        <button
          @click="toggleSettings"
          class="p-2 bg-blue-950/40 hover:bg-blue-800 rounded-full transition text-blue-100"
          title="API 설정 고도화"
        >
          <Settings class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Settings Panel -->
    <SettingsPanel v-if="isSettingsOpen" />
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Utensils, Search, Settings } from 'lucide-vue-next'
import SettingsPanel from './SettingsPanel.vue'

const router = useRouter()
const route = useRoute()

const searchQuery = ref('')
const isSettingsOpen = ref(false)

const isHome = computed(() => route.path === '/')
const isCommunity = computed(() => route.path === '/community')

const goHome = () => router.push('/')
const goCommunity = () => router.push('/community')
const toggleSettings = () => (isSettingsOpen.value = !isSettingsOpen.value)

const focusOnMap = () => {
  router.push('/')
  // Emit event to scroll to map - will implement via event bus or provide/inject
}

const showDirectionsGuide = () => {
  // Show directions
}
</script>

<style scoped>
</style>

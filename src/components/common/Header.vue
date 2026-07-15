<template>
  <header class="bg-[#1e3a8a] text-white shadow-md px-4 py-3 sticky top-0 z-50">
    <div class="w-full max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
      <!-- Logo -->
      <div class="flex items-center gap-2 cursor-pointer" @click="goHome">
        <div class="bg-white p-1.5 rounded-full text-[#1e3a8a]">
          <Utensils class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-xl font-bold tracking-tight">광주 맛집 파인더</h1>
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
        <button
          @click="goCommunity"
          :class="['px-3 py-1.5 rounded-md transition', isCommunity ? 'bg-[#172554] text-white' : 'hover:bg-blue-800 text-blue-100']"
        >
          커뮤니티
        </button>
      </nav>

    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Utensils } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

const isHome = computed(() => route.path === '/')
const isCommunity = computed(() => route.path === '/community')

const goHome = () => router.push('/')
const goCommunity = () => router.push('/community')
</script>

<style scoped>
</style>

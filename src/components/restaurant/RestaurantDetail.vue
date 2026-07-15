<template>
  <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5 relative overflow-hidden">
    <div class="absolute top-0 left-0 w-full h-1.5 bg-[#1e3a8a]"></div>
    <h2 class="text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">상세 정보 / 지도 / 챗봇</h2>

    <div class="flex flex-col md:flex-row gap-5 items-start">
      <!-- Detail Table -->
      <div class="flex-grow space-y-4 w-full">
        <div class="flex items-baseline justify-between gap-2 border-b border-slate-100 pb-3">
          <h3 class="text-2xl font-bold text-slate-900">{{ currentDetails.title }}</h3>
          <span class="text-sm text-slate-500 font-medium">등록일: {{ currentDate }}</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-x-3 gap-y-2 text-sm">
          <div class="md:col-span-3 text-slate-400 font-medium">지역</div>
          <div class="md:col-span-9 text-slate-800 font-semibold">광주광역시</div>

          <div class="md:col-span-3 text-slate-400 font-medium">구분</div>
          <div class="md:col-span-9 text-slate-800 font-semibold">{{ currentDetails.category }}</div>

          <div class="md:col-span-3 text-slate-400 font-medium">주소</div>
          <div class="md:col-span-9 text-slate-800">{{ currentDetails.addr1 }} {{ currentDetails.addr2 }}</div>

          <div class="md:col-span-3 text-slate-400 font-medium">연락처</div>
          <div class="md:col-span-9 text-slate-800">{{ currentDetails.tel || '정보 없음' }}</div>

          <div class="md:col-span-3 text-slate-400 font-medium">설명</div>
          <div class="md:col-span-9 text-slate-600 italic">"{{ currentDetails.description }}"</div>
        </div>
      </div>

      <!-- Restaurant Photo -->
      <div class="w-full md:w-56 h-40 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center relative shadow-inner">
        <img
          v-if="currentDetails.image"
          :src="currentDetails.image"
          @error="onImageError"
          alt="맛집 이미지"
          class="w-full h-full object-cover"
        />
        <div v-else class="text-slate-500 text-sm font-medium">이미지 없음</div>
        <div class="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
          {{ currentDetails.cpyrhtDivCd || 'Google Places Photo' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentDetails: {
    type: Object,
    default: () => ({
      title: '양동통닭',
      category: '한식',
      addr1: '전남광주통합특별시 동구 구성로 174',
      addr2: '(양동시장 근처)',
      tel: '062-364-5410',
      mapx: '126.9125968520',
      mapy: '35.1515409291',
      description: '가마솥에 바삭하게 튀겨내어 고소한 시장식 후라이드 치킨의 완벽한 표본입니다.',
      image: ''
    })
  }
})

const currentDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const onImageError = (event) => {
  event.target.style.display = 'none'
}
</script>

<style scoped>
</style>

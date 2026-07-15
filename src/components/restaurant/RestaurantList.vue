<template>
  <section class="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col max-h-[calc(100vh-140px)] min-h-[500px]">
    <!-- Header -->
    <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-xl">
      <h2 class="font-bold text-lg flex items-center gap-2">
        <ListFilter class="text-[#1e3a8a] w-5 h-5" />
        광주 맛집 목록
        <span class="text-xs font-normal text-slate-500">({{ filteredRestaurants.length }}개)</span>
      </h2>
      <div class="flex gap-1">
        <button
          v-for="category in categories"
          :key="category"
          @click="filterCategory = category"
          :class="[
            'px-2.5 py-1 text-xs rounded-full border',
            filterCategory === category
              ? 'bg-[#1e3a8a] text-white border-[#1e3a8a]'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          ]"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <div class="p-3 border-b border-slate-100 bg-white">
      <div class="relative">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          <Search class="w-4 h-4" />
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="식당명 또는 동네 검색"
          class="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
      </div>
    </div>

    <!-- Restaurant List -->
    <div class="flex-grow overflow-y-auto p-3 space-y-3">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12 text-slate-400">
        <div class="flex flex-col items-center gap-2">
          <div class="w-8 h-8 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
          <p>데이터 로드 중...</p>
        </div>
      </div>

      <!-- Restaurant Items -->
      <div v-else v-for="item in filteredRestaurants" :key="item.contentid"
        @click="selectRestaurant(item)"
        :class="[
          'p-3 rounded-lg border transition cursor-pointer flex gap-3',
          selectedId === item.contentid
            ? 'bg-blue-50/60 border-blue-400 ring-1 ring-blue-300'
            : 'bg-white border-slate-200 hover:bg-slate-50/80'
        ]"
      >
        <!-- Icon -->
        <div class="w-12 h-12 rounded-lg bg-slate-100 flex-shrink-0 flex items-center justify-center border border-slate-200">
          <UtensilsCrossed v-if="item.category === '한식'" class="text-orange-500 w-6 h-6" />
          <Cake v-else-if="item.category === '베이커리'" class="text-amber-500 w-6 h-6" />
          <Store v-else class="text-slate-500 w-6 h-6" />
        </div>

        <!-- Details -->
        <div class="flex-grow min-w-0">
          <h3 class="font-bold text-slate-900 truncate">{{ item.title }}</h3>
          <p class="text-xs text-slate-500 truncate mt-0.5">{{ item.addr1 }}</p>
          <div class="flex items-center gap-3 mt-1.5">
            <span class="text-xs font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-600">
              {{ item.category }}
            </span>
            <span class="text-xs text-amber-500 flex items-center gap-0.5 font-medium">
              <Star class="w-3.5 h-3.5 fill-amber-500" />
              {{ item.rating || '4.5' }}
            </span>
          </div>
          <!-- Action Buttons -->
          <div class="flex items-center gap-2 mt-2.5">
            <button
              @click.stop="selectRestaurant(item)"
              class="flex-1 bg-[#1e3a8a] hover:bg-blue-800 text-white text-xs font-medium py-1.5 rounded transition"
            >
              상세보기
            </button>
            <button
              @click.stop="calculateRoute(item)"
              class="flex-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-medium py-1.5 rounded transition flex items-center justify-center gap-1"
            >
              <Navigation2 class="w-3 h-3 text-blue-600" />
              길찾기
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredRestaurants.length === 0" class="text-center py-12 text-slate-400">
        <SearchCode class="w-12 h-12 mx-auto stroke-1 mb-2" />
        검색 조건에 맞는 광주 맛집이 없습니다.
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  ListFilter,
  UtensilsCrossed,
  Cake,
  Store,
  Star,
  Navigation2,
  SearchCode,
  Search
} from 'lucide-vue-next'

const emit = defineEmits(['select-restaurant'])

const selectedId = ref('132880')
const searchQuery = ref('')
const filterCategory = ref('전체')
const categories = ['전체', '한식', '일식', '중식', '양식']
const restaurants = ref([])
const isLoading = ref(true)

const fallbackImages = [
  'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=500&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500&auto=format&fit=crop&q=60'
]

// 카테고리 매핑
const getCategoryName = (cat2) => {
  const categoryMap = {
    'A0501': '한식',
    'A0502': '한식',
    'A0503': '한식',
    'A0504': '일식',
    'A0505': '중식',
    'A0506': '양식',
    'A0507': '카페',
    'A0508': '기타'
  }
  return categoryMap[cat2] || '기타'
}

// JSON 데이터 로드
const loadRestaurants = async () => {
  try {
    const response = await fetch('/restaurants.json')
    const data = await response.json()
    
    // API 데이터를 컴포넌트에 맞게 변환
    restaurants.value = data.items
      .map((item, index) => ({
        contentid: item.contentid,
        title: item.title,
        category: getCategoryName(item.cat2),
        addr1: item.addr1,
        addr2: item.addr2 || '',
        tel: item.tel || '정보 없음',
        mapx: item.mapx,
        mapy: item.mapy,
        image: item.firstimage || item.firstimage2 || fallbackImages[index % fallbackImages.length],
        description: `${item.title} - 광주광역시 ${item.addr1?.split(' ')[2] || ''}`,
        cpyrhtDivCd: item.cpyrhtDivCd || 'Google Places',
        createdtime: item.createdtime
      }))
      .slice(0, 100) // 성능을 위해 처음 100개만 로드

    if (restaurants.value.length > 0) {
      const firstRestaurant = restaurants.value[0]
      selectedId.value = firstRestaurant.contentid
      emit('select-restaurant', firstRestaurant)
    }
    
    isLoading.value = false
    console.log(`✅ ${restaurants.value.length}개의 음식점 데이터 로드 완료`)
  } catch (error) {
    console.error('❌ 데이터 로드 실패:', error)
    isLoading.value = false
  }
}

const filteredRestaurants = computed(() => {
  return restaurants.value.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.addr1.toLowerCase().includes(searchQuery.value.toLowerCase())

    let matchesCategory = true
    if (filterCategory.value === '한식') {
      matchesCategory = item.category === '한식'
    } else if (filterCategory.value === '일식') {
      matchesCategory = item.category === '일식'
    } else if (filterCategory.value === '중식') {
      matchesCategory = item.category === '중식'
    } else if (filterCategory.value === '양식') {
      matchesCategory = item.category === '양식'
    }
    return matchesSearch && matchesCategory
  })
})

const selectRestaurant = (item) => {
  selectedId.value = item.contentid
  emit('select-restaurant', item)
}

const calculateRoute = (item) => {
  const destination = item.mapy && item.mapx
    ? `${item.mapy},${item.mapx}`
    : `${item.addr1} ${item.addr2 || ''}`.trim()
  const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

onMounted(() => {
  loadRestaurants()
})

defineExpose({ selectedId, restaurants })
</script>

<style scoped>
</style>

<template>
  <section class="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col max-h-[calc(100vh-140px)] min-h-[500px]">
    <!-- Header -->
    <div class="p-4 border-b border-slate-100 flex items-center justify-between gap-2 bg-slate-50/50 rounded-t-xl">
      <h2 class="font-bold text-base lg:text-lg flex items-center gap-2 whitespace-nowrap min-w-0">
        <ListFilter class="text-[#1e3a8a] w-5 h-5" />
        광주 맛집 목록
        <span class="text-xs font-normal text-slate-500 tabular-nums inline-block w-[6ch] text-right">({{ filteredRestaurants.length }}개)</span>
      </h2>
      <div class="flex flex-nowrap gap-1 justify-end shrink-0">
        <button
          v-for="category in categories"
          :key="category"
          @click="filterCategory = category"
          :class="[
            'px-2 py-1 text-xs rounded-full border whitespace-nowrap',
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
        <!-- Left Visual (icon or selected thumbnail) -->
        <div class="w-12 h-12 rounded-lg bg-slate-100 flex-shrink-0 flex items-center justify-center border border-slate-200 overflow-hidden">
          <img
            v-if="item.hasRealImage"
            :src="item.image"
            alt="식당 썸네일"
            class="w-full h-full object-cover"
          />
          <UtensilsCrossed v-else-if="item.category === '한식'" class="text-orange-500 w-6 h-6" />
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
const categories = ['전체', '식당', '카페', '한식', '일식', '중식', '양식']
const restaurants = ref([])
const isLoading = ref(true)

// 카테고리 매핑
// cat2는 음식점 데이터에서 거의 고정(A0502)이므로 분류 키로 쓰면 전부 같은 값으로 떨어진다.
// 세부 분류인 cat3를 우선 사용하고, 없을 때 lclsSystm2로 보정한다.
const getCategoryName = (item) => {
  const cat3Map = {
    A05020100: '한식',
    A05020200: '양식',
    A05020300: '일식',
    A05020400: '중식',
    A05020900: '카페'
  }

  const lclsSystm2Map = {
    FD01: '한식',
    FD02: '중식',
    FD03: '베이커리',
    FD05: '카페'
  }

  return cat3Map[item.cat3] || lclsSystm2Map[item.lclsSystm2] || '기타'
}

// JSON 데이터 로드
const loadRestaurants = async () => {
  try {
    const response = await fetch('/restaurants.json')
    const data = await response.json()
    
    // API 데이터를 컴포넌트에 맞게 변환 (전체 데이터 사용)
    restaurants.value = data.items
      .map((item) => {
        const realImage = item.firstimage || item.firstimage2 || ''

        return {
        contentid: item.contentid,
        title: item.title,
        category: getCategoryName(item),
        addr1: item.addr1,
        addr2: item.addr2 || '',
        tel: item.tel || '정보 없음',
        mapx: item.mapx,
        mapy: item.mapy,
        image: realImage,
        hasRealImage: Boolean(realImage),
        description: `${item.title} - 광주광역시 ${item.addr1?.split(' ')[2] || ''}`,
        cpyrhtDivCd: item.cpyrhtDivCd || 'Google Places',
        createdtime: item.createdtime
      }
      })
      .sort((a, b) => {
        if (a.hasRealImage !== b.hasRealImage) {
          return a.hasRealImage ? -1 : 1
        }
        return a.title.localeCompare(b.title, 'ko-KR')
      })

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

    const isCafeCategory = item.category === '카페' || item.category === '베이커리'

    let matchesCategory = true
    if (filterCategory.value === '식당') {
      matchesCategory = !isCafeCategory
    } else if (filterCategory.value === '카페') {
      matchesCategory = isCafeCategory
    } else if (filterCategory.value !== '전체') {
      matchesCategory = item.category === filterCategory.value
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

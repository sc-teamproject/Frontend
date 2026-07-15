<template>
  <div class="w-full max-w-[1800px] mx-auto px-4 lg:px-6 py-4 flex-grow flex flex-col gap-4">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-grow">
      <RestaurantList @select-restaurant="handleSelectRestaurant" />

      <section class="lg:col-span-2 flex flex-col gap-4">
        <RestaurantDetail :current-details="selectedRestaurant" />

        <div class="grid grid-cols-1 xl:grid-cols-[700px_minmax(0,1fr)] gap-4 flex-grow min-h-[700px]">
          <RestaurantMap :selected-restaurant="selectedRestaurant" />
          <div class="xl:max-w-[520px] xl:w-full">
            <ChatBot />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import RestaurantList from '../components/restaurant/RestaurantList.vue'
import RestaurantDetail from '../components/restaurant/RestaurantDetail.vue'
import RestaurantMap from '../components/restaurant/RestaurantMap.vue'
import ChatBot from '../components/chat/ChatBot.vue'

const selectedRestaurant = ref({
  title: '양동통닭',
  category: '한식',
  addr1: '전남광주통합특별시 동구 구성로 174',
  addr2: '(양동시장 근처)',
  tel: '062-364-5410',
  mapx: '126.9125968520',
  mapy: '35.1515409291',
  description: '가마솥에 바삭하게 튀겨내어 고소한 시장식 후라이드 치킨의 완벽한 표본입니다.',
  image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60',
  cpyrhtDivCd: 'Google Places Photo'
})

const handleSelectRestaurant = (restaurant) => {
  selectedRestaurant.value = restaurant
}
</script>

<style scoped>
</style>

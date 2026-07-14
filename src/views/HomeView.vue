<template>
  <div class="max-w-7xl mx-auto w-full p-4 flex-grow flex flex-col gap-4">
    <!-- HOME & MAIN SPLIT LAYOUT -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-grow">
      
      <!-- LEFT PANEL: Restaurant List (1/3 Width) -->
      <RestaurantList />

      <!-- RIGHT PANEL: Details, Map, Chatbot (2/3 Width) -->
      <section class="lg:col-span-2 flex flex-col gap-4">
        
        <!-- TOP: Restaurant Detail Card -->
        <RestaurantDetail />

        <!-- BOTTOM: Map + Chatbot (1:1 Ratio) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow min-h-[340px]">
          <!-- Map Container -->
          <RestaurantMap />
          
          <!-- Chatbot Container -->
          <ChatBot />
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import RestaurantList from '../components/restaurant/RestaurantList.vue'
import RestaurantDetail from '../components/restaurant/RestaurantDetail.vue'
import RestaurantMap from '../components/restaurant/RestaurantMap.vue'
import ChatBot from '../components/chat/ChatBot.vue'
</script>

<style scoped>
</style>

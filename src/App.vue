<template>
  <div class="flex flex-col min-h-screen bg-slate-50">
    <!-- Header -->
    <Header />

    <!-- Main Content -->
    <main class="flex-grow">
      <router-view />
    </main>

    <!-- Footer -->
    <Footer />

    <!-- Toast Notifications -->
    <Toast />
  </div>
</template>

<script setup>
import Header from './components/common/Header.vue'
import Footer from './components/common/Footer.vue'
import Toast from './components/common/Toast.vue'
</script>

<style scoped>
</style>

<template>
  <footer class="bg-[#0f172a] text-slate-400 border-t border-slate-800 mt-auto px-4 py-6 text-xs">
    <div class="w-full max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <p class="font-semibold text-slate-200">{{ uiText.footerTitle }}</p>
        <p class="mt-1 text-slate-500">{{ uiText.footerDescription }}</p>
      </div>
      <div class="flex gap-4 text-slate-500">
        <a href="#" class="hover:text-slate-300">{{ uiText.privacyPolicy }}</a>
        <a href="#" class="hover:text-slate-300">{{ uiText.termsOfUse }}</a>
        <a href="#" class="hover:text-slate-300">{{ uiText.contactUs }}</a>
      </div>
      <div class="text-right text-slate-500">
        <p>{{ uiText.madeBy }}</p>
        <p>{{ uiText.teamMembers }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { isKorean } from '../../composables/useUiPreferences'

const uiText = computed(() => {
  if (isKorean.value) {
    return {
      footerTitle: '© 2026 Gwangju Gourmet Finder - LocalHub Team',
      footerDescription: '본 사이트는 공공데이터(한국관광공사 TourAPI 4.0 음식점 데이터)를 활용하여 정제한 실습용 결과물입니다.',
      privacyPolicy: '개인정보처리방침',
      termsOfUse: '이용약관',
      contactUs: '문의하기',
      madeBy: 'Made by Gwangju Class 3 AI Project',
      teamMembers: '이윤찬, 이승규, 김진영'
    }
  }

  return {
    footerTitle: '© 2026 Gwangju Gourmet Finder - LocalHub Team',
    footerDescription: 'This site is a practice project refined using public data from the Korea Tourism Organization TourAPI 4.0 restaurant dataset.',
    privacyPolicy: 'Privacy Policy',
    termsOfUse: 'Terms of Use',
    contactUs: 'Contact Us',
    madeBy: 'Made by Gwangju Class 3 AI Project',
    teamMembers: 'Yoonchan Lee, Seunggyu Lee, Jinyoung Kim'
  }
})
</script>

<style scoped>
</style>

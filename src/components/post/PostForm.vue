<template>
  <div>
    <h2 class="text-2xl font-bold text-slate-900 mb-4">새 게시글 작성</h2>

    <form @submit.prevent="submitForm" class="space-y-4">
      <!-- Category -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">카테고리</label>
        <div class="flex gap-2">
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            @click="formData.category = cat"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-medium border transition',
              formData.category === cat
                ? 'bg-[#1e3a8a] text-white border-[#1e3a8a]'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            ]"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Restaurant Name -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">식당 이름</label>
        <input
          v-model="formData.restaurantName"
          type="text"
          placeholder="예: 양동통닭, 김밥천국"
          maxlength="50"
          class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <!-- Title -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">제목</label>
        <input
          v-model="formData.title"
          type="text"
          placeholder="게시글 제목을 입력하세요 (50자 이내)"
          maxlength="50"
          class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
        <p class="text-xs text-slate-500 mt-1">{{ formData.title.length }}/50</p>
      </div>

      <!-- Content -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">내용</label>
        <textarea
          v-model="formData.content"
          placeholder="게시글 내용을 작성하세요 (1000자 이내)"
          maxlength="1000"
          rows="6"
          class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none"
        ></textarea>
        <p class="text-xs text-slate-500 mt-1">{{ formData.content.length }}/1000</p>
      </div>

      <!-- Password -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">수정/삭제 비밀번호</label>
        <input
          v-model="formData.password"
          type="password"
          placeholder="비밀번호를 입력하세요"
          class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <!-- Buttons -->
      <div class="flex gap-2 justify-end border-t border-slate-100 pt-4">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition text-sm"
        >
          취소
        </button>
        <button
          type="submit"
          :disabled="!formData.title.trim() || !formData.content.trim()"
          class="px-4 py-2 rounded-lg bg-[#1e3a8a] text-white font-medium hover:bg-blue-800 disabled:bg-slate-300 transition text-sm"
        >
          작성하기
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const categories = ['후기', '팁', '질문', '기타']

const formData = ref({
  title: '',
  content: '',
  category: '후기',
  restaurantName: '',
  password: ''
})

const emit = defineEmits(['submit', 'close'])

const submitForm = () => {
  emit('submit', {
    title: formData.value.title,
    content: formData.value.content,
    category: formData.value.category,
    restaurantName: formData.value.restaurantName,
    password: formData.value.password
  })
  formData.value = { title: '', content: '', category: '후기', restaurantName: '', password: '' }
}
</script>

<style scoped>
</style>

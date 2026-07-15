<template>
  <div>
    <h2 class="text-2xl font-bold text-slate-900 mb-4">{{ uiText.title }}</h2>

    <form @submit.prevent="submitForm" class="space-y-4">
      <!-- Category -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">{{ uiText.categoryLabel }}</label>
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
        <label class="block text-sm font-semibold text-slate-700 mb-1">{{ uiText.restaurantLabel }}</label>
        <input
          v-model="formData.restaurantName"
          type="text"
          :placeholder="uiText.restaurantPlaceholder"
          maxlength="50"
          class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <!-- Title -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">{{ uiText.titleLabel }}</label>
        <input
          v-model="formData.title"
          type="text"
          :placeholder="uiText.titlePlaceholder"
          maxlength="50"
          class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
        <p class="text-xs text-slate-500 mt-1">{{ formData.title.length }}/50</p>
      </div>

      <!-- Content -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">{{ uiText.contentLabel }}</label>
        <textarea
          v-model="formData.content"
          :placeholder="uiText.contentPlaceholder"
          maxlength="1000"
          rows="6"
          class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none"
        ></textarea>
        <p class="text-xs text-slate-500 mt-1">{{ formData.content.length }}/1000</p>
      </div>

      <!-- Password -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">{{ uiText.passwordLabel }}</label>
        <input
          v-model="formData.password"
          type="password"
          :placeholder="uiText.passwordPlaceholder"
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
          {{ uiText.cancel }}
        </button>
        <button
          type="submit"
          :disabled="!formData.title.trim() || !formData.content.trim()"
          class="px-4 py-2 rounded-lg bg-[#1e3a8a] text-white font-medium hover:bg-blue-800 disabled:bg-slate-300 transition text-sm"
        >
          {{ uiText.submit }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { isKorean } from '../../composables/useUiPreferences'

const categories = computed(() => (isKorean.value ? ['후기', '팁', '질문', '기타'] : ['Review', 'Tip', 'Question', 'Other']))

const uiText = computed(() => {
  if (isKorean.value) {
    return {
      title: '새 게시글 작성',
      categoryLabel: '카테고리',
      restaurantLabel: '식당 이름',
      restaurantPlaceholder: '예: 양동통닭, 김밥천국',
      titleLabel: '제목',
      titlePlaceholder: '게시글 제목을 입력하세요 (50자 이내)',
      contentLabel: '내용',
      contentPlaceholder: '게시글 내용을 작성하세요 (1000자 이내)',
      passwordLabel: '수정/삭제 비밀번호',
      passwordPlaceholder: '비밀번호를 입력하세요',
      cancel: '취소',
      submit: '작성하기'
    }
  }

  return {
    title: 'Create New Post',
    categoryLabel: 'Category',
    restaurantLabel: 'Restaurant Name',
    restaurantPlaceholder: 'e.g. Yangdong Tongdak, Gimbap Heaven',
    titleLabel: 'Title',
    titlePlaceholder: 'Enter a post title (up to 50 characters)',
    contentLabel: 'Content',
    contentPlaceholder: 'Write the post content (up to 1000 characters)',
    passwordLabel: 'Edit/Delete Password',
    passwordPlaceholder: 'Enter a password',
    cancel: 'Cancel',
    submit: 'Submit'
  }
})

const formData = ref({
  title: '',
  content: '',
  category: '후기',
  restaurantName: '',
  password: ''
})

watch(isKorean, (value) => {
  const current = formData.value.category
  if (value) {
    if (['Review', 'Tip', 'Question', 'Other'].includes(current)) {
      const mapped = { Review: '후기', Tip: '팁', Question: '질문', Other: '기타' }
      formData.value.category = mapped[current]
    }
  } else if (['후기', '팁', '질문', '기타'].includes(current)) {
    const mapped = { 후기: 'Review', 팁: 'Tip', 질문: 'Question', 기타: 'Other' }
    formData.value.category = mapped[current]
  }
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
  formData.value = {
    title: '',
    content: '',
    category: isKorean.value ? '후기' : 'Review',
    restaurantName: '',
    password: ''
  }
}
</script>

<style scoped>
</style>

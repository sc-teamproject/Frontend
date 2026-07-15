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
      <div class="relative">
        <label class="block text-sm font-semibold text-slate-700 mb-1">{{ uiText.restaurantLabel }}</label>
        <input
          v-model="restaurantSearch"
          type="text"
          :placeholder="uiText.restaurantPlaceholder"
          maxlength="50"
          class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
          @focus="showRestaurantOptions = true"
          @blur="setTimeout(() => { showRestaurantOptions = false }, 120)"
        />
        <div class="mt-1 text-xs text-slate-500">{{ uiText.restaurantHelp }}</div>

        <div v-if="showRestaurantOptions" class="absolute z-20 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
          <button
            type="button"
            class="block w-full border-b border-slate-100 px-3 py-2 text-left text-sm font-semibold text-blue-700 hover:bg-blue-50"
            @mousedown.prevent="selectOtherRestaurant"
          >
            {{ uiText.otherRestaurant }}
          </button>
          <button
            v-for="name in filteredRestaurantOptions"
            :key="name"
            type="button"
            class="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
            @mousedown.prevent="selectRestaurantName(name)"
          >
            {{ name }}
          </button>
          <div v-if="filteredRestaurantOptions.length === 0" class="px-3 py-2 text-xs text-slate-400">
            {{ uiText.noRestaurantResult }}
          </div>
        </div>

        <div v-if="formData.restaurantName" class="mt-2 text-xs text-emerald-700">
          {{ uiText.selectedRestaurant }}: <span class="font-semibold">{{ formData.restaurantName }}</span>
        </div>
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

      <!-- Likes -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">{{ uiText.likesLabel }}</label>
        <div class="flex items-center gap-1">
          <button
            v-for="star in [1, 2, 3, 4, 5]"
            :key="star"
            type="button"
            class="rounded-md p-1 transition"
            @click="setLikeCount(star)"
          >
            <Star
              class="h-6 w-6"
              :class="star <= formData.likeCount ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'"
            />
          </button>
          <button
            type="button"
            class="ml-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
            @click="setLikeCount(0)"
          >
            {{ uiText.clearLikes }}
          </button>
        </div>
        <p class="mt-1 text-xs text-slate-500">{{ formData.likeCount }}/5</p>
      </div>

      <!-- Image -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">{{ uiText.imageLabel }}</label>
        <input
          ref="imageInputRef"
          type="file"
          accept="image/*"
          class="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
          @change="handleImageChange"
        />

        <div v-if="imagePreview" class="mt-3 border border-slate-200 rounded-lg p-2">
          <img :src="imagePreview" :alt="uiText.imagePreviewAlt" class="max-h-56 w-auto rounded-md object-cover" />
          <button
            type="button"
            class="mt-2 text-xs font-semibold text-rose-600 hover:text-rose-800"
            @click="removeImage"
          >
            {{ uiText.removeImage }}
          </button>
        </div>
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
import { computed, onMounted, ref, watch } from 'vue'
import { Star } from 'lucide-vue-next'
import { isKorean } from '../../composables/useUiPreferences'

const props = defineProps({
  initialRestaurantName: {
    type: String,
    default: ''
  }
})

const categories = computed(() => (isKorean.value ? ['후기', '팁', '질문', '기타'] : ['Review', 'Tip', 'Question', 'Other']))

const uiText = computed(() => {
  if (isKorean.value) {
    return {
      title: '새 게시글 작성',
      categoryLabel: '카테고리',
      restaurantLabel: '식당 이름',
      restaurantPlaceholder: '식당 이름을 검색해서 선택하세요',
      restaurantHelp: '목록에서 선택하거나 [기타]를 선택하세요.',
      otherRestaurant: '기타',
      selectedRestaurant: '선택된 식당',
      noRestaurantResult: '검색 결과가 없습니다.',
      titleLabel: '제목',
      titlePlaceholder: '게시글 제목을 입력하세요 (50자 이내)',
      contentLabel: '내용',
      contentPlaceholder: '게시글 내용을 작성하세요 (1000자 이내)',
      passwordLabel: '수정/삭제 비밀번호',
      passwordPlaceholder: '비밀번호를 입력하세요',
      likesLabel: '좋아요 수',
      clearLikes: '초기화',
      imageLabel: '이미지',
      imagePreviewAlt: '업로드 이미지 미리보기',
      removeImage: '이미지 삭제',
      cancel: '취소',
      submit: '작성하기'
    }
  }

  return {
    title: 'Create New Post',
    categoryLabel: 'Category',
    restaurantLabel: 'Restaurant Name',
    restaurantPlaceholder: 'Search and select a restaurant name',
    restaurantHelp: 'Select from the list or choose [Other].',
    otherRestaurant: 'Other',
    selectedRestaurant: 'Selected Restaurant',
    noRestaurantResult: 'No matching restaurants found.',
    titleLabel: 'Title',
    titlePlaceholder: 'Enter a post title (up to 50 characters)',
    contentLabel: 'Content',
    contentPlaceholder: 'Write the post content (up to 1000 characters)',
    passwordLabel: 'Edit/Delete Password',
    passwordPlaceholder: 'Enter a password',
    likesLabel: 'Likes',
    clearLikes: 'Clear',
    imageLabel: 'Image',
    imagePreviewAlt: 'Uploaded image preview',
    removeImage: 'Remove Image',
    cancel: 'Cancel',
    submit: 'Submit'
  }
})

const formData = ref({
  title: '',
  content: '',
  category: '후기',
  restaurantName: '',
  password: '',
  likeCount: 0
})

const imageInputRef = ref(null)
const imageFile = ref(null)
const imagePreview = ref('')
const restaurantSearch = ref('')
const restaurantOptions = ref([])
const showRestaurantOptions = ref(false)

const getRestaurantDataUrl = () => (isKorean.value ? '/restaurants.json' : '/restaurants.en.json')

const loadRestaurantOptions = async () => {
  try {
    const response = await fetch(getRestaurantDataUrl())
    const data = await response.json()
    const options = (data.items || [])
      .map((item) => (isKorean.value ? item.title : (item.titleEn || item.title)))
      .filter(Boolean)

    restaurantOptions.value = [...new Set(options)].sort((a, b) => a.localeCompare(b, isKorean.value ? 'ko-KR' : 'en-US'))
  } catch (error) {
    console.error('Failed to load restaurant options', error)
    restaurantOptions.value = []
  }
}

const filteredRestaurantOptions = computed(() => {
  const query = restaurantSearch.value.trim().toLowerCase()
  if (!query) return restaurantOptions.value.slice(0, 8)
  return restaurantOptions.value.filter((name) => name.toLowerCase().includes(query)).slice(0, 8)
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

watch(
  isKorean,
  async () => {
    await loadRestaurantOptions()
  }
)

watch(restaurantSearch, (value) => {
  if ((value || '').trim() !== (formData.value.restaurantName || '').trim()) {
    formData.value.restaurantName = ''
  }
})

watch(
  () => props.initialRestaurantName,
  (value) => {
    const restaurantName = (value || '').trim()
    if (restaurantName) {
      formData.value.restaurantName = restaurantName
      restaurantSearch.value = restaurantName
    }
  },
  { immediate: true }
)

const emit = defineEmits(['submit', 'close'])

const handleImageChange = (event) => {
  const file = event.target.files?.[0]
  if (!file) {
    imageFile.value = null
    imagePreview.value = ''
    return
  }

  imageFile.value = file
  const reader = new FileReader()
  reader.onload = () => {
    imagePreview.value = typeof reader.result === 'string' ? reader.result : ''
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  imageFile.value = null
  imagePreview.value = ''
  if (imageInputRef.value) {
    imageInputRef.value.value = ''
  }
}

const setLikeCount = (count) => {
  const safeCount = Math.max(0, Math.min(5, Number(count) || 0))
  formData.value.likeCount = formData.value.likeCount === safeCount ? 0 : safeCount
}

const selectRestaurantName = (name) => {
  formData.value.restaurantName = name
  restaurantSearch.value = name
  showRestaurantOptions.value = false
}

const selectOtherRestaurant = () => {
  selectRestaurantName(uiText.value.otherRestaurant)
}

const submitForm = () => {
  emit('submit', {
    title: formData.value.title,
    content: formData.value.content,
    category: formData.value.category,
    restaurantName: formData.value.restaurantName,
    password: formData.value.password,
    likeCount: Math.max(0, Math.min(5, Number(formData.value.likeCount) || 0)),
    imageFile: imageFile.value,
    imagePreview: imagePreview.value
  })

  formData.value = {
    title: '',
    content: '',
    category: isKorean.value ? '후기' : 'Review',
    restaurantName: '',
    password: '',
    likeCount: 0
  }
  restaurantSearch.value = ''
  removeImage()
}

onMounted(() => {
  loadRestaurantOptions()
})
</script>

<style scoped>
</style>

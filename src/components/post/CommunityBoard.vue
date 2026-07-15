<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">{{ uiText.title }}</h1>
          <p class="text-xs text-slate-500 mt-1">
            {{ uiText.subtitle }}
          </p>
        </div>
        <button
          @click="showForm = true"
          class="bg-[#1e3a8a] hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          <Plus class="w-4 h-4" />
          {{ uiText.createPost }}
        </button>
      </div>

      <!-- Search -->
      <div class="mb-4 flex items-center gap-2">
        <input
          v-model="searchInput"
          type="text"
          :placeholder="uiText.searchPlaceholder"
          class="min-w-0 flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          @keyup.enter="handleSearch"
        />
        <div class="flex shrink-0 gap-2 whitespace-nowrap">
          <button
            type="button"
            class="rounded-lg bg-[#1e3a8a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 whitespace-nowrap"
            @click="handleSearch"
          >
            {{ uiText.searchButton }}
          </button>
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 whitespace-nowrap"
            @click="resetSearch"
          >
            {{ uiText.resetButton }}
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-4 gap-3 text-xs">
        <div class="bg-blue-50 border border-blue-100 rounded-lg p-2.5 text-center">
          <p class="text-lg font-bold text-[#1e3a8a]">{{ totalPosts }}</p>
          <p class="text-slate-600">{{ uiText.totalPosts }}</p>
        </div>
        <div class="bg-purple-50 border border-purple-100 rounded-lg p-2.5 text-center">
          <p class="text-lg font-bold text-purple-600">{{ todayPosts }}</p>
          <p class="text-slate-600">{{ uiText.today }}</p>
        </div>
        <div class="bg-emerald-50 border border-emerald-100 rounded-lg p-2.5 text-center">
          <p class="text-lg font-bold text-emerald-600">{{ weekPosts }}</p>
          <p class="text-slate-600">{{ uiText.week }}</p>
        </div>
        <div class="bg-amber-50 border border-amber-100 rounded-lg p-2.5 text-center">
          <p class="text-lg font-bold text-amber-600">{{ totalComments }}</p>
          <p class="text-slate-600">{{ uiText.comments }}</p>
        </div>
      </div>
    </div>

    <!-- Post Form Modal -->
    <Transition name="fade">
      <div
        v-if="showForm"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
        @click="showForm = false"
      >
        <div @click.stop class="bg-white rounded-xl shadow-lg border border-slate-200 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <PostForm :initial-restaurant-name="prefillRestaurantName" @submit="addPost" @close="showForm = false" />
        </div>
      </div>
    </Transition>

    <!-- Posts Table -->
    <PostTable :posts="filteredPosts" @open-detail="openPostDetail" @delete="deletePost" />

    <div
      v-if="appliedKeyword && filteredPosts.length === 0"
      class="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500"
    >
      {{ uiText.noSearchResult }}
    </div>

    <!-- Detail Modal -->
    <Transition name="fade">
      <div
        v-if="selectedPost"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
        @click="selectedPost = null"
      >
        <div @click.stop class="bg-white rounded-xl shadow-lg border border-slate-200 p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Post Detail -->
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-slate-900 mb-2">{{ selectedPost.title }}</h2>
            <div class="flex items-center justify-between text-xs text-slate-500 pb-4 border-b border-slate-100">
              <span>{{ uiText.anonymousAuthor }} • {{ selectedPost.createdAt }}</span>
              <span class="bg-slate-100 px-2 py-1 rounded">{{ selectedPost.category }}</span>
            </div>
            <div class="mt-3 inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700">
              <span>{{ uiText.likesLabel }}:</span>
              <div class="flex items-center gap-0.5">
                <Star
                  v-for="star in [1, 2, 3, 4, 5]"
                  :key="`detail-like-${star}`"
                  class="h-3.5 w-3.5"
                  :class="star <= (selectedPost.likeCount || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'"
                />
              </div>
              <span>{{ selectedPost.likeCount || 0 }}/5</span>
            </div>
            <div v-if="selectedPost.restaurantName" class="mt-3 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              {{ uiText.restaurantLabel }}: {{ selectedPost.restaurantName }}
            </div>
            <div v-if="selectedPost.imageUrl" class="mt-4">
              <img :src="selectedPost.imageUrl" :alt="uiText.postImageAlt" class="max-h-80 w-auto rounded-lg border border-slate-200 object-cover" />
            </div>
            <div class="mt-4 text-sm text-slate-700 whitespace-pre-wrap">{{ selectedPost.content }}</div>
          </div>

          <!-- Comments -->
          <CommentSection :post-id="selectedPost.id" :comments="selectedPost.comments" @comment-added="handleCommentAdded" @comment-deleted="handleCommentDeleted" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Plus, Star } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import PostForm from './PostForm.vue'
import PostTable from './PostTable.vue'
import CommentSection from './CommentSection.vue'
import { getPosts, createPost, deletePost as deletePostApi, incrementViewCount } from '../../api/postApi'
import { isKorean } from '../../composables/useUiPreferences'

const route = useRoute()
const router = useRouter()
const POST_META_STORAGE_KEY = 'community.post.meta.v1'

const loadStoredPostMeta = () => {
  try {
    const raw = localStorage.getItem(POST_META_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch (error) {
    console.error('Failed to load post meta from localStorage', error)
    return {}
  }
}

const saveStoredPostMeta = (meta) => {
  try {
    localStorage.setItem(POST_META_STORAGE_KEY, JSON.stringify(meta))
  } catch (error) {
    console.error('Failed to save post meta to localStorage', error)
  }
}

const showForm = ref(false)
const selectedPost = ref(null)
const posts = ref([])
const loading = ref(false)
const searchInput = ref('')
const appliedKeyword = ref('')
const prefillRestaurantName = ref('')
const localPostMeta = ref(loadStoredPostMeta())

const getPostMeta = (postId) => {
  if (!postId) return {}
  return localPostMeta.value[String(postId)] || {}
}

const upsertPostMeta = (postId, meta) => {
  if (!postId) return
  const key = String(postId)
  localPostMeta.value = {
    ...localPostMeta.value,
    [key]: {
      ...(localPostMeta.value[key] || {}),
      ...meta
    }
  }
  saveStoredPostMeta(localPostMeta.value)
}

const removePostMeta = (postId) => {
  if (!postId) return
  const key = String(postId)
  const nextMeta = { ...localPostMeta.value }
  delete nextMeta[key]
  localPostMeta.value = nextMeta
  saveStoredPostMeta(localPostMeta.value)
}

const filteredPosts = computed(() => {
  const keyword = appliedKeyword.value.trim().toLowerCase()
  if (!keyword) return posts.value

  return posts.value.filter((post) => {
    const title = (post.title || '').toLowerCase()
    const content = (post.content || '').toLowerCase()
    const restaurant = (post.restaurantName || '').toLowerCase()
    return title.includes(keyword) || content.includes(keyword) || restaurant.includes(keyword)
  })
})

const getDateKey = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

const getTodayKey = () => new Date().toISOString().slice(0, 10)

const getWeekStartKey = () => {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() - 6)
  return date.toISOString().slice(0, 10)
}

const totalPosts = computed(() => posts.value.length)
const todayPosts = computed(() => {
  const todayKey = getTodayKey()
  return posts.value.filter((post) => getDateKey(post.createdAt) === todayKey).length
})
const weekPosts = computed(() => {
  const weekStartKey = getWeekStartKey()
  return posts.value.filter((post) => {
    const postDateKey = getDateKey(post.createdAt)
    return postDateKey >= weekStartKey && postDateKey <= getTodayKey()
  }).length
})
const totalComments = computed(() => posts.value.reduce((sum, post) => sum + (post.commentCount || 0), 0))

const uiText = computed(() => {
  if (isKorean.value) {
    return {
      title: '광주 맛집 커뮤니티 게시판',
      subtitle: '🔓 완전 익명 게시판 - 누구든 자유롭게 후기, 팁, 질문을 올려주세요!',
      createPost: '새 게시글 작성',
      totalPosts: '전체 게시글',
      today: '오늘',
      week: '이번 주',
      comments: '댓글',
      anonymousAuthor: '익명 작성자',
      restaurantLabel: '식당',
      likesLabel: '좋아요',
      postImageAlt: '게시글 이미지',
      searchPlaceholder: '제목/내용/식당명으로 검색',
      searchButton: '검색',
      resetButton: '초기화',
      noSearchResult: '검색 결과가 없습니다.'
    }
  }

  return {
    title: 'Gwangju Food Community Board',
    subtitle: '🔓 Fully anonymous board - anyone can freely share reviews, tips, and questions!',
    createPost: 'Write Post',
    totalPosts: 'Total Posts',
    today: 'Today',
    week: 'This Week',
    comments: 'Comments',
    anonymousAuthor: 'Anonymous Author',
    restaurantLabel: 'Restaurant',
    likesLabel: 'Likes',
    postImageAlt: 'Post image',
    searchPlaceholder: 'Search by title/content/restaurant',
    searchButton: 'Search',
    resetButton: 'Reset',
    noSearchResult: 'No matching posts found.'
  }
})

const normalizePostPayload = (payload) => payload?.data || payload

const mapPostToViewModel = (post, fallback = {}) => {
  const normalized = normalizePostPayload(post) || {}
  const localMeta = getPostMeta(normalized.id)
  const fallbackTitle = fallback.title || ''
  const fallbackContent = fallback.content || ''
  const firstImageFromList = Array.isArray(normalized.images) && normalized.images.length > 0
    ? (normalized.images[0]?.image_url || normalized.images[0]?.imageUrl || normalized.images[0]?.url || normalized.images[0])
    : ''

  const imageCandidate = normalized.image_url || normalized.imageUrl || normalized.image || firstImageFromList || localMeta.imageUrl || fallback.imageUrl || ''
  const resolvedImageUrl = typeof imageCandidate === 'string' && imageCandidate.startsWith('/uploads')
    ? imageCandidate
    : imageCandidate

  return {
    id: normalized.id,
    title: normalized.title || fallbackTitle,
    category: normalized.category || localMeta.category || fallback.category || (isKorean.value ? '기타' : 'Other'),
    restaurantName: normalized.restaurant_name || normalized.restaurantName || localMeta.restaurantName || fallback.restaurantName || '',
    content: normalized.content || fallbackContent,
    author: normalized.nickname || (isKorean.value ? '익명' : 'Anonymous'),
    createdAt: normalized.created_at?.slice(0, 10) || normalized.createdAt?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    views: normalized.view_count || normalized.viewCount || 0,
    likeCount: localMeta.likeCount ?? normalized.like_count ?? normalized.likeCount ?? fallback.likeCount ?? 0,
    imageUrl: resolvedImageUrl,
    commentCount: normalized.comment_count || normalized.commentCount || (normalized.comments?.length || 0),
    comments: normalized.comments || []
  }
}

const loadPosts = async (keyword = '') => {
  loading.value = true
  try {
    const data = await getPosts(1, 20, keyword)
    posts.value = (data.items || []).map((post) => mapPostToViewModel(post))
  } catch (error) {
    console.error('Failed to load posts', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = async () => {
  appliedKeyword.value = searchInput.value.trim()
  await loadPosts(appliedKeyword.value)
}

const resetSearch = async () => {
  searchInput.value = ''
  appliedKeyword.value = ''
  await loadPosts('')
}

const applyWriteQuery = async () => {
  const shouldOpenForm = route.query.openForm === '1'
  const restaurantName = typeof route.query.restaurantName === 'string' ? route.query.restaurantName.trim() : ''

  if (!shouldOpenForm) return

  prefillRestaurantName.value = restaurantName
  showForm.value = true

  const nextQuery = { ...route.query }
  delete nextQuery.openForm
  delete nextQuery.restaurantName
  await router.replace({ query: nextQuery })
}

const addPost = async (newPost) => {
  try {
    const created = await createPost({
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      restaurant_name: newPost.restaurantName,
      like_count: Number(newPost.likeCount) || 0,
      imageFile: newPost.imageFile,
      password: newPost.password || '1234'
    })

    const createdPost = mapPostToViewModel(created, {
      title: newPost.title,
      content: newPost.content,
      restaurantName: newPost.restaurantName,
      likeCount: Number(newPost.likeCount) || 0,
      imageUrl: newPost.imagePreview || ''
    })

    if (createdPost.id) {
      upsertPostMeta(createdPost.id, {
        category: newPost.category,
        restaurantName: newPost.restaurantName,
        likeCount: Number(newPost.likeCount) || 0,
        imageUrl: newPost.imagePreview || ''
      })
      posts.value = [createdPost, ...posts.value.filter((post) => post.id !== createdPost.id)]
    } else {
      await loadPosts(appliedKeyword.value)
    }

    showForm.value = false
  } catch (error) {
    console.error('Failed to create post', error)
    alert(isKorean.value ? '게시글 작성에 실패했습니다.' : 'Failed to create the post.')
  }
}

const deletePost = async (postId) => {
  if (!confirm(isKorean.value ? '정말 삭제하시겠습니까?' : 'Are you sure you want to delete it?')) return
  try {
    await deletePostApi(postId, prompt(isKorean.value ? '삭제를 위해 비밀번호를 입력하세요' : 'Enter the password to delete') || '1234')
    removePostMeta(postId)
    await loadPosts(appliedKeyword.value)
  } catch (error) {
    console.error('Failed to delete post', error)
    alert(isKorean.value ? '게시글 삭제에 실패했습니다.' : 'Failed to delete the post.')
  }
}

const openPostDetail = async (post) => {
  try {
    const updated = await incrementViewCount(post.id)
    const mergedPost = mapPostToViewModel(updated, {
      title: post.title,
      content: post.content,
      restaurantName: post.restaurantName,
      likeCount: post.likeCount,
      imageUrl: post.imageUrl
    })
    selectedPost.value = {
      ...post,
      ...mergedPost,
      commentCount: mergedPost.commentCount,
      comments: mergedPost.comments
    }

    const index = posts.value.findIndex((item) => item.id === post.id)
    if (index !== -1) {
      posts.value[index].views = mergedPost.views
      posts.value[index].commentCount = mergedPost.commentCount
      posts.value[index].restaurantName = mergedPost.restaurantName
      posts.value[index].likeCount = mergedPost.likeCount
      posts.value[index].imageUrl = mergedPost.imageUrl
    }
  } catch (error) {
    console.error('Failed to open post detail', error)
    selectedPost.value = post
  }
}

const handleCommentAdded = (comment) => {
  if (!selectedPost.value) return
  selectedPost.value.comments = [...selectedPost.value.comments, comment]
  selectedPost.value.commentCount = (selectedPost.value.commentCount || 0) + 1

  const index = posts.value.findIndex((item) => item.id === selectedPost.value.id)
  if (index !== -1) {
    posts.value[index].commentCount = (posts.value[index].commentCount || 0) + 1
  }
}

const handleCommentDeleted = (commentId) => {
  if (!selectedPost.value) return
  selectedPost.value.comments = selectedPost.value.comments.filter((comment) => comment.id !== commentId)
  selectedPost.value.commentCount = Math.max(0, (selectedPost.value.commentCount || 0) - 1)

  const index = posts.value.findIndex((item) => item.id === selectedPost.value.id)
  if (index !== -1) {
    posts.value[index].commentCount = Math.max(0, (posts.value[index].commentCount || 0) - 1)
  }
}

onMounted(() => {
  loadPosts()
  applyWriteQuery()
})

watch(
  () => route.query,
  () => {
    applyWriteQuery()
  }
)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">광주 맛집 커뮤니티 게시판</h1>
          <p class="text-xs text-slate-500 mt-1">
            🔓 완전 익명 게시판 - 누구든 자유롭게 후기, 팁, 질문을 올려주세요!
          </p>
        </div>
        <button
          @click="showForm = true"
          class="bg-[#1e3a8a] hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          <Plus class="w-4 h-4" />
          새 게시글 작성
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-4 gap-3 text-xs">
        <div class="bg-blue-50 border border-blue-100 rounded-lg p-2.5 text-center">
          <p class="text-lg font-bold text-[#1e3a8a]">{{ totalPosts }}</p>
          <p class="text-slate-600">전체 게시글</p>
        </div>
        <div class="bg-purple-50 border border-purple-100 rounded-lg p-2.5 text-center">
          <p class="text-lg font-bold text-purple-600">{{ todayPosts }}</p>
          <p class="text-slate-600">오늘</p>
        </div>
        <div class="bg-emerald-50 border border-emerald-100 rounded-lg p-2.5 text-center">
          <p class="text-lg font-bold text-emerald-600">{{ weekPosts }}</p>
          <p class="text-slate-600">이번 주</p>
        </div>
        <div class="bg-amber-50 border border-amber-100 rounded-lg p-2.5 text-center">
          <p class="text-lg font-bold text-amber-600">{{ totalComments }}</p>
          <p class="text-slate-600">댓글</p>
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
          <PostForm @submit="addPost" @close="showForm = false" />
        </div>
      </div>
    </Transition>

    <!-- Posts Table -->
    <PostTable :posts="posts" @open-detail="selectedPost = $event" @delete="deletePost" />

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
              <span>익명 작성자 • {{ selectedPost.createdAt }}</span>
              <span class="bg-slate-100 px-2 py-1 rounded">{{ selectedPost.category }}</span>
            </div>
            <div class="mt-4 text-sm text-slate-700 whitespace-pre-wrap">{{ selectedPost.content }}</div>
          </div>

          <!-- Comments -->
          <CommentSection :post-id="selectedPost.id" :comments="selectedPost.comments" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus } from 'lucide-vue-next'
import PostForm from './PostForm.vue'
import PostTable from './PostTable.vue'
import CommentSection from './CommentSection.vue'

const showForm = ref(false)
const selectedPost = ref(null)

// Sample posts data
const posts = ref([
  {
    id: 1,
    title: '양동통닭 정말 맛있어요!',
    category: '후기',
    content: '가마솥에 튀긴 치킨이 정말 바삭하고 맛있어요. 양도 많고 가격도 합리적입니다. 강추합니다!',
    author: '익명',
    createdAt: '2024-01-15',
    views: 124,
    comments: [
      { id: 1, content: '저도 먹어봤는데 정말 좋더라구요!', author: '익명', createdAt: '2024-01-15' }
    ]
  },
  {
    id: 2,
    title: '궁전제과 어디가 맛있나요?',
    category: '질문',
    content: '궁전제과가 유명하다고 해서 가봤는데 뭘 먹어야 할지 모르겠어요. 추천 메뉴 있으신가요?',
    author: '익명',
    createdAt: '2024-01-14',
    views: 89,
    comments: [
      { id: 1, content: '크림팥빵이 제일 유명합니다!', author: '익명', createdAt: '2024-01-14' }
    ]
  },
  {
    id: 3,
    title: '새로운 맛집 발견',
    category: '팁',
    content: '양동 근처에 새로 생긴 카페가 있는데 정말 좋아요. 실내도 깔끔하고 커피도 맛있습니다.',
    author: '익명',
    createdAt: '2024-01-13',
    views: 156,
    comments: []
  }
])

const totalPosts = computed(() => posts.value.length)
const todayPosts = computed(() => posts.value.filter(p => p.createdAt === '2024-01-15').length)
const weekPosts = computed(
  () => posts.value.length // Simplified for demo
)
const totalComments = computed(() =>
  posts.value.reduce((sum, post) => sum + post.comments.length, 0)
)

const addPost = (newPost) => {
  posts.value.unshift({
    id: posts.value.length + 1,
    ...newPost,
    createdAt: new Date().toISOString().split('T')[0],
    views: 0,
    comments: []
  })
  showForm.value = false
}

const deletePost = (postId) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    posts.value = posts.value.filter(p => p.id !== postId)
  }
}
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

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
          <PostForm @submit="addPost" @close="showForm = false" />
        </div>
      </div>
    </Transition>

    <!-- Posts Table -->
    <PostTable :posts="posts" @open-detail="openPostDetail" @delete="deletePost" />

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
            <div v-if="selectedPost.restaurantName" class="mt-3 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              {{ uiText.restaurantLabel }}: {{ selectedPost.restaurantName }}
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
import { ref, computed, onMounted } from 'vue'
import { Plus } from 'lucide-vue-next'
import PostForm from './PostForm.vue'
import PostTable from './PostTable.vue'
import CommentSection from './CommentSection.vue'
import { getPosts, createPost, deletePost as deletePostApi, incrementViewCount } from '../../api/postApi'
import { isKorean } from '../../composables/useUiPreferences'

const showForm = ref(false)
const selectedPost = ref(null)
const posts = ref([])
const loading = ref(false)

const totalPosts = computed(() => posts.value.length)
const todayPosts = computed(() => 0)
const weekPosts = computed(() => 0)
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
      restaurantLabel: '식당'
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
    restaurantLabel: 'Restaurant'
  }
})

const loadPosts = async () => {
  loading.value = true
  try {
    const data = await getPosts(1, 20)
    posts.value = (data.items || []).map((post) => ({
      id: post.id,
      title: post.title,
      category: isKorean.value ? '기타' : 'Other',
      restaurantName: post.restaurant_name || post.restaurantName || '',
      content: post.content,
      author: post.nickname || (isKorean.value ? '익명' : 'Anonymous'),
      createdAt: post.created_at?.slice(0, 10) || '',
      views: post.view_count || 0,
      commentCount: post.comment_count || (post.comments?.length || 0),
      comments: post.comments || []
    }))
  } catch (error) {
    console.error('Failed to load posts', error)
  } finally {
    loading.value = false
  }
}

const addPost = async (newPost) => {
  try {
    await createPost({
      title: newPost.title,
      content: newPost.content,
      password: newPost.password || '1234'
    })
    await loadPosts()
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
    await loadPosts()
  } catch (error) {
    console.error('Failed to delete post', error)
    alert(isKorean.value ? '게시글 삭제에 실패했습니다.' : 'Failed to delete the post.')
  }
}

const openPostDetail = async (post) => {
  try {
    const updated = await incrementViewCount(post.id)
    selectedPost.value = {
      ...post,
      ...updated,
      commentCount: updated.comment_count || (updated.comments?.length || 0),
      comments: updated.comments || []
    }

    const index = posts.value.findIndex((item) => item.id === post.id)
    if (index !== -1) {
      posts.value[index].views = updated.view_count || 0
      posts.value[index].commentCount = updated.comment_count || (updated.comments?.length || 0)
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
})
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

<template>
  <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-xs">
        <thead class="bg-slate-50 border-b border-slate-200">
          <tr>
            <th class="px-4 py-3 text-left font-semibold text-slate-700">{{ uiText.category }}</th>
            <th class="px-4 py-3 text-left font-semibold text-slate-700">{{ uiText.restaurant }}</th>
            <th class="px-4 py-3 text-left font-semibold text-slate-700">{{ uiText.title }}</th>
            <th class="px-4 py-3 text-center font-semibold text-slate-700 w-16">{{ uiText.views }}</th>
            <th class="px-4 py-3 text-center font-semibold text-slate-700 w-16">{{ uiText.likes }}</th>
            <th class="px-4 py-3 text-center font-semibold text-slate-700 w-16">{{ uiText.comments }}</th>
            <th class="px-4 py-3 text-center font-semibold text-slate-700 w-20 whitespace-nowrap">{{ uiText.date }}</th>
            <th class="px-4 py-3 text-center font-semibold text-slate-700 w-16">{{ uiText.action }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="post in posts"
            :key="post.id"
            class="border-b border-slate-100 hover:bg-slate-50/50 transition cursor-pointer"
          >
            <!-- Category -->
            <td class="px-4 py-3">
              <span
                :class="[
                  'px-2 py-0.5 rounded-full text-[10px] font-semibold',
                  post.category === uiText.review
                    ? 'bg-emerald-100 text-emerald-700'
                    : post.category === uiText.tip
                      ? 'bg-blue-100 text-blue-700'
                      : post.category === uiText.question
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-700'
                ]"
              >
                {{ post.category }}
              </span>
            </td>

            <!-- Title -->
            <td class="px-4 py-3 text-slate-700 truncate max-w-[180px]">
              {{ post.restaurantName || '-' }}
            </td>

            <!-- Title -->
            <td class="px-4 py-3">
              <button
                @click="$emit('open-detail', post)"
                class="text-slate-900 font-semibold hover:text-blue-600 hover:underline text-left truncate max-w-xs"
              >
                {{ post.title }}
              </button>
            </td>

            <!-- Views -->
            <td class="px-4 py-3 text-center text-slate-600">{{ post.views }}</td>

            <!-- Likes -->
            <td class="px-4 py-3 text-center">
              <div class="flex items-center justify-center gap-0.5">
                <Star
                  v-for="star in [1, 2, 3, 4, 5]"
                  :key="`${post.id}-like-${star}`"
                  class="h-3.5 w-3.5"
                  :class="star <= (post.likeCount || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'"
                />
              </div>
            </td>

            <!-- Comments -->
            <td class="px-4 py-3 text-center">
              <span v-if="(post.commentCount || post.comments?.length || 0) > 0" class="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                {{ post.commentCount || post.comments?.length || 0 }}
              </span>
              <span v-else class="text-slate-400">0</span>
            </td>

            <!-- Date -->
            <td class="px-4 py-3 text-center text-slate-500 whitespace-nowrap">{{ post.createdAt }}</td>

            <!-- Actions -->
            <td class="px-4 py-3 text-center">
              <button
                @click.stop="$emit('delete', post.id)"
                class="text-rose-600 hover:text-rose-800 font-semibold text-[10px] hover:underline"
              >
                {{ uiText.delete }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="posts.length === 0" class="text-center py-12 text-slate-400">
      <MessageSquare class="w-12 h-12 mx-auto stroke-1 mb-2" />
      <p>{{ uiText.empty }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { MessageSquare, Star } from 'lucide-vue-next'
import { isKorean } from '../../composables/useUiPreferences'

defineProps({
  posts: {
    type: Array,
    required: true
  }
})

defineEmits(['open-detail', 'delete'])

const uiText = computed(() => {
  if (isKorean.value) {
    return {
      category: '카테고리',
      restaurant: '식당',
      title: '제목',
      views: '조회수',
      likes: '좋아요',
      comments: '댓글',
      date: '작성일',
      action: '액션',
      delete: '삭제',
      empty: '아직 게시글이 없습니다. 첫 번째 게시글을 작성해보세요!',
      review: '후기',
      tip: '팁',
      question: '질문'
    }
  }

  return {
    category: 'Category',
    restaurant: 'Restaurant',
    title: 'Title',
    views: 'Views',
    likes: 'Likes',
    comments: 'Comments',
    date: 'Date',
    action: 'Action',
    delete: 'Delete',
    empty: 'No posts yet. Be the first to write one!',
    review: 'Review',
    tip: 'Tip',
    question: 'Question'
  }
})
</script>

<style scoped>
</style>

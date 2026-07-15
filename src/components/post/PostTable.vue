<template>
  <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-xs">
        <thead class="bg-slate-50 border-b border-slate-200">
          <tr>
            <th class="px-4 py-3 text-left font-semibold text-slate-700">카테고리</th>
            <th class="px-4 py-3 text-left font-semibold text-slate-700">제목</th>
            <th class="px-4 py-3 text-center font-semibold text-slate-700 w-16">조회수</th>
            <th class="px-4 py-3 text-center font-semibold text-slate-700 w-16">댓글</th>
            <th class="px-4 py-3 text-center font-semibold text-slate-700 w-20">작성일</th>
            <th class="px-4 py-3 text-center font-semibold text-slate-700 w-16">액션</th>
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
                  post.category === '후기'
                    ? 'bg-emerald-100 text-emerald-700'
                    : post.category === '팁'
                      ? 'bg-blue-100 text-blue-700'
                      : post.category === '질문'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-700'
                ]"
              >
                {{ post.category }}
              </span>
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

            <!-- Comments -->
            <td class="px-4 py-3 text-center">
              <span v-if="(post.commentCount || post.comments?.length || 0) > 0" class="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                {{ post.commentCount || post.comments?.length || 0 }}
              </span>
              <span v-else class="text-slate-400">0</span>
            </td>

            <!-- Date -->
            <td class="px-4 py-3 text-center text-slate-500">{{ post.createdAt }}</td>

            <!-- Actions -->
            <td class="px-4 py-3 text-center">
              <button
                @click.stop="$emit('delete', post.id)"
                class="text-rose-600 hover:text-rose-800 font-semibold text-[10px] hover:underline"
              >
                삭제
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="posts.length === 0" class="text-center py-12 text-slate-400">
      <MessageSquare class="w-12 h-12 mx-auto stroke-1 mb-2" />
      <p>아직 게시글이 없습니다. 첫 번째 게시글을 작성해보세요!</p>
    </div>
  </div>
</template>

<script setup>
import { MessageSquare } from 'lucide-vue-next'

defineProps({
  posts: {
    type: Array,
    required: true
  }
})

defineEmits(['open-detail', 'delete'])
</script>

<style scoped>
</style>

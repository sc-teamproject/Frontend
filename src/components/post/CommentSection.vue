<template>
  <div>
    <h3 class="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
      <MessageCircle class="w-4 h-4 text-purple-600" />
      {{ uiText.title }} {{ comments.length }}{{ uiText.countSuffix }}
    </h3>

    <!-- Comments List -->
    <div class="space-y-3 mb-4">
      <div v-for="comment in comments" :key="comment.id" class="bg-slate-50 border border-slate-100 rounded-lg p-3">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-semibold text-slate-700">{{ comment.nickname || uiText.anonymous }} ({{ uiText.anonymous }})</span>
          <div class="flex items-center gap-2">
            <span class="text-[10px] text-slate-500">{{ comment.created_at?.slice(0, 10) || '' }}</span>
            <button
              type="button"
              @click="deleteComment(comment.id)"
              class="text-[10px] text-rose-600 hover:text-rose-800 font-semibold"
            >
              {{ uiText.delete }}
            </button>
          </div>
        </div>
        <p class="text-sm text-slate-800">{{ comment.content }}</p>
      </div>

      <!-- Empty State -->
      <div v-if="comments.length === 0" class="text-center py-6 text-slate-400">
        {{ uiText.empty }}
      </div>
    </div>

    <!-- Add Comment Form -->
    <div class="border-t border-slate-100 pt-4">
      <h4 class="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">{{ uiText.writeComment }}</h4>
      <form @submit.prevent="submitComment" class="flex gap-2">
        <textarea
          v-model="newComment"
          :placeholder="uiText.placeholder"
          maxlength="300"
          rows="2"
          class="flex-grow bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none resize-none"
        ></textarea>
        <button
          type="submit"
          :disabled="!newComment.trim()"
          class="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white font-semibold px-3 py-2 rounded-lg transition text-xs h-fit flex items-center gap-1"
        >
          <Send class="w-3 h-3" />
          <span class="hidden sm:inline">{{ uiText.button }}</span>
        </button>
      </form>
      <p class="text-[10px] text-slate-400 mt-1">{{ newComment.length }}/300</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { MessageCircle, Send } from 'lucide-vue-next'
import axios from 'axios'
import { isKorean } from '../../composables/useUiPreferences'

const props = defineProps({
  postId: {
    type: Number,
    required: true
  },
  comments: {
    type: Array,
    required: true
  }
})

const newComment = ref('')
const emit = defineEmits(['comment-added', 'comment-deleted'])

const uiText = computed(() => {
  if (isKorean.value) {
    return {
      title: '댓글',
      countSuffix: '개',
      anonymous: '익명',
      delete: '삭제',
      empty: '아직 댓글이 없습니다. 첫 댓글을 달아보세요!',
      writeComment: '댓글 작성',
      placeholder: '댓글을 입력하세요 (300자 이내)',
      button: '댓글'
    }
  }

  return {
    title: 'Comments',
    countSuffix: '',
    anonymous: 'Anonymous',
    delete: 'Delete',
    empty: 'No comments yet. Be the first to comment!',
    writeComment: 'Write a Comment',
    placeholder: 'Enter your comment (up to 300 characters)',
    button: 'Comment'
  }
})

const submitComment = async () => {
  if (!newComment.value.trim()) return

  try {
    const { data } = await axios.post(`/api/posts/${props.postId}/comments`, {
      author: '익명',
      content: newComment.value.trim(),
      password: '1234'
    })

    emit('comment-added', data)
    newComment.value = ''
  } catch (error) {
    console.error('Failed to create comment', error)
    alert(isKorean.value ? '댓글 등록에 실패했습니다.' : 'Failed to add the comment.')
  }
}

const deleteComment = async (commentId) => {
  if (!confirm(isKorean.value ? '정말 삭제하시겠습니까?' : 'Are you sure you want to delete it?')) return

  try {
    await axios.delete(`/api/comments/${commentId}`, {
      params: { password: '1234' }
    })
    emit('comment-deleted', commentId)
  } catch (error) {
    console.error('Failed to delete comment', error)
    alert(isKorean.value ? '댓글 삭제에 실패했습니다.' : 'Failed to delete the comment.')
  }
}
</script>

<style scoped>
</style>

<template>
  <div class="fixed bottom-4 left-4 z-[9999] space-y-2 max-w-sm">
    <transition-group name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'p-4 rounded-xl shadow-lg border flex items-start gap-3 transform transition duration-300',
          toast.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
        ]"
      >
        <CheckCircle v-if="toast.type === 'success'" class="w-5 h-5 flex-shrink-0 text-emerald-600" />
        <AlertTriangle v-else class="w-5 h-5 flex-shrink-0 text-rose-600" />
        <div>
          <p class="text-xs font-bold">{{ toast.title }}</p>
          <p class="text-[11px] text-slate-500 mt-0.5">{{ toast.msg }}</p>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CheckCircle, AlertTriangle } from 'lucide-vue-next'

const toasts = ref([])

const addToast = (title, msg, type = 'success') => {
  const id = Date.now()
  toasts.value.push({ id, title, msg, type })
  
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 3500)
}

defineExpose({ addToast })
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
</style>

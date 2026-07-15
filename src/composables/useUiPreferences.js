import { computed, ref } from 'vue'

const isDarkTheme = ref(false)
const isKorean = ref(true)

const initUiPreferences = () => {
  if (typeof window === 'undefined') {
    return
  }

  const savedTheme = localStorage.getItem('theme')
  const savedLanguage = localStorage.getItem('language')

  isDarkTheme.value = savedTheme === 'dark'
  isKorean.value = savedLanguage !== 'en'

  document.documentElement.classList.toggle('dark-theme', isDarkTheme.value)
}

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value

  if (typeof window !== 'undefined') {
    document.documentElement.classList.toggle('dark-theme', isDarkTheme.value)
    localStorage.setItem('theme', isDarkTheme.value ? 'dark' : 'light')
  }
}

const toggleLanguage = () => {
  isKorean.value = !isKorean.value

  if (typeof window !== 'undefined') {
    localStorage.setItem('language', isKorean.value ? 'ko' : 'en')
  }
}

const themeLabel = computed(() => (isDarkTheme.value ? 'Light' : 'Dark'))
const languageLabel = computed(() => (isKorean.value ? 'EN' : 'KOR'))

export {
  initUiPreferences,
  isDarkTheme,
  isKorean,
  languageLabel,
  themeLabel,
  toggleLanguage,
  toggleTheme
}
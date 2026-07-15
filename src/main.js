import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/styles/main.css'
import 'leaflet/dist/leaflet.css'
import { initUiPreferences } from './composables/useUiPreferences'

initUiPreferences()

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')

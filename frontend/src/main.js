import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { useMovieStore } from './composables/useMovieStore'

const app = createApp(App)
app.use(router)

const store = useMovieStore()
store.init().then(() => {
  app.mount('#app')
})

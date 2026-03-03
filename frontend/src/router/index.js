import { createRouter, createWebHistory } from 'vue-router'
import MovieList from '../views/MovieList.vue'
import MovieDetail from '../views/MovieDetail.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  { path: '/', name: 'home', component: MovieList },
  { path: '/movies/:id', name: 'movie', component: MovieDetail },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router

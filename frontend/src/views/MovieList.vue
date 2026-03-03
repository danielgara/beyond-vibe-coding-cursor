<script setup>
import { ref, computed } from 'vue'
import { useMovieStore } from '../composables/useMovieStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const { movies, loading, loadError } = useMovieStore()

const searchQuery = ref('')
const filterGenre = ref('')
const filterYear = ref('')

const genres = computed(() => {
  const set = new Set()
  movies.value.forEach((m) => m.genres?.forEach((g) => set.add(g)))
  return [...set].sort()
})

const filteredMovies = computed(() => {
  let list = movies.value
  const q = (searchQuery.value || '').trim().toLowerCase()
  if (q) {
    list = list.filter(
      (m) =>
        (m.title || '').toLowerCase().includes(q) ||
        (m.description || '').toLowerCase().includes(q)
    )
  }
  if (filterGenre.value) {
    list = list.filter((m) => (m.genres || []).includes(filterGenre.value))
  }
  if (filterYear.value) {
    const y = Number(filterYear.value)
    list = list.filter((m) => m.year === y)
  }
  return list
})

function goToMovie(id) {
  router.push({ name: 'movie', params: { id } })
}
</script>

<template>
  <div class="movie-list-page">
    <header class="page-header">
      <h1>Movies Review</h1>
      <p class="tagline">Browse and review your favorite films</p>
    </header>

    <div v-if="loading" class="loading">Loading…</div>
    <div v-else-if="loadError" class="error">{{ loadError }}</div>
    <template v-else>
      <div class="filters">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search by title or description…"
          class="filter-input"
        />
        <select v-model="filterGenre" class="filter-select">
          <option value="">All genres</option>
          <option v-for="g in genres" :key="g" :value="g">{{ g }}</option>
        </select>
        <input
          v-model="filterYear"
          type="number"
          placeholder="Year"
          min="1900"
          max="2030"
          class="filter-input filter-year"
        />
      </div>

      <ul class="movie-grid">
        <li
          v-for="movie in filteredMovies"
          :key="movie.id"
          class="movie-card"
          @click="goToMovie(movie.id)"
        >
          <div class="poster-wrap">
            <img
              v-if="movie.posterUrl"
              :src="movie.posterUrl"
              :alt="movie.title"
              class="poster"
              loading="lazy"
            />
            <div v-else class="poster placeholder">No poster</div>
          </div>
          <div class="card-body">
            <h2 class="movie-title">{{ movie.title }}</h2>
            <p class="meta">{{ movie.year }} · {{ (movie.genres || []).join(', ') }}</p>
          </div>
        </li>
      </ul>
      <p v-if="filteredMovies.length === 0" class="empty">No movies match your filters.</p>
    </template>
  </div>
</template>

<style scoped>
.movie-list-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 1.5rem;
}
.page-header {
  margin-bottom: 1.5rem;
}
.page-header h1 {
  margin: 0 0 0.25rem;
  font-size: 1.75rem;
}
.tagline {
  margin: 0;
  color: var(--muted);
  font-size: 0.95rem;
}
.loading,
.error {
  padding: 2rem;
  text-align: center;
}
.error {
  color: var(--error, #c00);
}
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}
.filter-input,
.filter-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 0.95rem;
}
.filter-input {
  flex: 1;
  min-width: 180px;
}
.filter-year {
  width: 6ch;
}
.movie-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.25rem;
}
.movie-card {
  background: var(--card-bg);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.movie-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}
.poster-wrap {
  aspect-ratio: 2/3;
  background: var(--bg-muted);
}
.poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.poster.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  font-size: 0.85rem;
}
.card-body {
  padding: 0.75rem 1rem;
}
.movie-title {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.3;
}
.meta {
  margin: 0;
  font-size: 0.8rem;
  color: var(--muted);
}
.empty {
  text-align: center;
  color: var(--muted);
  padding: 2rem;
}
</style>

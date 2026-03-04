<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMovieStore } from '../composables/useMovieStore'

const route = useRoute()
const router = useRouter()
const { getMovieById, getReviewsByMovieId, addReview, loading, loadError } = useMovieStore()

const movie = computed(() => getMovieById(route.params.id))
const movieReviews = computed(() => (movie.value ? getReviewsByMovieId(movie.value.id) : []))

const averageRating = computed(() => {
  const list = movieReviews.value
  if (!list.length) return null
  const sum = list.reduce((a, r) => a + (r.rating || 0), 0)
  return (sum / list.length).toFixed(1)
})

const form = ref({
  authorName: '',
  rating: '',
  text: ''
})
const errors = ref({})
const submitted = ref(false)

function validate() {
  errors.value = {}
  const r = Number(form.value.rating)
  if (!Number.isInteger(r) || r < 1 || r > 5) {
    errors.value.rating = 'Please choose a rating from 1 to 5.'
  }
  const text = (form.value.text || '').trim()
  if (!text) {
    errors.value.text = 'Review text is required.'
  }
  return Object.keys(errors.value).length === 0
}

function submitReview() {
  if (!movie.value) return
  if (!validate()) return
  addReview(movie.value.id, {
    authorName: form.value.authorName,
    rating: form.value.rating,
    text: form.value.text
  })
  form.value = { authorName: '', rating: '', text: '' }
  errors.value = {}
  submitted.value = true
  setTimeout(() => { submitted.value = false }, 3000)
}

function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return iso
  }
}

function goBack() {
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="movie-detail-page">
    <div
      v-if="loading"
      class="loading"
    >
      Loading…
    </div>
    <div
      v-else-if="loadError"
      class="error"
    >
      {{ loadError }}
    </div>
    <div
      v-else-if="!movie"
      class="not-found-inline"
    >
      <h2>Movie not found</h2>
      <p>No movie exists with this ID.</p>
      <button
        type="button"
        class="back-btn"
        @click="goBack"
      >
        Back to list
      </button>
    </div>
    <template v-else-if="movie">
      <button
        type="button"
        class="back-btn"
        @click="goBack"
      >
        ← Back to list
      </button>

      <article class="movie-article">
        <div class="movie-hero">
          <div class="poster-wrap">
            <img
              v-if="movie.posterUrl"
              :src="movie.posterUrl"
              :alt="movie.title"
              class="poster"
            >
            <div
              v-else
              class="poster placeholder"
            >
              No poster
            </div>
          </div>
          <div class="movie-info">
            <h1 class="title">
              {{ movie.title }}
            </h1>
            <p class="meta">
              {{ movie.year }}
              <span v-if="movie.duration"> · {{ movie.duration }} min</span>
              <span v-if="movie.genres?.length"> · {{ movie.genres.join(', ') }}</span>
            </p>
            <p
              v-if="averageRating"
              class="avg-rating"
            >
              {{ averageRating }} based on {{ movieReviews.length }} review{{ movieReviews.length === 1 ? '' : 's' }}
            </p>
            <p class="description">
              {{ movie.description }}
            </p>
          </div>
        </div>

        <section class="reviews-section">
          <h2>Reviews</h2>
          <ul
            v-if="movieReviews.length"
            class="reviews-list"
          >
            <li
              v-for="r in movieReviews"
              :key="r.id"
              class="review-card"
            >
              <div class="review-meta">
                <span class="author">{{ r.authorName || 'Anonymous' }}</span>
                <span class="rating">★ {{ r.rating }}/5</span>
                <span class="date">{{ formatDate(r.createdAt) }}</span>
              </div>
              <p class="review-text">
                {{ r.text }}
              </p>
            </li>
          </ul>
          <p
            v-else
            class="no-reviews"
          >
            No reviews yet. Be the first!
          </p>

          <div class="review-form-wrap">
            <h3>Leave a review</h3>
            <p
              v-if="submitted"
              class="success-msg"
            >
              Thanks! Your review has been added.
            </p>
            <form
              class="review-form"
              @submit.prevent="submitReview"
            >
              <div class="form-row">
                <label for="author">Your name (optional)</label>
                <input
                  id="author"
                  v-model="form.authorName"
                  type="text"
                  placeholder="Anonymous"
                  class="form-input"
                >
              </div>
              <div class="form-row">
                <label for="rating">Rating (1–5) *</label>
                <select
                  id="rating"
                  v-model="form.rating"
                  class="form-select"
                  :class="{ invalid: errors.rating }"
                >
                  <option value="">
                    Choose…
                  </option>
                  <option
                    v-for="n in 5"
                    :key="n"
                    :value="n"
                  >
                    {{ n }} ★
                  </option>
                </select>
                <span
                  v-if="errors.rating"
                  class="field-error"
                >{{ errors.rating }}</span>
              </div>
              <div class="form-row">
                <label for="text">Review *</label>
                <textarea
                  id="text"
                  v-model="form.text"
                  rows="4"
                  placeholder="Write your review…"
                  class="form-input"
                  :class="{ invalid: errors.text }"
                />
                <span
                  v-if="errors.text"
                  class="field-error"
                >{{ errors.text }}</span>
              </div>
              <button
                type="submit"
                class="submit-btn"
              >
                Submit review
              </button>
            </form>
          </div>
        </section>
      </article>
    </template>
  </div>
</template>

<style scoped>
.movie-detail-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem;
}
.loading,
.error {
  padding: 2rem;
  text-align: center;
}
.error {
  color: var(--error, #c00);
}
.not-found-inline {
  text-align: center;
  padding: 2rem;
}
.not-found-inline h2 {
  margin: 0 0 0.5rem;
}
.not-found-inline p {
  color: var(--muted);
  margin-bottom: 1rem;
}
.back-btn {
  margin-bottom: 1rem;
  padding: 0.4rem 0.75rem;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}
.back-btn:hover {
  background: var(--bg-muted);
}
.movie-hero {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}
@media (max-width: 560px) {
  .movie-hero {
    grid-template-columns: 1fr;
  }
}
.poster-wrap {
  aspect-ratio: 2/3;
  background: var(--bg-muted);
  border-radius: 8px;
  overflow: hidden;
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
.movie-info .title {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
}
.meta,
.avg-rating {
  margin: 0 0 0.5rem;
  color: var(--muted);
  font-size: 0.95rem;
}
.description {
  margin: 1rem 0 0;
  line-height: 1.5;
}
.reviews-section h2 {
  margin: 0 0 1rem;
  font-size: 1.25rem;
}
.reviews-list {
  list-style: none;
  margin: 0 0 2rem;
  padding: 0;
}
.review-card {
  padding: 1rem;
  margin-bottom: 0.75rem;
  background: var(--card-bg);
  border-radius: 8px;
}
.review-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--muted);
}
.review-meta .rating {
  color: var(--accent);
}
.review-text {
  margin: 0;
  line-height: 1.5;
}
.no-reviews {
  color: var(--muted);
  margin-bottom: 2rem;
}
.review-form-wrap {
  border-top: 1px solid var(--border);
  padding-top: 1.5rem;
}
.review-form-wrap h3 {
  margin: 0 0 1rem;
  font-size: 1.1rem;
}
.success-msg {
  color: var(--success, #0a0);
  margin-bottom: 1rem;
}
.review-form .form-row {
  margin-bottom: 1rem;
}
.review-form label {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.9rem;
}
.form-input,
.form-select {
  width: 100%;
  max-width: 400px;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 1rem;
}
.form-input.invalid,
.form-select.invalid {
  border-color: var(--error, #c00);
}
.field-error {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.85rem;
  color: var(--error, #c00);
}
.submit-btn {
  margin-top: 0.5rem;
  padding: 0.6rem 1.25rem;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
}
.submit-btn:hover {
  opacity: 0.9;
}
</style>

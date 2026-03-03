import { ref, computed } from 'vue'

const MOVIES_KEY = 'movies'
const REVIEWS_KEY = 'reviews'

const movies = ref([])
const reviews = ref([])
const loading = ref(true)
const loadError = ref(null)

async function fetchSeed(path) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const res = await fetch(`${base}/data/${path}`)
  if (!res.ok) throw new Error(`Failed to load ${path}`)
  return res.json()
}

export function useMovieStore() {
  async function init() {
    loading.value = true
    loadError.value = null
    try {
      let rawMovies = localStorage.getItem(MOVIES_KEY)
      let rawReviews = localStorage.getItem(REVIEWS_KEY)
      const needsMovies = !rawMovies || rawMovies === '[]' || rawMovies === 'null'
      const needsReviews = !rawReviews || rawReviews === '[]' || rawReviews === 'null'

      if (needsMovies || needsReviews) {
        const [moviesData, reviewsData] = await Promise.all([
          needsMovies ? fetchSeed('movies.json') : Promise.resolve(null),
          needsReviews ? fetchSeed('reviews.json') : Promise.resolve(null)
        ])
        if (moviesData?.movies) {
          rawMovies = JSON.stringify(moviesData.movies)
          localStorage.setItem(MOVIES_KEY, rawMovies)
        }
        if (reviewsData?.reviews) {
          rawReviews = JSON.stringify(reviewsData.reviews)
          localStorage.setItem(REVIEWS_KEY, rawReviews)
        }
      }

      movies.value = rawMovies ? JSON.parse(rawMovies) : []
      reviews.value = rawReviews ? JSON.parse(rawReviews) : []
    } catch (err) {
      loadError.value = err.message
      movies.value = []
      reviews.value = []
    } finally {
      loading.value = false
    }
  }

  function getMovieById(id) {
    return movies.value.find((m) => m.id === id) ?? null
  }

  function getReviewsByMovieId(movieId) {
    return reviews.value.filter((r) => r.movieId === movieId)
  }

  function addReview(movieId, { authorName = '', rating, text }) {
    const id = `review-${Date.now()}`
    const createdAt = new Date().toISOString()
    const review = {
      id,
      movieId,
      authorName: authorName?.trim() || 'Anonymous',
      rating: Number(rating),
      text: (text || '').trim(),
      createdAt
    }
    reviews.value = [...reviews.value, review]
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews.value))
    return review
  }

  const reviewsByMovie = computed(() => {
    const map = {}
    for (const r of reviews.value) {
      if (!map[r.movieId]) map[r.movieId] = []
      map[r.movieId].push(r)
    }
    return map
  })

  return {
    movies,
    reviews,
    loading,
    loadError,
    init,
    getMovieById,
    getReviewsByMovieId,
    addReview,
    reviewsByMovie
  }
}

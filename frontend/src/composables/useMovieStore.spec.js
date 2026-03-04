import { describe, it, expect, beforeEach } from 'vitest'
import { useMovieStore } from './useMovieStore'

const sampleMovies = [
  {
    id: 'movie-1',
    title: 'Inception',
    year: 2010,
    genres: ['Sci-Fi', 'Thriller'],
    description: 'A thief who steals corporate secrets.',
    posterUrl: 'https://example.com/poster.jpg',
    duration: 148
  },
  { id: 'movie-2', title: 'Parasite', year: 2019, genres: ['Drama'], description: 'Greed and class.', posterUrl: '', duration: 132 }
]

const sampleReviews = [
  { id: 'review-1', movieId: 'movie-1', authorName: 'Alex', rating: 5, text: 'Great!', createdAt: '2025-01-01T00:00:00Z' },
  { id: 'review-2', movieId: 'movie-1', authorName: 'Anonymous', rating: 4, text: 'Good.', createdAt: '2025-01-02T00:00:00Z' },
  { id: 'review-3', movieId: 'movie-2', authorName: 'Jordan', rating: 5, text: 'Amazing.', createdAt: '2025-01-03T00:00:00Z' }
]

describe('useMovieStore', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('movies', JSON.stringify(sampleMovies))
    localStorage.setItem('reviews', JSON.stringify(sampleReviews))
  })

  it('getMovieById returns the movie when found', async () => {
    const store = useMovieStore()
    await store.init()
    expect(store.getMovieById('movie-1')).toEqual(sampleMovies[0])
    expect(store.getMovieById('movie-2')).toEqual(sampleMovies[1])
  })

  it('getMovieById returns null when not found', async () => {
    const store = useMovieStore()
    await store.init()
    expect(store.getMovieById('movie-99')).toBeNull()
  })

  it('getReviewsByMovieId returns only reviews for that movie', async () => {
    const store = useMovieStore()
    await store.init()
    const reviews1 = store.getReviewsByMovieId('movie-1')
    const reviews2 = store.getReviewsByMovieId('movie-2')
    expect(reviews1).toHaveLength(2)
    expect(reviews2).toHaveLength(1)
    expect(reviews1.every(r => r.movieId === 'movie-1')).toBe(true)
    expect(reviews2[0].movieId).toBe('movie-2')
  })

  it('addReview appends a review and persists to localStorage', async () => {
    const store = useMovieStore()
    await store.init()
    const initialCount = store.reviews.value.length
    const added = store.addReview('movie-1', {
      authorName: 'Test User',
      rating: 4,
      text: 'My review text'
    })
    expect(added).toMatchObject({
      movieId: 'movie-1',
      authorName: 'Test User',
      rating: 4,
      text: 'My review text'
    })
    expect(added.id).toMatch(/^review-\d+$/)
    expect(added.createdAt).toBeDefined()
    expect(store.reviews.value).toHaveLength(initialCount + 1)
    const saved = JSON.parse(localStorage.getItem('reviews'))
    expect(saved).toHaveLength(initialCount + 1)
    expect(saved[saved.length - 1].text).toBe('My review text')
  })

  it('addReview uses Anonymous when authorName is empty', async () => {
    const store = useMovieStore()
    await store.init()
    const added = store.addReview('movie-1', { authorName: '', rating: 3, text: 'No name' })
    expect(added.authorName).toBe('Anonymous')
  })
})

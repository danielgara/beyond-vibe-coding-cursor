import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import MovieDetail from './MovieDetail.vue'

const mockMovie = {
  id: 'movie-1',
  title: 'Inception',
  year: 2010,
  duration: 148,
  genres: ['Sci-Fi', 'Thriller'],
  description: 'A mind-bending thriller.'
}

const mockReviews = [
  { id: 'r1', movieId: 'movie-1', authorName: 'Alex', rating: 5, text: 'Great film.', createdAt: '2025-01-01T00:00:00Z' }
]

const addReviewFn = vi.fn()

vi.mock('../composables/useMovieStore', () => ({
  useMovieStore: () => ({
    getMovieById: (id) => (id === 'movie-1' ? mockMovie : null),
    getReviewsByMovieId: () => mockReviews,
    addReview: addReviewFn,
    loading: ref(false),
    loadError: ref(null)
  })
}))

const StubHome = { template: '<div>Home</div>' }

describe('MovieDetail', () => {
  let router

  beforeEach(async () => {
    addReviewFn.mockClear()
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', name: 'home', component: StubHome },
        { path: '/movies/:id', name: 'movie', component: MovieDetail }
      ]
    })
    await router.push('/movies/movie-1')
  })

  it('shows movie info and reviews when movie exists', () => {
    const wrapper = mount(MovieDetail, {
      global: { plugins: [router] }
    })
    expect(wrapper.text()).toContain('Inception')
    expect(wrapper.text()).toContain('2010')
    expect(wrapper.text()).toContain('148 min')
    expect(wrapper.text()).toContain('Sci-Fi')
    expect(wrapper.text()).toContain('A mind-bending thriller.')
    expect(wrapper.text()).toContain('Reviews')
    expect(wrapper.text()).toContain('Alex')
    expect(wrapper.text()).toContain('Great film.')
  })

  it('shows average rating when reviews exist', () => {
    const wrapper = mount(MovieDetail, {
      global: { plugins: [router] }
    })
    expect(wrapper.text()).toMatch(/\d+\.\d+ based on 1 review/)
  })

  it('shows Leave a review form', () => {
    const wrapper = mount(MovieDetail, {
      global: { plugins: [router] }
    })
    expect(wrapper.find('form.review-form').exists()).toBe(true)
    expect(wrapper.find('#rating').exists()).toBe(true)
    expect(wrapper.find('#text').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').text()).toContain('Submit review')
  })

  it('calls addReview and shows success when form is submitted with valid data', async () => {
    const wrapper = mount(MovieDetail, {
      global: { plugins: [router] }
    })
    await wrapper.find('#rating').setValue(4)
    await wrapper.find('#text').setValue('Really enjoyed it.')
    await wrapper.find('form.review-form').trigger('submit.prevent')
    expect(addReviewFn).toHaveBeenCalledWith('movie-1', expect.objectContaining({
      rating: 4,
      text: 'Really enjoyed it.'
    }))
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Thanks! Your review has been added.')
  })

  it('shows not found when movie id is invalid', async () => {
    await router.push('/movies/invalid-id')
    const wrapper = mount(MovieDetail, {
      global: { plugins: [router] }
    })
    expect(wrapper.text()).toContain('Movie not found')
    expect(wrapper.text()).toContain('No movie exists with this ID')
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import MovieList from './MovieList.vue'

const mockMovies = [
  { id: 'movie-1', title: 'Inception', year: 2010, genres: ['Sci-Fi'], description: 'A thriller.' },
  { id: 'movie-2', title: 'Parasite', year: 2019, genres: ['Drama'], description: 'A drama.' }
]

vi.mock('../composables/useMovieStore', () => ({
  useMovieStore: () => ({
    movies: ref(mockMovies),
    loading: ref(false),
    loadError: ref(null)
  })
}))

const StubMovie = { template: '<div>Movie</div>' }

describe('MovieList', () => {
  let router

  beforeEach(async () => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', name: 'home', component: MovieList },
        { path: '/movies/:id', name: 'movie', component: StubMovie }
      ]
    })
    await router.push('/')
  })

  it('shows the page header', () => {
    const wrapper = mount(MovieList, {
      global: { plugins: [router] }
    })
    expect(wrapper.text()).toContain('Movies Review')
    expect(wrapper.text()).toContain('Browse and review your favorite films')
  })

  it('renders movie cards with titles and links to detail', () => {
    const wrapper = mount(MovieList, {
      global: { plugins: [router] }
    })
    const titles = wrapper.findAll('.movie-title')
    expect(titles).toHaveLength(2)
    expect(titles[0].text()).toBe('Inception')
    expect(titles[1].text()).toBe('Parasite')
    const cards = wrapper.findAll('.movie-card')
    expect(cards).toHaveLength(2)
  })

  it('navigates to movie detail when a card is clicked', async () => {
    const pushSpy = vi.spyOn(router, 'push')
    const wrapper = mount(MovieList, {
      global: { plugins: [router] }
    })
    await wrapper.find('.movie-card').trigger('click')
    expect(pushSpy).toHaveBeenCalledWith({ name: 'movie', params: { id: 'movie-1' } })
  })
})

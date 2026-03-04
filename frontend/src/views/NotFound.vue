<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="not-found">
    <h1>Movie not found</h1>
    <p>We couldn't find a movie with that ID.</p>
    <router-link
      to="/"
      class="home-link"
    >
      Back to movie list
    </router-link>
  </div>
</template>

<style scoped>
.not-found {
  max-width: 480px;
  margin: 4rem auto;
  padding: 2rem;
  text-align: center;
}
.not-found h1 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
}
.not-found p {
  margin: 0 0 1rem;
  color: var(--muted);
}
.home-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: var(--accent);
  color: #fff;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
}
.home-link:hover {
  opacity: 0.9;
}
</style>

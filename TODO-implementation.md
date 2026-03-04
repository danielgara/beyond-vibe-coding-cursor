# Movies Review Site — Implementation To-Do List

**Source:** [PRD-movies-review-site.md](./PRD-movies-review-site.md)  
**Goal:** Implement in small, manageable increments suitable for AI-assisted development.  
**Stack:** Vue.js 3 (Vite) only — **frontend-only**, **localStorage** for data (no backend).

---

## How to Use This List

- Work in order; later tasks often depend on earlier ones.
- One task = one focused session (one prompt or a short conversation).
- Check off items as you go; uncheck if you need to redo.
- When asking the AI for help, paste the task text and the relevant part of the PRD.

---

## Phase 1: Project Setup & Seed Data

| Done | Task | Notes / AI prompt hint |
|------|------|------------------------|
| [x] | **1.1** Scaffold Vue 3 app with Vite at project root (or in a single `frontend/` folder). Use Composition API. | "Create a new Vue 3 + Vite project here (or in ./frontend) using npm create vite." |
| [x] | **1.2** Add Vue Router; define routes `/` (movie list) and `/movies/:id` (movie detail). | "Add Vue Router with two routes: home and /movies/:id." |
| [x] | **1.3** Add sample data: create `public/data/movies.json` and `public/data/reviews.json` with the PRD sample (Inception, Shawshank, Parasite + a few reviews). | "Create public/data/movies.json and reviews.json matching PRD section 7." |
| [x] | **1.4** Create a **data/store layer**: on app init, read `localStorage.getItem('movies')` and `localStorage.getItem('reviews')`. If missing or empty, fetch the JSON from `public/data/`, then write to localStorage and use that; otherwise use what’s in localStorage. Expose reactive state (e.g. refs or a simple store) for movies and reviews. | "Add a store or composable that seeds localStorage from public/data/*.json when empty and exposes movies and reviews reactively." |

---

## Phase 2: Pages & Data Binding

| Done | Task | Notes / AI prompt hint |
|------|------|------------------------|
| [x] | **2.1** Build the **movie list page**: read movies from the store (localStorage-backed), display title, year, poster (or placeholder), link each to `/movies/:id`. | "On the home route, show a list of movies from the store with links to detail." |
| [x] | **2.2** Build the **movie detail page**: get movie by id from store; get reviews for that movie (filter by `movieId`). Show title, year, genres, description, poster, duration and list of reviews (author, rating, text, date). | "On /movies/:id, show full movie info and list of reviews from the store." |
| [x] | **2.3** Handle **movie not found**: when `id` doesn’t match any movie, show a simple “Not found” message or redirect. | "Handle 404 when movie id is invalid on the detail page." |
| [x] | **2.4** Add **Leave a review** form on movie detail: author name (optional), rating (1–5), review text. On submit: validate (rating 1–5, non-empty text), generate id and `createdAt`, append to reviews array, save to localStorage, update store state so the new review appears in the list. | "Add review form that saves to localStorage and updates the store and UI." |

---

## Phase 3: Validation & Styling

| Done | Task | Notes / AI prompt hint |
|------|------|------------------------|
| [x] | **3.1** Add **client-side validation** on the review form: rating required (1–5), review text required and non-empty. Show inline or summary errors. | "Add form validation for rating and review text on the review form." |
| [x] | **3.2** Apply **basic styling**: readable layout, movie cards on list, clear detail layout, styled form. Use CSS/SCSS or Tailwind per PRD. | "Style the movie list, detail page, and review form for a clean layout." |
| [x] | **3.3** (Optional) Add **search or filter** on the movie list (by title, genre, year) in the frontend only. | "Add search/filter UI for the movie list using the existing movies array." |

---

## Phase 4: Polish & Documentation

| Done | Task | Notes / AI prompt hint |
|------|------|------------------------|
| [x] | **4.1** On movie detail, **compute and display average rating** from reviews (e.g. "4.2 based on 3 reviews"). | "Show average rating and count from reviews on the movie detail page." |
| [x] | **4.2** Add **loading state** when reading from localStorage/seed (if async); optional **error state** if seed fetch fails. | "Add loading (and error) handling for initial data load." |
| [x] | **4.3** Write a short **README**: how to install dependencies, run dev server, and open the app. Mention that data is in localStorage and seeded from `public/data/*.json`. | "Write README with setup and run instructions (frontend only, localStorage)." |
| [ ] | **4.4** Smoke-test: list → detail → submit review → see new review and updated average. Fix any bugs. | Manual check; use "Test the full flow and fix [issue]." if needed. |

---

## Phase 5: CI Pipeline

| Done | Task | Notes / AI prompt hint |
|------|------|------------------------|
| [x] | **5.1** Add a **CI pipeline** (e.g. GitHub Actions) that installs dependencies, runs lint (if configured), and runs `npm run build` in the frontend app. Ensure the workflow runs on push and pull request. | "Add GitHub Actions workflow for the frontend: install, lint, build in frontend/." |

---

## Phase 6: Unit Tests

| Done | Task | Notes / AI prompt hint |
|------|------|------------------------|
| [x] | **6.1** Add a **test runner** to the frontend (e.g. Vitest with Vue Test Utils). Add `npm run test` script. | "Add Vitest and @vue/test-utils to the frontend; add a test script." |
| [x] | **6.2** Write **unit tests for the store/composable**: test that `getMovieById`, `getReviewsByMovieId`, and `addReview` behave correctly (mock or reset localStorage as needed). | "Write Vitest tests for useMovieStore: getMovieById, getReviewsByMovieId, addReview." |
| [x] | **6.3** Write **unit tests for key views**: e.g. MovieList shows movies and links; MovieDetail shows movie info and reviews, and the review form submits and updates the list. | "Write component tests for MovieList and MovieDetail with Vue Test Utils." |
| [x] | **6.4** Add **test step to CI**: run `npm run test` in the frontend in the GitHub Actions workflow (after lint, before or with build). | "Add npm run test to the frontend CI workflow." |

---

## Quick Reference: Data (localStorage)

| Key       | Content                          |
|-----------|-----------------------------------|
| `movies`  | JSON array of movie objects       |
| `reviews` | JSON array of review objects      |

- **Seed:** If either key is missing/empty, load from `public/data/movies.json` and `public/data/reviews.json` (or embedded default), then write to localStorage.
- **Movie shape:** `id`, `title`, `year`, `genres`, `description`, `posterUrl`, `duration`.
- **Review shape:** `id`, `movieId`, `authorName`, `rating`, `text`, `createdAt`.

---

## Done Checklist (from PRD)

- [x] Vue app loads and displays movie list from localStorage (seeded from sample JSON if empty).
- [x] Movie detail page shows all main movie fields and poster.
- [x] Movie detail page lists all reviews for that movie.
- [x] User can submit a new review; it is saved to localStorage and appears in the list.
- [x] Sample `movies.json` and `reviews.json` are provided for seeding; app seeds localStorage on first run.

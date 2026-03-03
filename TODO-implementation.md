# Movies Review Site — Implementation To-Do List

**Source:** [PRD-movies-review-site.md](./PRD-movies-review-site.md)  
**Goal:** Implement in small, manageable increments suitable for AI-assisted development.  
**Stack:** Vue.js 3 (Vite) + Node.js backend + SQLite.

---

## How to Use This List

- Work in order; later tasks often depend on earlier ones.
- One task = one focused session (one prompt or a short conversation).
- Check off items as you go; uncheck if you need to redo.
- When asking the AI for help, paste the task text and the relevant part of the PRD.

---

## Phase 1: Project Setup & Database

| Done | Task | Notes / AI prompt hint |
|------|------|------------------------|
| [ ] | **1.1** Create project root and decide structure (e.g. `frontend/` and `backend/` or `client/` and `server/`). | "Set up folder structure for a Vue frontend and Node backend in this repo." |
| [ ] | **1.2** Scaffold Vue 3 app with Vite in the frontend folder. Use Composition API. | "Create a new Vue 3 + Vite project in ./frontend using npm create vite." |
| [ ] | **1.3** Add Vue Router to the Vue app; define routes `/` (movie list) and `/movies/:id` (movie detail). | "Add Vue Router with two routes: home and /movies/:id." |
| [ ] | **1.4** Create backend folder and initialize a Node.js project (e.g. Express or Fastify). Add `better-sqlite3` (or chosen SQLite driver). | "Initialize Express (or Fastify) in ./backend and add better-sqlite3." |
| [ ] | **1.5** Add `schema.sql`: create `movies` table (id, title, year, genres, description, poster_url, duration) and `reviews` table (id, movie_id FK, author_name, rating, text, created_at) with CHECK(rating between 1 and 5). | "Write schema.sql for movies and reviews per PRD section 4." |
| [ ] | **1.6** Add a seed script or `seed.sql` that inserts 3–5 sample movies and a few reviews. Match PRD sample data (e.g. Inception, Shawshank, Parasite). | "Create seed data for movies and reviews matching the PRD sample." |
| [ ] | **1.7** Add an init script (e.g. `npm run db:init`) that creates `data/movies.db` (or `db/movies.db`), runs schema, then runs seed. Document in backend README. | "Add a script that creates the SQLite DB, applies schema.sql, and seeds it." |

---

## Phase 2: Backend API

| Done | Task | Notes / AI prompt hint |
|------|------|------------------------|
| [ ] | **2.1** Implement `GET /api/movies` — return all movies as JSON. Use SQLite in the backend. | "Implement GET /api/movies that reads from SQLite and returns JSON." |
| [ ] | **2.2** Implement `GET /api/movies/:id` — return one movie by id or 404. | "Add GET /api/movies/:id with 404 when not found." |
| [ ] | **2.3** Implement `GET /api/movies/:id/reviews` — return all reviews for that movie. | "Add GET /api/movies/:id/reviews." |
| [ ] | **2.4** Implement `POST /api/movies/:id/reviews` — body: author_name (optional), rating (1–5), text. Validate rating and non-empty text; insert into SQLite; return created review (with id, created_at). | "Add POST /api/movies/:id/reviews with validation and SQLite insert." |
| [ ] | **2.5** Enable CORS for the frontend origin (e.g. http://localhost:5173) so the Vue app can call the API. | "Enable CORS in the backend for the Vite dev server origin." |
| [ ] | **2.6** (Optional) Add query params to `GET /api/movies`: e.g. `?search=...&genre=...&year=...` and filter in SQL. | "Add optional search/genre/year filters to GET /api/movies." |

---

## Phase 3: Frontend — Data & Pages

| Done | Task | Notes / AI prompt hint |
|------|------|------------------------|
| [ ] | **3.1** Create a simple API client (e.g. axios or fetch) with base URL pointing to the backend (configurable, e.g. env). | "Add an API client in the Vue app for the backend base URL." |
| [ ] | **3.2** Build the **movie list page**: fetch `GET /api/movies`, display title, year, poster (or placeholder), link to `/movies/:id`. | "On the home route, fetch movies and show a list with links to detail." |
| [ ] | **3.3** Build the **movie detail page**: fetch movie by id and its reviews; show title, year, genres, description, poster, duration; show list of reviews (author, rating, text, date). | "On /movies/:id, fetch movie and reviews and display full detail and review list." |
| [ ] | **3.4** Add **Leave a review** form on the movie detail page: author name (optional), rating (1–5), review text. On submit, call `POST /api/movies/:id/reviews`, then refresh reviews list or append the new review. | "Add review form that POSTs to the API and updates the review list." |
| [ ] | **3.5** Handle loading and error states (e.g. movie not found, network error) on list and detail pages. | "Add loading and error handling for movie list and detail." |

---

## Phase 4: Form Validation & Styling

| Done | Task | Notes / AI prompt hint |
|------|------|------------------------|
| [ ] | **4.1** Add client-side validation: rating required (1–5), review text required and non-empty. Show inline or summary errors. | "Add form validation for rating and review text on the review form." |
| [ ] | **4.2** Apply basic styling: readable layout, movie cards on list, clear detail layout, styled form. Use CSS/SCSS or Tailwind per PRD. | "Style the movie list, detail page, and review form for a clean layout." |
| [ ] | **4.3** (Optional) Add search or filter on the movie list page (by title, genre, year) using backend filters if implemented in 2.6. | "Add search/filter UI that uses the movies API query params." |

---

## Phase 5: Polish & Documentation

| Done | Task | Notes / AI prompt hint |
|------|------|------------------------|
| [ ] | **5.1** On movie detail, compute and display **average rating** from reviews (e.g. "4.2 based on 3 reviews"). | "Show average rating and count from reviews on the movie detail page." |
| [ ] | **5.2** Write a short **README** at project root: how to install dependencies (frontend + backend), run DB init, start backend, start frontend, and open the app. | "Write README with setup and run instructions for frontend and backend." |
| [ ] | **5.3** Smoke-test full flow: list → detail → submit review → see new review and updated average. Fix any bugs. | Manual check; use "Test the full flow and fix [specific issue]." if needed. |

---

## Quick Reference: API Contract

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/movies` | List all movies (optional: ?search=&genre=&year=) |
| GET | `/api/movies/:id` | One movie |
| GET | `/api/movies/:id/reviews` | Reviews for movie |
| POST | `/api/movies/:id/reviews` | Body: `{ author_name?, rating, text }` |

---

## Done Checklist (from PRD)

- [ ] Vue app loads and displays movie list from the API (SQLite-backed).
- [ ] Movie detail page shows all main movie fields and poster.
- [ ] Movie detail page lists all reviews for that movie.
- [ ] User can submit a new review; it is saved in SQLite and appears in the list.
- [ ] Schema and seed are provided and documented.

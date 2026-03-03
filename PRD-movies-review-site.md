# Product Requirements Document (PRD)  
# Movies Review Site

**Version:** 1.0  
**Last updated:** March 3, 2025  
**Status:** Draft

---

## 1. Overview

### 1.1 Product Summary

A **Movies Review Site** is a single-page web application where users can browse movie information and submit reviews. The app is built with **Vue.js** and uses a **JSON file as the sample database** for movies and reviews data.

### 1.2 Goals

- Let users **view main movie information** (title, year, genre, description, poster, rating, etc.).
- Let users **leave and read reviews** for each movie.
- Provide a simple, fast, client-side experience with Vue.js and a JSON-backed data layer (no backend server required for the sample).

### 1.3 Target Users

- Casual visitors who want to discover movies and read reviews.
- Users who want to write short reviews and see them displayed on the site.

---

## 2. Core Features

### 2.1 View Movie Information

| Requirement | Description |
|-------------|-------------|
| **Movie list** | Display a list/grid of movies (e.g. from `movies.json` or a combined data file). |
| **Movie detail** | On click/route, show full details: title, release year, genre(s), description/synopsis, poster image URL, average rating (if derived from reviews). |
| **Search / filter** | Optional: filter or search movies by title, genre, or year. |

### 2.2 Reviews

| Requirement | Description |
|-------------|-------------|
| **Read reviews** | On a movie’s detail page, show all reviews for that movie (author name or “Anonymous”, rating, text, date). |
| **Leave a review** | Form to submit: author name (or anonymous), star rating (e.g. 1–5), review text. New reviews are stored in the JSON “database” (file or in-memory structure) and reflected in the UI. |
| **Validation** | Require at least: rating and non-empty review text; optionally author. |

### 2.3 Out of Scope (for this PRD)

- User accounts, login, or authentication.
- Backend API or real database (this version uses JSON only).
- Moderation, editing, or deleting reviews (can be added later).

---

## 3. Technical Stack

| Layer | Technology |
|-------|------------|
| **Frontend framework** | Vue.js 3 (Composition API recommended) |
| **Build / dev** | Vite (recommended) or Vue CLI |
| **Routing** | Vue Router (for movie list vs movie detail pages) |
| **State / data** | Vue reactivity; data loaded from JSON (fetch/import). For persistence, either rewrite JSON via a simple local API or use `localStorage` and merge with static JSON at runtime. |
| **Database (sample)** | JSON file(s), e.g. `data/movies.json`, `data/reviews.json` (or one combined file). |
| **Styling** | CSS/SCSS or a utility framework (e.g. Tailwind) — optional. |

---

## 4. Data Model (JSON Database)

### 4.1 File Structure (sample)

Place under `public/` or `src/assets/` (or `data/`), e.g.:

- `public/data/movies.json` — list of movies.
- `public/data/reviews.json` — list of reviews, each linked to a movie by `movieId`.

Alternatively, one file: `public/data/db.json` with `movies` and `reviews` arrays.

### 4.2 Movies Schema

```json
{
  "movies": [
    {
      "id": "movie-1",
      "title": "Inception",
      "year": 2010,
      "genres": ["Sci-Fi", "Thriller"],
      "description": "A thief who steals corporate secrets through dream-sharing technology is offered a chance to have his criminal record erased.",
      "posterUrl": "https://example.com/posters/inception.jpg",
      "duration": 148
    }
  ]
}
```

- `id`: unique string (e.g. `movie-1`).
- `title`, `year`, `genres`, `description`, `posterUrl`, `duration`: main movie information.

### 4.3 Reviews Schema

```json
{
  "reviews": [
    {
      "id": "review-1",
      "movieId": "movie-1",
      "authorName": "Jane D.",
      "rating": 5,
      "text": "Mind-bending and visually stunning.",
      "createdAt": "2025-03-01T12:00:00Z"
    }
  ]
}
```

- `id`: unique string.
- `movieId`: references `movies[].id`.
- `authorName`: string (optional; can be “Anonymous”).
- `rating`: number 1–5.
- `text`: string (required).
- `createdAt`: ISO 8601 date string.

### 4.4 Persistence Strategy (sample app)

- **Read:** On load, fetch `movies.json` and `reviews.json` (or `db.json`) and store in Vue state (e.g. `ref`/`reactive` or Pinia).
- **Write (leave review):**  
  - **Option A:** In a purely static setup, new reviews live only in memory/localStorage; page refresh loses them unless you rehydrate from localStorage.  
  - **Option B:** Use a minimal local backend (e.g. Node/Express) that reads/writes the same JSON file so reviews persist on disk.  
  - **Option C:** Use **JSON Server** or similar to mock a REST API that reads/writes the JSON file.

PRD recommends defining the JSON schema and one sample `movies.json` + `reviews.json` (or `db.json`) so the Vue app can run against it; persistence method can be chosen in implementation.

---

## 5. User Flows

### 5.1 Browse movies and view details

1. User opens the app → sees **movie list** (from JSON).
2. User clicks a movie → **movie detail** page shows main info + poster + list of reviews.
3. Optional: user uses search/filter to narrow the list.

### 5.2 Leave a review

1. User is on a **movie detail** page.
2. User scrolls to “Leave a review” form.
3. User enters: author name (optional), rating (1–5), review text.
4. User submits → form validates → new review is added to data (memory/localStorage/backend) and appended to the list on the page.

---

## 6. Pages / Views (Vue)

| View | Route (example) | Description |
|------|------------------|-------------|
| **Movie list** | `/` or `/movies` | Grid/list of movies; optional search/filter. |
| **Movie detail** | `/movies/:id` | Main movie info + reviews list + “Leave a review” form. |

---

## 7. Sample JSON Database Files

### 7.1 `data/movies.json`

```json
{
  "movies": [
    {
      "id": "movie-1",
      "title": "Inception",
      "year": 2010,
      "genres": ["Sci-Fi", "Thriller"],
      "description": "A thief who steals corporate secrets through dream-sharing technology is offered a chance to have his criminal record erased.",
      "posterUrl": "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
      "duration": 148
    },
    {
      "id": "movie-2",
      "title": "The Shawshank Redemption",
      "year": 1994,
      "genres": ["Drama"],
      "description": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
      "posterUrl": "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNkLWJiNDEtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg",
      "duration": 142
    },
    {
      "id": "movie-3",
      "title": "Parasite",
      "year": 2019,
      "genres": ["Comedy", "Drama", "Thriller"],
      "description": "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
      "posterUrl": "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
      "duration": 132
    }
  ]
}
```

### 7.2 `data/reviews.json`

```json
{
  "reviews": [
    {
      "id": "review-1",
      "movieId": "movie-1",
      "authorName": "Alex M.",
      "rating": 5,
      "text": "Mind-bending and visually stunning. One of the best films of the decade.",
      "createdAt": "2025-02-15T14:30:00Z"
    },
    {
      "id": "review-2",
      "movieId": "movie-1",
      "authorName": "Anonymous",
      "rating": 4,
      "text": "Complex plot but worth multiple viewings.",
      "createdAt": "2025-02-20T09:15:00Z"
    },
    {
      "id": "review-3",
      "movieId": "movie-2",
      "authorName": "Jordan K.",
      "rating": 5,
      "text": "A timeless classic about hope and friendship.",
      "createdAt": "2025-03-01T11:00:00Z"
    }
  ]
}
```

---

## 8. Success Criteria

- [ ] Vue.js app loads and displays movie list from JSON.
- [ ] Movie detail page shows all main movie fields and poster.
- [ ] Movie detail page lists all reviews for that movie.
- [ ] User can submit a new review (rating + text, optional author); it appears in the list (in-memory or persisted per chosen strategy).
- [ ] Sample `movies.json` and `reviews.json` (or single `db.json`) are provided and documented.

---

## 9. Future Enhancements (backlog)

- User authentication and “my reviews”.
- Edit/delete own review.
- Sort/filter reviews (by date, rating).
- Average rating per movie computed from reviews.
- Admin UI to add/edit movies in the JSON data.
- Replace JSON with a real backend and database.

---

## 10. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-03-03 | — | Initial PRD: Vue.js movies review site with JSON sample database. |

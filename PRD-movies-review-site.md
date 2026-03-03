# Product Requirements Document (PRD)  
# Movies Review Site

**Version:** 1.0  
**Last updated:** March 3, 2025  
**Status:** Draft

---

## 1. Overview

### 1.1 Product Summary

A **Movies Review Site** is a single-page web application where users can browse movie information and submit reviews. The app is **frontend-only**, built with **Vue.js**, and uses **localStorage** as the data store for movies and reviews.

### 1.2 Goals

- Let users **view main movie information** (title, year, genre, description, poster, rating, etc.).
- Let users **leave and read reviews** for each movie.
- Provide a simple, fast experience with Vue.js; no backend — all data lives in the browser via localStorage.

### 1.3 Target Users

- Casual visitors who want to discover movies and read reviews.
- Users who want to write short reviews and see them displayed on the site.

---

## 2. Core Features

### 2.1 View Movie Information

| Requirement | Description |
|-------------|-------------|
| **Movie list** | Display a list/grid of movies loaded from localStorage (seeded from sample JSON if empty). |
| **Movie detail** | On click/route, show full details: title, release year, genre(s), description/synopsis, poster image URL, average rating (if derived from reviews). |
| **Search / filter** | Optional: filter or search movies by title, genre, or year. |

### 2.2 Reviews

| Requirement | Description |
|-------------|-------------|
| **Read reviews** | On a movie’s detail page, show all reviews for that movie (author name or “Anonymous”, rating, text, date). |
| **Leave a review** | Form to submit: author name (or anonymous), star rating (e.g. 1–5), review text. New reviews are stored in localStorage and reflected in the UI. |
| **Validation** | Require at least: rating and non-empty review text; optionally author. |

### 2.3 Out of Scope (for this PRD)

- User accounts, login, or authentication.
- Moderation, editing, or deleting reviews (can be added later).

---

## 3. Technical Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Vue.js 3 (Composition API recommended); **frontend-only** — no backend server. |
| **Build / dev** | Vite (recommended) or Vue CLI |
| **Routing** | Vue Router (movie list and movie detail pages) |
| **State / data** | Vue reactivity; movies and reviews read from and written to **localStorage**. |
| **Storage** | **localStorage**: keys for movies and reviews (e.g. `movies`, `reviews`). Seed from static JSON if storage is empty. |
| **Styling** | CSS/SCSS or a utility framework (e.g. Tailwind) — optional. |

---

## 4. Data Model (localStorage)

### 4.1 Storage Keys

- **`movies`** — JSON string of an array of movie objects.
- **`reviews`** — JSON string of an array of review objects.
- On first load (or when keys are missing/empty), seed from static sample JSON so the app has default data.

### 4.2 Movies (shape in localStorage)

| Field         | Type   | Description                    |
|---------------|--------|--------------------------------|
| `id`          | string | Unique id (e.g. `"movie-1"`)   |
| `title`       | string | Movie title                    |
| `year`        | number | Release year                   |
| `genres`      | array  | e.g. `["Sci-Fi", "Thriller"]`  |
| `description` | string | Synopsis                       |
| `posterUrl`   | string | Poster image URL               |
| `duration`    | number | Runtime in minutes             |

### 4.3 Reviews (shape in localStorage)

| Field        | Type   | Description                   |
|--------------|--------|-------------------------------|
| `id`         | string | Unique id (e.g. `"review-1"`) |
| `movieId`    | string | References `movies[].id`      |
| `authorName` | string | Optional; default "Anonymous" |
| `rating`     | number | 1–5                           |
| `text`       | string | Review body (required)        |
| `createdAt`  | string | ISO 8601 date string          |

### 4.4 Persistence Strategy

- **Read:** On app load, read `localStorage.getItem('movies')` and `localStorage.getItem('reviews')`. If missing or empty, parse the sample JSON (from `public/` or embedded) and write it to localStorage, then use that as the source of truth.
- **Write (new review):** Generate id and `createdAt`, append to the reviews array, then `localStorage.setItem('reviews', JSON.stringify(reviews))`. Update Vue state so the UI reflects the new review immediately.
- **Movies** are typically read-only in this version (seed once); only reviews are added by the user.

---

## 5. User Flows

### 5.1 Browse movies and view details

1. User opens the app → sees **movie list** (from localStorage, seeded from sample JSON if empty).
2. User clicks a movie → **movie detail** page shows main info + poster + list of reviews.
3. Optional: user uses search/filter to narrow the list.

### 5.2 Leave a review

1. User is on a **movie detail** page.
2. User scrolls to “Leave a review” form.
3. User enters: author name (optional), rating (1–5), review text.
4. User submits → form validates → new review is saved to localStorage and appended to the list on the page.

---

## 6. Pages / Views (Vue)

| View | Route (example) | Description |
|------|------------------|-------------|
| **Movie list** | `/` or `/movies` | Grid/list of movies; optional search/filter. |
| **Movie detail** | `/movies/:id` | Main movie info + reviews list + “Leave a review” form. |

---

## 7. Sample / Seed Data (JSON)

Static JSON files (e.g. in `public/data/`) are used to **seed** localStorage when the app loads and finds no data. The Vue app fetches or imports this data and writes it to `movies` and `reviews` keys if they are empty.

### 7.1 `public/data/movies.json` (seed)

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

### 7.2 `public/data/reviews.json` (seed)

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

- [ ] Vue.js app loads and displays movie list from localStorage (seeded from sample JSON if empty).
- [ ] Movie detail page shows all main movie fields and poster.
- [ ] Movie detail page lists all reviews for that movie.
- [ ] User can submit a new review (rating + text, optional author); it is saved to localStorage and appears in the list.
- [ ] Sample `movies.json` and `reviews.json` are provided for seeding; app seeds localStorage on first run.

---

## 9. Future Enhancements (backlog)

- User authentication and “my reviews”.
- Edit/delete own review.
- Sort/filter reviews (by date, rating).
- Average rating per movie computed from reviews.
- Admin UI to add/edit movies (stored in localStorage).
- Optional: migrate to a backend + database later.

---

## 10. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-03-03 | — | Initial PRD: Vue.js movies review site with JSON sample database. |
| 1.1 | 2025-03-03 | — | Frontend-only; localStorage for data; seed from static JSON. |
| 1.1 | 2025-03-03 | — | Frontend-only; localStorage for data; seed from static JSON. |

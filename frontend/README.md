# Movies Review Site (Frontend)

A Vue 3 single-page app for browsing movies and submitting reviews. **Frontend only** — all data is stored in the browser via **localStorage**.

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the dev server**

   ```bash
   npm run dev
   ```

3. Open the URL shown in the terminal (e.g. `http://localhost:5173`) in your browser.

## Data

- **Storage:** Movies and reviews are kept in `localStorage` under the keys `movies` and `reviews`.
- **Seeding:** On first load, if either key is missing or empty, the app loads sample data from `public/data/movies.json` and `public/data/reviews.json`, then writes it to localStorage. After that, the app uses whatever is in localStorage.
- To reset to the default sample data, clear site data for this origin (e.g. in DevTools → Application → Local Storage) and reload.

## Build

```bash
npm run build
```

Output is in `dist/`. Use `npm run preview` to serve the production build locally.

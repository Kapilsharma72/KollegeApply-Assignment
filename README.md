# KollegeApply Intern Assignment – MERN Landing Pages

A complete MERN stack project that fulfills the KollegeApply assignment:

- Two single-page, responsive landing pages for private universities.
- Lead form integrated with a Pipedream workflow (configurable).
- Working APIs returning simple and nested JSON (universities, fees, and lead submission).
- Mobile and desktop responsive, suitable for deployment on free hosts with SSL (e.g., Vercel/Netlify for client, Render/Railway for server).

## Tech Stack
- Client: React (Vite), Fetch API, modern CSS
- Server: Node.js, Express, MongoDB (Mongoose)

## Structure
```
kollegeapply-intern/
  client/           # React Vite app (two landing pages + modal + lead form)
  server/           # Express API + Mongo lead persistence + Pipedream forwarder
  README.md
```

## Getting Started

### 1) Server
```
cd server
cp .env.example .env
# Edit .env and set at least PIPEDREAM_URL (your Pipedream HTTP endpoint)
# Optionally set MONGO_URL to persist leads in MongoDB
npm install
npm run dev
```
Server runs on http://localhost:5000

### 2) Client
```
cd client
cp .env.example .env
# VITE_API_BASE should point to your server URL
npm install
npm run dev
```
Client runs on http://localhost:5173

## Environment Variables

Server (.env):
- PORT=5000
- MONGO_URL=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
- PIPEDREAM_URL=https://eoxxxxxx.m.pipedream.net  # Your Pipedream endpoint
- CORS_ORIGIN=http://localhost:5173

Client (.env):
- VITE_API_BASE=http://localhost:5000
- VITE_PIPEDREAM_DIRECT=  # Optional: leave empty to go via server. If set, form posts directly here.

## APIs
- GET /api/universities → list of universities (slugs and basic info)
- GET /api/fees/:slug → nested JSON of course-wise fee ranges for a university
- POST /api/leads → accepts lead payload, validates, stores to Mongo (if MONGO_URL set), and forwards to Pipedream

## Deployment Notes
- Client: Build and deploy to Netlify/Vercel. Ensure VITE_API_BASE points to the live server URL.
- Server: Deploy to Render/Railway/Heroku. Set env vars (PORT provided by platform, MONGO_URL, PIPEDREAM_URL, CORS_ORIGIN).

## Accessibility & UX
- Keyboard-accessible modal with focus trap and ESC to close.
- Inline validation messages.
- Mobile-first, responsive layout.

## Scripts
Server:
- npm run dev – nodemon
- npm start – production

Client:
- npm run dev – Vite dev server
- npm run build – build assets
- npm run preview – preview build

## Notes
- If Mongo is not configured, the server still accepts leads and forwards to Pipedream; it logs a warning about skipped DB save.
- Update university content in `client/src/data/universities.js` and `server/data/fees.js` as needed.

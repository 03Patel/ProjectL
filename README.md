# Event Reminders App

## Overview
Small event reminder application with frontend (React) and backend (Node/Express + MongoDB). Features:
- Sign up & login (JWT)
- Beautiful home with gradient, time/weather widgets, animated event cards
- Dashboard with totals & filters
- Smooth micro-interaction when creating events
- Web Push notifications (sent N minutes before event)

## Tech stack
- Frontend: React (Vite), TailwindCSS, Framer Motion
- Backend: Node.js, Express, Mongoose
- DB: MongoDB Atlas
- Auth: JWT
- Push: web-push + Service Worker
- Scheduler: node-cron

## Repo structure
(see tree)

## Setup (local)
1. Clone repository
2. Backend:
   - `cd backend`
   - create `.env`:
     ```
     MONGO_URI=<your-mongo-uri>
     JWT_SECRET=<secret>
     VAPID_PUBLIC_KEY=<vapid-pub>
     VAPID_PRIVATE_KEY=<vapid-priv>
     ```
   - Install: `npm install`
   - Start: `npm run dev` (use nodemon) or `node src/server.js`
   - Note: generate VAPID keys: `npx web-push generate-vapid-keys`

3. Frontend:
   - `cd frontend`
   - create `.env`:
     ```
     VITE_API_URL=http://localhost:4000/api
     VITE_VAPID_PUBLIC=<vapid-public>
     ```
   - Install: `npm install`
   - Start: `npm run dev`
   - Open the site and register / login. Accept push permission.

## Deploy
- Backend: Railway / Render (set env variables from .env)
- Frontend: Vercel / Netlify (set VITE env vars)
- MongoDB Atlas: create free cluster and set `MONGO_URI`.
- In deployments, ensure `VAPID_PUBLIC_KEY` used on frontend matches backend.

## Design choices & structure
- JWT chosen for portability with simple REST.
- web-push for cross-browser push notifications; subscriptions stored server-side.
- node-cron schedules push jobs at runtime; for production you would use a durable job system (e.g., Agenda, Bull with Redis, or serverless scheduled tasks) so jobs survive restarts.
- Framer Motion provides polished micro-interactions (slide-in modal, hover)
- Tailwind enables fast, consistent styling and gradient layout.

## How push works (summary)
1. Client registers service worker `/sw.js`.
2. Client subscribes to push using VAPID public key and sends subscription object to backend.
3. On event create, backend computes `notifyTime = eventTime - notifyBeforeMins` and schedules a cron job to run at that time to call `webpush.sendNotification` to user's subscriptions.

## Improvements & TODOs
- Use persistent job queue (Agenda/Bull) for reliable scheduling.
- Add event repeat rules and timezone handling.
- Use file upload (S3) for event images.
- Add email/SMS fallback reminders.

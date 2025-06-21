# AggieTracker

## Description

AggieTracker is a web application for managing and displaying information related to Texas A&M University's League of Legends teams. It includes features for viewing team rosters, player profiles, leaderboards, schedules, and live streams. The application is built with a modern JavaScript stack and deployed on cloud platforms.

**For more detailed information, please refer to the [AggieTracker Master Document](https://docs.google.com/document/d/11LkL_qlVZ-wguEkPUGIYEaqeXn5BzDmreC7mG9OVxyI/edit?usp=sharing).**

## Technologies

* **Frontend (UI)**:
    * JavaScript / JSX (React)
    * Tailwind CSS
    * Framer Motion (animations)
    * Radix UI
* **Backend (API)**:
    * JavaScript (Node.js + Express)
    * PostgreSQL
    * Environment variables (dotenv)
    * Firebase Admin SDK
    * Cron jobs (node-cron)
* **Authentication**:
    * Firebase Auth
    * Firebase Admin
* **Data Exchange**:
    * JSON (REST endpoints)
    * Riot API wrappers

## Setup

1.  **SQL Login (Local Dev)**

    * Host: localhost:5432
    * Database: aggielol
    * User: tamu\_user
    * Password: \[*Provide your SQL Password here*]
2.  **Run Frontend (Vite Dev Server)**

    ```bash
    cd vite-project
    npm install
    npm run dev # starts Vite at http://localhost:5173
    ```
3.  **Run Backend (Node/Express)**

    ```bash
    cd vite-project/backend
    npm install
    node index.js
    ```
4.  **Riot Sync**

    * Automatically invoked from `backend/index.js` via `syncAllAccounts()`
    * Batch logic in `backend/services/riotSync.js`
    * To run manually:

        ```bash
        cd vite-project
        node backend/services/riotSync.js
        ```

## Deployment

* **Firebase Console**:
    * Project: Aggie-LOL
        \[[Firebase Console](https://console.firebase.google.com/u/0/project/aggie-lol)]
* **Hosting Dashboards**:
    * Vercel (frontend): \[[Vercel](https://aggielol.vercel.app/)]
    * Render (backend): \[[Render](https://dashboard.render.com)]

## Database Schema

The application uses a PostgreSQL database with the following schema:

* `public.players`
* `public.riot_accounts`
* `public.league_entries`
* `public.player_team_stints`
* `public.school_years`
* `public.teams`
* `public.tournament_matches`
* `public.users`

## Known Issues

* Internal Web browser dark mode messes up the visuals making some text not readable (working on a fix)
* Mobile layout not functioning properly
* Dark mode making winrates unreadable in leaderboard
* Some boxes may be blurry due to a rescale i did

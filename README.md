# String.sg v2

A consolidated app launcher for educators that surfaces relevant apps at point-of-need.

## Tech Stack

- **Frontend:** React 19 + Vite 7 + TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** NeonDB (PostgreSQL)
- **ORM:** Drizzle
- **API:** Vercel Edge Functions

## Testing Locally

### Prerequisites

- Node.js 18+
- A NeonDB database (or any PostgreSQL instance)

### Setup

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env and add your DATABASE_URL from NeonDB

# Push schema to database
npm run db:push

# Seed the database with 42 apps
npm run db:seed
```

### Running the Dev Server

```bash
# Start Vercel dev server (frontend + API)
npm run dev
```

This opens the app at **http://localhost:3000**

### Other Commands

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vercel dev (frontend + API) |
| `npm run dev:vite` | Start Vite only (no API) |
| `npm run build` | Build for production |
| `npm run db:push` | Push schema to NeonDB |
| `npm run db:seed` | Seed apps from research data |
| `npm run db:studio` | Open Drizzle Studio (database admin UI) |

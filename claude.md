# String.sg v2 - Development Plan

**Last Updated:** 2026-02-01
**Status:** Phase 3 Ready - Backend + Frontend Complete

---

## Project Overview

**Problem:** Educators face app fragmentation - too many tools scattered across platforms leads to inefficient utilization.

**Solution:** A consolidated app launcher that surfaces relevant apps at point-of-need through:
- Curated landing page with commonly used education apps
- Chrome extension (new tab + popup) for quick access
- Contextual "bumping" based on time/season relevance
- Optional user personalization with drag-and-drop arrangement

---

## Current Status

### ✅ Phase 1: Research (COMPLETE)
- [x] Scraped MOE school directory (320 schools)
- [x] Scraped staff quick links from 10 schools
- [x] Discovered 42 unique apps used by educators
- [x] Created seed data with frequency rankings

### ✅ Phase 2: Backend (COMPLETE)
- [x] NeonDB database created
- [x] Drizzle ORM schema defined (8 tables)
- [x] Database seeded with 42 apps
- [x] API route `/api/apps` with bump rules logic

### ✅ Phase 3: Landing Page (COMPLETE)
- [x] React + Vite + Tailwind setup
- [x] App grid with search and category filters
- [x] Featured app section with time-based bumping
- [x] Responsive design

### 🔲 Phase 4: PWA Support (NEXT)
- [ ] manifest.json for installability
- [ ] Service worker for offline caching
- [ ] Install prompt on mobile

### 🔲 Phase 5: Authentication
- [ ] Google OAuth integration
- [ ] Magic Link email auth
- [ ] Sync local preferences to account

### 🔲 Phase 6: Chrome Extension
- [ ] Manifest V3 setup
- [ ] New tab override + popup
- [ ] Drag-and-drop arrangement

---

## Tech Stack

| Layer | Technology | Status |
|-------|------------|--------|
| Frontend | React 19 + Vite 7 + TypeScript | ✅ |
| Styling | Tailwind CSS 4 | ✅ |
| Database | NeonDB (PostgreSQL) | ✅ |
| ORM | Drizzle | ✅ |
| API | Vercel Edge Functions | ✅ |
| Auth | Google OAuth + Magic Link | 🔲 |
| Hosting | Vercel | Ready |
| Extension | Chrome Manifest V3 | 🔲 |
| Mobile | PWA → Capacitor later | 🔲 |

### Why Drizzle over Prisma
1. **Edge runtime** - Native Vercel Edge support
2. **Cold starts** - ~50ms vs 200-500ms
3. **NeonDB** - First-class serverless driver support
4. **Bundle size** - Much smaller
5. **Drizzle Studio** - Built-in admin UI

---

## Project Structure

```
string-v2/
├── api/
│   └── apps.ts              # GET /api/apps - Edge function ✅
├── data/
│   ├── schools.json         # 320 MOE schools ✅
│   └── apps-seed.json       # 42 apps with metadata ✅
├── scripts/
│   ├── scrape-schools.ts    # School directory scraper ✅
│   └── seed-apps.ts         # Database seeder ✅
├── src/
│   ├── db/
│   │   ├── schema.ts        # Drizzle schema (8 tables) ✅
│   │   └── index.ts         # DB connection ✅
│   ├── App.tsx              # Main landing page ✅
│   ├── main.tsx             # React entry ✅
│   └── index.css            # Tailwind styles ✅
├── drizzle.config.ts        # Drizzle config ✅
├── vite.config.ts           # Vite config ✅
├── tailwind.config.js       # Tailwind config ✅
├── postcss.config.js        # PostCSS config ✅
├── vercel.json              # Vercel routing ✅
├── tsconfig.json            # TypeScript config ✅
├── tsconfig.node.json       # Node TypeScript config ✅
├── package.json             # Dependencies ✅
├── index.html               # HTML entry ✅
├── .env                     # DATABASE_URL (git ignored)
├── .env.example             # Template for .env
├── .gitignore               # Git ignore rules ✅
└── claude.md                # This file
```

---

## Database Schema

```sql
apps                  -- 42 apps seeded ✅
bump_rules            -- Time/date-based promotion rules ✅
featured_apps         -- Daily featured app with messaging
users                 -- User accounts (optional auth)
user_preferences      -- App arrangement, hidden/pinned
user_app_launches     -- Analytics tracking
app_submissions       -- UGC with moderation workflow
categories            -- 8 categories ✅
```

---

## Research Findings

### Top Apps by Frequency (10 schools)

| Apps | Frequency |
|------|-----------|
| SC Mobile, Parents Gateway, HRP, OPAL 2.0, School Cockpit | 10/10 |
| iCON | 9/10 |
| iEXAMS, MOE Intranet, SLS | 8/10 |
| Resource Booking System, HR Online | 7/10 |
| MIMS, SSOE2, Academy of Singapore Teachers | 6/10 |

### Categories (8)
- Administration
- Teaching
- Communication
- HR
- Assessment
- Professional Development
- Productivity
- IT Support

### Featured Apps (Your Apps)
- **Pair** (pair.gov.sg) - AI suite for public officers
- **SmartCompose** (smartcompose.gov.sg) - AI remarks writer
- **String Bingo** (bingo.string.sg) - Classroom icebreakers

### Bump Rules
| App | Rule | When |
|-----|------|------|
| SC Mobile | time_window | 6:00-7:30 AM |
| String Bingo | time_window | 7:30-8:30 AM |
| SmartCompose | date_range | Mid/end quarter |
| iEXAMS | date_range | Exam periods |

---

## Running Locally

```bash
# Install dependencies
npm install

# Set up environment (copy and edit)
cp .env.example .env
# Add DATABASE_URL from NeonDB

# Push schema to database (if needed)
npm run db:push

# Seed apps (if needed)
npm run db:seed

# Start dev server
npm run dev
# Opens at http://localhost:3000

# Open Drizzle Studio
npm run db:studio
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vercel dev (frontend + API) |
| `npm run dev:vite` | Start Vite only (no API) |
| `npm run build` | Build for production |
| `npm run db:push` | Push schema to NeonDB |
| `npm run db:seed` | Seed apps from research data |
| `npm run db:studio` | Open Drizzle Studio |

---

## Next Steps (Resume Here)

### 1. Add PWA Support
```bash
# Create these files:
public/manifest.json    # PWA manifest
public/sw.js           # Service worker
```
- Add manifest link to index.html
- Configure workbox for offline caching
- Add install prompt component

### 2. Implement Auth
- Install: `npm install next-auth` or custom auth
- Add Google OAuth credentials
- Add Magic Link email flow
- Create `/api/auth/[...nextauth].ts`

### 3. Build Chrome Extension
```bash
mkdir extension
# Create manifest.json, popup.html, newtab.html
```

---

## UGC Workflow

1. User submits app via form
2. Saved with `status: 'pending'`
3. **Submitter sees their app immediately**
4. Admin reviews via Drizzle Studio
5. Approved → visible globally

---

## Decisions Made

- **ORM:** Drizzle (not Prisma) - edge/serverless optimized
- **Auth:** Google OAuth + Magic Link
- **Mobile:** PWA first → Capacitor later
- **Admin:** Drizzle Studio (no custom panel)
- **UGC:** Form → manual review

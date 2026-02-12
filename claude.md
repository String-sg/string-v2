# String.sg v2 - Development Plan

**Last Updated:** 2026-02-12
**Status:** Phase 4 Complete + UI Design System Established

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

### ✅ Phase 4: Authentication & User Features (COMPLETE)
- [x] Google OAuth integration with client-side auth
- [x] Persistent pinned apps (localStorage + user preferences)
- [x] App submission form for authenticated users
- [x] User dashboard with profile/submissions/submit tabs
- [x] Mobile-responsive pin/unpin with long-press interactions
- [x] **UI Design System**: String brand colors (#75F8CC mint, #33373B dark, #C0F4FB light)
- [x] **Component Architecture**: Reusable UI components (Button, Card, AppCard, Header)
- [x] **Profile Components**: Abstracted ProfileHeader, AppsList, ProfileFooter for dev/prod consistency
- [x] **Profile UX**: Apps ordered by user contributions first, profile info moved to bottom
- [x] **Development Mode**: DevProfileMock component for local testing without API dependencies
- [x] **Submission UX Improvements**:
  - Enhanced empty submissions state with actionable CTA (clickable + icon)
  - App name autocomplete to prevent duplicate submissions
  - Fixed modal styling to match String brand guidelines (mint green buttons)
  - Removed duplicate title in submission form
  - Submission modal accessible from both homepage and dashboard + buttons

### 🔲 Phase 5: Personal Profile Pages (NEXT)
- [ ] Email-prefix slug generation (e.g., `string.sg/lee-kh`)
- [ ] Public profile API (`/api/users/[slug]`)
- [ ] Personal launcher page (`/[slug]`) showing pinned + submitted apps
- [ ] Inline visibility controls with WYSIWYG public preview toggle
- [ ] Profile app management (add/remove from public profile)

### 🔲 Phase 6: PWA Support
- [ ] manifest.json for installability
- [ ] Service worker for offline caching
- [ ] Install prompt on mobile

### 🔲 Phase 7: Chrome Extension
- [ ] Manifest V3 setup
- [ ] New tab override + popup
- [ ] Drag-and-drop arrangement

---

## Tech Stack

| Layer | Technology | Status |
|-------|------------|--------|
| Frontend | React 19 + Vite 7 + TypeScript | ✅ |
| Styling | Tailwind CSS 4 + String Design System | ✅ |
| Components | Abstracted UI Library (Button, Card, etc.) | ✅ |
| Database | NeonDB (PostgreSQL) | ✅ |
| ORM | Drizzle | ✅ |
| API | Vercel Edge Functions | ✅ |
| Auth | NextAuth.js + Google OAuth | ✅ |
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
│   ├── apps.ts              # GET /api/apps - Edge function ✅
│   └── auth/
│       └── [...nextauth].ts # NextAuth.js configuration ✅
├── data/
│   ├── schools.json         # 320 MOE schools ✅
│   └── apps-seed.json       # 42 apps with metadata ✅
├── scripts/
│   ├── scrape-schools.ts    # School directory scraper ✅
│   └── seed-apps.ts         # Database seeder ✅
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx       # Reusable button component ✅
│   │   │   ├── Card.tsx         # Reusable card component ✅
│   │   │   ├── AppCard.tsx      # App display card ✅
│   │   │   ├── Header.tsx       # Navigation header ✅
│   │   │   └── Modal.tsx        # Modal component ✅
│   │   ├── profile/
│   │   │   ├── ProfileHeader.tsx # Profile info component ✅
│   │   │   ├── AppsList.tsx     # Apps grid with sorting ✅
│   │   │   └── ProfileFooter.tsx # Branded footer ✅
│   │   ├── dashboard/
│   │   │   └── MySubmissions.tsx # User submissions tab ✅
│   │   ├── AppSubmissionForm.tsx # App submission form with autocomplete ✅
│   │   ├── DevProfileMock.tsx   # Development profile mock ✅
│   │   ├── PersonalProfile.tsx  # Production profile page ✅
│   │   └── UserDashboard.tsx    # User dashboard ✅
│   ├── db/
│   │   ├── schema.ts        # Drizzle schema (8 tables) ✅
│   │   └── index.ts         # DB connection ✅
│   ├── lib/
│   │   └── auth.ts          # Auth utilities ✅
│   ├── types/
│   │   └── next-auth.d.ts   # NextAuth type extensions ✅
│   ├── App.tsx              # Main landing page ✅
│   ├── main.tsx             # React entry ✅
│   └── index.css            # Tailwind styles ✅
├── STYLING.md               # Design system documentation ✅
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

### 1. Implement Personal Profile Pages (Phase 5)

#### Database Schema Updates
```sql
-- Add slug to users table
ALTER TABLE users ADD COLUMN slug VARCHAR(255) UNIQUE;

-- Create profile apps table for public visibility control
CREATE TABLE user_profile_apps (
  user_id VARCHAR(255) REFERENCES users(id),
  app_id VARCHAR(255),
  app_type VARCHAR(20), -- 'pinned' or 'submitted'
  is_visible BOOLEAN DEFAULT true,
  display_order INTEGER,
  PRIMARY KEY (user_id, app_id, app_type)
);
```

#### API Routes to Create
```typescript
// /api/users/[slug].ts - Get public profile data
GET /api/users/john-doe
Response: { user: {...}, apps: [...] }

// /api/profile/apps.ts - Manage profile apps visibility
POST /api/profile/apps { appId, type, isVisible }
```

#### Components Architecture ✅ COMPLETE
```typescript
// ProfileHeader.tsx - Profile info display (abstracted) ✅
// AppsList.tsx - Apps grid with contribution ordering ✅
// ProfileFooter.tsx - Branded footer with SVG logo ✅
// DevProfileMock.tsx - Development testing component ✅
// PersonalProfile.tsx - Production profile page ✅

// UI Components Library ✅
// Button.tsx, Card.tsx, AppCard.tsx, Header.tsx ✅

// Design Features ✅
- User contributions ordered first before pinned apps
- Profile info moved to bottom for content-first UX
- String dark navbar (#33373B) for better contrast
- SVG logo in footer for improved readability
- Abstracted components prevent dev/prod inconsistencies
```

#### Implementation Approach
1. **Email-prefix slug generation**: Extract username from email (before @)
2. **API-first**: Public profiles served via `/api/users/[slug]`
3. **Dynamic routing**: `[slug].tsx` catches all profile URLs
4. **Public by default**: Profiles are public, apps visible by default
5. **Inline controls**: Toggle visibility with immediate preview
6. **Two app sources**: Pinned apps + submitted (approved) apps
7. **Profile-specific**: Users can hide apps from profile (different from unpinning)

#### User Flow
1. User signs in → slug auto-generated from email prefix
2. Profile automatically public at `string.sg/{slug}`
3. Dashboard shows "Profile Preview" toggle
4. When preview mode ON: Shows public view with visibility controls
5. Long-press on mobile reveals "Hide from profile" option
6. Desktop hover shows visibility toggle icon

### 2. Add PWA Support
```bash
# Create these files:
public/manifest.json    # PWA manifest
public/sw.js           # Service worker
```

### 3. Build Chrome Extension
```bash
mkdir extension
# Create manifest.json, popup.html, newtab.html
```

---

## Recent Improvements (2026-02-12)

### App Submission UX Overhaul
**Problem:** Submission flow was disconnected and modal didn't follow brand guidelines
**Solution:**
1. **Enhanced Empty State** - MySubmissions tab now shows actionable CTA with clickable + icon
2. **Autocomplete for Duplicates** - App name field queries existing apps and warns users about duplicates
3. **Brand Consistency** - Updated all modal styling to use String mint (#75F8CC) instead of generic blue
4. **Unified Access** - Submission modal accessible from both homepage + button and dashboard
5. **Cleaner UI** - Removed duplicate title, modal header now serves as the only title

**Technical Details:**
- `AppSubmissionForm.tsx`: Added autocomplete dropdown with real-time filtering
- `MySubmissions.tsx`: Enhanced empty state with interactive + button
- `App.tsx`: Added modal state and wired + button in header
- All inputs now use `focus:ring-string-mint` for consistent brand experience

---

## UGC Workflow

1. User clicks + icon (homepage or dashboard)
2. Modal opens with app submission form
3. User types app name → autocomplete suggests existing apps to prevent duplicates
4. If selecting existing app → yellow warning appears
5. Form validates and submits with `status: 'pending'`
6. **Submitter sees their app immediately in dashboard**
7. Admin reviews via Drizzle Studio
8. Approved → visible globally in app directory

---

## Decisions Made

- **ORM:** Drizzle (not Prisma) - edge/serverless optimized
- **Auth:** Google OAuth + Magic Link
- **Mobile:** PWA first → Capacitor later
- **Admin:** Drizzle Studio (no custom panel)
- **UGC:** Form → manual review

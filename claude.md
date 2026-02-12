# String.sg v2 - Development Plan

**Last Updated:** 2026-02-12
**Status:** Phase 4 Complete + UI Component Library Documented

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
- [x] **Styling Abstractions**: Complete UI component library with consistent patterns (see Component Library section below)

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
│   │   │   └── Header.tsx       # Navigation header ✅
│   │   ├── profile/
│   │   │   ├── ProfileHeader.tsx # Profile info component ✅
│   │   │   ├── AppsList.tsx     # Apps grid with sorting ✅
│   │   │   └── ProfileFooter.tsx # Branded footer ✅
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

## Component Library & Styling Architecture

### Overview
This section documents the abstracted UI components introduced in Phase 4. **Always reference this section before creating new components** to maintain consistency and prevent hardcoding styling patterns. See also: `STYLING.md` for design system guidelines.

---

### 🎨 Core UI Components (`src/components/ui/`)

#### **Button.tsx** - Variant-based Button System
**Purpose:** Primary action buttons with consistent styling across the app.

**Props:**
- `variant`: `'primary' | 'secondary' | 'text'` (default: `'primary'`)
- `size`: `'sm' | 'md' | 'lg'` (default: `'md'`)
- `disabled`: `boolean` (default: `false`)
- `onClick`, `className`, `children`

**Variants:**
```tsx
primary:   bg-string-mint text-string-dark hover:bg-string-mint-light
secondary: bg-white border border-gray-200 text-string-dark hover:bg-gray-50
text:      text-string-mint hover:text-string-mint-light (no background)
```

**Sizes:**
```tsx
sm: px-3 py-1.5 text-sm
md: px-4 py-2 text-sm
lg: px-6 py-3 text-base
```

**Usage Example:**
```tsx
<Button variant="primary" size="lg" onClick={handleSubmit}>
  Submit App
</Button>
```

**Best Practices:**
- ✅ Use `variant="primary"` for main CTAs
- ✅ Use `variant="secondary"` for cancel/dismiss actions
- ✅ Use `variant="text"` for inline/subtle actions
- ❌ DON'T hardcode colors directly on button elements

---

#### **Card.tsx** - Flexible Container Component
**Purpose:** Consistent container styling with optional hover effects.

**Props:**
- `hover`: `boolean` (default: `false`) - Enables border-string-mint and shadow on hover
- `onClick`: `() => void` - Makes card clickable
- `className`: string - Additional custom classes
- `children`: ReactNode

**Base Styling:**
```tsx
bg-white rounded-xl border border-gray-100 transition-colors
```

**With Hover:**
```tsx
hover:border-string-mint cursor-pointer hover:shadow-md
```

**Usage Example:**
```tsx
<Card hover onClick={() => navigate('/profile')}>
  <div className="p-6">Profile content</div>
</Card>
```

**Best Practices:**
- ✅ Use for content sections, list items, modals
- ✅ Enable `hover` prop for clickable cards
- ✅ Add padding via `className` or child wrapper
- ❌ DON'T create inline divs with repeated rounded-xl/border styles

---

#### **AppCard.tsx** - Specialized App Display Card
**Purpose:** Displays app information with consistent layout (used in grids/lists).

**Props:**
- `app`: Object with `{ id, name, description, tagline, logoUrl, category, url, type }`
- `onClick`: `() => void` - Card click handler

**Key Features:**
1. **Icon Fallback:** If no `logoUrl`, displays initials (first 2 letters) in mint-on-dark square
2. **Category Badge:** Rounded pill with mint background at 10% opacity
3. **Contributed Badge:** Shows "Contributed" tag for `type === 'submitted'` apps
4. **Hover Launch Icon:** External link icon appears on hover (top-right)
5. **Responsive Layout:** Flex with gap-4, shrink-0 icon, flex-1 content

**Styling Pattern:**
```tsx
group bg-white rounded-xl p-6 shadow-sm border border-gray-100
hover:border-string-mint hover:shadow-md transition-all cursor-pointer
```

**Best Practices:**
- ✅ Use for all app representations in grids/lists
- ✅ Pass complete app object (don't deconstruct prematurely)
- ✅ Leverage `group-hover:opacity-100` pattern for progressive disclosure
- ❌ DON'T create custom app cards with different layouts

---

#### **IconButton.tsx** - Icon-Only Button Wrapper
**Purpose:** Consistent styling for icon-based actions (settings, close, etc.).

**Props:**
- `size`: `'sm' | 'md' | 'lg'` (default: `'md'`)
- `onClick`, `title`, `className`, `children` (SVG icon)

**Sizes:**
```tsx
sm: w-6 h-6 (icon: w-3 h-3)
md: w-8 h-8 (icon: w-4 h-4)
lg: w-10 h-10 (icon: w-5 h-5)
```

**Styling:**
```tsx
rounded-lg flex items-center justify-center transition-all
text-gray-400 hover:bg-string-mint hover:text-string-dark
```

**Usage Example:**
```tsx
<IconButton size="md" onClick={handleClose} title="Close">
  <svg><!-- X icon --></svg>
</IconButton>
```

**Best Practices:**
- ✅ Use for toolbar actions, modal close buttons, utility icons
- ✅ Always include `title` prop for accessibility
- ✅ Wrap SVG content in children
- ❌ DON'T create inline buttons for icons without this component

---

#### **PinButton.tsx** - Pin/Unpin Toggle Button
**Purpose:** Toggle pinned state for apps (filled star when pinned).

**Props:**
- `isPinned`: `boolean` - Current pin state
- `onPin`: `() => void` - Pin handler
- `onUnpin`: `() => void` - Unpin handler
- `size`: `'sm' | 'md'` (default: `'md'`)
- `className`: string

**Visual States:**
```tsx
Pinned:   text-string-mint bg-string-mint/10 (filled star icon)
Unpinned: text-gray-400 hover:text-string-dark hover:bg-string-mint (outlined star)
```

**Key Behavior:**
- Calls `e.stopPropagation()` to prevent parent click events
- Shows appropriate title attribute ("Pin" or "Unpin")

**Usage Example:**
```tsx
<PinButton
  isPinned={pinnedApps.includes(app.id)}
  onPin={() => handlePin(app.id)}
  onUnpin={() => handleUnpin(app.id)}
/>
```

**Best Practices:**
- ✅ Use for app pin/favorite actions
- ✅ Let component handle event propagation
- ❌ DON'T create custom pin buttons with different icons

---

#### **LaunchButton.tsx** - External Link Button
**Purpose:** Opens app URL in new tab with security attributes.

**Props:**
- `url`: string - Target URL
- `size`: `'sm' | 'md'` (default: `'md'`)
- `className`: string

**Features:**
- Opens in new tab (`target="_blank"`)
- Security: `rel="noopener noreferrer"`
- Prevents click propagation (`e.stopPropagation()`)
- External link icon (arrow-up-right)

**Styling:**
```tsx
rounded-lg transition-colors text-gray-400
hover:text-string-dark hover:bg-string-mint
```

**Usage Example:**
```tsx
<LaunchButton url={app.url} size="md" />
```

**Best Practices:**
- ✅ Use for all external app launches
- ✅ Let component handle security attributes
- ❌ DON'T create inline `<a>` tags for external links

---

#### **Modal.tsx** - Accessible Modal Dialog
**Purpose:** Full-screen overlay dialog with accessibility features.

**Props:**
- `isOpen`: `boolean` - Modal visibility state
- `onClose`: `() => void` - Close handler
- `title`: string - Modal header title
- `size`: `'sm' | 'md' | 'lg' | 'xl'` (default: `'md'`)
- `children`: ReactNode - Modal content

**Sizes:**
```tsx
sm: max-w-md   (384px)
md: max-w-lg   (512px)
lg: max-w-2xl  (672px)
xl: max-w-4xl  (896px)
```

**Key Features:**
1. **Keyboard Support:** Escape key closes modal
2. **Body Scroll Lock:** Prevents background scrolling when open
3. **Click-Outside:** Backdrop click closes modal
4. **Close Button:** X icon in header
5. **Backdrop:** Semi-transparent black overlay (bg-opacity-50)

**Structure:**
```tsx
<Modal isOpen={open} onClose={handleClose} title="Submit App" size="lg">
  {/* Form or content */}
</Modal>
```

**Best Practices:**
- ✅ Use for forms, confirmations, detail views
- ✅ Set appropriate size based on content
- ✅ Always provide meaningful title
- ❌ DON'T create custom modal wrappers

---

#### **Header.tsx** - Page Header with Navigation
**Purpose:** Top navigation bar for detail/profile pages.

**Props:**
- `title`: string - Header title
- `subtitle`: string (optional) - Subtitle text
- `backUrl`: string (default: `'/'`) - Back button destination
- `rightContent`: ReactNode (optional) - Right-aligned content

**Styling:**
```tsx
bg-string-dark border-b border-gray-700
title: text-lg font-semibold text-string-mint
```

**Features:**
- Back button with String logo (green variant)
- Customizable right-side content area
- Optional subtitle display

**Usage Example:**
```tsx
<Header
  title="My Profile"
  backUrl="/dashboard"
  rightContent={<Button>Edit</Button>}
/>
```

---

#### **DashboardHeader.tsx** - Dashboard Navigation Header
**Purpose:** Complex header with tab navigation, user menu, and theme toggle.

**Props:**
- `isDark`: boolean - Current theme state
- `onToggleTheme`: `() => void` - Theme toggle handler
- `t`: `(light: string, dark: string) => string` - Theme helper function
- `activeTab`: `'profile' | 'submissions'` - Current active tab
- `onTabChange`: `(tab) => void` - Tab change handler
- `onSubmitApp`: `() => void` - Submit app button handler

**Features:**
1. **Back Button:** Returns to home (pushes state + logo)
2. **Tab Navigation:** "Submissions" and "Profile" tabs with border-bottom active state
3. **Submit App Button:** Plus icon button
4. **Theme Toggle:** Sun/moon icons
5. **User Menu:** Avatar/name button with dropdown (sign out option)
6. **Click-Outside Detection:** Closes menu when clicking elsewhere
7. **Responsive:** Hides logo on mobile, shows user initials only

**Styling:**
```tsx
bg-string-dark sticky top-0 z-20
Active tab: border-string-mint text-string-mint
Inactive tab: text-gray-400 hover:text-gray-200
```

**Best Practices:**
- ✅ Use as primary dashboard navigation
- ✅ Maintain sticky positioning for scroll context
- ❌ DON'T duplicate tab navigation patterns

---

### 👤 Profile Components (`src/components/profile/`)

#### **ProfileHeader.tsx** - Profile Information Card
**Purpose:** Displays user profile metadata (avatar, name, member date, contributions).

**Props:**
- `profile`: `{ name, slug, avatarUrl, memberSince }`
- `apps`: Array of apps (to count submitted apps)
- `className`: string (optional)

**Composition:**
- Wraps content in `Card` component
- Padding: `p-8`

**Features:**
1. **Avatar Display:** 20x20 rounded-2xl with initials fallback
2. **Name Display:** h1 (text-3xl font-bold)
3. **Member Since:** Formatted as "Month YYYY"
4. **Contributed Badge:** Only shows if user has submitted apps (counts `type === 'submitted'`)

**Layout:**
```tsx
Flex layout with gap-6:
- Avatar (w-20 h-20, shrink-0)
- Content (flex-1): Name → Member date → Badge
```

**Best Practices:**
- ✅ Use at top of profile pages
- ✅ Let component handle contribution counting
- ✅ Pass full app array for accurate counts
- ❌ DON'T manually construct profile headers

---

#### **AppsList.tsx** - Apps Grid with Sorting
**Purpose:** Grid display of user's apps with smart sorting (contributions first).

**Props:**
- `apps`: Array of app objects
- `userName`: string | null - For empty state message
- `onAppClick`: `(app) => void` - Card click handler

**Features:**
1. **Smart Sorting:** Submitted apps (`type === 'submitted'`) appear before pinned apps
2. **Responsive Grid:** 2 columns on mobile (`sm:grid-cols-2`), 3 on desktop (`lg:grid-cols-3`)
3. **Empty State:** Icon + message when no apps shared
4. **Unique Keys:** Uses `${app.type}-${app.id}` to prevent duplicate key issues

**Grid Styling:**
```tsx
grid gap-6 sm:grid-cols-2 lg:grid-cols-3
```

**Empty State:**
- Centered icon in gray circle
- "No Apps Shared" heading
- Personalized message with userName

**Best Practices:**
- ✅ Use for all app grid displays on profiles
- ✅ Let component handle sorting logic
- ✅ Pass userName for personalized empty state
- ❌ DON'T manually sort apps before passing to component

---

#### **ProfileFooter.tsx** - Branded Footer
**Purpose:** Consistent footer with "Powered by String" and logo.

**Features:**
- SVG logo inline (`/Brand Guidelines/4. Svg Separate Files/primary_dark.svg`)
- Link to home (`href="/"`)
- Hover effect on logo link

**Styling:**
```tsx
mt-16 pt-8 border-t border-gray-200 text-center
text-sm text-gray-500
```

**Usage:**
```tsx
<ProfileFooter />
```

**Best Practices:**
- ✅ Use at bottom of all public profile pages
- ✅ No props needed (fully self-contained)
- ❌ DON'T create custom footer variants

---

### 🔧 Development Components

#### **DevProfileMock.tsx** - Local Testing Component
**Purpose:** Mock profile page for development without API dependencies.

**Features:**
- Mock user data (name, slug, avatar, member date)
- Sample apps array (mix of pinned and submitted)
- Uses `ProfileHeader`, `AppsList`, and `ProfileFooter`
- Renders at `/dev-profile` route

**When to Use:**
- Local development without backend
- UI iteration and component testing
- Design reviews and demos

**Note:** Should NOT be deployed to production.

---

### 📋 Styling Patterns & Conventions

#### **Consistent Patterns Across Components**

| Pattern | Implementation | Where Used |
|---------|---------------|------------|
| **Hover → Mint** | `hover:border-string-mint`, `hover:bg-string-mint`, `hover:text-string-mint` | Cards, buttons, links |
| **Size Variants** | `sm`, `md`, `lg` props with consistent padding/dimensions | Buttons, icons, modals |
| **Rounded Corners** | `rounded-xl` (cards/buttons), `rounded-lg` (small elements), `rounded-2xl` (avatars) | All containers |
| **Transitions** | `transition-colors`, `transition-all duration-200` | Interactive elements |
| **Event Propagation** | `e.stopPropagation()` in nested interactive elements | PinButton, LaunchButton |
| **Initials Fallback** | First 2 letters of name, uppercase | AppCard, ProfileHeader |
| **Badge Style** | `px-3 py-1 rounded-full bg-string-mint/10 text-string-dark text-xs/sm font-medium` | Categories, tags |
| **Icon Sizing** | Component prop controls both button and icon dimensions | IconButton, PinButton |
| **Accessibility** | `title` attributes, semantic HTML, keyboard support | All interactive components |

---

### ⚠️ Anti-Patterns: What NOT to Do

**❌ AVOID THESE PRACTICES:**

1. **Hardcoding Colors**
   ```tsx
   // ❌ DON'T
   <button className="bg-[#75F8CC] text-[#33373B]">
   
   // ✅ DO
   <Button variant="primary">
   ```

2. **Inline Style Objects**
   ```tsx
   // ❌ DON'T
   <div style={{ backgroundColor: '#75F8CC', padding: '16px' }}>
   
   // ✅ DO
   <Card className="p-4 bg-string-mint">
   ```

3. **Duplicate Component Patterns**
   ```tsx
   // ❌ DON'T
   <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
   
   // ✅ DO
   <Card className="p-6">
   ```

4. **Custom Button Variants**
   ```tsx
   // ❌ DON'T
   <button className="bg-string-mint hover:bg-string-mint-light px-4 py-2">
   
   // ✅ DO
   <Button variant="primary" size="md">
   ```

5. **Inconsistent Sizing**
   ```tsx
   // ❌ DON'T
   <button className="px-5 py-2.5">  // non-standard sizing
   
   // ✅ DO
   <Button size="md">  // uses predefined sizes
   ```

6. **Manual Icon Styling**
   ```tsx
   // ❌ DON'T
   <button className="w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100">
     <svg>...</svg>
   </button>
   
   // ✅ DO
   <IconButton size="md">
     <svg>...</svg>
   </IconButton>
   ```

7. **Hardcoded Modal Structures**
   ```tsx
   // ❌ DON'T
   <div className="fixed inset-0 bg-black bg-opacity-50">
     <div className="bg-white rounded-xl max-w-lg">...</div>
   </div>
   
   // ✅ DO
   <Modal isOpen={open} onClose={close} size="md">...</Modal>
   ```

---

### 🎯 Decision Making Guide

**When building new features, ask:**

1. **Does a component already exist?**
   - Check `src/components/ui/` and `src/components/profile/` first
   - Review this documentation section

2. **Can I compose existing components?**
   - Example: Combine `Card` + `Button` + `IconButton` instead of creating new component

3. **Am I repeating styling patterns?**
   - If yes, extract to props or create new abstracted component

4. **Does this match the design system?**
   - Verify colors against STYLING.md
   - Use established size variants (sm/md/lg)
   - Follow spacing conventions (px-4, py-2, gap-4, etc.)

5. **Is this maintainable?**
   - Future developers should understand component usage from props
   - Avoid magic numbers or unexplained styling

---

### 📚 Related Documentation

- **STYLING.md**: Color palette, typography, layout standards, theme support
- **Component Files**: Browse `src/components/ui/` and `src/components/profile/` for implementation details
- **Design System**: Tailwind configuration in `tailwind.config.js`

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
- **Component Architecture:** Abstracted UI library in `src/components/ui/` with variant-based patterns
- **Styling System:** Tailwind + String Design System (see STYLING.md and Component Library section)
- **Profile Composition:** Separated ProfileHeader, AppsList, ProfileFooter for reusability
- **Development Testing:** DevProfileMock for API-independent local testing

---

## Important Notes for Future Development

### Before Adding New Components
1. **Check existing components first** - Review Component Library section above
2. **Consult STYLING.md** - Verify color usage and design patterns
3. **Avoid hardcoding** - Use abstracted components with props/variants
4. **Maintain consistency** - Follow established size variants (sm/md/lg) and spacing conventions
5. **Document changes** - Update this file if creating new reusable components

### Component Creation Checklist
- [ ] Does a similar component already exist?
- [ ] Can I compose existing components instead?
- [ ] Am I using String Design System colors (string-mint, string-dark)?
- [ ] Does it support size variants (sm/md/lg) if applicable?
- [ ] Have I included TypeScript types for all props?
- [ ] Is it documented in claude.md if it's reusable?

# String v2 Test Plan

Comprehensive test coverage derived from `claude.md` and current product flows. Split by unit tests (logic/components) and end-to-end (E2E) user journeys.

## Unit Tests
- **Auth**
  - `useAuth` returns authenticated state after mock sign-in; clears on sign-out.
  - AuthButton renders correct label/state for signed-in vs signed-out users.
  - AuthButton is disabled while loading to prevent duplicate actions.
- **App submission (new app)**
  - `AppSubmissionForm` validates required fields and blocks submit on empty name/URL.
  - Duplicate detection banner appears when existing app name is selected.
  - Submit button switches to “Add to profile and homepage” CTA when `fromProfile` is true.
  - Successful submit calls `/api/submissions` with `status: 'pending'`.
  - Submit button shows loading state while the request is in flight.
  - Duplicate submissions are prevented while the request is in flight.
- **Add existing app to profile/homepage**
  - `PersonalProfile` (and `DevProfileMock`) detect `?pin=<appId>&addToProfile=true` query params → call pin + `/api/profile/add-app`, then remove params via `history.replaceState`.
  - AppsList empty state shows “+ Add App” only when `isOwnProfile` is true; other viewers see neutral empty state.
  - App cards render remove affordance with neutral default + red hover, and loading spinner while `removing` is true.
- **Pin / Unpin (favorite)**
  - `PinButton` stops event propagation, toggles icon/title for pinned vs unpinned, and calls correct handler.
  - `usePreferences` persists pinned IDs to API/local storage and rehydrates on load.
- **Remove / hide app from profile**
  - App card remove handler invokes `/api/profile/manage` with correct payload and disables controls while in-flight.
  - Removing a submitted app keeps it in dashboard submissions list but removes it from profile grid.
- **App availability and links**
  - `getAppAvailability` flags intranet-only URLs.
  - `isIntranetUrl` returns true for intranet patterns used in the codebase (e.g., hosts containing `intranet.` or ending with `.internal`, `.corp`, `.local`).
  - `LaunchButton` sets `target="_blank"` + `rel="noopener noreferrer"` and stops propagation.
- **Search and filters**
  - Header search updates results; clearing query resets list.
  - Category filters show correct counts and respect featured bump rules when filtering.
- **Profile share copy**
  - Share action uses Clipboard API with `execCommand('copy')` fallback and shows toast on success/failure.
- **Submission list feedback**
  - Submissions list renders rejection reasons when provided by the API and hides the field when absent.

## End-to-End Tests
- **Authentication**
  - Sign in with Google mock succeeds, displays user avatar/name; sign out clears profile/homepage personalization.
  - Auth-guarded actions (submit app, pin) redirect to sign-in or show blocked state when unauthenticated.
- **Submit new app (pending approval)**
  - From homepage/dashboard, open “+”, fill the form with a new app, submit, see success toast, and verify the app appears in “My Submissions” with `pending` badge and is NOT in the public catalog until approved.
  - Validation errors shown for missing name/URL or invalid URL.
- **Add existing app to profile & homepage**
  - From own profile, click “+ Add App”, pick an existing app from autocomplete, click “Add to profile and homepage”, get redirected back with the app visible in the profile grid and pinned on the homepage; query params are cleared after refresh.
  - Duplicate prevention: selecting existing app in submission form shows warning and prevents duplicate submission.
- **Pin / Unpin (favorite)**
  - Pin app from homepage → app moves to pinned section + persists on reload; unpin removes it.
  - Pin/unpin available via swipe actions on mobile cards and via buttons on desktop.
- **Remove / hide app**
  - Remove app from profile grid using cross affordance → app disappears from profile but remains accessible in global catalog (if official) or in submissions list (if user-submitted).
  - Attempting to remove while request in-flight shows spinner and disables further clicks.
- **Approval workflow**
  - Admin approves a pending submission (via API/seed hook) → app becomes visible in global catalog and eligible for bump rules; user’s profile shows app as submitted with “Contributed” badge.
  - Rejected submission stays hidden from catalog; user still sees it in submissions with rejection reason.
- **Search & filtering**
  - Searching narrows apps; clearing restores list; filters by category show matching apps and maintain pinned state.
  - Featured/bump rules: featured app surfaces in banner during relevant time windows.
- **Profile sharing**
  - “Copy profile link” copies `https://string.sg/{slug}`; toast confirms; link opens public profile view without edit controls.
- **Deep links**
  - Visiting `/{slug}` for other users shows public view without “+ Add App” or removal controls.

## Future test coverage
- Add-to-profile redirect flow to verify: user lands on `?pin=<appId>&addToProfile=true` while signed out, gets sent to auth, is returned with intent preserved, and the pin + profile-add actions execute automatically.

import { useEffect, useState, useRef, type ReactElement } from 'react';
import { AuthButton } from './components/AuthButton';
import { Footer } from './components/Footer';
import { PinButton } from './components/ui/PinButton';
import { LaunchButton } from './components/ui/LaunchButton';
import { Modal } from './components/ui/Modal';
import { AppSubmissionForm } from './components/AppSubmissionForm';
import { usePreferences } from './hooks/usePreferences';
import { useSwipe } from './hooks/useSwipe';
import { useAuth } from './hooks/useAuth';

// ── Types ──────────────────────────────────────────────

interface App {
  id: string;
  name: string;
  slug: string;
  url: string;
  logoUrl: string | null;
  description: string | null;
  tagline: string | null;
  category: string;
  tags: string[];
  isOfficial: boolean;
  frequency: number;
  featured: boolean;
}

// ── Utilities ──────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

// ── Category Icons (inline SVGs) ──────────────────────

const CATEGORY_ICONS: Record<string, ReactElement> = {
  Administration: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  ),
  Teaching: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
  Communication: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  ),
  HR: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  Assessment: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  ),
  'Professional Development': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
    </svg>
  ),
  Productivity: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  'IT Support': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

const DEFAULT_ICON = (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
);

// ── Theme helper ──────────────────────────────────────

function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem('string-theme') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem('string-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = () => setIsDark((d) => !d);
  const t = (light: string, dark: string) => (isDark ? dark : light);

  return { isDark, toggle, t };
}

// ── Components ────────────────────────────────────────

function Header({
  searchQuery,
  setSearchQuery,
  searchInputRef,
  isDark,
  onToggleTheme,
  onSearchOpen,
  onOpenSubmitModal,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  isDark: boolean;
  onToggleTheme: () => void;
  onSearchOpen: () => void;
  onOpenSubmitModal: () => void;
}) {
  const { isAuthenticated } = useAuth();
  return (
    <header className="bg-string-dark sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <img
          src="/logo-green.svg"
          alt="String"
          className="h-7"
        />
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop search bar */}
          <div className="relative hidden sm:block">
            <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-72 px-4 py-2 pl-10 pr-16 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-string-mint bg-string-darker text-white placeholder-gray-400"
            />
            <kbd className="absolute right-3 top-2 text-xs px-1.5 py-0.5 rounded bg-string-darker text-gray-400">
              Cmd+K
            </kbd>
          </div>
          {/* Mobile search icon */}
          <button
            onClick={onSearchOpen}
            className="sm:hidden p-2 rounded-lg transition-colors hover:bg-string-darker text-gray-400"
            title="Search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Add App button for authenticated users */}
          {isAuthenticated && (
            <button
              onClick={onOpenSubmitModal}
              className="p-2 rounded-lg transition-colors hover:bg-string-darker text-gray-400 hover:text-string-mint"
              title="Submit new app"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          )}

          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg transition-colors hover:bg-string-darker text-gray-400"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}

function GreetingSection({ t }: { t: (l: string, d: string) => string }) {
  return (
    <div className="mb-6">
      <h1 className={`text-3xl font-bold ${t('text-string-dark', 'text-white')}`}>{getGreeting()}</h1>
      <p className={`text-sm mt-1 ${t('text-string-text-secondary', 'text-gray-400')}`}>
        Access your tools and resources.<span className="hidden sm:inline"> Press <kbd className={`text-xs px-1.5 py-0.5 rounded ${t('bg-gray-200 text-gray-600', 'bg-string-dark text-gray-400')}`}>Cmd+K</kbd> to quick-search.</span>
      </p>
    </div>
  );
}

function PinnedAppCard({
  app,
  onUnpin,
  t
}: {
  app: App;
  onUnpin: (id: string) => void;
  t: (l: string, d: string) => string;
}) {
  const swipeProps = useSwipe({
    onSwipeLeft: () => {},  // Show menu on swipe left
    threshold: 100
  });

  const handleClick = (e: React.MouseEvent) => {
    // If swipe menu is open, close it instead of navigating
    if (swipeProps.isSwipeMenuOpen) {
      e.preventDefault();
      swipeProps.closeSwipeMenu();
      return;
    }

    // Allow normal navigation
    swipeProps.onClick(e);
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      <a
        href={app.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl sm:min-w-[200px] transition-all duration-200 ${t(
          'bg-white border border-gray-100 hover:border-string-mint hover:shadow-sm',
          'bg-[#2a2d30] border border-[#3a3f44] hover:border-string-mint'
        )} ${swipeProps.isSwipeMenuOpen ? 'transform -translate-x-20' : ''}`}
        {...swipeProps}
        onClick={handleClick}
      >
      <div className="w-10 h-10 rounded-xl bg-string-dark flex items-center justify-center text-string-mint font-semibold text-sm shrink-0">
        {getInitials(app.name)}
      </div>
      <div className="text-left min-w-0">
        <div className={`text-sm font-medium truncate ${t('text-string-dark', 'text-white')}`}>{app.name}</div>
        <div className={`text-xs ${t('text-string-text-secondary', 'text-gray-400')}`}>{app.category}</div>
      </div>

      {/* Desktop: Show unpin button on hover */}
      <div
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onUnpin(app.id); }}
        className={`absolute top-1.5 right-1.5 transition-all duration-200 p-1 rounded-lg hover:bg-string-mint hover:text-string-dark ${t('text-string-text-secondary', 'text-gray-400')} cursor-pointer opacity-0 scale-75 sm:group-hover:opacity-100 sm:scale-100`}
        title="Unpin"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      </a>

      {/* Mobile swipe menu */}
      <div className={`absolute top-0 right-0 h-full flex items-center transition-all duration-200 ${
        swipeProps.isSwipeMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onUnpin(app.id); }}
          className="h-full px-3 bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
          title="Unpin"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        </button>
        <a
          href={app.url}
          target="_blank"
          rel="noopener noreferrer"
          className="h-full px-3 bg-string-mint text-string-dark flex items-center justify-center hover:bg-string-mint-light transition-colors"
          title="Open App"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </a>
      </div>
    </div>
  );
}

function PinnedAppsRow({
  apps,
  onUnpin,
  t,
}: {
  apps: App[];
  onUnpin: (id: string) => void;
  t: (l: string, d: string) => string;
}) {
  if (apps.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-4 h-4 text-string-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
        <span className={`text-sm font-semibold ${t('text-string-dark', 'text-white')}`}>Your Pinned Apps</span>
        <span className="bg-string-mint text-string-dark text-xs font-semibold px-2 py-0.5 rounded-full">{apps.length}</span>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 sm:overflow-x-auto pb-2">
        {apps.map((app) => (
          <PinnedAppCard
            key={app.id}
            app={app}
            onUnpin={onUnpin}
            t={t}
          />
        ))}
      </div>
    </div>
  );
}

function CategorySidebar({
  categories,
  selectedCategory,
  onSelect,
  totalCount,
  t,
}: {
  categories: { name: string; count: number }[];
  selectedCategory: string | null;
  onSelect: (cat: string | null) => void;
  totalCount: number;
  t: (l: string, d: string) => string;
}) {
  return (
    <aside className="hidden md:block w-56 shrink-0">
      <div className={`text-xs font-semibold uppercase tracking-wider mb-3 ${t('text-gray-500', 'text-gray-400')}`}>Categories</div>
      <nav className="flex flex-col gap-0.5">
        <button
          onClick={() => onSelect(null)}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
            selectedCategory === null
              ? 'bg-string-mint/10 text-string-mint-dark font-medium'
              : `${t('text-gray-700', 'text-gray-300')} hover:bg-gray-100/10 hover:text-string-text-primary`
          }`}
        >
          {DEFAULT_ICON}
          <span className="flex-1">All</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            selectedCategory === null
              ? 'bg-string-mint/20 text-string-mint-dark'
              : t('bg-gray-500/10 text-gray-600', 'bg-gray-500/20 text-gray-400')
          }`}>{totalCount}</span>
        </button>
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => onSelect(cat.name)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
              selectedCategory === cat.name
                ? 'bg-string-mint/10 text-string-mint-dark font-medium'
                : `${t('text-gray-700', 'text-gray-300')} hover:bg-gray-100/10 hover:text-string-text-primary`
            }`}
          >
            {CATEGORY_ICONS[cat.name] || DEFAULT_ICON}
            <span className="flex-1">{cat.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              selectedCategory === cat.name
                ? 'bg-string-mint/20 text-string-mint-dark'
                : t('bg-gray-500/10 text-gray-600', 'bg-gray-500/20 text-gray-400')
            }`}>{cat.count}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

function CategoryDropdown({
  categories,
  selectedCategory,
  onSelect,
  totalCount,
  t,
}: {
  categories: { name: string; count: number }[];
  selectedCategory: string | null;
  onSelect: (cat: string | null) => void;
  totalCount: number;
  t: (l: string, d: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const selectedLabel = selectedCategory || 'All';
  const selectedCount = selectedCategory
    ? categories.find((c) => c.name === selectedCategory)?.count ?? 0
    : totalCount;

  return (
    <div className="md:hidden mb-4 relative">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors bg-string-mint/10 text-string-mint-dark border border-string-mint/20`}
      >
        {CATEGORY_ICONS[selectedLabel] || DEFAULT_ICON}
        <span className="flex-1 text-left">{selectedLabel}</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-string-mint/20 text-string-mint-dark">{selectedCount}</span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div className={`absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-20 shadow-lg ${t(
          'bg-white border border-gray-200',
          'bg-[#2a2d30] border border-[#3a3f44]'
        )}`}>
          <button
            onClick={() => { onSelect(null); setOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors text-left ${
              selectedCategory === null
                ? 'bg-string-mint/10 text-string-mint-dark font-medium'
                : `${t('text-gray-700', 'text-gray-300')} hover:bg-gray-100/10`
            }`}
          >
            {DEFAULT_ICON}
            <span className="flex-1">All</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              selectedCategory === null
                ? 'bg-string-mint/20 text-string-mint-dark'
                : t('bg-gray-500/10 text-gray-600', 'bg-gray-500/20 text-gray-400')
            }`}>{totalCount}</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => { onSelect(cat.name); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors text-left ${
                selectedCategory === cat.name
                  ? 'bg-string-mint/10 text-string-mint-dark font-medium'
                  : `${t('text-gray-700', 'text-gray-300')} hover:bg-gray-100/10`
              }`}
            >
              {CATEGORY_ICONS[cat.name] || DEFAULT_ICON}
              <span className="flex-1">{cat.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                selectedCategory === cat.name
                  ? 'bg-string-mint/20 text-string-mint-dark'
                  : t('bg-gray-500/10 text-gray-600', 'bg-gray-500/20 text-gray-400')
              }`}>{cat.count}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AppGridCard({
  app,
  isPinned,
  onPin,
  onUnpin,
  onSelect,
  showCategory,
  t,
}: {
  app: App;
  isPinned: boolean;
  onPin: (id: string) => void;
  onUnpin: (id: string) => void;
  onSelect: (app: App) => void;
  showCategory: boolean;
  t: (l: string, d: string) => string;
}) {
  const swipeProps = useSwipe({
    onSwipeLeft: () => {},  // Show menu on swipe left
    threshold: 100
  });

  const handleClick = () => {
    // If swipe menu is open, close it instead of selecting
    if (swipeProps.isSwipeMenuOpen) {
      swipeProps.closeSwipeMenu();
      return;
    }
    onSelect(app);
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div
        onClick={handleClick}
        className={`group relative flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200 ${t(
          'bg-white border border-gray-100 hover:border-string-mint hover:shadow-sm',
          'bg-[#2a2d30] border border-[#3a3f44] hover:border-string-mint'
        )} ${swipeProps.isSwipeMenuOpen ? 'transform -translate-x-20' : ''}`}
        {...swipeProps}
      >
      <div className="w-11 h-11 rounded-xl bg-string-dark flex items-center justify-center text-string-mint font-semibold text-sm shrink-0">
        {app.logoUrl ? (
          <img src={app.logoUrl} alt={app.name} className="w-7 h-7 object-contain rounded-[15px]" />
        ) : (
          getInitials(app.name)
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className={`text-sm font-medium truncate ${t('text-string-dark', 'text-white')}`}>{app.name}</div>
        <div className={`text-xs line-clamp-1 ${t('text-string-text-secondary', 'text-gray-400')}`}>{app.tagline || app.description}</div>
        {showCategory && (
          <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full mt-1 bg-[#C0F4FB] text-[#0B5563]">{app.category}</span>
        )}
      </div>
        {/* Desktop action buttons - show on hover */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); isPinned ? onUnpin(app.id) : onPin(app.id); }}
            className={`p-1.5 rounded-lg transition-colors ${
              isPinned
                ? 'text-string-mint bg-string-mint/10'
                : t('text-gray-400 hover:text-string-dark hover:bg-string-mint', 'text-gray-500 hover:text-string-dark hover:bg-string-mint')
            }`}
            title={isPinned ? 'Unpin' : 'Pin'}
          >
            <svg className="w-4 h-4" fill={isPinned ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </button>
          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`p-1.5 rounded-lg transition-colors ${t('text-gray-400 hover:text-string-dark hover:bg-string-mint', 'text-gray-500 hover:text-string-dark hover:bg-string-mint')}`}
            title="Open in new tab"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </a>
      </div>
      </div>

      {/* Mobile swipe menu */}
      <div className={`absolute top-0 right-0 h-full flex items-center transition-all duration-200 ${
        swipeProps.isSwipeMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); isPinned ? onUnpin(app.id) : onPin(app.id); }}
          className={`h-full px-3 flex items-center justify-center hover:opacity-80 transition-colors ${
            isPinned ? 'bg-red-500 text-white' : 'bg-string-mint text-string-dark'
          }`}
          title={isPinned ? 'Unpin' : 'Pin'}
        >
          <svg className="w-4 h-4" fill={isPinned ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        </button>
        <a
          href={app.url}
          target="_blank"
          rel="noopener noreferrer"
          className="h-full px-3 bg-string-mint text-string-dark flex items-center justify-center hover:bg-string-mint-light transition-colors"
          title="Open App"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
        </a>
      </div>
    </div>
  );
}

function FeaturedSection({
  featuredApps,
  onSelectApp,
  pinnedApps,
  onPin,
  onUnpin,
  t,
}: {
  featuredApps: App[];
  onSelectApp: (app: App) => void;
  pinnedApps: string[];
  onPin: (id: string) => void;
  onUnpin: (id: string) => void;
  t: (l: string, d: string) => string;
}) {
  if (featuredApps.length === 0) return null;

  const primary = featuredApps[0];
  const secondary = featuredApps.slice(1);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-4 h-4 text-string-mint" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
        <span className={`text-sm font-semibold ${t('text-string-dark', 'text-white')}`}>Featured</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div
          onClick={() => onSelectApp(primary)}
          className="lg:col-span-2 relative rounded-2xl p-6 cursor-pointer overflow-hidden bg-gradient-to-br from-string-dark to-string-darker text-white group"
        >
          <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-string-mint/10 blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-string-mint/20 flex items-center justify-center text-string-mint font-bold text-lg">
                {getInitials(primary.name)}
              </div>
              <span className="bg-string-mint/20 text-string-mint text-xs font-medium px-2 py-1 rounded-full">New</span>
            </div>
            <h3 className="text-xl font-bold mb-1">{primary.name}</h3>
            <p className="text-gray-300 text-sm mb-1">{primary.tagline || primary.description}</p>
            <span className="text-xs text-gray-400">{primary.category}</span>
          </div>
          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-20">
            <PinButton
              isPinned={pinnedApps.includes(primary.id)}
              onPin={() => onPin(primary.id)}
              onUnpin={() => onUnpin(primary.id)}
              className="text-gray-300"
            />
            <LaunchButton
              url={primary.url}
              className="text-gray-300"
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {secondary.map((app) => (
            <div
              key={app.id}
              onClick={() => onSelectApp(app)}
              className={`group relative flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-colors flex-1 ${t(
                'bg-white border border-gray-100 hover:border-string-mint',
                'bg-[#2a2d30] border border-[#3a3f44] hover:border-string-mint'
              )}`}
            >
              <div className="w-10 h-10 rounded-xl bg-string-dark flex items-center justify-center text-string-mint font-semibold text-sm shrink-0">
                {getInitials(app.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className={`text-sm font-medium ${t('text-string-dark', 'text-white')}`}>{app.name}</div>
                <div className={`text-xs line-clamp-1 ${t('text-string-text-secondary', 'text-gray-400')}`}>{app.tagline || app.description}</div>
                <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full mt-1 bg-[#C0F4FB] text-[#0B5563]">{app.category}</span>
              </div>
              {/* Action buttons */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); pinnedApps.includes(app.id) ? onUnpin(app.id) : onPin(app.id); }}
                  className={`p-1.5 rounded-lg transition-colors ${
                    pinnedApps.includes(app.id)
                      ? 'text-string-mint bg-string-mint/10'
                      : t('text-gray-400 hover:text-string-dark hover:bg-string-mint', 'text-gray-500 hover:text-string-dark hover:bg-string-mint')
                  }`}
                  title={pinnedApps.includes(app.id) ? 'Unpin' : 'Pin'}
                >
                  <svg className="w-4 h-4" fill={pinnedApps.includes(app.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a .563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </button>
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={`p-1.5 rounded-lg transition-colors ${t('text-gray-400 hover:text-string-dark hover:bg-string-mint', 'text-gray-500 hover:text-string-dark hover:bg-string-mint')}`}
                  title="Open in new tab"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SearchModal({
  open,
  onClose,
  apps,
  pinnedApps,
  recentApps,
  onOpenApp,
  t,
}: {
  open: boolean;
  onClose: () => void;
  apps: App[];
  pinnedApps: App[];
  recentApps: App[];
  onOpenApp: (app: App) => void;
  t: (l: string, d: string) => string;
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  const filtered = query
    ? apps.filter(
        (a) =>
          a.name.toLowerCase().includes(query.toLowerCase()) ||
          a.category.toLowerCase().includes(query.toLowerCase()) ||
          a.tagline?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (app: App) => {
    onOpenApp(app);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filtered.length > 0) {
      handleSelect(filtered[0]);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      <div className="fixed inset-x-0 top-0 z-50 flex justify-center pt-[15vh] px-4">
        <div className={`w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl ${t('bg-white', 'bg-[#1e2124]')}`}>
          <div className={`flex items-center gap-3 px-4 py-3 border-b ${t('border-gray-200', 'border-[#3a3f44]')}`}>
            <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search apps, categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`flex-1 bg-transparent text-sm outline-none placeholder-gray-400 ${t('text-string-dark', 'text-white')}`}
            />
            <button onClick={onClose} className={`p-1 rounded-lg transition-colors ${t('hover:bg-gray-100 text-gray-400', 'hover:bg-[#2a2d30] text-gray-500')}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="max-h-[50vh] overflow-y-auto py-2">
            {query ? (
              filtered.length === 0 ? (
                <div className={`px-4 py-8 text-center text-sm ${t('text-gray-400', 'text-gray-500')}`}>
                  No apps found
                </div>
              ) : (
                filtered.slice(0, 8).map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleSelect(app)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${t(
                      'hover:bg-gray-50',
                      'hover:bg-[#2a2d30]'
                    )}`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-string-dark flex items-center justify-center text-string-mint font-semibold text-xs shrink-0">
                      {getInitials(app.name)}
                    </div>
                    <span className={`text-sm ${t('text-string-dark', 'text-white')}`}>{app.name}</span>
                  </button>
                ))
              )
            ) : (
              <>
                {pinnedApps.length > 0 && (
                  <div>
                    <div className={`flex items-center gap-2 px-4 py-2 text-xs font-medium ${t('text-gray-400', 'text-gray-500')}`}>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                      Pinned
                    </div>
                    {pinnedApps.map((app) => (
                      <button
                        key={app.id}
                        onClick={() => handleSelect(app)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${t(
                          'hover:bg-gray-50',
                          'hover:bg-[#2a2d30]'
                        )}`}
                      >
                        <div className="w-9 h-9 rounded-xl bg-string-dark flex items-center justify-center text-string-mint font-semibold text-xs shrink-0">
                          {getInitials(app.name)}
                        </div>
                        <span className={`text-sm ${t('text-string-dark', 'text-white')}`}>{app.name}</span>
                      </button>
                    ))}
                  </div>
                )}
                {recentApps.length > 0 && (
                  <div>
                    <div className={`flex items-center gap-2 px-4 py-2 text-xs font-medium ${t('text-gray-400', 'text-gray-500')}`}>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Recent
                    </div>
                    {recentApps.map((app) => (
                      <button
                        key={app.id}
                        onClick={() => handleSelect(app)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${t(
                          'hover:bg-gray-50',
                          'hover:bg-[#2a2d30]'
                        )}`}
                      >
                        <div className="w-9 h-9 rounded-xl bg-string-dark flex items-center justify-center text-string-mint font-semibold text-xs shrink-0">
                          {getInitials(app.name)}
                        </div>
                        <span className={`text-sm ${t('text-string-dark', 'text-white')}`}>{app.name}</span>
                      </button>
                    ))}
                  </div>
                )}
                {pinnedApps.length === 0 && recentApps.length === 0 && (
                  <div className={`px-4 py-8 text-center text-sm ${t('text-gray-400', 'text-gray-500')}`}>
                    Type to search apps
                  </div>
                )}
              </>
            )}
          </div>

          <div className={`flex items-center gap-4 px-4 py-2.5 border-t text-xs ${t('border-gray-200 text-gray-400', 'border-[#3a3f44] text-gray-500')}`}>
            <span className="flex items-center gap-1">
              <kbd className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${t('bg-gray-100 text-gray-500', 'bg-[#2a2d30] text-gray-400')}`}>Esc</kbd>
              close
            </span>
            <span className="flex items-center gap-1">
              <kbd className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${t('bg-gray-100 text-gray-500', 'bg-[#2a2d30] text-gray-400')}`}>Enter</kbd>
              open
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

function AppDetailSidebar({
  app,
  isPinned,
  onPin,
  onUnpin,
  onClose,
  t,
}: {
  app: App | null;
  isPinned: boolean;
  onPin: (id: string) => void;
  onUnpin: (id: string) => void;
  onClose: () => void;
  t: (l: string, d: string) => string;
}) {
  return (
    <>
      {app && <div className="fixed inset-0 bg-black/40 z-30" onClick={onClose} />}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-80 z-40 transform transition-transform duration-300 ease-in-out border-l overflow-y-auto ${
          app ? 'translate-x-0' : 'translate-x-full'
        } ${t('bg-white border-gray-200', 'bg-[#2a2d30] border-[#3a3f44]')}`}
      >
        {app && (
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <span className={`text-xs px-2 py-1 rounded-full ${t('bg-gray-100 text-gray-600', 'bg-string-darker text-gray-400')}`}>{app.category}</span>
              <button onClick={onClose} className={`p-1 rounded-lg transition-colors ${t('hover:bg-gray-100 text-gray-400', 'hover:bg-string-darker text-gray-500')}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-string-dark flex items-center justify-center text-string-mint font-bold text-2xl mb-3">
                {app.logoUrl ? <img src={app.logoUrl} alt={app.name} className="w-10 h-10 object-contain rounded-[15px]" /> : getInitials(app.name)}
              </div>
              <h2 className={`text-xl font-bold ${t('text-string-dark', 'text-white')}`}>{app.name}</h2>
              <p className={`text-sm mt-2 ${t('text-string-text-secondary', 'text-gray-400')}`}>{app.description}</p>
            </div>

            <div className="flex gap-2 mb-6">
              <a
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-string-mint text-string-dark font-medium py-2.5 rounded-xl hover:bg-string-mint-light transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                Open App
              </a>
              <button
                onClick={() => isPinned ? onUnpin(app.id) : onPin(app.id)}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isPinned
                    ? 'border-string-mint text-string-mint bg-string-mint/10'
                    : t('border-gray-200 text-gray-400 hover:border-string-mint hover:text-string-mint', 'border-string-border text-gray-500 hover:border-string-mint hover:text-string-mint')
                }`}
                title={isPinned ? 'Unpin' : 'Pin'}
              >
                <svg className="w-5 h-5" fill={isPinned ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(app.url)}
                className={`p-2.5 rounded-xl border transition-colors ${t(
                  'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600',
                  'border-string-border text-gray-500 hover:border-gray-500 hover:text-gray-300'
                )}`}
                title="Copy link"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 000 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
              </button>
            </div>

            <div className={`rounded-xl p-4 ${t('bg-gray-50', 'bg-string-darker')}`}>
              <div className={`text-xs font-semibold uppercase tracking-wider mb-3 ${t('text-string-text-secondary', 'text-gray-400')}`}>App Details</div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className={t('text-string-text-secondary', 'text-gray-400')}>Category</span>
                  <span className={`font-medium ${t('text-string-dark', 'text-white')}`}>{app.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={t('text-string-text-secondary', 'text-gray-400')}>Status</span>
                  <span className="text-string-mint flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-string-mint inline-block"></span>
                    Available
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={t('text-string-text-secondary', 'text-gray-400')}>Access</span>
                  <span className={`font-medium ${t('text-string-dark', 'text-white')}`}>{app.isOfficial ? 'MOE Staff' : 'Open Access'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

// ── Main App ──────────────────────────────────────────

export default function App() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [recentAppIds, setRecentAppIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('string-recent-apps');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { isDark, toggle: toggleTheme, t } = useTheme();
  const { preferences, togglePinnedApp } = usePreferences();

  useEffect(() => {
    localStorage.setItem('string-recent-apps', JSON.stringify(recentAppIds));
  }, [recentAppIds]);

  const addRecentApp = (id: string) => {
    setRecentAppIds((prev) => [id, ...prev.filter((p) => p !== id)].slice(0, 10));
  };

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      if (e.key === 'Escape') {
        if (searchModalOpen) {
          setSearchModalOpen(false);
        } else {
          setSelectedApp(null);
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchModalOpen]);

  useEffect(() => {
    async function fetchApps() {
      try {
        const res = await fetch('/api/apps');
        if (!res.ok) throw new Error('API unavailable');
        const contentType = res.headers.get('content-type');
        if (!contentType?.includes('application/json')) throw new Error('Not JSON');
        const data = await res.json();
        setApps(data.apps || []);
      } catch {
        try {
          const res = await fetch('/apps-seed.json');
          const data = await res.json();
          const seedApps = (data.apps || []).map((a: Record<string, unknown>, i: number) => ({
            id: String(i),
            name: a.name,
            slug: a.slug,
            url: a.url,
            logoUrl: a.logo_url || null,
            description: a.description || null,
            tagline: a.tagline || null,
            category: a.category as string,
            tags: (a.tags as string[]) || [],
            isOfficial: a.is_official ?? true,
            frequency: (a.frequency as number) || 0,
            featured: (a.featured as boolean) || false,
          }));
          setApps(seedApps);
        } catch (err) {
          console.error('Failed to load apps:', err);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchApps();
  }, []);

  const categories = [...new Set(apps.map((a) => a.category))].sort();
  const categoryCountMap = categories.reduce((acc, cat) => {
    acc[cat] = apps.filter((a) => a.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  const featuredApps = apps.filter((a) => a.featured);

  const filteredApps = apps.filter((app) => {
    const matchesCategory = !selectedCategory || app.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.tagline?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedApps = [...filteredApps].sort((a, b) => b.frequency - a.frequency);
  const pinnedApps = apps.filter((a) => preferences.pinnedApps.includes(a.id));

  const handlePin = (id: string) => togglePinnedApp(id);
  const handleUnpin = (id: string) => togglePinnedApp(id);

  const handleSubmitSuccess = () => {
    setSubmitModalOpen(false);
    // Optionally refresh apps list
    // fetchApps();
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${t('bg-string-bg', 'bg-string-darker')}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-string-mint"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${t('bg-string-bg', 'bg-string-darker')}`}>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchInputRef={searchInputRef}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onSearchOpen={() => setSearchModalOpen(true)}
        onOpenSubmitModal={() => setSubmitModalOpen(true)}
      />

      <SearchModal
        open={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        apps={apps}
        pinnedApps={pinnedApps}
        recentApps={apps.filter((a) => recentAppIds.includes(a.id))}
        onOpenApp={(app) => {
          addRecentApp(app.id);
          window.open(app.url, '_blank');
        }}
        t={t}
      />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        <GreetingSection t={t} />
        <PinnedAppsRow apps={pinnedApps} onUnpin={handleUnpin} t={t} />

        {/* Mobile category dropdown */}
        <CategoryDropdown
          categories={categories.map((c) => ({ name: c, count: categoryCountMap[c] }))}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
          totalCount={apps.length}
          t={t}
        />

        <div className="flex gap-6">
          {/* Desktop category sidebar */}
          <CategorySidebar
            categories={categories.map((c) => ({ name: c, count: categoryCountMap[c] }))}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
            totalCount={apps.length}
            t={t}
          />

          <div className="flex-1 min-w-0">

            {!selectedCategory && !searchQuery && (
              <FeaturedSection
                featuredApps={featuredApps}
                onSelectApp={setSelectedApp}
                pinnedApps={preferences.pinnedApps}
                onPin={handlePin}
                onUnpin={handleUnpin}
                t={t}
              />
            )}

            {sortedApps.length === 0 ? (
              <div className={`text-center py-12 ${t('text-string-text-secondary', 'text-gray-400')}`}>
                No apps found matching your criteria
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedApps.map((app) => (
                  <AppGridCard
                    key={app.id}
                    app={app}
                    isPinned={preferences.pinnedApps.includes(app.id)}
                    onPin={handlePin}
                    onUnpin={handleUnpin}
                    onSelect={setSelectedApp}
                    showCategory={!selectedCategory}
                    t={t}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <AppDetailSidebar
        app={selectedApp}
        isPinned={selectedApp ? preferences.pinnedApps.includes(selectedApp.id) : false}
        onPin={handlePin}
        onUnpin={handleUnpin}
        onClose={() => setSelectedApp(null)}
        t={t}
      />

      {/* Submit App Modal */}
      <Modal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        title="Submit New App"
        size="lg"
      >
        <AppSubmissionForm onSuccess={handleSubmitSuccess} />
      </Modal>

      <Footer t={t} />
    </div>
  );
}

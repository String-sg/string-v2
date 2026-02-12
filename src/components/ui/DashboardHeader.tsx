import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface DashboardHeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  t: (light: string, dark: string) => string;
  activeTab: 'profile' | 'submissions';
  onTabChange: (tab: 'profile' | 'submissions') => void;
  onSubmitApp: () => void;
}

export function DashboardHeader({
  isDark,
  onToggleTheme,
  t,
  activeTab,
  onTabChange,
  onSubmitApp
}: DashboardHeaderProps) {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <header className="bg-string-dark sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Back button with logo */}
          <button
            onClick={() => {
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="flex items-center gap-2 text-gray-400 hover:text-string-mint transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <img
              src="/logo-green.svg"
              alt="String"
              className="h-6 hidden sm:block"
            />
          </button>

          {/* Center - Navigation tabs */}
          <nav className="flex items-center space-x-8" aria-label="Dashboard navigation">
            <button
              onClick={() => onTabChange('submissions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'submissions'
                  ? 'border-string-mint text-string-mint'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
              }`}
            >
              Submissions
            </button>
            <button
              onClick={() => onTabChange('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'profile'
                  ? 'border-string-mint text-string-mint'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
              }`}
            >
              Profile
            </button>
          </nav>

          {/* Right side - Theme toggle, Submit app, User menu */}
          <div className="flex items-center gap-3">
            {/* Submit app button */}
            <button
              onClick={onSubmitApp}
              className="p-2 rounded-lg transition-colors hover:bg-string-darker text-gray-400 hover:text-string-mint"
              title="Submit new app"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>

            {/* Theme toggle */}
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

            {/* User menu */}
            {user && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center bg-white border border-gray-300 rounded-full sm:rounded-lg w-8 h-8 sm:w-auto sm:h-auto justify-center hover:bg-gray-50 transition-colors sm:px-3 sm:py-2"
                >
                  <span className="sm:hidden text-sm font-medium text-gray-700">
                    {user.name?.charAt(0)?.toUpperCase() || user.email.charAt(0)?.toUpperCase()}
                  </span>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user.name || user.email}
                  </span>
                </button>

                <div className={`absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-200 z-10 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                  <div className="py-1">
                    <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                      {user.email}
                    </div>
                    <button
                      onClick={signOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
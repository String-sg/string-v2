import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { SignInModal } from './SignInModal';
import { generateSlugFromEmail } from '../lib/slug-utils';

export function AuthButton() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const [showSignInModal, setShowSignInModal] = useState(false);

  console.log('AuthButton render - user:', user, 'isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

  if (isLoading) {
    return (
      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="relative group">
        {/* Mobile: Circular avatar with initial */}
        <button className="sm:hidden w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          {user.name?.charAt(0)?.toUpperCase() || user.email.charAt(0)?.toUpperCase()}
        </button>

        {/* Desktop: Full name/email */}
        <button className="hidden sm:flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
          <span className="text-sm font-medium text-gray-700">
            {user.name || user.email}
          </span>
        </button>

        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
          <div className="py-1">
            <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
              {user.email}
            </div>
            <a
              href={`/${generateSlugFromEmail(user.email)}`}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              My Launcher
            </a>
            <button
              onClick={() => {
                window.history.pushState({}, '', '/dashboard');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Dashboard
            </button>
            <button
              onClick={signOut}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowSignInModal(true)}
        className="border rounded-lg px-4 py-2 transition-colors text-sm font-medium"
        style={{
          borderColor: '#75F8CC',
          color: '#75F8CC'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#75F8CC';
          e.currentTarget.style.color = '#33373B';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#75F8CC';
        }}
      >
        Log in
      </button>

      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
      />
    </>
  );
}
import { useState, useEffect } from 'react';
import { UserDashboard } from './UserDashboard';
import { Terms } from './Terms';
import { Privacy } from './Privacy';
import { PersonalProfile } from './PersonalProfile';
import { DevProfileMock } from './DevProfileMock';
import { isReservedSlug } from '../lib/slug-utils';

interface RouterProps {
  children: React.ReactNode;
}

export function Router({ children }: RouterProps) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Simple client-side routing
  if (currentPath === '/dashboard') {
    return <UserDashboard />;
  }

  if (currentPath === '/terms') {
    return <Terms />;
  }

  if (currentPath === '/privacy') {
    return <Privacy />;
  }

  // Check for user profile routes (e.g., /lee-kh)
  // Must be a single path segment (no nested routes)
  if (currentPath !== '/' && currentPath.startsWith('/')) {
    const pathSegments = currentPath.split('/').filter(Boolean);

    // Only match single-segment paths
    if (pathSegments.length === 1) {
      const slug = pathSegments[0];

      // Only render profile if it's not a reserved slug
      if (!isReservedSlug(slug)) {
        // Use dev mock in development, real profile in production
        const isDevelopment = window.location.hostname === 'localhost' ||
                             window.location.hostname === '127.0.0.1';

        return isDevelopment ?
          <DevProfileMock slug={slug} /> :
          <PersonalProfile slug={slug} />;
      }
    }
  }

  return <>{children}</>;
}

// Navigation helper
export function navigateTo(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
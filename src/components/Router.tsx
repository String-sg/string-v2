import { useState, useEffect } from 'react';
import { UserDashboard } from './UserDashboard';
import { Terms } from './Terms';
import { Privacy } from './Privacy';

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

  return <>{children}</>;
}

// Navigation helper
export function navigateTo(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
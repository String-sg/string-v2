import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

interface UserPreferences {
  pinnedApps: string[];
  hiddenApps: string[];
  appArrangement: string[];
}

export function usePreferences() {
  const { isAuthenticated } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>({
    pinnedApps: [],
    hiddenApps: [],
    appArrangement: []
  });
  const [loading, setLoading] = useState(false);

  // Load preferences from API or localStorage
  useEffect(() => {
    if (isAuthenticated) {
      loadPreferences();
    } else {
      // Load from localStorage for guests
      const saved = localStorage.getItem('string-preferences');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setPreferences(parsed);
        } catch (error) {
          console.error('Failed to parse guest preferences from localStorage, clearing corrupted value.', error);
          localStorage.removeItem('string-preferences');
        }
      } else {
        // Migration: check for old pinned apps key and migrate to new preferences structure
        const oldPinnedApps = localStorage.getItem('string-pinned-apps');
        if (oldPinnedApps) {
          try {
            const parsedPinnedApps = JSON.parse(oldPinnedApps);
            const migratedPreferences = {
              pinnedApps: parsedPinnedApps,
              hiddenApps: [],
              appArrangement: []
            };
            setPreferences(migratedPreferences);
            // Save migrated preferences and remove old key
            localStorage.setItem('string-preferences', JSON.stringify(migratedPreferences));
            localStorage.removeItem('string-pinned-apps');
            console.log('Migrated pinned apps to new preferences structure');
          } catch (error) {
            console.error('Failed to migrate old pinned apps, clearing corrupted value.', error);
            localStorage.removeItem('string-pinned-apps');
          }
        }
      }
    }
  }, [isAuthenticated]);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/preferences');
      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);

    if (isAuthenticated) {
      // Save to database
      try {
        await fetch('/api/preferences', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPreferences)
        });
      } catch (error) {
        console.error('Failed to save preferences:', error);
      }
    } else {
      // Save to localStorage for guests
      localStorage.setItem('string-preferences', JSON.stringify(newPreferences));
    }
  };

  const togglePinnedApp = (appId: string) => {
    const pinnedApps = preferences.pinnedApps.includes(appId)
      ? preferences.pinnedApps.filter(id => id !== appId)
      : [...preferences.pinnedApps, appId];

    updatePreferences({ pinnedApps });
  };

  const toggleHiddenApp = (appId: string) => {
    const hiddenApps = preferences.hiddenApps.includes(appId)
      ? preferences.hiddenApps.filter(id => id !== appId)
      : [...preferences.hiddenApps, appId];

    updatePreferences({ hiddenApps });
  };

  return {
    preferences,
    loading,
    togglePinnedApp,
    toggleHiddenApp,
    updatePreferences
  };
}
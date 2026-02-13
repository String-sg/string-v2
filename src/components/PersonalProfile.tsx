import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePreferences } from '../hooks/usePreferences';
import { useToast } from '../hooks/useToast';
import { AppsList } from './profile/AppsList';
import { ProfileHeader } from './profile/ProfileHeader';
import { ProfileFooter } from './profile/ProfileFooter';
import { ToastContainer } from './ToastContainer';
import { Modal } from './ui/Modal';
import { AppSubmissionForm } from './AppSubmissionForm';

interface ProfileApp {
  id: string;
  name: string;
  slug: string | null;
  url: string;
  logoUrl: string | null;
  description: string | null;
  tagline: string | null;
  category: string;
  type: 'pinned' | 'submitted';
}

interface ProfileData {
  profile: {
    name: string | null;
    slug: string;
    avatarUrl: string | null;
    memberSince: string;
  };
  apps: ProfileApp[];
}

export function PersonalProfile({ slug }: { slug: string }) {
  const { user } = useAuth();
  const { preferences, togglePinnedApp } = usePreferences();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);

  // Check if viewing own profile
  const isOwnProfile = user?.email?.split('@')[0]?.toLowerCase().replace(/[^a-z0-9]/g, '-') === slug;

  useEffect(() => {
    loadProfile();
  }, [slug]);

  // Handle pin and addToProfile query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pinId = params.get('pin');
    const addToProfile = params.get('addToProfile');

    if (pinId && addToProfile === 'true' && isOwnProfile && user) {
      // Pin to homepage
      const alreadyPinned = preferences.pinnedApps?.includes(pinId);
      if (!alreadyPinned) {
        togglePinnedApp(pinId);
      }

      // Add to profile (make API call)
      addAppToProfile(pinId);

      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
      
      // Reload profile to show new app
      setTimeout(() => loadProfile(), 500);
    }
  }, [slug, isOwnProfile, user, preferences.pinnedApps, togglePinnedApp]);

  const addAppToProfile = async (appId: string) => {
    if (!user?.id) {
      console.error('User ID not available');
      return;
    }

    try {
      const response = await fetch('/api/profile/add-app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appId, userId: user.id })
      });

      if (!response.ok) {
        console.error('Failed to add app to profile');
      }
    } catch (error) {
      console.error('Error adding app to profile:', error);
    }
  };

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/profile/${slug}`);

      if (response.status === 404) {
        setError('Profile not found');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to load profile');
      }

      const data = await response.json();
      setProfileData(data);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAppClick = (app: ProfileApp) => {
    // Track app launch if needed
    window.open(app.url, '_blank', 'noopener,noreferrer');
  };

  const handleAddApp = () => {
    setSubmitModalOpen(true);
  };

  const handleSubmitSuccess = () => {
    setSubmitModalOpen(false);
    // Refresh profile data
    loadProfile();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            {error === 'Profile not found' ? 'Profile Not Found' : 'Error Loading Profile'}
          </h1>
          <p className="text-gray-600 mb-4">
            {error === 'Profile not found'
              ? "This profile doesn't exist or has been removed."
              : 'Something went wrong while loading this profile.'}
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            ← Back to String
          </button>
        </div>
      </div>
    );
  }

  const { profile, apps } = profileData;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Profile Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
        <AppsList
          apps={apps}
          userName={profile.name}
          onAppClick={handleAppClick}
          isOwnProfile={isOwnProfile}
          onAddApp={handleAddApp}
        />

        <ProfileHeader
          profile={profile}
          apps={apps}
          className="mt-16"
        />
      </main>

      <ProfileFooter profile={profile} />

      {/* Add App Modal */}
      <Modal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        title="Add App to Profile"
      >
        <AppSubmissionForm
          onSuccess={handleSubmitSuccess}
          fromProfile={true}
        />
      </Modal>
    </div>
  );
}
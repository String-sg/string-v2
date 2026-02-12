import { useState, useEffect } from 'react';
import { AppsList } from './profile/AppsList';
import { ProfileHeader } from './profile/ProfileHeader';
import { ProfileFooter } from './profile/ProfileFooter';

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
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, [slug]);

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              String
            </button>

            <div className="text-sm text-gray-500">
              string.sg/{profile.slug}
            </div>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <AppsList
          apps={apps}
          userName={profile.name}
          onAppClick={handleAppClick}
        />

        <ProfileHeader
          profile={profile}
          apps={apps}
          className="mt-16"
        />

        <ProfileFooter />
      </main>
    </div>
  );
}
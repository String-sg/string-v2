import { useState, useEffect } from 'react';

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

function getInitials(name: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
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
              ? 'This profile doesn\\'t exist or has been removed.'
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
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-gray-800 flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name || 'User'}
                  className="w-20 h-20 rounded-2xl object-cover"
                />
              ) : (
                getInitials(profile.name)
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profile.name || 'String User'}
              </h1>
              <p className="text-gray-600 mb-4">
                Member since {new Date(profile.memberSince).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long'
                })}
              </p>

              {apps.length > 0 && (
                <div className="text-sm text-gray-500">
                  Sharing {apps.length} app{apps.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Apps Section */}
        {apps.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Apps Shared</h3>
            <p className="text-gray-500">
              {profile.name || 'This user'} hasn\\'t shared any apps on their profile yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {profile.name || 'User'}\\'s Apps
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {apps.map((app) => (
                <div
                  key={`${app.type}-${app.id}`}
                  onClick={() => handleAppClick(app)}
                  className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 hover:border-blue-200"
                >
                  <div className="flex items-start gap-4">
                    {/* App Icon */}
                    <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                      {app.logoUrl ? (
                        <img
                          src={app.logoUrl}
                          alt={app.name}
                          className="w-10 h-10 object-contain rounded-lg"
                        />
                      ) : (
                        getInitials(app.name)
                      )}
                    </div>

                    {/* App Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {app.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {app.tagline || app.description || 'No description available'}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-block text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                          {app.category}
                        </span>
                        {app.type === 'submitted' && (
                          <span className="inline-block text-xs font-medium px-2 py-1 rounded-full bg-green-50 text-green-700">
                            Contributed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Launch Icon */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Powered by{' '}
            <a href="/" className="text-blue-500 hover:text-blue-600 font-medium">
              String
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
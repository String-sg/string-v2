import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

// Mock profile data for development
const mockProfileData = {
  profile: {
    name: "John Doe",
    slug: "john-doe",
    avatarUrl: null,
    memberSince: new Date().toISOString(),
  },
  apps: [
    {
      id: "1",
      name: "SC Mobile",
      url: "https://scmobile.moe.edu.sg",
      logoUrl: null,
      description: "Student information system",
      tagline: "Access your student information",
      category: "Administration",
      type: "pinned" as const,
    },
    {
      id: "2",
      name: "Parents Gateway",
      url: "https://pg.moe.edu.sg",
      logoUrl: null,
      description: "Parent-school communication platform",
      tagline: "Stay connected with your child's school",
      category: "Communication",
      type: "pinned" as const,
    }
  ]
};

function getInitials(name: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function DevProfileMock({ slug }: { slug: string }) {
  const { user } = useAuth();
  const [loading] = useState(false);

  const handleAppClick = (app: any) => {
    window.open(app.url, '_blank', 'noopener,noreferrer');
  };

  // Use real user data if available, otherwise use mock
  const profileData = {
    profile: {
      name: user?.name || mockProfileData.profile.name,
      slug: slug,
      avatarUrl: user?.image || mockProfileData.profile.avatarUrl,
      memberSince: mockProfileData.profile.memberSince,
    },
    apps: mockProfileData.apps
  };

  const { profile, apps } = profileData;

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Development Banner */}
      <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-yellow-800">
            <span className="font-medium">Development Mode:</span> This is a mock profile page. In production, this will show real user data.
          </p>
        </div>
      </div>

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
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {profile.name || 'User'}'s Apps
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
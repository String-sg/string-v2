import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card } from './ui/Card';
import { AppCard } from './ui/AppCard';
import { Header } from './ui/Header';

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
      <div className="bg-string-mint/10 border-b border-string-mint/20 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-string-dark">
            <span className="font-semibold">Development Mode:</span> This is a mock profile page. In production, this will show real user data.
          </p>
        </div>
      </div>

      {/* Header */}
      <Header
        title=""
        subtitle={`string.sg/${profile.slug}`}
      />

      {/* Profile Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile Header */}
        <Card className="p-8 mb-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-string-dark flex items-center justify-center text-string-mint text-2xl font-bold shrink-0">
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
              <h1 className="text-3xl font-bold text-string-dark mb-2">
                {profile.name || 'String User'}
              </h1>
              <p className="text-gray-600 mb-4">
                Member since {new Date(profile.memberSince).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long'
                })}
              </p>

              {apps.length > 0 && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-string-mint/10 text-string-dark text-sm font-medium">
                  Sharing {apps.length} app{apps.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Apps Section */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-string-dark">
            {profile.name || 'User'}'s Apps
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {apps.map((app) => (
              <AppCard
                key={`${app.type}-${app.id}`}
                app={app}
                onClick={() => handleAppClick(app)}
              />
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
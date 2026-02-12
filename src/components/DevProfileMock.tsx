import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Header } from './ui/Header';
import { AppsList } from './profile/AppsList';
import { ProfileHeader } from './profile/ProfileHeader';
import { ProfileFooter } from './profile/ProfileFooter';

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
        title={`${profile.name || 'User'}'s Apps`}
        subtitle={`string.sg/${profile.slug}`}
      />

      {/* Profile Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
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
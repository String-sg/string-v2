import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePreferences } from '../hooks/usePreferences';
import { Header } from './ui/Header';
import { AppsList } from './profile/AppsList';
import { ProfileHeader } from './profile/ProfileHeader';
import { ProfileFooter } from './profile/ProfileFooter';
import { Modal } from './ui/Modal';
import { AppSubmissionForm } from './AppSubmissionForm';

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
  const { preferences, togglePinnedApp } = usePreferences();
  const [loading] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [mockApps, setMockApps] = useState(mockProfileData.apps);

  // Check if viewing own profile
  const isOwnProfile = user?.email?.split('@')[0]?.toLowerCase().replace(/[^a-z0-9]/g, '-') === slug;

  // Handle pin and addToProfile query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pinId = params.get('pin');
    const addToProfile = params.get('addToProfile');

    if (pinId && addToProfile === 'true' && isOwnProfile) {
      // Pin to homepage
      const alreadyPinned = preferences.pinnedApps?.includes(pinId);
      if (!alreadyPinned) {
        togglePinnedApp(pinId);
      }

      // In dev mode, just add a mock app to the list
      const newMockApp = {
        id: pinId,
        name: `App ${pinId}`,
        url: `https://example.com/${pinId}`,
        logoUrl: null,
        description: 'Added from autocomplete',
        tagline: 'Pinned app',
        category: 'Productivity',
        type: 'pinned' as const,
      };
      
      setMockApps(prev => {
        // Don't add if already exists
        if (prev.some(app => app.id === pinId)) return prev;
        return [...prev, newMockApp];
      });

      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [slug, isOwnProfile, preferences.pinnedApps, togglePinnedApp]);

  const handleAppClick = (app: any) => {
    window.open(app.url, '_blank', 'noopener,noreferrer');
  };

  const handleAddApp = () => {
    setSubmitModalOpen(true);
  };

  const handleSubmitSuccess = () => {
    setSubmitModalOpen(false);
    // TODO: Refresh profile data
  };

  // Use real user data if available, otherwise use mock
  const profileData = {
    profile: {
      name: user?.name || mockProfileData.profile.name,
      slug: slug,
      avatarUrl: user?.image || mockProfileData.profile.avatarUrl,
      memberSince: mockProfileData.profile.memberSince,
    },
    apps: mockApps
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Development Banner */}
      <div className="bg-string-mint/10 border-b border-string-mint/20 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-string-dark">
            <span className="font-semibold">Development Mode:</span> This is a mock profile page. In production, this will show real user data.
          </p>
        </div>
      </div>

      {/* Profile Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8">
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
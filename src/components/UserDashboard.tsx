import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AppSubmissionForm } from './AppSubmissionForm';

// Theme helper function (consistent with main app)
function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem('string-theme') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem('string-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = () => setIsDark((d) => !d);
  const t = (light: string, dark: string) => (isDark ? dark : light);

  return { isDark, toggle, t };
}

// Header component consistent with main app
function DashboardHeader({
  isDark,
  onToggleTheme,
  t
}: {
  isDark: boolean;
  onToggleTheme: () => void;
  t: (l: string, d: string) => string;
}) {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-string-dark sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => {
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          className="flex items-center gap-2 text-gray-400 hover:text-string-mint transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <img
            src="/logo-green.svg"
            alt="String"
            className="h-6"
          />
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg transition-colors hover:bg-string-darker text-gray-400"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>

          {user && (
            <div className="relative group">
              <button className="flex items-center bg-string-mint text-string-dark rounded-lg px-3 py-2 hover:bg-string-mint-light transition-colors text-sm font-medium">
                {user.name || user.email}
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="py-1">
                  <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                    {user.email}
                  </div>
                  <button
                    onClick={signOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

interface Submission {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

interface App {
  id: string;
  name: string;
  url: string;
  logoUrl: string | null;
  description: string | null;
  tagline: string | null;
  category: string;
}

interface ProfileApp {
  id: string;
  appType: 'pinned' | 'submitted';
  isVisible: boolean;
  displayOrder: number;
  app?: App;
  submission?: Submission;
}

interface ProfileData {
  user: {
    id: string;
    name: string | null;
    slug: string | null;
    email: string;
  };
  pinnedApps: App[];
  submissions: Submission[];
  profileApps: ProfileApp[];
}

export function UserDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const { isDark, toggle: toggleTheme, t } = useTheme();

  // Initialize active tab based on URL query parameter
  const getInitialTab = (): 'profile' | 'submissions' | 'submit' => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam === 'submit' || tabParam === 'submissions') {
      return tabParam as 'submit' | 'submissions';
    }
    return 'profile';
  };

  const [activeTab, setActiveTab] = useState<'profile' | 'submissions' | 'submit'>(getInitialTab);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'submissions') {
      loadSubmissions();
    }
    if (isAuthenticated && activeTab === 'profile') {
      loadProfileData();
    }
  }, [isAuthenticated, activeTab]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/submissions');
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions);
      }
    } catch (error) {
      console.error('Failed to load submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProfileData = async () => {
    if (!user?.id) return;

    try {
      setProfileLoading(true);
      const response = await fetch(`/api/profile/manage?userId=${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      }
    } catch (error) {
      console.error('Failed to load profile data:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const toggleAppVisibility = async (appId: string, submissionId: string | null, appType: 'pinned' | 'submitted', isVisible: boolean) => {
    if (!user?.id) return;

    try {
      const response = await fetch('/api/profile/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          appId: appType === 'pinned' ? appId : null,
          submissionId: appType === 'submitted' ? submissionId : null,
          appType,
          isVisible,
        }),
      });

      if (response.ok) {
        // Reload profile data to reflect changes
        loadProfileData();
      }
    } catch (error) {
      console.error('Failed to update app visibility:', error);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className={`min-h-screen ${t('bg-string-bg', 'bg-string-darker')}`}>
        <DashboardHeader isDark={isDark} onToggleTheme={toggleTheme} t={t} />
        <div className="max-w-4xl mx-auto p-6 pt-12">
          <div className={`${t('bg-white border border-gray-200', 'bg-[#2a2d30] border border-[#3a3f44]')} rounded-xl p-8 text-center`}>
            <h3 className={`text-lg font-semibold ${t('text-gray-800', 'text-white')} mb-2`}>Sign In Required</h3>
            <p className={`${t('text-gray-600', 'text-gray-400')}`}>Please sign in to access your dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'profile', name: 'Profile' },
              { id: 'submissions', name: 'My Submissions' },
              { id: 'submit', name: 'Submit App' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>

              {/* Basic Profile Info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{user.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                  </div>
                  {profileData?.user?.slug && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Public Profile</label>
                      <div className="mt-1 flex items-center space-x-2">
                        <a
                          href={`/${profileData.user.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          string.sg/{profileData.user.slug}
                        </a>
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Apps Management */}
              {profileLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : profileData ? (
                <div className="space-y-6">
                  {/* Pinned Apps Section */}
                  {profileData.pinnedApps.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Your Pinned Apps</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Control which of your pinned apps appear on your public profile.
                      </p>
                      <div className="space-y-3">
                        {profileData.pinnedApps.map((app) => {
                          const profileApp = profileData.profileApps.find(
                            p => p.appType === 'pinned' && p.app?.id === app.id
                          );
                          const isVisible = profileApp?.isVisible ?? false;

                          return (
                            <div key={app.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                              <div className="flex items-center space-x-3">
                                {app.logoUrl ? (
                                  <img src={app.logoUrl} alt={app.name} className="w-8 h-8 rounded" />
                                ) : (
                                  <div className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center text-sm font-medium">
                                    {app.name.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <h4 className="font-medium text-gray-900">{app.name}</h4>
                                  <p className="text-sm text-gray-600">{app.category}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => toggleAppVisibility(app.id, null, 'pinned', !isVisible)}
                                className={`px-3 py-1 text-xs rounded-full font-medium ${
                                  isVisible
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                              >
                                {isVisible ? 'Visible' : 'Hidden'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Approved Submissions Section */}
                  {profileData.submissions.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Your Approved Apps</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Control which of your submitted apps appear on your public profile.
                      </p>
                      <div className="space-y-3">
                        {profileData.submissions.map((submission) => {
                          const profileApp = profileData.profileApps.find(
                            p => p.appType === 'submitted' && p.submission?.id === submission.id
                          );
                          const isVisible = profileApp?.isVisible ?? false;

                          return (
                            <div key={submission.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-sm font-medium">
                                  {submission.name.charAt(0)}
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">{submission.name}</h4>
                                  <p className="text-sm text-gray-600">{submission.category}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => toggleAppVisibility(submission.id, submission.id, 'submitted', !isVisible)}
                                className={`px-3 py-1 text-xs rounded-full font-medium ${
                                  isVisible
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                              >
                                {isVisible ? 'Visible' : 'Hidden'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* No Apps Message */}
                  {profileData.pinnedApps.length === 0 && profileData.submissions.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Apps to Display</h3>
                      <p className="text-gray-600 mb-4">
                        Pin apps from the homepage or submit new apps to customize your profile.
                      </p>
                      <button
                        onClick={() => setActiveTab('submit')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Submit an App
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}

          {activeTab === 'submissions' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">My Submissions</h2>
              {loading ? (
                <p className="text-gray-600">Loading submissions...</p>
              ) : submissions.length === 0 ? (
                <p className="text-gray-600">You haven't submitted any apps yet.</p>
              ) : (
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <div key={submission.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">{submission.name}</h3>
                        {getStatusBadge(submission.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{submission.description}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Category: {submission.category || 'Uncategorized'}</span>
                        <span>Submitted: {new Date(submission.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'submit' && (
            <div>
              <AppSubmissionForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
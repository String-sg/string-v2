import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AppSubmissionForm } from './AppSubmissionForm';
import { DashboardHeader } from './ui/DashboardHeader';
import { MySubmissions } from './dashboard/MySubmissions';
import { Modal } from './ui/Modal';

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
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const { isDark, toggle: toggleTheme, t } = useTheme();

  // Initialize active tab based on URL query parameter - default to submissions
  const getInitialTab = (): 'profile' | 'submissions' => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam === 'profile') {
      return 'profile';
    }
    return 'submissions';
  };

  const [activeTab, setActiveTab] = useState<'profile' | 'submissions'>(getInitialTab);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'profile') {
      loadProfileData();
    }
  }, [isAuthenticated, activeTab]);

  // Handle tab changes and update URL
  const handleTabChange = (tab: 'profile' | 'submissions') => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState({}, '', url);
  };

  // Handle submit app modal
  const handleSubmitApp = () => {
    setShowSubmitModal(true);
  };

  const handleSubmitSuccess = () => {
    setShowSubmitModal(false);
    // Switch to submissions tab to see the new submission
    handleTabChange('submissions');
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
        <DashboardHeader
          isDark={isDark}
          onToggleTheme={toggleTheme}
          t={t}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onSubmitApp={handleSubmitApp}
        />
        <div className="max-w-4xl mx-auto p-6 pt-12">
          <div className={`${t('bg-white border border-gray-200', 'bg-[#2a2d30] border border-[#3a3f44]')} rounded-xl p-8 text-center`}>
            <h3 className={`text-lg font-semibold ${t('text-gray-800', 'text-white')} mb-2`}>Sign In Required</h3>
            <p className={`${t('text-gray-600', 'text-gray-400')}`}>Please sign in to access your dashboard.</p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className={`min-h-screen ${t('bg-string-bg', 'bg-string-darker')}`}>
      <DashboardHeader
        isDark={isDark}
        onToggleTheme={toggleTheme}
        t={t}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onSubmitApp={handleSubmitApp}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className={`${t('bg-white border border-gray-100', 'bg-[#2a2d30] border border-[#3a3f44]')} rounded-xl p-6`}>
                <h2 className={`text-xl font-semibold ${t('text-string-dark', 'text-white')}`}>Profile Settings</h2>

                {/* Basic Profile Info */}
                <div className={`${t('bg-gray-50', 'bg-string-darker')} rounded-xl p-6`}>
                  <h3 className={`text-lg font-medium ${t('text-string-dark', 'text-white')} mb-4`}>Basic Information</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${t('text-gray-700', 'text-gray-300')}`}>Name</label>
                      <p className={`mt-1 text-sm ${t('text-gray-900', 'text-white')}`}>{user.name || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${t('text-gray-700', 'text-gray-300')}`}>Email</label>
                      <p className={`mt-1 text-sm ${t('text-gray-900', 'text-white')}`}>{user.email}</p>
                    </div>
                  {profileData?.user?.slug && (
                    <div>
                        <label className={`block text-sm font-medium ${t('text-gray-700', 'text-gray-300')}`}>Public Profile</label>
                        <div className="mt-1 flex items-center space-x-2">
                          <a
                            href={`/${profileData.user.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-string-mint hover:text-string-mint-light text-sm font-medium transition-colors"
                          >
                            string.sg/{profileData.user.slug}
                          </a>
                          <svg className={`w-4 h-4 ${t('text-gray-400', 'text-gray-500')}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                      <h3 className={`text-lg font-medium ${t('text-string-dark', 'text-white')} mb-4`}>Your Pinned Apps</h3>
                      <p className={`text-sm ${t('text-gray-600', 'text-gray-400')} mb-4`}>
                        Control which of your pinned apps appear on your public profile.
                      </p>
                      <div className="space-y-3">
                        {profileData.pinnedApps.map((app) => {
                          const profileApp = profileData.profileApps.find(
                            p => p.appType === 'pinned' && p.app?.id === app.id
                          );
                          const isVisible = profileApp?.isVisible ?? false;

                          return (
                            <div key={app.id} className={`flex items-center justify-between p-4 ${t('bg-white border border-gray-200', 'bg-[#2a2d30] border border-[#3a3f44]')} rounded-xl transition-colors hover:border-string-mint`}>
                              <div className="flex items-center space-x-3">
                                {app.logoUrl ? (
                                  <img src={app.logoUrl} alt={app.name} className="w-10 h-10 rounded-xl" />
                                ) : (
                                  <div className="w-10 h-10 bg-string-dark rounded-xl flex items-center justify-center text-string-mint font-semibold text-sm">
                                    {app.name.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <h4 className={`font-medium ${t('text-string-dark', 'text-white')}`}>{app.name}</h4>
                                  <p className={`text-sm ${t('text-gray-600', 'text-gray-400')}`}>{app.category}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => toggleAppVisibility(app.id, null, 'pinned', !isVisible)}
                                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                                  isVisible
                                    ? 'bg-string-mint text-string-dark hover:bg-string-mint-light'
                                    : t('bg-gray-100 text-gray-700 hover:bg-gray-200', 'bg-[#3a3f44] text-gray-300 hover:bg-[#4a5058]')
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
                      <h3 className={`text-lg font-medium ${t('text-string-dark', 'text-white')} mb-4`}>Your Approved Apps</h3>
                      <p className={`text-sm ${t('text-gray-600', 'text-gray-400')} mb-4`}>
                        Control which of your submitted apps appear on your public profile.
                      </p>
                      <div className="space-y-3">
                        {profileData.submissions.map((submission) => {
                          const profileApp = profileData.profileApps.find(
                            p => p.appType === 'submitted' && p.submission?.id === submission.id
                          );
                          const isVisible = profileApp?.isVisible ?? false;

                          return (
                            <div key={submission.id} className={`flex items-center justify-between p-4 ${t('bg-white border border-gray-200', 'bg-[#2a2d30] border border-[#3a3f44]')} rounded-xl transition-colors hover:border-string-mint`}>
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-string-dark rounded-xl flex items-center justify-center text-string-mint font-semibold text-sm">
                                  {submission.name.charAt(0)}
                                </div>
                                <div>
                                  <h4 className={`font-medium ${t('text-string-dark', 'text-white')}`}>{submission.name}</h4>
                                  <p className={`text-sm ${t('text-gray-600', 'text-gray-400')}`}>{submission.category}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => toggleAppVisibility(submission.id, submission.id, 'submitted', !isVisible)}
                                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                                  isVisible
                                    ? 'bg-string-mint text-string-dark hover:bg-string-mint-light'
                                    : t('bg-gray-100 text-gray-700 hover:bg-gray-200', 'bg-[#3a3f44] text-gray-300 hover:bg-[#4a5058]')
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
                      <h3 className={`text-lg font-medium ${t('text-string-dark', 'text-white')} mb-2`}>No Apps to Display</h3>
                      <p className={`${t('text-gray-600', 'text-gray-400')} mb-4`}>
                        Pin apps from the homepage or submit new apps to customize your profile.
                      </p>
                      <button
                        onClick={() => setShowSubmitModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-string-dark bg-string-mint hover:bg-string-mint-light transition-colors"
                      >
                        Submit an App
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )}

        {activeTab === 'submissions' && (
          <MySubmissions t={t} onSubmitApp={handleSubmitApp} userId={user.id} />
        )}

        {/* Submit App Modal */}
        <Modal
          isOpen={showSubmitModal}
          onClose={() => setShowSubmitModal(false)}
          title="Submit New App"
          size="lg"
        >
          <AppSubmissionForm onSuccess={handleSubmitSuccess} />
        </Modal>
      </div>
    </div>
  );
}
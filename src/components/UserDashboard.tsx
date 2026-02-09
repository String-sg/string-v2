import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AppSubmissionForm } from './AppSubmissionForm';

interface Submission {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export function UserDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'submissions' | 'submit'>('profile');

  useEffect(() => {
    if (isAuthenticated && activeTab === 'submissions') {
      loadSubmissions();
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

  if (!isAuthenticated || !user) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Sign In Required</h3>
        <p className="text-gray-600">Please sign in to access your dashboard.</p>
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
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{user.name || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                </div>
              </div>
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
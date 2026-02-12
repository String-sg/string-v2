import { useState, useEffect } from 'react';

interface Submission {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  viewCount: number;
  clickCount: number;
}

interface MySubmissionsProps {
  t: (light: string, dark: string) => string;
  onSubmitApp: () => void;
}

export function MySubmissions({ t, onSubmitApp }: MySubmissionsProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSubmissions();
  }, []);

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

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: t('bg-yellow-100 text-yellow-800', 'bg-yellow-900/20 text-yellow-400'),
      approved: 'bg-string-mint/20 text-string-mint-dark',
      rejected: t('bg-red-100 text-red-800', 'bg-red-900/20 text-red-400')
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-lg font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getClickThroughRate = (views: number, clicks: number) => {
    if (views === 0) return '0%';
    return `${Math.round((clicks / views) * 100)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-string-mint"></div>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className={`${t('bg-gray-50', 'bg-string-darker')} rounded-xl p-8 text-center`}>
        <h3 className={`text-lg font-medium ${t('text-string-dark', 'text-white')} mb-2`}>No submissions yet</h3>
        <p className={`${t('text-gray-600', 'text-gray-400')} mb-6`}>Submit your first app below</p>
        <button
          onClick={onSubmitApp}
          className={`w-16 h-16 mx-auto rounded-full ${t('bg-gray-200 hover:bg-gray-300', 'bg-[#3a3f44] hover:bg-[#454a4f]')} flex items-center justify-center transition-colors cursor-pointer group`}
          title="Submit new app"
        >
          <svg className={`w-8 h-8 ${t('text-gray-400 group-hover:text-gray-600', 'text-gray-500 group-hover:text-gray-300')} transition-colors`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop table view */}
      <div className="hidden md:block">
        <div className={`${t('bg-white', 'bg-[#2a2d30]')} rounded-xl overflow-hidden`}>
          <div className={`px-6 py-4 border-b ${t('border-gray-200', 'border-[#3a3f44]')}`}>
            <h2 className={`text-lg font-semibold ${t('text-string-dark', 'text-white')}`}>My Submissions</h2>
            <p className={`text-sm mt-1 ${t('text-gray-600', 'text-gray-400')}`}>
              Track performance and manage your submitted apps
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${t('bg-gray-50', 'bg-string-darker')}`}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${t('text-gray-500', 'text-gray-400')} uppercase tracking-wider`}>
                    App
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${t('text-gray-500', 'text-gray-400')} uppercase tracking-wider`}>
                    Status
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${t('text-gray-500', 'text-gray-400')} uppercase tracking-wider`}>
                    Views
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${t('text-gray-500', 'text-gray-400')} uppercase tracking-wider`}>
                    Clicks
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${t('text-gray-500', 'text-gray-400')} uppercase tracking-wider`}>
                    CTR
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${t('text-gray-500', 'text-gray-400')} uppercase tracking-wider`}>
                    Submitted
                  </th>
                  <th className={`px-6 py-3 text-right text-xs font-medium ${t('text-gray-500', 'text-gray-400')} uppercase tracking-wider`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`${t('bg-white', 'bg-[#2a2d30]')} divide-y ${t('divide-gray-200', 'divide-[#3a3f44]')}`}>
                {submissions.map((submission) => (
                  <tr key={submission.id} className={`${t('hover:bg-gray-50', 'hover:bg-string-darker')} transition-colors`}>
                    <td className="px-6 py-4">
                      <div>
                        <div className={`font-medium ${t('text-string-dark', 'text-white')}`}>
                          {submission.name}
                        </div>
                        <div className={`text-sm ${t('text-gray-500', 'text-gray-400')}`}>
                          {submission.category || 'Uncategorized'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(submission.status)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${t('text-gray-900', 'text-white')}`}>
                        {submission.viewCount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${t('text-gray-900', 'text-white')}`}>
                        {submission.clickCount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${t('text-gray-900', 'text-white')}`}>
                        {getClickThroughRate(submission.viewCount, submission.clickCount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${t('text-gray-500', 'text-gray-400')}`}>
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className={`text-sm font-medium ${t('text-string-dark hover:text-string-darker', 'text-string-mint hover:text-string-mint-light')} transition-colors`}
                        title="Edit submission"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden space-y-4">
        <div className="mb-6">
          <h2 className={`text-lg font-semibold ${t('text-string-dark', 'text-white')}`}>My Submissions</h2>
          <p className={`text-sm mt-1 ${t('text-gray-600', 'text-gray-400')}`}>
            Track performance and manage your submitted apps
          </p>
        </div>

        {submissions.map((submission) => (
          <div key={submission.id} className={`${t('bg-white border border-gray-200', 'bg-[#2a2d30] border border-[#3a3f44]')} rounded-xl p-4 transition-colors hover:border-string-mint`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className={`font-medium ${t('text-string-dark', 'text-white')}`}>{submission.name}</h3>
                <p className={`text-sm ${t('text-gray-500', 'text-gray-400')}`}>{submission.category || 'Uncategorized'}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(submission.status)}
                <button
                  className={`p-1 rounded-lg transition-colors ${t('text-gray-400 hover:text-string-dark hover:bg-string-mint', 'text-gray-400 hover:text-string-mint hover:bg-string-mint/10')}`}
                  title="Edit submission"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-3">
              <div>
                <div className={`text-xs ${t('text-gray-500', 'text-gray-400')} uppercase tracking-wider mb-1`}>Views</div>
                <div className={`text-sm font-medium ${t('text-gray-900', 'text-white')}`}>
                  {submission.viewCount.toLocaleString()}
                </div>
              </div>
              <div>
                <div className={`text-xs ${t('text-gray-500', 'text-gray-400')} uppercase tracking-wider mb-1`}>Clicks</div>
                <div className={`text-sm font-medium ${t('text-gray-900', 'text-white')}`}>
                  {submission.clickCount.toLocaleString()}
                </div>
              </div>
              <div>
                <div className={`text-xs ${t('text-gray-500', 'text-gray-400')} uppercase tracking-wider mb-1`}>CTR</div>
                <div className={`text-sm font-medium ${t('text-gray-900', 'text-white')}`}>
                  {getClickThroughRate(submission.viewCount, submission.clickCount)}
                </div>
              </div>
            </div>

            <div className={`text-xs ${t('text-gray-500', 'text-gray-400')}`}>
              Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
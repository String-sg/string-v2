import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AppSubmissionForm {
  name: string;
  url: string;
  description: string;
  logoUrl: string;
  category: string;
}

interface AppSubmissionFormProps {
  onSuccess?: () => void;
  fromProfile?: boolean;
}

interface ExistingApp {
  id: string;
  name: string;
  url: string;
}

export function AppSubmissionForm({ onSuccess, fromProfile = false }: AppSubmissionFormProps = {}) {
  const { isAuthenticated, user } = useAuth();
  const [form, setForm] = useState<AppSubmissionForm>({
    name: '',
    url: '',
    description: '',
    logoUrl: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [existingApps, setExistingApps] = useState<ExistingApp[]>([]);
  const [filteredApps, setFilteredApps] = useState<ExistingApp[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedExistingApp, setSelectedExistingApp] = useState<ExistingApp | null>(null);

  const categories = [
    'Administration',
    'Teaching',
    'Communication',
    'HR',
    'Assessment',
    'Professional Development',
    'Productivity',
    'IT Support'
  ];

  // Fetch existing apps on mount
  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await fetch('/api/apps');
        if (response.ok) {
          const data = await response.json();
          const apps = data.apps.map((app: any) => ({
            id: app.id,
            name: app.name,
            url: app.url
          }));
          setExistingApps(apps);
        }
      } catch (error) {
        console.error('Failed to fetch apps:', error);
      }
    };
    fetchApps();
  }, []);

  // Filter apps based on input
  const handleNameChange = (value: string) => {
    setForm(prev => ({ ...prev, name: value }));
    
    if (value.length >= 2) {
      const matches = existingApps.filter(app =>
        app.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setFilteredApps(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectApp = (app: ExistingApp) => {
    setForm(prev => ({ ...prev, name: app.name, url: app.url }));
    setShowSuggestions(false);
    setSelectedExistingApp(app);
    
    if (fromProfile) {
      setMessage('existing-app'); // Special flag for existing app
    } else {
      setMessage('Note: This app already exists. Consider if you really need to submit it again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setMessage('Please sign in to submit apps');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Validate user information
      if (!user?.id || !user?.email) {
        setMessage('Authentication error. Please sign out and sign in again.');
        return;
      }

      // Include user information in submission
      const submissionData = {
        ...form,
        submittedByUserId: user.id,
        submittedByEmail: user.email
      };


      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('App submitted successfully! It will be reviewed by admins.');
        setForm({
          name: '',
          url: '',
          description: '',
          logoUrl: '',
          category: ''
        });
        // Call onSuccess callback if provided
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1500); // Give user time to see success message
        }
      } else {
        console.error('Submission error:', data); // Debug log
        setMessage(data.error || 'Failed to submit app');
      }
    } catch (error) {
      console.error('Network error:', error); // Debug log
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Sign In Required</h3>
        <p className="text-yellow-700">Please sign in to submit apps for the directory.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && message !== 'existing-app' && (
        <div className={`p-3 rounded-lg ${message.includes('successfully')
          ? 'bg-green-50 text-green-700 border border-green-200'
          : message.includes('Note:')
          ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
          : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}

      {/* Special message for existing apps from profile */}
      {fromProfile && message === 'existing-app' && selectedExistingApp && (
        <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
          <p className="text-yellow-800 text-sm mb-3">
            <strong>This app already exists in the library.</strong>
          </p>
          <a
            href={`/?pin=${selectedExistingApp.id}`}
            className="inline-flex items-center px-4 py-2 bg-string-mint text-string-dark rounded-lg hover:bg-string-mint-light transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Pin it to your homepage →
          </a>
        </div>
      )}

      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          App Name *
        </label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => handleNameChange(e.target.value)}
          onFocus={() => {
            if (form.name.length >= 2 && filteredApps.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-string-mint focus:border-string-mint"
        />
        
        {/* Autocomplete dropdown */}
        {showSuggestions && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredApps.map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => selectApp(app)}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-sm text-gray-900">{app.name}</div>
                <div className="text-xs text-gray-500 truncate">{app.url}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL *
        </label>
        <input
          type="url"
          required
          value={form.url}
          onChange={(e) => setForm(prev => ({ ...prev, url: e.target.value }))}
          placeholder="https://..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-string-mint focus:border-string-mint"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          value={form.category}
          onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-string-mint focus:border-string-mint"
        >
          <option value="">Select a category...</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-string-mint focus:border-string-mint"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Logo URL
        </label>
        <input
          type="url"
          value={form.logoUrl}
          onChange={(e) => setForm(prev => ({ ...prev, logoUrl: e.target.value }))}
          placeholder="https://..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-string-mint focus:border-string-mint"
        />
      </div>

      <button
        type="submit"
        disabled={loading || (fromProfile && message === 'existing-app')}
        className="w-full bg-string-mint text-string-dark py-2.5 px-4 rounded-xl font-medium hover:bg-string-mint-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Submitting...' : 'Submit App'}
      </button>

      <p className="text-xs text-gray-500">
        * Required fields. Your submission will be reviewed by administrators before appearing in the directory.
      </p>
    </form>
  );
}
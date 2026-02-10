import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AppSubmissionForm {
  name: string;
  url: string;
  description: string;
  logoUrl: string;
  category: string;
}

export function AppSubmissionForm() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setMessage('Please sign in to submit apps');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Include user information in submission
      const submissionData = {
        ...form,
        submittedByUserId: user?.id,
        submittedByEmail: user?.email
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
      } else {
        setMessage(data.error || 'Failed to submit app');
      }
    } catch (error) {
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
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Submit New App</h2>

      {message && (
        <div className={`p-3 rounded ${message.includes('successfully')
          ? 'bg-green-50 text-green-700'
          : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          App Name *
        </label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          value={form.category}
          onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting...' : 'Submit App'}
      </button>

      <p className="text-xs text-gray-500">
        * Required fields. Your submission will be reviewed by administrators before appearing in the directory.
      </p>
    </form>
  );
}
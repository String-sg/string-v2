import { useEffect, useState } from 'react';

interface App {
  id: string;
  name: string;
  slug: string;
  url: string;
  logoUrl: string | null;
  description: string | null;
  tagline: string | null;
  category: string;
  tags: string[];
  isOfficial: boolean;
  frequency: number;
  featured: boolean;
}

interface FeaturedApp {
  app: App;
  headline?: string;
  description?: string;
}

function AppCard({ app }: { app: App }) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <a
      href={app.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 border border-gray-100"
    >
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg mb-3 group-hover:scale-105 transition-transform">
        {app.logoUrl ? (
          <img src={app.logoUrl} alt={app.name} className="w-10 h-10 object-contain" />
        ) : (
          getInitials(app.name)
        )}
      </div>
      <span className="text-sm font-medium text-gray-900 text-center line-clamp-2">
        {app.name}
      </span>
      {app.tagline && (
        <span className="text-xs text-gray-500 text-center mt-1 line-clamp-1">
          {app.tagline}
        </span>
      )}
    </a>
  );
}

function FeaturedSection({ featured }: { featured: FeaturedApp | null }) {
  if (!featured) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white mb-8">
      <div className="flex items-center gap-2 text-blue-200 text-sm mb-2">
        <span>⭐</span>
        <span>Featured Today</span>
      </div>
      <h2 className="text-2xl font-bold mb-2">
        {featured.headline || featured.app.name}
      </h2>
      <p className="text-blue-100 mb-4">
        {featured.description || featured.app.description}
      </p>
      <a
        href={featured.app.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
      >
        Open {featured.app.name}
        <span>→</span>
      </a>
    </div>
  );
}

function CategoryFilter({
  categories,
  selected,
  onSelect,
}: {
  categories: string[];
  selected: string | null;
  onSelect: (cat: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onSelect(null)}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          selected === null
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
            selected === cat
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {cat.replace(/-/g, ' ')}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [apps, setApps] = useState<App[]>([]);
  const [featured, setFeatured] = useState<FeaturedApp | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchApps() {
      try {
        const res = await fetch('/api/apps');
        const data = await res.json();
        setApps(data.apps || []);
        setFeatured(data.featured || null);
      } catch (err) {
        console.error('Failed to fetch apps:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchApps();
  }, []);

  const categories = [...new Set(apps.map((app) => app.category))].sort();

  const filteredApps = apps.filter((app) => {
    const matchesCategory = !selectedCategory || app.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.tagline?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort: featured first, then by frequency
  const sortedApps = [...filteredApps].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return b.frequency - a.frequency;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">
            String<span className="text-blue-600">.sg</span>
          </h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 px-4 py-2 pl-10 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            <svg
              className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <FeaturedSection featured={featured} />

        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {sortedApps.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No apps found matching your criteria
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {sortedApps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12 py-6 text-center text-sm text-gray-500">
        <p>Built for educators in Singapore</p>
      </footer>
    </div>
  );
}

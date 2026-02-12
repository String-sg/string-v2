import { AppCard } from '../ui/AppCard';

interface App {
  id: string;
  name: string;
  description?: string;
  tagline?: string;
  logoUrl?: string;
  category: string;
  url: string;
  type?: 'pinned' | 'submitted';
}

interface AppsListProps {
  apps: App[];
  userName: string | null;
  onAppClick: (app: App) => void;
}

export function AppsList({ apps, userName, onAppClick }: AppsListProps) {
  // Sort apps to show submitted (user's contributions) first, then pinned
  const sortedApps = [...apps].sort((a, b) => {
    if (a.type === 'submitted' && b.type !== 'submitted') return -1;
    if (a.type !== 'submitted' && b.type === 'submitted') return 1;
    return 0;
  });

  if (sortedApps.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-string-dark mb-2">No Apps Shared</h3>
        <p className="text-gray-600">
          {userName || 'This user'} hasn't shared any apps on their profile yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-string-dark">
        {userName || 'User'}'s Apps
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sortedApps.map((app) => (
          <AppCard
            key={`${app.type}-${app.id}`}
            app={app}
            onClick={() => onAppClick(app)}
          />
        ))}
      </div>
    </div>
  );
}
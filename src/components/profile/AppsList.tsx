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
  isOwnProfile?: boolean;
  showOwnerControls?: boolean;
  onAddApp?: () => void;
  onRemoveApp?: (app: App) => void;
  removingAppKey?: string | null;
}

export function AppsList({
  apps,
  userName,
  onAppClick,
  isOwnProfile = false,
  showOwnerControls = false,
  onAddApp,
  onRemoveApp,
  removingAppKey,
}: AppsListProps) {
  // Sort apps to show submitted (user's contributions) first, then pinned
  const sortedApps = [...apps].sort((a, b) => {
    if (a.type === 'submitted' && b.type !== 'submitted') return -1;
    if (a.type !== 'submitted' && b.type === 'submitted') return 1;
    return 0;
  });

  if (sortedApps.length === 0) {
    // Show "Add App" button if viewing own profile
    if (isOwnProfile && showOwnerControls && onAddApp) {
      return (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm w-full max-w-4xl mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-string-dark mb-2">Add Your First App</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Share apps you've created or frequently use with the community
          </p>
          <button
            onClick={onAddApp}
            className="inline-flex items-center justify-center px-6 py-3 bg-string-mint text-string-dark font-medium rounded-lg hover:bg-string-mint-light transition-colors"
          >
            <span className="sr-only">Add app</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      );
    }

    // Show empty state for other users
    return (
      <div className="bg-white rounded-2xl p-12 text-center shadow-sm w-full max-w-4xl mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-string-dark mb-2">No Apps Shared</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {userName || 'This user'} hasn't shared any apps on their profile yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      {isOwnProfile && showOwnerControls && onAddApp && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">Manage which apps appear on your profile.</p>
          <button
            onClick={onAddApp}
            className="inline-flex items-center justify-center px-4 py-2 bg-string-mint text-string-dark font-medium rounded-lg hover:bg-string-mint-light transition-colors"
          >
            <span className="sr-only">Add app</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      )}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {sortedApps.map((app) => {
          const appKey = `${app.type}-${app.id}`;
          return (
            <AppCard
              key={appKey}
              app={app}
              onClick={() => onAppClick(app)}
              onRemove={showOwnerControls && onRemoveApp ? () => onRemoveApp(app) : undefined}
              removing={removingAppKey === appKey}
            />
          );
        })}
      </div>
    </div>
  );
}

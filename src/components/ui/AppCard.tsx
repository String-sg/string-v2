interface AppCardProps {
  app: {
    id: string;
    name: string;
    description?: string;
    tagline?: string;
    logoUrl?: string;
    category: string;
    url: string;
    type?: 'pinned' | 'submitted';
  };
  onClick: () => void;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function AppCard({ app, onClick }: AppCardProps) {
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-string-mint hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start gap-4">
        {/* App Icon */}
        <div className="w-12 h-12 rounded-xl bg-string-dark flex items-center justify-center text-string-mint font-semibold text-sm shrink-0">
          {app.logoUrl ? (
            <img
              src={app.logoUrl}
              alt={app.name}
              className="w-10 h-10 object-contain rounded-lg"
            />
          ) : (
            getInitials(app.name)
          )}
        </div>

        {/* App Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-string-dark truncate group-hover:text-string-mint transition-colors">
            {app.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
            {app.tagline || app.description || 'No description available'}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-string-mint/10 text-string-dark">
              {app.category}
            </span>
            {app.type === 'submitted' && (
              <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-string-light/50 text-string-dark">
                Contributed
              </span>
            )}
          </div>
        </div>

        {/* Launch Icon */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-5 h-5 text-gray-400 group-hover:text-string-mint transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
      </div>
    </div>
  );
}
import { Card } from '../ui/Card';

interface ProfileHeaderProps {
  profile: {
    name: string | null;
    slug: string;
    avatarUrl: string | null;
    memberSince: string;
  };
  appsCount: number;
  className?: string;
}

function getInitials(name: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function ProfileHeader({ profile, appsCount, className = '' }: ProfileHeaderProps) {
  return (
    <Card className={`p-8 ${className}`}>
      <div className="flex items-start gap-6">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-2xl bg-string-dark flex items-center justify-center text-string-mint text-2xl font-bold shrink-0">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name || 'User'}
              className="w-20 h-20 rounded-2xl object-cover"
            />
          ) : (
            getInitials(profile.name)
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-string-dark mb-2">
            {profile.name || 'String User'}
          </h1>
          <p className="text-gray-600 mb-4">
            Member since {new Date(profile.memberSince).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long'
            })}
          </p>

          {appsCount > 0 && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-string-mint/10 text-string-dark text-sm font-medium">
              Sharing {appsCount} app{appsCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
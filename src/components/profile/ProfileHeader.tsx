import { useState } from 'react';
import { Card } from '../ui/Card';
import { QRCodeModal } from '../QRCodeModal';
import { useToast } from '../../hooks/useToast';

interface ProfileHeaderProps {
  profile: {
    name: string | null;
    slug: string;
    avatarUrl: string | null;
    memberSince: string;
  };
  apps: Array<{
    type?: 'pinned' | 'submitted';
  }>;
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

export function ProfileHeader({ profile, apps, className = '' }: ProfileHeaderProps) {
  // Only count apps that the user has uniquely contributed (submitted)
  const contributedAppsCount = apps.filter(app => app.type === 'submitted').length;
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const { addToast } = useToast();
  const profileUrl = `string.sg/${profile.slug}`;
  const fullUrl = `https://${profileUrl}`;

  const copyProfileUrl = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      addToast('Profile URL copied to clipboard', 'success');
    } catch (err) {
      console.error('Failed to copy URL:', err);
      addToast('Failed to copy URL', 'error');
    }
  };

  return (
    <Card className={`p-8 ${className}`}>
      <div className="flex items-start gap-6">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-2xl bg-string-dark flex items-center justify-center text-string-mint text-2xl font-bold shrink-0">
          <svg
            className="w-12 h-12"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 264 264"
          >
            <path
              fill="#75f8cc"
              d="M175,28a31.64,31.64,0,0,1-30.07,21.4H90.33A55.81,55.81,0,0,0,89.78,161h1.91a28.67,28.67,0,0,0,20.3-8.3l20-19.8v0l-41.27-.2c-15.12-.08-28.25-12.5-28.17-27.63A27.5,27.5,0,0,1,90.19,77.71l54.6,0A59.72,59.72,0,0,0,182.87,64.3,58.84,58.84,0,0,0,191.26,56a59.7,59.7,0,0,0,12.87-28Z"
            />
            <path
              fill="#75f8cc"
              d="M213.58,121.36a55.59,55.59,0,0,0-39.36-16.53h-1.91a28.62,28.62,0,0,0-20.3,8.29l-20,19.8,41.23.2c15.14.08,28.27,12.52,28.19,27.67a27.48,27.48,0,0,1-27.62,27.36l-56.25,0a59.64,59.64,0,0,0-38.14,13.46A57.17,57.17,0,0,0,71,209.91A59.39,59.39,0,0,0,58.52,236H88a31.69,31.69,0,0,1,29.43-19.59l56.23,0a55.79,55.79,0,0,0,39.91-95.07Z"
            />
          </svg>
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

          {/* Profile URL with action buttons */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-gray-500">{profileUrl}</span>
            <button
              onClick={copyProfileUrl}
              className="p-2 text-gray-400 hover:text-string-mint hover:bg-string-mint/10 rounded-lg transition-colors touch-manipulation"
              title="Copy profile URL"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={() => setQrModalOpen(true)}
              className="p-2 text-gray-400 hover:text-string-mint hover:bg-string-mint/10 rounded-lg transition-colors touch-manipulation"
              title="Generate QR code"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
              </svg>
            </button>
          </div>

          {contributedAppsCount > 0 && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-string-mint/10 text-string-dark text-sm font-medium">
              Contributed {contributedAppsCount} app{contributedAppsCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        url={fullUrl}
        username={profile.slug}
      />
    </Card>
  );
}
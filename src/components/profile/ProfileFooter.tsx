import { useState } from 'react';
import { QRCodeModal } from '../QRCodeModal';

interface ProfileFooterProps {
  profile: {
    name: string | null;
    slug: string;
    avatarUrl: string | null;
    memberSince: string;
  };
}

export function ProfileFooter({ profile }: ProfileFooterProps) {
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const profileUrl = `string.sg/${profile.slug}`;
  const fullUrl = `https://${profileUrl}`;

  const copyProfileUrl = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <footer className="bg-string-dark">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left side - String logo */}
        <button
          onClick={() => window.location.href = '/'}
          className="flex items-center text-string-mint hover:text-white transition-colors"
        >
          <img
            src="/logo-green.svg"
            alt="String"
            className="h-7"
          />
        </button>

        {/* Right side - Profile info and actions */}
        <div className="flex items-center gap-4">
          {/* Profile info */}
          <div className="text-right">
            <div className="text-white font-medium text-sm">
              {profile.name || 'String User'}'s Apps
            </div>
            <div className="text-gray-400 text-xs flex items-center gap-2">
              {profileUrl}

              {/* Copy button */}
              <button
                onClick={copyProfileUrl}
                className="p-1.5 rounded-lg transition-colors text-string-dark hover:bg-string-mint"
                title="Copy profile URL"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>

              {/* QR code button */}
              <button
                onClick={() => setQrModalOpen(true)}
                className="p-1.5 rounded-lg transition-colors text-string-dark hover:bg-string-mint"
                title="Generate QR code"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        url={fullUrl}
        username={profile.slug}
      />
    </footer>
  );
}
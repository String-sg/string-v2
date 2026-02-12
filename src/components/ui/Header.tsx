import { Button } from './Button';

interface HeaderProps {
  title: string;
  subtitle?: string;
  backUrl?: string;
  rightContent?: React.ReactNode;
}

export function Header({ title, subtitle, backUrl = '/', rightContent }: HeaderProps) {
  return (
    <header className="bg-string-dark border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {title ? (
            <div className="text-lg font-semibold text-string-mint">
              {title}
            </div>
          ) : (
            <Button
              variant="text"
              onClick={() => window.location.href = backUrl}
              className="!p-0 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <img
                src="/logo-green.svg"
                alt="String"
                className="h-6"
              />
            </Button>
          )}

          {rightContent && (
            <div className="flex items-center gap-3">
              {rightContent}
            </div>
          )}

          {subtitle && !rightContent && (
            <div className="text-sm text-gray-500 font-medium">
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
interface LaunchButtonProps {
  url: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function LaunchButton({
  url,
  size = 'md',
  className = ''
}: LaunchButtonProps) {
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4'
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={`
        ${sizeClasses[size]}
        rounded-lg
        transition-colors
        text-gray-400
        hover:text-string-dark
        hover:bg-string-mint
        ${className}
      `}
      title="Open in new tab"
    >
      <svg
        className={iconSizes[size]}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
      </svg>
    </a>
  );
}
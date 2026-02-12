interface PinButtonProps {
  isPinned: boolean;
  onPin: () => void;
  onUnpin: () => void;
  size?: 'sm' | 'md';
  className?: string;
}

export function PinButton({
  isPinned,
  onPin,
  onUnpin,
  size = 'md',
  className = ''
}: PinButtonProps) {
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4'
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        isPinned ? onUnpin() : onPin();
      }}
      className={`
        ${sizeClasses[size]}
        rounded-lg
        transition-colors
        ${isPinned
          ? 'text-string-mint bg-string-mint/10'
          : 'text-gray-400 hover:text-string-dark hover:bg-string-mint'
        }
        ${className}
      `}
      title={isPinned ? 'Unpin' : 'Pin'}
    >
      <svg
        className={iconSizes[size]}
        fill={isPinned ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    </button>
  );
}
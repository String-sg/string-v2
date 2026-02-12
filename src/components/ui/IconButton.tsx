import { ReactNode } from 'react';

interface IconButtonProps {
  children: ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function IconButton({
  children,
  onClick,
  className = '',
  title,
  size = 'md'
}: IconButtonProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        ${sizeClasses[size]}
        rounded-lg
        flex items-center justify-center
        transition-all duration-200
        text-gray-400
        hover:bg-string-mint
        hover:text-string-dark
        ${className}
      `}
    >
      <div className={iconSizes[size]}>
        {children}
      </div>
    </button>
  );
}
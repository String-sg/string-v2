import { ReactNode } from 'react';

interface IconButtonProps {
  children: ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  title?: string;
  ariaLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary';
}

export function IconButton({
  children,
  onClick,
  className = '',
  title,
  ariaLabel,
  size = 'md',
  variant = 'default'
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

  const variants = {
    default: 'text-gray-400 hover:bg-string-mint hover:text-string-dark',
    primary: 'bg-string-mint text-string-dark hover:bg-string-mint-light'
  };

  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={ariaLabel || title}
      className={`
        ${sizeClasses[size]}
        rounded-lg
        flex items-center justify-center
        transition-all duration-200
        ${variants[variant]}
        ${className}
      `}
    >
      <div className={iconSizes[size]}>
        {children}
      </div>
    </button>
  );
}

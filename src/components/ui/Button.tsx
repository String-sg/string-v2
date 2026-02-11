import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false
}: ButtonProps) {
  const baseClasses = 'font-medium transition-colors rounded-xl inline-flex items-center justify-center';

  const variants = {
    primary: 'bg-string-mint text-string-dark hover:bg-string-mint-light disabled:opacity-50',
    secondary: 'bg-white border border-gray-200 text-string-dark hover:bg-gray-50 disabled:opacity-50',
    text: 'text-string-mint hover:text-string-mint-light disabled:opacity-50'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
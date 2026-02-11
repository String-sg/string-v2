import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', hover = false, onClick }: CardProps) {
  const baseClasses = 'bg-white rounded-xl border border-gray-100 transition-colors';
  const hoverClasses = hover ? 'hover:border-string-mint cursor-pointer hover:shadow-md' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`}
    >
      {children}
    </div>
  );
}
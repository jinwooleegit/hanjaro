import React from 'react';

interface ContentCardProps {
  children: React.ReactNode;
  title?: string;
  titleSize?: 'sm' | 'md' | 'lg';
  description?: string;
  className?: string;
  gradient?: boolean;
  gradientColors?: string;
  noPadding?: boolean;
  onClick?: () => void;
}

export default function ContentCard({
  children,
  title,
  titleSize = 'md',
  description,
  className = '',
  gradient = false,
  gradientColors = 'from-blue-50 to-blue-100',
  noPadding = false,
  onClick
}: ContentCardProps) {
  const titleSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div 
      className={`
        ${gradient ? `bg-gradient-to-br ${gradientColors}` : 'bg-white dark:bg-gray-800'} 
        shadow-md rounded-xl 
        ${!noPadding ? 'p-6' : ''} 
        border ${gradient ? 'border-blue-200 dark:border-blue-900/30' : 'border-gray-100 dark:border-gray-700'}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {title && (
        <h3 className={`${titleSizeClasses[titleSize]} font-bold mb-2 text-gray-800 dark:text-white`}>
          {title}
        </h3>
      )}
      
      {description && (
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {description}
        </p>
      )}
      
      {children}
    </div>
  );
} 
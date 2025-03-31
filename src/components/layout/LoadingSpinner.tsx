import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  fullScreen = false 
}) => {
  const sizeClasses = {
    small: 'h-8 w-8 border-2',
    medium: 'h-12 w-12 border-3',
    large: 'h-16 w-16 border-4',
  };

  const spinnerClass = `animate-spin rounded-full ${sizeClasses[size]} border-primary border-t-transparent`;
  
  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className={spinnerClass}></div>
      </div>
    );
  }
  
  return (
    <div className="flex justify-center items-center p-4">
      <div className={spinnerClass}></div>
    </div>
  );
};

export default LoadingSpinner; 
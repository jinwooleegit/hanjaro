import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
}

export default function PageContainer({ 
  children, 
  maxWidth = 'max-w-7xl', 
  className = ''
}: PageContainerProps) {
  return (
    <div className={`container mx-auto px-4 py-8 ${className}`}>
      <div className={`${maxWidth} mx-auto`}>
        {children}
      </div>
    </div>
  );
} 
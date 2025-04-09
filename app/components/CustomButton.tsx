import React from 'react';

interface CustomButtonProps {
  text: string;
  className?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ text, className }) => {
  return (
    <button 
      className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${className || ''}`}
    >
      {text}
    </button>
  );
};

export default CustomButton; 
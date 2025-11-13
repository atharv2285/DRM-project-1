import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
  const baseClasses = "px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors";
  
  return (
    <button
      {...props}
      className={`${baseClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
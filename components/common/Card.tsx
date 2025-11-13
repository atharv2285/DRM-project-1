import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm p-6 ${className}`}>
      <h2 className="text-lg font-semibold text-orange-600 mb-4 border-b border-gray-200 pb-2">{title}</h2>
      {children}
    </div>
  );
};

export default Card;
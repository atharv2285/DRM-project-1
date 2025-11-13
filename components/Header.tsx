
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <h1 className="text-xl md:text-2xl font-bold text-cyan-400">
          Option Pricing & Portfolio Construction
        </h1>
        <p className="text-sm text-gray-400">DRM Project | BITS Pilani</p>
      </div>
    </header>
  );
};

export default Header;

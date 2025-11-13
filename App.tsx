import React, { useState } from 'react';
import Header from './components/Header';
import Tabs from './components/Tabs';
import BSMModel from './components/BSMModel';
import BinomialModel from './components/BinomialModel';
import SyntheticOptionModel from './components/SyntheticOptionModel';
import StrategyBacktest from './components/StrategyBacktest';
import WelcomeScreen from './components/WelcomeScreen';

type Tab = 'bsm' | 'binomial' | 'synthetic' | 'strategy';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('bsm');
  const [isAppEntered, setIsAppEntered] = useState(false);

  const handleEnter = () => {
    setIsAppEntered(true);
  };

  if (!isAppEntered) {
    return <WelcomeScreen onEnter={handleEnter} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-8">
          {activeTab === 'bsm' && <BSMModel />}
          {activeTab === 'binomial' && <BinomialModel />}
          {activeTab === 'synthetic' && <SyntheticOptionModel />}
          {activeTab === 'strategy' && <StrategyBacktest />}
        </div>
      </main>
      <footer className="text-center p-4 text-gray-600 text-sm">
        <p>Built for DRM Project, BITS Pilani | First Semester: 2025-2026</p>
      </footer>
    </div>
  );
};

export default App;
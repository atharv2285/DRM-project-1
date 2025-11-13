import React from 'react';

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'bsm', name: 'BSM Model' },
    { id: 'binomial', name: 'Binomial Model' },
    { id: 'synthetic', name: 'Synthetic Option' },
    { id: 'strategy', name: 'Strategy Backtest' },
  ];

  return (
    <div className="border-b border-gray-300">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${
              activeTab === tab.id
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-400'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 focus:outline-none`}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;

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
  ];

  return (
    <div className="border-b border-gray-700">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${
              activeTab === tab.id
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 focus:outline-none`}
          >
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;

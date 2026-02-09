type Tab = {
  key: string;
  label: string;
};

type TabNavigationProps = {
  tabs: Tab[];
  activeTab: string;
  onChange: (key: string) => void;
};

export default function TabNavigation({ tabs, activeTab, onChange }: TabNavigationProps) {
  return (
    <div className="flex border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-4 py-3 text-sm font-medium transition-colors relative ${
            activeTab === tab.key
              ? 'text-pink-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
          {activeTab === tab.key && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500" />
          )}
        </button>
      ))}
    </div>
  );
}

import type { ReactNode } from "react";

export type TabId = "scope-facets" | "service-catalog" | "tier-definition" | "the-matrix";

interface Tab {
  id: TabId;
  label: string;
  icon: ReactNode;
}

const tabs: Tab[] = [
  {
    id: "scope-facets",
    label: "Scope & Facets",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="3" />
        <circle cx="6" cy="16" r="3" />
        <circle cx="18" cy="16" r="3" />
        <path d="M12 11v2M9 14l-1.5 1M15 14l1.5 1" />
      </svg>
    ),
  },
  {
    id: "service-catalog",
    label: "Service Catalog",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 6h16M4 10h16M4 14h10M4 18h6" />
      </svg>
    ),
  },
  {
    id: "tier-definition",
    label: "Tier Definition",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 3v18" />
      </svg>
    ),
  },
  {
    id: "the-matrix",
    label: "The Matrix",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="8" cy="8" r="2" />
        <circle cx="16" cy="8" r="2" />
        <circle cx="8" cy="16" r="2" />
        <circle cx="16" cy="16" r="2" />
        <path d="M10 8h4M10 16h4M8 10v4M16 10v4" />
      </svg>
    ),
  },
];

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
  completedTabs?: TabId[];
}

export function TabNavigation({ activeTab, onTabChange, completedTabs = [] }: TabNavigationProps) {
  const getTabIndex = (tabId: TabId) => tabs.findIndex((t) => t.id === tabId);
  const activeIndex = getTabIndex(activeTab);

  const getTabColor = (tab: Tab, index: number) => {
    if (tab.id === activeTab) {
      switch (tab.id) {
        case "scope-facets":
          return "text-purple-600 border-purple-600";
        case "service-catalog":
          return "text-green-600 border-green-600";
        case "tier-definition":
          return "text-purple-600 border-purple-600";
        case "the-matrix":
          return "text-gray-600 border-gray-600";
        default:
          return "text-blue-600 border-blue-600";
      }
    }
    if (index < activeIndex || completedTabs.includes(tab.id)) {
      return "text-green-500 border-green-500";
    }
    return "text-gray-400 border-gray-200";
  };

  const getIconBgColor = (tab: Tab, index: number) => {
    if (tab.id === activeTab) {
      switch (tab.id) {
        case "scope-facets":
          return "bg-purple-100 text-purple-600";
        case "service-catalog":
          return "bg-green-100 text-green-600";
        case "tier-definition":
          return "bg-purple-100 text-purple-600";
        case "the-matrix":
          return "bg-gray-100 text-gray-600";
        default:
          return "bg-blue-100 text-blue-600";
      }
    }
    if (index < activeIndex || completedTabs.includes(tab.id)) {
      return "bg-green-100 text-green-500";
    }
    return "bg-gray-100 text-gray-400";
  };

  const getLineColor = (index: number) => {
    if (index < activeIndex) {
      return "bg-green-500";
    }
    if (index === activeIndex) {
      switch (tabs[index].id) {
        case "scope-facets":
          return "bg-purple-600";
        case "service-catalog":
          return "bg-green-600";
        case "tier-definition":
          return "bg-purple-600";
        default:
          return "bg-gray-300";
      }
    }
    return "bg-gray-200";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between">
        {tabs.map((tab, index) => (
          <div key={tab.id} className="flex items-center flex-1">
            <button
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-2 px-4 py-2 transition-colors ${getTabColor(tab, index)}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getIconBgColor(tab, index)}`}>
                {tab.icon}
              </div>
              <span className="text-sm font-medium whitespace-nowrap">{tab.label}</span>
            </button>
            {index < tabs.length - 1 && (
              <div className={`flex-1 h-1 mx-2 rounded ${getLineColor(index)}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

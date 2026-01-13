import { useState } from "react";
import { DocumentToolbar } from "@powerhousedao/design-system/connect";
import { useSelectedServiceOfferingDocument } from "../../document-models/service-offering/hooks.js";
import { TabNavigation, type TabId } from "./components/TabNavigation.js";
import { ScopeAndFacets } from "./components/ScopeAndFacets.js";
import { ServiceCatalog, type GroupMetadata } from "./components/ServiceCatalog.js";
import { TierDefinition } from "./components/TierDefinition.js";
import { TheMatrix } from "./components/TheMatrix.js";

export default function ServiceOfferingEditor() {
  const [document, dispatch] = useSelectedServiceOfferingDocument();
  const [activeTab, setActiveTab] = useState<TabId>("scope-facets");

  // Centralized group metadata state shared between ServiceCatalog and TheMatrix
  const [groupMetadata, setGroupMetadata] = useState<Record<string, GroupMetadata>>({});

  if (!document) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-500 text-lg">No service offering document selected</p>
          <p className="text-gray-400 text-sm mt-1">Select a document to start editing</p>
        </div>
      </div>
    );
  }

  // Derive groupSetupFees for TheMatrix from groupMetadata
  const groupSetupFees: Record<string, number | null> = {};
  Object.entries(groupMetadata).forEach(([groupId, meta]) => {
    if (meta.isSetupFormation) {
      groupSetupFees[groupId] = meta.setupFee;
    }
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case "scope-facets":
        return <ScopeAndFacets document={document} dispatch={dispatch} />;
      case "service-catalog":
        return (
          <ServiceCatalog
            document={document}
            dispatch={dispatch}
            groupMetadata={groupMetadata}
            setGroupMetadata={setGroupMetadata}
          />
        );
      case "tier-definition":
        return <TierDefinition document={document} dispatch={dispatch} />;
      case "the-matrix":
        return <TheMatrix document={document} dispatch={dispatch} groupSetupFees={groupSetupFees} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full overflow-auto bg-gray-100">
      <DocumentToolbar />
      <div className="max-w-7xl mx-auto p-6">
        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className="min-h-[500px]">{renderTabContent()}</div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import type {
  ServiceOfferingDocument,
  ServiceOfferingAction,
} from "resourceServices/document-models/service-offering";
import {
  updateOfferingInfo,
  updateOfferingStatus,
  setOperator,
} from "../../../document-models/service-offering/gen/creators.js";

interface ScopeAndFacetsProps {
  document: ServiceOfferingDocument;
  dispatch: DocumentDispatch<ServiceOfferingAction>;
}

// Example facet categories - in a real implementation, these would come from a schema or API
const FACET_CATEGORIES = {
  FUNCTION: {
    label: "Function",
    options: [
      { id: "operational-hub", label: "Operational Hub" },
      { id: "embryonic-hub", label: "Embryonic Hub" },
    ],
  },
  LEGAL_ENTITY: {
    label: "Legal Entity",
    options: [
      { id: "swiss-association", label: "Swiss Association" },
      { id: "bvi-ltd", label: "BVI Ltd" },
      { id: "unaffiliated", label: "Unaffiliated" },
    ],
  },
  TEAM_STRUCTURE: {
    label: "Team Structure",
    options: [
      { id: "remote-team", label: "Remote Team" },
      { id: "on-premise", label: "On-Premise" },
      { id: "hybrid", label: "Hybrid" },
    ],
  },
  ANONYMITY: {
    label: "Anonymity",
    options: [
      { id: "high-anonymity", label: "High Anonymity" },
      { id: "highest-anonymity", label: "Highest Anonymity" },
    ],
  },
};

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "COMING_SOON", label: "Coming Soon" },
  { value: "ACTIVE", label: "Active" },
  { value: "DEPRECATED", label: "Deprecated" },
];

export function ScopeAndFacets({ document, dispatch }: ScopeAndFacetsProps) {
  const { state } = document;
  const globalState = state.global;

  const [formData, setFormData] = useState({
    title: globalState.title || "",
    operatorId: globalState.operatorId || "",
    status: globalState.status || "DRAFT",
  });

  // Local UI state for facet targeting (not persisted to document model)
  const [selectedFacets, setSelectedFacets] = useState<Record<string, string[]>>({});

  useEffect(() => {
    setFormData({
      title: globalState.title || "",
      operatorId: globalState.operatorId || "",
      status: globalState.status || "DRAFT",
    });
  }, [globalState.title, globalState.operatorId, globalState.status]);

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, title: value }));
  };

  const handleTitleBlur = () => {
    if (formData.title !== globalState.title) {
      dispatch(
        updateOfferingInfo({
          title: formData.title,
          lastModified: new Date().toISOString(),
        })
      );
    }
  };

  const handleOperatorChange = (value: string) => {
    setFormData((prev) => ({ ...prev, operatorId: value }));
  };

  const handleOperatorBlur = () => {
    if (formData.operatorId !== globalState.operatorId) {
      dispatch(
        setOperator({
          operatorId: formData.operatorId,
          lastModified: new Date().toISOString(),
        })
      );
    }
  };

  const handleStatusChange = (value: string) => {
    const status = value as "DRAFT" | "COMING_SOON" | "ACTIVE" | "DEPRECATED";
    setFormData((prev) => ({ ...prev, status }));
    dispatch(
      updateOfferingStatus({
        status,
        lastModified: new Date().toISOString(),
      })
    );
  };

  const toggleFacet = (category: string, optionId: string) => {
    setSelectedFacets(prev => {
      const current = prev[category] || [];
      const isSelected = current.includes(optionId);
      const newSelected = isSelected
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];

      return {
        ...prev,
        [category]: newSelected,
      };
    });
    // Note: Facet targeting is UI-only and not persisted to the document model
  };

  const isFacetSelected = (category: string, optionId: string) => {
    return (selectedFacets[category] || []).includes(optionId);
  };

  return (
    <div className="space-y-6">
      {/* General Information Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">General Information</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Offering Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              onBlur={handleTitleBlur}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Enter offering title..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Operator ID
              </label>
              <input
                type="text"
                value={formData.operatorId}
                onChange={(e) => handleOperatorChange(e.target.value)}
                onBlur={handleOperatorBlur}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="op-123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Status
              </label>
              <div className="relative">
                <select
                  value={formData.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 appearance-none bg-white"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Facet Targeting Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Facet Targeting</h2>
        <p className="text-gray-500 text-sm mb-6">
          Select the resource characteristics this offering is available for.
        </p>

        <div className="space-y-6">
          {Object.entries(FACET_CATEGORIES).map(([categoryKey, category]) => (
            <div key={categoryKey}>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                {category.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.options.map((option) => {
                  const isSelected = isFacetSelected(categoryKey, option.id);
                  return (
                    <button
                      key={option.id}
                      onClick={() => toggleFacet(categoryKey, option.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isSelected
                          ? "bg-blue-100 text-blue-700 border-2 border-blue-500"
                          : "bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

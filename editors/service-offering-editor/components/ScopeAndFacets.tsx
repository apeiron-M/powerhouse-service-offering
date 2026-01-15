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
  { value: "DRAFT", label: "Draft", color: "slate" },
  { value: "COMING_SOON", label: "Coming Soon", color: "sky" },
  { value: "ACTIVE", label: "Active", color: "emerald" },
  { value: "DEPRECATED", label: "Deprecated", color: "rose" },
] as const;

export function ScopeAndFacets({ document, dispatch }: ScopeAndFacetsProps) {
  const { state } = document;
  const globalState = state.global;

  const [formData, setFormData] = useState({
    title: globalState.title || "",
    operatorId: globalState.operatorId || "",
    status: globalState.status || "DRAFT",
  });

  // Local UI state for facet targeting (not persisted to document model)
  const [selectedFacets, setSelectedFacets] = useState<
    Record<string, string[]>
  >({});

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
        }),
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
        }),
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
      }),
    );
  };

  const toggleFacet = (category: string, optionId: string) => {
    setSelectedFacets((prev) => {
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

  const currentStatus = STATUS_OPTIONS.find((s) => s.value === formData.status);

  return (
    <>
      <style>{styles}</style>
      <div className="scope-facets">
        {/* General Information Section */}
        <section className="scope-facets__card">
          <div className="scope-facets__header">
            <div className="scope-facets__header-icon scope-facets__header-icon--violet">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h2 className="scope-facets__title">General Information</h2>
              <p className="scope-facets__subtitle">
                Define the core details of your service offering
              </p>
            </div>
          </div>

          <div className="scope-facets__form">
            <div className="scope-facets__field scope-facets__field--full">
              <label className="scope-facets__label">Offering Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                onBlur={handleTitleBlur}
                className="scope-facets__input"
                placeholder="Enter offering title..."
              />
            </div>

            <div className="scope-facets__row">
              <div className="scope-facets__field">
                <label className="scope-facets__label">Operator ID</label>
                <input
                  type="text"
                  value={formData.operatorId}
                  onChange={(e) => handleOperatorChange(e.target.value)}
                  onBlur={handleOperatorBlur}
                  className="scope-facets__input scope-facets__input--mono"
                  placeholder="op-123"
                />
              </div>

              <div className="scope-facets__field">
                <label className="scope-facets__label">Status</label>
                <div className="scope-facets__select-wrapper">
                  <select
                    value={formData.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="scope-facets__select"
                    data-status={currentStatus?.color}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <span
                    className={`scope-facets__status-dot scope-facets__status-dot--${currentStatus?.color}`}
                  />
                  <svg
                    className="scope-facets__select-chevron"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Facet Targeting Section */}
        <section className="scope-facets__card">
          <div className="scope-facets__header">
            <div className="scope-facets__header-icon scope-facets__header-icon--amber">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.07-7.07l-2.83 2.83M9.76 14.24l-2.83 2.83m11.14 0l-2.83-2.83M9.76 9.76L6.93 6.93" />
              </svg>
            </div>
            <div>
              <h2 className="scope-facets__title">Facet Targeting</h2>
              <p className="scope-facets__subtitle">
                Select the resource characteristics this offering is available
                for
              </p>
            </div>
          </div>

          <div className="scope-facets__facets">
            {Object.entries(FACET_CATEGORIES).map(([categoryKey, category]) => (
              <div key={categoryKey} className="scope-facets__category">
                <h3 className="scope-facets__category-label">
                  {category.label}
                </h3>
                <div className="scope-facets__options">
                  {category.options.map((option) => {
                    const isSelected = isFacetSelected(categoryKey, option.id);
                    return (
                      <button
                        key={option.id}
                        onClick={() => toggleFacet(categoryKey, option.id)}
                        className={`scope-facets__option ${isSelected ? "scope-facets__option--selected" : ""}`}
                      >
                        <span className="scope-facets__option-check">
                          {isSelected && (
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <path d="M5 12l5 5L20 7" />
                            </svg>
                          )}
                        </span>
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

const styles = `
  .scope-facets {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .scope-facets__card {
    background: white;
    border-radius: var(--so-radius-lg);
    box-shadow: var(--so-shadow-md);
    border: 1px solid var(--so-slate-100);
    padding: 28px;
    animation: so-scale-in var(--so-transition-slow) ease-out;
  }

  .scope-facets__header {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 28px;
  }

  .scope-facets__header-icon {
    width: 44px;
    height: 44px;
    border-radius: var(--so-radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .scope-facets__header-icon svg {
    width: 22px;
    height: 22px;
  }

  .scope-facets__header-icon--violet {
    background: var(--so-violet-100);
    color: var(--so-violet-600);
  }

  .scope-facets__header-icon--amber {
    background: var(--so-amber-100);
    color: var(--so-amber-600);
  }

  .scope-facets__title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--so-slate-800);
    margin: 0 0 4px;
    letter-spacing: -0.02em;
  }

  .scope-facets__subtitle {
    font-size: 0.875rem;
    color: var(--so-slate-500);
    margin: 0;
  }

  .scope-facets__form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .scope-facets__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .scope-facets__field {
    display: flex;
    flex-direction: column;
  }

  .scope-facets__field--full {
    grid-column: 1 / -1;
  }

  .scope-facets__label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--so-slate-500);
    margin-bottom: 8px;
  }

  .scope-facets__input {
    width: 100%;
    padding: 14px 16px;
    font-family: var(--so-font-sans);
    font-size: 0.9375rem;
    color: var(--so-slate-800);
    background: var(--so-slate-50);
    border: 1.5px solid var(--so-slate-200);
    border-radius: var(--so-radius-md);
    transition: all var(--so-transition-fast);
  }

  .scope-facets__input:hover {
    border-color: var(--so-slate-300);
    background: white;
  }

  .scope-facets__input:focus {
    outline: none;
    border-color: var(--so-violet-500);
    background: white;
    box-shadow: 0 0 0 3px var(--so-violet-100);
  }

  .scope-facets__input::placeholder {
    color: var(--so-slate-400);
  }

  .scope-facets__input--mono {
    font-family: var(--so-font-mono);
    font-size: 0.875rem;
  }

  .scope-facets__select-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .scope-facets__select {
    width: 100%;
    padding: 14px 16px;
    padding-left: 36px;
    font-family: var(--so-font-sans);
    font-size: 0.9375rem;
    color: var(--so-slate-800);
    background: var(--so-slate-50);
    border: 1.5px solid var(--so-slate-200);
    border-radius: var(--so-radius-md);
    appearance: none;
    cursor: pointer;
    transition: all var(--so-transition-fast);
  }

  .scope-facets__select:hover {
    border-color: var(--so-slate-300);
    background: white;
  }

  .scope-facets__select:focus {
    outline: none;
    border-color: var(--so-violet-500);
    background: white;
    box-shadow: 0 0 0 3px var(--so-violet-100);
  }

  .scope-facets__status-dot {
    position: absolute;
    left: 14px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    pointer-events: none;
  }

  .scope-facets__status-dot--slate {
    background: var(--so-slate-400);
  }

  .scope-facets__status-dot--sky {
    background: var(--so-sky-500);
  }

  .scope-facets__status-dot--emerald {
    background: var(--so-emerald-500);
  }

  .scope-facets__status-dot--rose {
    background: var(--so-rose-500);
  }

  .scope-facets__select-chevron {
    position: absolute;
    right: 14px;
    width: 18px;
    height: 18px;
    color: var(--so-slate-400);
    pointer-events: none;
  }

  .scope-facets__facets {
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  .scope-facets__category {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .scope-facets__category-label {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--so-slate-600);
    margin: 0;
  }

  .scope-facets__options {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .scope-facets__option {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    font-family: var(--so-font-sans);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--so-slate-600);
    background: var(--so-slate-50);
    border: 1.5px solid var(--so-slate-200);
    border-radius: 100px;
    cursor: pointer;
    transition: all var(--so-transition-fast);
  }

  .scope-facets__option:hover {
    border-color: var(--so-slate-300);
    background: white;
  }

  .scope-facets__option--selected {
    background: var(--so-violet-50);
    border-color: var(--so-violet-400);
    color: var(--so-violet-700);
  }

  .scope-facets__option--selected:hover {
    background: var(--so-violet-100);
    border-color: var(--so-violet-500);
  }

  .scope-facets__option-check {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--so-slate-200);
    transition: all var(--so-transition-fast);
  }

  .scope-facets__option--selected .scope-facets__option-check {
    background: var(--so-violet-500);
  }

  .scope-facets__option-check svg {
    width: 12px;
    height: 12px;
    color: white;
  }
`;

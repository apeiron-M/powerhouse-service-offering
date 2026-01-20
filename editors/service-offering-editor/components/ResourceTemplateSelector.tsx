import { useState, useMemo } from "react";
import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import type {
  ServiceOfferingDocument,
  ServiceOfferingAction,
} from "resourceServices/document-models/service-offering";
import { useResourceTemplateDocumentsInSelectedDrive } from "../../../document-models/resource-template/hooks.js";
import type { ResourceTemplateDocument } from "resourceServices/document-models/resource-template";

interface ResourceTemplateSelectorProps {
  document: ServiceOfferingDocument;
  dispatch: DocumentDispatch<ServiceOfferingAction>;
}

export function ResourceTemplateSelector({
  document,
  dispatch,
}: ResourceTemplateSelectorProps) {
  const templates = useResourceTemplateDocumentsInSelectedDrive();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );

  // Get the currently linked template from document state
  const globalState = document.state.global;

  const filteredTemplates = useMemo(() => {
    if (!templates) return [];
    if (!searchQuery.trim()) return templates;

    const query = searchQuery.toLowerCase();
    return templates.filter(
      (t) =>
        t.state.global.title.toLowerCase().includes(query) ||
        t.state.global.summary.toLowerCase().includes(query),
    );
  }, [templates, searchQuery]);

  const handleSelectTemplate = (template: ResourceTemplateDocument) => {
    setSelectedTemplateId(template.header.id);
    // In the future, this would dispatch an action to link the template
    // For now, we just show the selection visually
  };

  const activeTemplates = filteredTemplates?.filter(
    (t) => t.state.global.status === "ACTIVE",
  );
  const otherTemplates = filteredTemplates?.filter(
    (t) => t.state.global.status !== "ACTIVE",
  );

  return (
    <>
      <style>{styles}</style>
      <div className="rts-container">
        {/* Header */}
        <div className="rts-header">
          <div className="rts-header__icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <div className="rts-header__text">
            <h2 className="rts-header__title">Select Resource Template</h2>
            <p className="rts-header__subtitle">
              Choose a resource template to base this service offering on. The
              template defines the product configuration, target audiences, and
              available services.
            </p>
          </div>
        </div>

        {/* Current Selection Info */}
        {globalState.title && (
          <div className="rts-current">
            <div className="rts-current__badge">Current Configuration</div>
            <div className="rts-current__info">
              <h3 className="rts-current__title">{globalState.title}</h3>
              <p className="rts-current__summary">{globalState.summary}</p>
              <div className="rts-current__meta">
                <span className="rts-current__audiences">
                  {globalState.targetAudiences.length} target audience
                  {globalState.targetAudiences.length !== 1 ? "s" : ""}
                </span>
                <span className="rts-current__services">
                  {globalState.services.length} service
                  {globalState.services.length !== 1 ? "s" : ""} defined
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="rts-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="M21 21l-4.35-4.35" strokeWidth="2" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resource templates..."
            className="rts-search__input"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="rts-search__clear"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" />
              </svg>
            </button>
          )}
        </div>

        {/* Templates List */}
        <div className="rts-templates">
          {!templates || templates.length === 0 ? (
            <div className="rts-empty">
              <div className="rts-empty__icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="rts-empty__title">No Resource Templates Found</h3>
              <p className="rts-empty__desc">
                Create a Resource Template first to define the base
                configuration for your service offering.
              </p>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="rts-empty rts-empty--search">
              <p className="rts-empty__desc">
                No templates match "{searchQuery}"
              </p>
            </div>
          ) : (
            <>
              {/* Active Templates Section */}
              {activeTemplates && activeTemplates.length > 0 && (
                <div className="rts-section">
                  <h3 className="rts-section__title">
                    <span className="rts-section__dot rts-section__dot--active" />
                    Active Templates
                  </h3>
                  <div className="rts-grid">
                    {activeTemplates.map((template) => (
                      <TemplateCard
                        key={template.header.id}
                        template={template}
                        isSelected={selectedTemplateId === template.header.id}
                        onSelect={() => handleSelectTemplate(template)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Other Templates Section */}
              {otherTemplates && otherTemplates.length > 0 && (
                <div className="rts-section">
                  <h3 className="rts-section__title">
                    <span className="rts-section__dot" />
                    Other Templates
                  </h3>
                  <div className="rts-grid">
                    {otherTemplates.map((template) => (
                      <TemplateCard
                        key={template.header.id}
                        template={template}
                        isSelected={selectedTemplateId === template.header.id}
                        onSelect={() => handleSelectTemplate(template)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

interface TemplateCardProps {
  template: ResourceTemplateDocument;
  isSelected: boolean;
  onSelect: () => void;
}

function TemplateCard({ template, isSelected, onSelect }: TemplateCardProps) {
  const { state } = template;
  const globalState = state.global;

  const statusColors: Record<
    string,
    { bg: string; text: string; dot: string }
  > = {
    ACTIVE: {
      bg: "var(--rts-emerald-light)",
      text: "var(--rts-emerald)",
      dot: "var(--rts-emerald)",
    },
    DRAFT: {
      bg: "var(--rts-slate-light)",
      text: "var(--rts-slate)",
      dot: "var(--rts-slate)",
    },
    COMING_SOON: {
      bg: "var(--rts-sky-light)",
      text: "var(--rts-sky)",
      dot: "var(--rts-sky)",
    },
    DEPRECATED: {
      bg: "var(--rts-rose-light)",
      text: "var(--rts-rose)",
      dot: "var(--rts-rose)",
    },
  };

  const statusStyle = statusColors[globalState.status] || statusColors.DRAFT;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rts-card ${isSelected ? "rts-card--selected" : ""}`}
    >
      <div className="rts-card__header">
        {globalState.thumbnailUrl ? (
          <div
            className="rts-card__thumb"
            style={{ backgroundImage: `url(${globalState.thumbnailUrl})` }}
          />
        ) : (
          <div className="rts-card__thumb rts-card__thumb--placeholder">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
        <span
          className="rts-card__status"
          style={{
            backgroundColor: statusStyle.bg,
            color: statusStyle.text,
          }}
        >
          <span
            className="rts-card__status-dot"
            style={{ backgroundColor: statusStyle.dot }}
          />
          {globalState.status.replace("_", " ")}
        </span>
      </div>
      <div className="rts-card__body">
        <h4 className="rts-card__title">{globalState.title || "Untitled"}</h4>
        <p className="rts-card__summary">
          {globalState.summary || "No summary provided"}
        </p>
        <div className="rts-card__meta">
          {globalState.targetAudiences.length > 0 && (
            <span className="rts-card__tag">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                  strokeWidth="2"
                />
                <circle cx="9" cy="7" r="4" strokeWidth="2" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeWidth="2" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2" />
              </svg>
              {globalState.targetAudiences.length}
            </span>
          )}
          {globalState.services.length > 0 && (
            <span className="rts-card__tag">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5z" strokeWidth="2" />
                <path d="M2 17l10 5 10-5" strokeWidth="2" />
                <path d="M2 12l10 5 10-5" strokeWidth="2" />
              </svg>
              {globalState.services.length}
            </span>
          )}
          {globalState.facetTargets.length > 0 && (
            <span className="rts-card__tag">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 6h18M7 12h10M10 18h4" strokeWidth="2" />
              </svg>
              {globalState.facetTargets.length}
            </span>
          )}
        </div>
      </div>
      {isSelected && (
        <div className="rts-card__check">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M5 12l5 5L20 7" strokeWidth="2.5" />
          </svg>
        </div>
      )}
    </button>
  );
}

const styles = `
  .rts-container {
    --rts-font: 'Instrument Sans', system-ui, sans-serif;
    --rts-mono: 'DM Mono', 'SF Mono', monospace;

    --rts-ink: #1a1f36;
    --rts-ink-light: #4a5578;
    --rts-ink-muted: #8792a8;
    --rts-surface: #ffffff;
    --rts-surface-raised: #fafbfc;
    --rts-border: #e4e8f0;
    --rts-border-light: #f0f2f7;

    --rts-teal: #14b8a6;
    --rts-teal-light: #ccfbf1;
    --rts-violet: #7c5cff;
    --rts-violet-light: #f4f1ff;
    --rts-emerald: #10b981;
    --rts-emerald-light: #e8faf3;
    --rts-sky: #0ea5e9;
    --rts-sky-light: #e8f7fc;
    --rts-rose: #f43f5e;
    --rts-rose-light: #fef1f3;
    --rts-slate: #64748b;
    --rts-slate-light: #f1f5f9;
    --rts-amber: #f59e0b;
    --rts-amber-light: #fef7e6;

    font-family: var(--rts-font);
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* Header */
  .rts-header {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    padding: 24px;
    background: var(--rts-surface);
    border-radius: 16px;
    box-shadow: 0 1px 3px rgba(26, 31, 54, 0.04), 0 4px 16px rgba(26, 31, 54, 0.06);
    border-left: 4px solid var(--rts-teal);
  }

  .rts-header__icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: var(--rts-teal-light);
    color: var(--rts-teal);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .rts-header__icon svg {
    width: 24px;
    height: 24px;
  }

  .rts-header__text {
    flex: 1;
  }

  .rts-header__title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--rts-ink);
    margin: 0 0 8px;
    letter-spacing: -0.02em;
  }

  .rts-header__subtitle {
    font-size: 0.9375rem;
    color: var(--rts-ink-light);
    margin: 0;
    line-height: 1.6;
    max-width: 600px;
  }

  /* Current Selection */
  .rts-current {
    padding: 20px;
    background: var(--rts-violet-light);
    border: 1px solid rgba(124, 92, 255, 0.2);
    border-radius: 12px;
  }

  .rts-current__badge {
    display: inline-block;
    padding: 4px 10px;
    background: var(--rts-violet);
    color: white;
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-radius: 100px;
    margin-bottom: 12px;
  }

  .rts-current__info {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .rts-current__title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--rts-ink);
    margin: 0;
  }

  .rts-current__summary {
    font-size: 0.875rem;
    color: var(--rts-ink-light);
    margin: 0;
    line-height: 1.5;
  }

  .rts-current__meta {
    display: flex;
    gap: 16px;
    margin-top: 8px;
  }

  .rts-current__audiences,
  .rts-current__services {
    font-size: 0.8125rem;
    color: var(--rts-violet);
    font-weight: 500;
  }

  /* Search */
  .rts-search {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    background: var(--rts-surface);
    border: 1.5px solid var(--rts-border);
    border-radius: 12px;
    transition: all 0.15s ease;
  }

  .rts-search:focus-within {
    border-color: var(--rts-teal);
    box-shadow: 0 0 0 3px var(--rts-teal-light);
  }

  .rts-search > svg {
    width: 20px;
    height: 20px;
    color: var(--rts-ink-muted);
    flex-shrink: 0;
  }

  .rts-search__input {
    flex: 1;
    font-family: var(--rts-font);
    font-size: 0.9375rem;
    background: transparent;
    border: none;
    outline: none;
    color: var(--rts-ink);
  }

  .rts-search__input::placeholder {
    color: var(--rts-ink-muted);
  }

  .rts-search__clear {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    background: var(--rts-border-light);
    border: none;
    border-radius: 6px;
    color: var(--rts-ink-muted);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .rts-search__clear:hover {
    background: var(--rts-border);
    color: var(--rts-ink-light);
  }

  .rts-search__clear svg {
    width: 14px;
    height: 14px;
  }

  /* Templates */
  .rts-templates {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .rts-section__title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--rts-ink-light);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 16px;
  }

  .rts-section__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--rts-slate);
  }

  .rts-section__dot--active {
    background: var(--rts-emerald);
  }

  .rts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 16px;
  }

  /* Card */
  .rts-card {
    position: relative;
    display: flex;
    flex-direction: column;
    text-align: left;
    background: var(--rts-surface);
    border: 2px solid var(--rts-border-light);
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .rts-card:hover {
    border-color: var(--rts-border);
    box-shadow: 0 4px 16px rgba(26, 31, 54, 0.08);
    transform: translateY(-2px);
  }

  .rts-card--selected {
    border-color: var(--rts-teal);
    background: var(--rts-teal-light);
  }

  .rts-card--selected:hover {
    border-color: var(--rts-teal);
  }

  .rts-card__header {
    position: relative;
    height: 100px;
  }

  .rts-card__thumb {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    background-color: var(--rts-border-light);
  }

  .rts-card__thumb--placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--rts-border-light) 0%, var(--rts-border) 100%);
    color: var(--rts-ink-muted);
  }

  .rts-card__thumb--placeholder svg {
    width: 32px;
    height: 32px;
    opacity: 0.5;
  }

  .rts-card__status {
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    font-size: 0.625rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    border-radius: 100px;
    backdrop-filter: blur(8px);
  }

  .rts-card__status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  .rts-card__body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }

  .rts-card__title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--rts-ink);
    margin: 0;
    letter-spacing: -0.01em;
  }

  .rts-card__summary {
    font-size: 0.8125rem;
    color: var(--rts-ink-light);
    margin: 0;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .rts-card__meta {
    display: flex;
    gap: 12px;
    margin-top: auto;
    padding-top: 8px;
  }

  .rts-card__tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.75rem;
    color: var(--rts-ink-muted);
  }

  .rts-card__tag svg {
    width: 14px;
    height: 14px;
  }

  .rts-card__check {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--rts-teal);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(20, 184, 166, 0.4);
  }

  .rts-card__check svg {
    width: 16px;
    height: 16px;
  }

  /* Empty State */
  .rts-empty {
    padding: 48px;
    text-align: center;
    background: var(--rts-surface);
    border-radius: 16px;
    border: 2px dashed var(--rts-border);
  }

  .rts-empty--search {
    padding: 24px;
    border-style: solid;
    background: var(--rts-surface-raised);
  }

  .rts-empty__icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 16px;
    color: var(--rts-ink-muted);
    opacity: 0.5;
  }

  .rts-empty__icon svg {
    width: 100%;
    height: 100%;
  }

  .rts-empty__title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--rts-ink);
    margin: 0 0 8px;
  }

  .rts-empty__desc {
    font-size: 0.9375rem;
    color: var(--rts-ink-muted);
    margin: 0;
    max-width: 400px;
    margin: 0 auto;
    line-height: 1.6;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .rts-header {
      flex-direction: column;
    }

    .rts-grid {
      grid-template-columns: 1fr;
    }
  }
`;

import { useState, useMemo } from "react";
import { generateId } from "document-model/core";
import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import type {
  ServiceOfferingDocument,
  ServiceOfferingAction,
  Service,
  ServiceSubscriptionTier,
  ServiceLevel,
  OptionGroup,
  ServiceUsageLimit,
} from "resourceServices/document-models/service-offering";
import {
  addServiceLevel,
  updateServiceLevel,
  removeServiceLevel,
  addUsageLimit,
  updateUsageLimit,
  removeUsageLimit,
  addService,
  addOptionGroup,
  updateOptionGroup,
} from "../../../document-models/service-offering/gen/creators.js";

interface TheMatrixProps {
  document: ServiceOfferingDocument;
  dispatch: DocumentDispatch<ServiceOfferingAction>;
  groupSetupFees?: Record<string, number | null>; // Setup fees per group ID, passed from parent
}

const SERVICE_LEVELS: { value: ServiceLevel; label: string; shortLabel: string; color: string }[] = [
  { value: "INCLUDED", label: "Included", shortLabel: "✓", color: "text-green-600" },
  { value: "OPTIONAL", label: "Optional", shortLabel: "Optional", color: "text-blue-600" },
  { value: "NOT_INCLUDED", label: "Not Included", shortLabel: "—", color: "text-gray-400" },
  { value: "NOT_APPLICABLE", label: "Not Applicable", shortLabel: "/", color: "text-gray-300 italic" },
  { value: "CUSTOM", label: "Custom", shortLabel: "Custom", color: "text-orange-600" },
  { value: "VARIABLE", label: "Variable", shortLabel: "#", color: "text-purple-600" },
];

// Reserved group ID for services without a group assignment
const UNGROUPED_ID = "__ungrouped__";

// Facet categories for filtering - especially Anonymity affects setup services
const FACET_CATEGORIES = {
  FUNCTION: {
    label: "SNO Function",
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
    label: "Team",
    options: [
      { id: "remote-team", label: "Remote" },
      { id: "on-premise", label: "On-Premise" },
      { id: "hybrid", label: "Hybrid" },
    ],
  },
  ANONYMITY: {
    label: "Anonymity",
    options: [
      { id: "high-anonymity", label: "High" },
      { id: "highest-anonymity", label: "Highest" },
    ],
  },
};

export function TheMatrix({ document, dispatch, groupSetupFees = {} }: TheMatrixProps) {
  const { state } = document;
  const services = state.global.services ?? [];
  const tiers = state.global.tiers ?? [];
  const optionGroups = state.global.optionGroups ?? [];

  // Track which optional groups are enabled (for display purposes)
  const [enabledOptionalGroups, setEnabledOptionalGroups] = useState<Set<string>>(
    new Set(optionGroups.filter(g => g.defaultSelected).map(g => g.id))
  );

  // Selected cell for editing
  const [selectedCell, setSelectedCell] = useState<{
    serviceId: string;
    tierId: string;
  } | null>(null);

  // Add service modal state
  const [addServiceModal, setAddServiceModal] = useState<{
    groupId: string;
    isSetupFormation: boolean;
  } | null>(null);
  const [newServiceName, setNewServiceName] = useState("");

  // Selected tier for highlighting
  const [selectedTierIdx, setSelectedTierIdx] = useState<number>(0);

  // Selected facets for filtering matrix view
  const [selectedFacets, setSelectedFacets] = useState<Record<string, string>>({
    FUNCTION: "operational-hub",
    LEGAL_ENTITY: "swiss-association",
    TEAM_STRUCTURE: "remote-team",
    ANONYMITY: "high-anonymity",
  });

  // Group services by their optionGroupId from service level bindings
  const getServiceGroup = (service: Service): string | null => {
    for (const tier of tiers) {
      const binding = tier.serviceLevels.find(sl => sl.serviceId === service.id);
      if (binding?.optionGroupId) {
        return binding.optionGroupId;
      }
    }
    return null;
  };

  // Organize services into groups
  const groupedServices = useMemo(() => {
    const groups: Map<string, Service[]> = new Map();
    optionGroups.forEach(g => groups.set(g.id, []));
    groups.set(UNGROUPED_ID, []);

    services.forEach(service => {
      const groupId = getServiceGroup(service) || UNGROUPED_ID;
      const groupServices = groups.get(groupId) || [];
      groupServices.push(service);
      groups.set(groupId, groupServices);
    });

    return groups;
  }, [services, tiers, optionGroups]);

  // Categorize groups
  const setupGroups = useMemo(() => {
    return optionGroups.filter(g => {
      const groupServices = groupedServices.get(g.id) || [];
      return groupServices.some(s => s.isSetupFormation);
    });
  }, [optionGroups, groupedServices]);

  const regularGroups = useMemo(() => {
    return optionGroups.filter(g => {
      const groupServices = groupedServices.get(g.id) || [];
      return !groupServices.some(s => s.isSetupFormation) && !g.isAddOn;
    });
  }, [optionGroups, groupedServices]);

  const addonGroups = useMemo(() => {
    return optionGroups.filter(g => g.isAddOn);
  }, [optionGroups]);

  const ungroupedSetupServices = useMemo(() => {
    return (groupedServices.get(UNGROUPED_ID) || []).filter(s => s.isSetupFormation);
  }, [groupedServices]);

  const ungroupedRegularServices = useMemo(() => {
    return (groupedServices.get(UNGROUPED_ID) || []).filter(s => !s.isSetupFormation);
  }, [groupedServices]);

  const getServiceLevelForTier = (serviceId: string, tier: ServiceSubscriptionTier) => {
    return tier.serviceLevels.find((sl) => sl.serviceId === serviceId);
  };

  // Get ALL unique metrics across all tiers for a service
  const getUniqueMetricsForService = (serviceId: string): string[] => {
    const metricsSet = new Set<string>();
    tiers.forEach(tier => {
      tier.usageLimits
        .filter(ul => ul.serviceId === serviceId)
        .forEach(ul => metricsSet.add(ul.metric));
    });
    return Array.from(metricsSet);
  };

  // Get usage limit for a specific service and metric in a tier
  const getUsageLimitForMetric = (serviceId: string, metric: string, tier: ServiceSubscriptionTier): ServiceUsageLimit | undefined => {
    return tier.usageLimits.find(ul => ul.serviceId === serviceId && ul.metric === metric);
  };

  const handleSetServiceLevel = (
    serviceId: string,
    tierId: string,
    level: ServiceLevel,
    existingLevelId?: string,
    optionGroupId?: string
  ) => {
    if (existingLevelId) {
      dispatch(
        updateServiceLevel({
          tierId,
          serviceLevelId: existingLevelId,
          level,
          lastModified: new Date().toISOString(),
        })
      );
    } else {
      dispatch(
        addServiceLevel({
          tierId,
          serviceLevelId: generateId(),
          serviceId,
          level,
          optionGroupId,
          lastModified: new Date().toISOString(),
        })
      );
    }
  };

  const toggleOptionalGroup = (groupId: string) => {
    setEnabledOptionalGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  // Handle adding a new service to a group
  const handleAddService = () => {
    if (!addServiceModal || !newServiceName.trim()) return;

    const newServiceId = generateId();

    // Create the service
    dispatch(
      addService({
        id: newServiceId,
        title: newServiceName.trim(),
        description: null,
        isSetupFormation: addServiceModal.isSetupFormation,
        lastModified: new Date().toISOString(),
      })
    );

    // Add service level bindings for all tiers with the group assignment
    tiers.forEach(tier => {
      dispatch(
        addServiceLevel({
          tierId: tier.id,
          serviceLevelId: generateId(),
          serviceId: newServiceId,
          level: "INCLUDED",
          optionGroupId: addServiceModal.groupId,
          lastModified: new Date().toISOString(),
        })
      );
    });

    // Reset modal state
    setNewServiceName("");
    setAddServiceModal(null);
  };

  const openAddServiceModal = (groupId: string, isSetupFormation: boolean) => {
    setAddServiceModal({ groupId, isSetupFormation });
    setNewServiceName("");
  };
  const getLevelDisplay = (serviceLevel: { level: ServiceLevel | `${ServiceLevel}`; customValue?: string | null } | undefined) => {
    if (!serviceLevel) return { label: "—", className: "text-gray-300" };

    const level = serviceLevel.level as ServiceLevel;
    const config = SERVICE_LEVELS.find(l => l.value === level);

    if (level === "CUSTOM" && serviceLevel.customValue) {
      return { label: serviceLevel.customValue, className: config?.color || "text-orange-600" };
    }

    return { label: config?.shortLabel || level, className: config?.color || "text-gray-600" };
  };

  if (services.length === 0 || tiers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
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
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Matrix Not Ready</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          {services.length === 0 && tiers.length === 0
            ? "Add services in the Service Catalog and tiers in Tier Definition to configure the matrix."
            : services.length === 0
              ? "Add services in the Service Catalog to configure the matrix."
              : "Add tiers in Tier Definition to configure the matrix."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Facet Selector Bar */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-6">
          {Object.entries(FACET_CATEGORIES).map(([key, category]) => (
            <div key={key} className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {category.label}
              </span>
              {key === "ANONYMITY" ? (
                // Toggle button group for Anonymity
                <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
                  {category.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedFacets(prev => ({ ...prev, [key]: option.id }))}
                      className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                        selectedFacets[key] === option.id
                          ? "bg-blue-100 text-blue-700 border-blue-200"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                      } ${option.id !== category.options[0].id ? "border-l border-gray-200" : ""}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : (
                // Dropdown for other facets
                <select
                  value={selectedFacets[key] || ""}
                  onChange={(e) => setSelectedFacets(prev => ({ ...prev, [key]: e.target.value }))}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {category.options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
        {selectedFacets.ANONYMITY === "highest-anonymity" && (
          <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-700">
              <strong>Highest Anonymity:</strong> Additional setup services may be required for enhanced privacy configurations.
            </p>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          {/* Tier Header Row */}
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-white px-4 py-3 text-left font-normal text-gray-500 border-b border-gray-200 min-w-[250px]">
                {/* Empty corner cell */}
              </th>
              {tiers.map((tier, idx) => (
                <th
                  key={tier.id}
                  onClick={() => setSelectedTierIdx(idx)}
                  className={`px-4 py-3 text-center border-b border-gray-200 min-w-[140px] cursor-pointer transition-colors ${
                    idx === selectedTierIdx ? "bg-purple-600 text-white" : "bg-white hover:bg-purple-50"
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      idx === selectedTierIdx ? "border-white bg-purple-600" : "border-gray-300"
                    } ${idx === selectedTierIdx ? "after:content-[''] after:block after:w-2 after:h-2 after:bg-white after:rounded-full after:m-0.5" : ""}`} />
                    <span className="font-semibold">{tier.name}</span>
                    <span className={`text-xs ${idx === selectedTierIdx ? "text-purple-200" : "text-gray-500"}`}>
                      {tier.isCustomPricing ? "Custom" : `$${tier.pricing.amount}/mo`}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* SERVICE CATALOG Section Header */}
            <tr>
              <td
                colSpan={tiers.length + 1}
                className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200"
              >
                Service Catalog
              </td>
            </tr>

            {/* Setup/Formation Groups */}
            {setupGroups.map(group => (
              <ServiceGroupSection
                key={group.id}
                group={group}
                services={groupedServices.get(group.id) || []}
                tiers={tiers}
                isSetupFormation={true}
                isOptional={false}
                isEnabled={true}
                onToggle={() => {}}
                getServiceLevelForTier={getServiceLevelForTier}
                getUniqueMetricsForService={getUniqueMetricsForService}
                getUsageLimitForMetric={getUsageLimitForMetric}
                getLevelDisplay={getLevelDisplay}
                selectedCell={selectedCell}
                setSelectedCell={setSelectedCell}
                handleSetServiceLevel={handleSetServiceLevel}
                dispatch={dispatch}
                setupFee={groupSetupFees[group.id]}
                onAddService={openAddServiceModal}
                selectedTierIdx={selectedTierIdx}
              />
            ))}

            {/* Ungrouped Setup Services */}
            {ungroupedSetupServices.length > 0 && (
              <ServiceGroupSection
                key="ungrouped-setup"
                group={{ id: UNGROUPED_ID, name: "Setup & Formation", description: null, isAddOn: false, defaultSelected: true }}
                services={ungroupedSetupServices}
                tiers={tiers}
                isSetupFormation={true}
                isOptional={false}
                isEnabled={true}
                onToggle={() => {}}
                getServiceLevelForTier={getServiceLevelForTier}
                getUniqueMetricsForService={getUniqueMetricsForService}
                getUsageLimitForMetric={getUsageLimitForMetric}
                getLevelDisplay={getLevelDisplay}
                selectedCell={selectedCell}
                setSelectedCell={setSelectedCell}
                handleSetServiceLevel={handleSetServiceLevel}
                dispatch={dispatch}
                setupFee={groupSetupFees[UNGROUPED_ID]}
                selectedTierIdx={selectedTierIdx}
              />
            )}

            {/* Regular Groups (Recurring Services) */}
            {regularGroups.map(group => (
              <ServiceGroupSection
                key={group.id}
                group={group}
                services={groupedServices.get(group.id) || []}
                tiers={tiers}
                isSetupFormation={false}
                isOptional={false}
                isEnabled={true}
                onToggle={() => {}}
                getServiceLevelForTier={getServiceLevelForTier}
                getUniqueMetricsForService={getUniqueMetricsForService}
                getUsageLimitForMetric={getUsageLimitForMetric}
                getLevelDisplay={getLevelDisplay}
                selectedCell={selectedCell}
                setSelectedCell={setSelectedCell}
                handleSetServiceLevel={handleSetServiceLevel}
                onAddService={openAddServiceModal}
                selectedTierIdx={selectedTierIdx}
                dispatch={dispatch}
              />
            ))}

            {/* Ungrouped Regular Services */}
            {ungroupedRegularServices.length > 0 && (
              <ServiceGroupSection
                key="ungrouped-regular"
                group={{ id: UNGROUPED_ID, name: "Recurring Operational Services", description: null, isAddOn: false, defaultSelected: true }}
                services={ungroupedRegularServices}
                tiers={tiers}
                isSetupFormation={false}
                isOptional={false}
                isEnabled={true}
                onToggle={() => {}}
                getServiceLevelForTier={getServiceLevelForTier}
                getUniqueMetricsForService={getUniqueMetricsForService}
                getUsageLimitForMetric={getUsageLimitForMetric}
                getLevelDisplay={getLevelDisplay}
                selectedCell={selectedCell}
                setSelectedCell={setSelectedCell}
                handleSetServiceLevel={handleSetServiceLevel}
                dispatch={dispatch}
                selectedTierIdx={selectedTierIdx}
              />
            )}

            {/* Subtotal Row for Recurring */}
            <tr className="bg-gray-100">
              <td className="sticky left-0 z-10 bg-gray-100 px-4 py-2 font-semibold text-gray-700 border-b border-gray-300">
                SUBTOTAL
              </td>
              {tiers.map((tier) => (
                <td
                  key={tier.id}
                  className="px-4 py-2 text-center font-semibold text-gray-700 border-b border-gray-300"
                >
                  {tier.isCustomPricing ? "Custom" : `$${tier.pricing.amount}`}
                </td>
              ))}
            </tr>

            {/* Add-on Groups (Optional) */}
            {addonGroups.map(group => (
              <ServiceGroupSection
                key={group.id}
                group={group}
                services={groupedServices.get(group.id) || []}
                tiers={tiers}
                isSetupFormation={false}
                isOptional={true}
                isEnabled={enabledOptionalGroups.has(group.id)}
                onToggle={() => toggleOptionalGroup(group.id)}
                getServiceLevelForTier={getServiceLevelForTier}
                getUniqueMetricsForService={getUniqueMetricsForService}
                getUsageLimitForMetric={getUsageLimitForMetric}
                getLevelDisplay={getLevelDisplay}
                selectedCell={selectedCell}
                setSelectedCell={setSelectedCell}
                handleSetServiceLevel={handleSetServiceLevel}
                dispatch={dispatch}
                onAddService={openAddServiceModal}
                selectedTierIdx={selectedTierIdx}
              />
            ))}

            {/* Grand Total Row */}
            <tr className="bg-purple-100">
              <td className="sticky left-0 z-10 bg-purple-100 px-4 py-3 font-bold text-purple-900 border-t-2 border-purple-300">
                Grand Total (Recurring)
              </td>
              {tiers.map((tier, idx) => {
                // Calculate total: tier price (add-on pricing removed from schema)
                const tierPrice = tier.pricing.amount || 0;
                const grandTotal = tierPrice;

                return (
                  <td
                    key={tier.id}
                    className={`px-4 py-3 text-center font-bold border-t-2 border-purple-300 ${
                      idx === selectedTierIdx ? "bg-purple-600 text-white" : "text-purple-900"
                    }`}
                  >
                    {tier.isCustomPricing ? "Custom" : `$${grandTotal}/mo`}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Selected Cell Detail Panel */}
      {selectedCell && (
        <ServiceLevelDetailPanel
          serviceId={selectedCell.serviceId}
          tierId={selectedCell.tierId}
          services={services}
          tiers={tiers}
          optionGroups={optionGroups}
          dispatch={dispatch}
          onClose={() => setSelectedCell(null)}
        />
      )}

      {/* Add Service Modal */}
      {addServiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add New Service
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name
              </label>
              <input
                type="text"
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
                placeholder="Enter service name"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
            </div>
            <div className="text-sm text-gray-500 mb-4">
              This service will be added as {addServiceModal.isSetupFormation ? "Setup/Formation" : "Recurring"}.
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setAddServiceModal(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddService}
                disabled={!newServiceName.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ServiceGroupSectionProps {
  group: OptionGroup;
  services: Service[];
  tiers: ServiceSubscriptionTier[];
  isSetupFormation: boolean;
  isOptional: boolean;
  isEnabled: boolean;
  onToggle: () => void;
  getServiceLevelForTier: (serviceId: string, tier: ServiceSubscriptionTier) => any;
  getUniqueMetricsForService: (serviceId: string) => string[];
  getUsageLimitForMetric: (serviceId: string, metric: string, tier: ServiceSubscriptionTier) => ServiceUsageLimit | undefined;
  getLevelDisplay: (serviceLevel: any) => { label: string; className: string };
  selectedCell: { serviceId: string; tierId: string } | null;
  setSelectedCell: (cell: { serviceId: string; tierId: string } | null) => void;
  handleSetServiceLevel: (serviceId: string, tierId: string, level: ServiceLevel, existingLevelId?: string, optionGroupId?: string) => void;
  dispatch: DocumentDispatch<ServiceOfferingAction>;
  setupFee?: number | null; // Setup fee for this group (only for setup groups)
  onAddService?: (groupId: string, isSetupFormation: boolean) => void;
  selectedTierIdx: number;
}

function ServiceGroupSection({
  group,
  services,
  tiers,
  isSetupFormation,
  isOptional,
  isEnabled,
  onToggle,
  getServiceLevelForTier,
  getUniqueMetricsForService,
  getUsageLimitForMetric,
  getLevelDisplay,
  selectedCell,
  setSelectedCell,
  setupFee,
  onAddService,
  selectedTierIdx,
}: ServiceGroupSectionProps) {
  // Allow showing even empty groups if we have onAddService capability
  const showGroup = services.length > 0 || onAddService;
  if (!showGroup) return null;

  const groupBgColor = isSetupFormation
    ? "bg-amber-50"
    : isOptional
      ? "bg-blue-50"
      : "bg-gray-50";

  const headerBgColor = isSetupFormation
    ? "bg-amber-100"
    : isOptional
      ? "bg-blue-100"
      : "bg-gray-100";

  return (
    <>
      {/* Group Header Row */}
      <tr className={headerBgColor}>
        <td className={`sticky left-0 z-10 ${headerBgColor} px-4 py-2 border-b border-gray-200`}>
          <div className="flex items-center gap-3">
            {isOptional && (
              <button
                onClick={onToggle}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  isEnabled ? "bg-purple-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    isEnabled ? "translate-x-5" : ""
                  }`}
                />
              </button>
            )}
            <span className="font-semibold text-gray-800">{group.name}</span>
          </div>
        </td>
        <td
          colSpan={tiers.length}
          className={`px-4 py-2 text-center border-b border-gray-200 ${headerBgColor}`}
        >
          <span className={`inline-block px-3 py-0.5 rounded text-xs font-medium ${
            isSetupFormation
              ? "bg-green-100 text-green-700"
              : isOptional
                ? "bg-blue-200 text-blue-700"
                : "bg-green-100 text-green-700"
          }`}>
            {isSetupFormation ? "INCLUDED" : isOptional ? "OPTIONAL" : "INCLUDED"}
          </span>
        </td>
      </tr>

      {/* Service Rows with nested metrics */}
      {services.map((service) => {
        const metrics = getUniqueMetricsForService(service.id);

        return (
          <ServiceRowWithMetrics
            key={service.id}
            service={service}
            metrics={metrics}
            tiers={tiers}
            groupBgColor={groupBgColor}
            getServiceLevelForTier={getServiceLevelForTier}
            getUsageLimitForMetric={getUsageLimitForMetric}
            getLevelDisplay={getLevelDisplay}
            selectedCell={selectedCell}
            setSelectedCell={setSelectedCell}
          />
        );
      })}

      {/* Add Service Row */}
      {onAddService && group.id !== "__ungrouped__" && (
        <tr className={groupBgColor}>
          <td className={`sticky left-0 z-10 ${groupBgColor} px-4 py-2 pl-8 border-b border-gray-100`}>
            <button
              onClick={() => onAddService(group.id, isSetupFormation)}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              + Add a Service
            </button>
          </td>
          <td colSpan={tiers.length} className={`px-4 py-2 border-b border-gray-100 ${groupBgColor}`}></td>
        </tr>
      )}

      {/* TOTAL SETUP FEE Row for Setup Groups */}
      {isSetupFormation && (
        <tr className="bg-gray-50">
          <td className="sticky left-0 z-10 bg-gray-50 px-4 py-2 font-semibold text-gray-700 border-b border-gray-200">
            TOTAL SETUP FEE
          </td>
          <td
            colSpan={tiers.length}
            className="px-4 py-2 text-center font-semibold text-gray-700 border-b border-gray-200"
          >
            {setupFee
              ? `$${setupFee} flat fee (applied to all tiers)`
              : "No setup fee configured"}
          </td>
        </tr>
      )}

      {/* Subtotal Row for Optional Groups */}
      {isOptional && (
        <tr className={headerBgColor}>
          <td className={`sticky left-0 z-10 ${headerBgColor} px-4 py-2 font-semibold text-gray-700 border-b border-gray-200`}>
            SUBTOTAL
          </td>
          {tiers.map((tier, tierIdx) => {
            // Add-on group pricing removed from schema - showing $0
            const priceDisplay = "$0";

            return (
              <td
                key={tier.id}
                className={`px-4 py-2 text-center font-semibold text-gray-700 border-b border-gray-200 ${
                  tierIdx === selectedTierIdx && isEnabled ? "bg-purple-200 text-purple-900" : ""
                }`}
              >
                {isEnabled ? priceDisplay : "$0"}
              </td>
            );
          })}
        </tr>
      )}
    </>
  );
}

interface ServiceRowWithMetricsProps {
  service: Service;
  metrics: string[];
  tiers: ServiceSubscriptionTier[];
  groupBgColor: string;
  getServiceLevelForTier: (serviceId: string, tier: ServiceSubscriptionTier) => any;
  getUsageLimitForMetric: (serviceId: string, metric: string, tier: ServiceSubscriptionTier) => ServiceUsageLimit | undefined;
  getLevelDisplay: (serviceLevel: any) => { label: string; className: string };
  selectedCell: { serviceId: string; tierId: string } | null;
  setSelectedCell: (cell: { serviceId: string; tierId: string } | null) => void;
}

function ServiceRowWithMetrics({
  service,
  metrics,
  tiers,
  groupBgColor,
  getServiceLevelForTier,
  getUsageLimitForMetric,
  getLevelDisplay,
  selectedCell,
  setSelectedCell,
}: ServiceRowWithMetricsProps) {
  return (
    <>
      {/* Service Row */}
      <tr className={`${groupBgColor} hover:bg-opacity-75`}>
        <td className={`sticky left-0 z-10 ${groupBgColor} px-4 py-2 pl-8 border-b border-gray-100`}>
          <span className="text-gray-700">{service.title}</span>
        </td>
        {tiers.map((tier, tierIdx) => {
          const serviceLevel = getServiceLevelForTier(service.id, tier);
          const display = getLevelDisplay(serviceLevel);
          const isSelected = selectedCell?.serviceId === service.id && selectedCell?.tierId === tier.id;

          return (
            <td
              key={tier.id}
              className={`px-4 py-2 text-center border-b border-gray-100 cursor-pointer hover:bg-white/50 ${
                tierIdx === 1 ? "bg-purple-50/50" : ""
              } ${isSelected ? "ring-2 ring-inset ring-purple-500" : ""}`}
              onClick={() => setSelectedCell(isSelected ? null : { serviceId: service.id, tierId: tier.id })}
            >
              <span className={`font-medium ${display.className}`}>
                {display.label}
              </span>
            </td>
          );
        })}
      </tr>

      {/* Metric Rows (nested under the service) */}
      {metrics.map((metric) => (
        <tr key={`${service.id}-${metric}`} className={`${groupBgColor}`}>
          <td className={`sticky left-0 z-10 ${groupBgColor} px-4 py-1.5 pl-12 border-b border-gray-100`}>
            <span className="text-gray-500 text-xs italic">{metric}</span>
          </td>
          {tiers.map((tier, tierIdx) => {
            const usageLimit = getUsageLimitForMetric(service.id, metric, tier);

            return (
              <td
                key={tier.id}
                className={`px-4 py-1.5 text-center border-b border-gray-100 ${
                  tierIdx === 1 ? "bg-purple-50/50" : ""
                }`}
              >
                <span className="text-xs text-gray-500">
                  {usageLimit
                    ? usageLimit.limit
                      ? `Up to ${usageLimit.limit}`
                      : "Unlimited"
                    : "—"}
                </span>
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}

interface ServiceLevelDetailPanelProps {
  serviceId: string;
  tierId: string;
  services: Service[];
  tiers: ServiceSubscriptionTier[];
  optionGroups: OptionGroup[];
  dispatch: DocumentDispatch<ServiceOfferingAction>;
  onClose: () => void;
}

function ServiceLevelDetailPanel({
  serviceId,
  tierId,
  services,
  tiers,
  optionGroups,
  dispatch,
  onClose,
}: ServiceLevelDetailPanelProps) {
  const service = services.find((s) => s.id === serviceId);
  const tier = tiers.find((t) => t.id === tierId);

  if (!service || !tier) return null;

  const serviceLevel = tier.serviceLevels.find((sl) => sl.serviceId === serviceId);
  const usageLimits = tier.usageLimits.filter((ul) => ul.serviceId === serviceId);

  const [newMetric, setNewMetric] = useState("");
  const [newLimit, setNewLimit] = useState("");
  const [customValue, setCustomValue] = useState(serviceLevel?.customValue || "");

  const handleAddLimit = () => {
    if (!newMetric.trim()) return;
    dispatch(
      addUsageLimit({
        tierId: tier.id,
        limitId: generateId(),
        serviceId: service.id,
        metric: newMetric.trim(),
        limit: newLimit ? parseInt(newLimit) : undefined,
        resetPeriod: "MONTHLY",
        lastModified: new Date().toISOString(),
      })
    );
    setNewMetric("");
    setNewLimit("");
  };

  const handleRemoveLimit = (limitId: string) => {
    dispatch(
      removeUsageLimit({
        tierId: tier.id,
        limitId,
        lastModified: new Date().toISOString(),
      })
    );
  };

  const handleSetLevel = (level: ServiceLevel) => {
    if (serviceLevel) {
      dispatch(
        updateServiceLevel({
          tierId: tier.id,
          serviceLevelId: serviceLevel.id,
          level,
          customValue: level === "CUSTOM" ? customValue : undefined,
          lastModified: new Date().toISOString(),
        })
      );
    } else {
      dispatch(
        addServiceLevel({
          tierId: tier.id,
          serviceLevelId: generateId(),
          serviceId: service.id,
          level,
          customValue: level === "CUSTOM" ? customValue : undefined,
          lastModified: new Date().toISOString(),
        })
      );
    }
  };

  const handleUpdateCustomValue = () => {
    if (serviceLevel && serviceLevel.level === "CUSTOM") {
      dispatch(
        updateServiceLevel({
          tierId: tier.id,
          serviceLevelId: serviceLevel.id,
          customValue,
          lastModified: new Date().toISOString(),
        })
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-end z-50">
      <div className="w-96 h-full bg-white shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="bg-purple-600 text-white p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm opacity-80">{tier.name.toUpperCase()} TIER</span>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <h3 className="text-lg font-semibold">{service.title}</h3>
        </div>

        <div className="p-4 space-y-6">
          {/* Service Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Service Level</label>
            <div className="grid grid-cols-2 gap-2">
              {SERVICE_LEVELS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSetLevel(option.value)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-colors ${
                    serviceLevel?.level === option.value
                      ? "border-purple-500 bg-purple-50 text-purple-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Value Input */}
          {serviceLevel?.level === "CUSTOM" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Custom Value</label>
              <input
                type="text"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                onBlur={handleUpdateCustomValue}
                placeholder="e.g., Expedited, Basic, Pro"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          )}

          {/* Usage Limits / Metrics */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">Usage Limits / Metrics</label>
              <button
                onClick={() => setNewMetric("New Metric")}
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                + Add Limit
              </button>
            </div>

            <div className="space-y-3">
              {usageLimits.map((limit) => (
                <MetricLimitItem
                  key={limit.id}
                  limit={limit}
                  tierId={tier.id}
                  dispatch={dispatch}
                  onRemove={() => handleRemoveLimit(limit.id)}
                />
              ))}

              {usageLimits.length === 0 && !newMetric && (
                <p className="text-sm text-gray-500 italic">
                  No metrics added yet. Metrics will appear as nested rows under this service in the matrix.
                </p>
              )}

              {newMetric && (
                <div className="p-3 bg-purple-50 rounded-lg space-y-2">
                  <input
                    type="text"
                    value={newMetric}
                    onChange={(e) => setNewMetric(e.target.value)}
                    placeholder="Metric name (e.g., API Calls, Storage)"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newLimit}
                      onChange={(e) => setNewLimit(e.target.value)}
                      placeholder="e.g., 3, Unlimited, As needed"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                    <button
                      onClick={handleAddLimit}
                      className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setNewMetric("");
                        setNewLimit("");
                      }}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// Editable metric limit item component
interface MetricLimitItemProps {
  limit: ServiceUsageLimit;
  tierId: string;
  dispatch: DocumentDispatch<ServiceOfferingAction>;
  onRemove: () => void;
}

function MetricLimitItem({ limit, tierId, dispatch, onRemove }: MetricLimitItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editMetric, setEditMetric] = useState(limit.metric);
  const [editLimit, setEditLimit] = useState(limit.limit?.toString() || "");

  const handleSave = () => {
    dispatch(
      updateUsageLimit({
        tierId,
        limitId: limit.id,
        metric: editMetric.trim() || limit.metric,
        limit: editLimit ? parseInt(editLimit) : undefined,
        lastModified: new Date().toISOString(),
      })
    );
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditMetric(limit.metric);
    setEditLimit(limit.limit?.toString() || "");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-3 bg-purple-50 rounded-lg space-y-2">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Metric Name</label>
          <input
            type="text"
            value={editMetric}
            onChange={(e) => setEditMetric(e.target.value)}
            placeholder="Metric name"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Limit Value</label>
          <input
            type="text"
            value={editLimit}
            onChange={(e) => setEditLimit(e.target.value)}
            placeholder="e.g., 3, Unlimited, As needed"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">
            Can be numeric (3) or descriptive (Unlimited, Custom)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group">
      <div
        className="flex-1 cursor-pointer hover:bg-gray-100 rounded p-1 -m-1"
        onClick={() => setIsEditing(true)}
      >
        <div className="text-sm font-medium text-gray-900">{limit.metric}</div>
        <div className="text-sm text-gray-500">
          {limit.limit ? `Up to ${limit.limit}` : "Unlimited"}
        </div>
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="p-1 text-gray-400 hover:text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Edit metric"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>
      <button
        onClick={onRemove}
        className="p-1 text-gray-400 hover:text-red-500"
        title="Remove metric"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

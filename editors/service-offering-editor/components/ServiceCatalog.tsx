import React, { useState, useMemo, useEffect } from "react";
import { generateId } from "document-model/core";
import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import type {
  ServiceOfferingDocument,
  ServiceOfferingAction,
  Service,
  OptionGroup,
} from "resourceServices/document-models/service-offering";
import {
  addService,
  updateService,
  deleteService,
  addOptionGroup,
  updateOptionGroup,
  deleteOptionGroup,
  addServiceLevel,
  updateServiceLevel,
} from "../../../document-models/service-offering/gen/creators.js";

// Extended group info for UI (tracks setup status and fee locally since schema doesn't support it yet)
export interface GroupMetadata {
  isSetupFormation: boolean;
  setupFee: number | null;
}

interface ServiceCatalogProps {
  document: ServiceOfferingDocument;
  dispatch: DocumentDispatch<ServiceOfferingAction>;
  groupMetadata: Record<string, GroupMetadata>;
  setGroupMetadata: React.Dispatch<React.SetStateAction<Record<string, GroupMetadata>>>;
}

export function ServiceCatalog({ document, dispatch, groupMetadata, setGroupMetadata }: ServiceCatalogProps) {
  const { state } = document;
  const services = state.global.services ?? [];
  const optionGroups = state.global.optionGroups ?? [];
  const tiers = state.global.tiers ?? [];

  // Local UI state
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupType, setNewGroupType] = useState<"setup" | "recurring" | "addon">("recurring");
  const [newGroupSetupFee, setNewGroupSetupFee] = useState("");
  const [newService, setNewService] = useState({ title: "", description: "" });

  // Initialize metadata from existing services in groups when optionGroups change
  useEffect(() => {
    const metadata: Record<string, GroupMetadata> = {};
    optionGroups.forEach(group => {
      const groupServices = getServicesForGroup(group.id);
      const hasSetupServices = groupServices.some(s => s.isSetupFormation);
      metadata[group.id] = {
        isSetupFormation: groupMetadata[group.id]?.isSetupFormation ?? hasSetupServices,
        setupFee: groupMetadata[group.id]?.setupFee ?? null,
      };
    });
    setGroupMetadata(metadata);
  }, [optionGroups.length]);

  // Get services that belong to a specific group (via service level binding optionGroupId)
  const getServicesForGroup = (groupId: string): Service[] => {
    const serviceIds = new Set<string>();
    tiers.forEach(tier => {
      tier.serviceLevels.forEach(sl => {
        if (sl.optionGroupId === groupId) {
          serviceIds.add(sl.serviceId);
        }
      });
    });
    return services.filter(s => serviceIds.has(s.id));
  };

  // Get ungrouped services
  const ungroupedServices = useMemo(() => {
    const groupedServiceIds = new Set<string>();
    tiers.forEach(tier => {
      tier.serviceLevels.forEach(sl => {
        if (sl.optionGroupId) {
          groupedServiceIds.add(sl.serviceId);
        }
      });
    });
    return services.filter(s => !groupedServiceIds.has(s.id));
  }, [services, tiers]);

  // Separate ungrouped services by type
  const ungroupedSetupServices = useMemo(() =>
    ungroupedServices.filter(s => s.isSetupFormation),
    [ungroupedServices]
  );

  const ungroupedRegularServices = useMemo(() =>
    ungroupedServices.filter(s => !s.isSetupFormation),
    [ungroupedServices]
  );

  // Categorize option groups based on metadata
  const setupGroups = useMemo(() => {
    return optionGroups.filter(g => groupMetadata[g.id]?.isSetupFormation);
  }, [optionGroups, groupMetadata]);

  const regularGroups = useMemo(() => {
    return optionGroups.filter(g => !groupMetadata[g.id]?.isSetupFormation && !g.isAddOn);
  }, [optionGroups, groupMetadata]);

  const addonGroups = useMemo(() => {
    return optionGroups.filter(g => g.isAddOn);
  }, [optionGroups]);

  const handleAddGroup = () => {
    if (!newGroupName.trim()) return;

    const groupId = generateId();
    const isSetup = newGroupType === "setup";
    const setupFee = isSetup && newGroupSetupFee ? parseFloat(newGroupSetupFee) : null;

    dispatch(
      addOptionGroup({
        id: groupId,
        name: newGroupName.trim(),
        isAddOn: newGroupType === "addon",
        defaultSelected: newGroupType !== "addon",
        lastModified: new Date().toISOString(),
      })
    );

    // Store metadata locally
    setGroupMetadata(prev => ({
      ...prev,
      [groupId]: {
        isSetupFormation: isSetup,
        setupFee,
      },
    }));

    setNewGroupName("");
    setNewGroupType("recurring");
    setNewGroupSetupFee("");
    setIsAddingGroup(false);
    setSelectedGroupId(groupId);
  };

  const handleDeleteGroup = (groupId: string) => {
    if (!confirm("Are you sure you want to delete this group? Services in this group will become ungrouped.")) return;
    dispatch(
      deleteOptionGroup({
        id: groupId,
        lastModified: new Date().toISOString(),
      })
    );
    setGroupMetadata(prev => {
      const next = { ...prev };
      delete next[groupId];
      return next;
    });
    if (selectedGroupId === groupId) {
      setSelectedGroupId(null);
    }
  };

  const handleAddService = () => {
    if (!newService.title.trim()) return;

    const serviceId = generateId();

    // Determine if this is a setup service based on the selected group's metadata
    const isSetupFormation = selectedGroupId
      ? groupMetadata[selectedGroupId]?.isSetupFormation ?? false
      : false;

    // First, add the service
    dispatch(
      addService({
        id: serviceId,
        title: newService.title.trim(),
        description: newService.description.trim() || undefined,
        isSetupFormation,
        lastModified: new Date().toISOString(),
      })
    );

    // If a group is selected, create service level bindings for all tiers to link the service to the group
    if (selectedGroupId && tiers.length > 0) {
      tiers.forEach(tier => {
        dispatch(
          addServiceLevel({
            tierId: tier.id,
            serviceLevelId: generateId(),
            serviceId,
            level: "INCLUDED",
            optionGroupId: selectedGroupId,
            lastModified: new Date().toISOString(),
          })
        );
      });
    }

    setNewService({ title: "", description: "" });
    setIsAddingService(false);
  };

  const handleUpdateService = (service: Service, updates: Partial<Pick<Service, "title" | "description" | "isSetupFormation">>) => {
    dispatch(
      updateService({
        id: service.id,
        ...updates,
        lastModified: new Date().toISOString(),
      })
    );
  };

  const handleDeleteService = (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    dispatch(
      deleteService({
        id: serviceId,
        lastModified: new Date().toISOString(),
      })
    );
  };

  // Get displayed services based on selection
  const displayedServices = useMemo(() => {
    if (selectedGroupId) {
      return getServicesForGroup(selectedGroupId);
    }
    return ungroupedServices;
  }, [selectedGroupId, services, tiers, ungroupedServices]);

  // Get selected group info
  const selectedGroup = selectedGroupId ? optionGroups.find(g => g.id === selectedGroupId) : null;
  const selectedGroupMeta = selectedGroupId ? groupMetadata[selectedGroupId] : null;

  return (
    <div className="flex gap-6 h-full">
      {/* Service Groups Sidebar */}
      <div className="w-80 bg-white rounded-lg shadow-sm p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Service Groups</h2>
          <button
            onClick={() => setIsAddingGroup(true)}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {isAddingGroup && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Group name..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-2"
              autoFocus
            />
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-500 mb-1">Group Type</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setNewGroupType("setup")}
                  className={`flex-1 px-2 py-1.5 text-xs rounded-lg border ${
                    newGroupType === "setup"
                      ? "border-amber-500 bg-amber-50 text-amber-700"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Setup
                </button>
                <button
                  onClick={() => setNewGroupType("recurring")}
                  className={`flex-1 px-2 py-1.5 text-xs rounded-lg border ${
                    newGroupType === "recurring"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Recurring
                </button>
                <button
                  onClick={() => setNewGroupType("addon")}
                  className={`flex-1 px-2 py-1.5 text-xs rounded-lg border ${
                    newGroupType === "addon"
                      ? "border-purple-500 bg-purple-50 text-purple-700"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Add-on
                </button>
              </div>
            </div>

            {/* Setup Fee field - only show for Setup type */}
            {newGroupType === "setup" && (
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-500 mb-1">One-time Setup Fee</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">$</span>
                  <input
                    type="number"
                    value={newGroupSetupFee}
                    onChange={(e) => setNewGroupSetupFee(e.target.value)}
                    placeholder="0"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    step="0.01"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleAddGroup}
                disabled={!newGroupName.trim()}
                className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add Group
              </button>
              <button
                onClick={() => {
                  setIsAddingGroup(false);
                  setNewGroupName("");
                  setNewGroupType("recurring");
                  setNewGroupSetupFee("");
                }}
                className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Setup & Formation Groups */}
          {setupGroups.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Setup & Formation</span>
              </div>
              <div className="space-y-1">
                {setupGroups.map((group) => (
                  <GroupButton
                    key={group.id}
                    group={group}
                    serviceCount={getServicesForGroup(group.id).length}
                    isSelected={selectedGroupId === group.id}
                    onSelect={() => setSelectedGroupId(group.id)}
                    onDelete={() => handleDeleteGroup(group.id)}
                    setupFee={groupMetadata[group.id]?.setupFee}
                    isSetup={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recurring Services Groups */}
          {regularGroups.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Recurring Services</span>
              </div>
              <div className="space-y-1">
                {regularGroups.map((group) => (
                  <GroupButton
                    key={group.id}
                    group={group}
                    serviceCount={getServicesForGroup(group.id).length}
                    isSelected={selectedGroupId === group.id}
                    onSelect={() => setSelectedGroupId(group.id)}
                    onDelete={() => handleDeleteGroup(group.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Add-on Groups */}
          {addonGroups.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Optional Add-ons</span>
              </div>
              <div className="space-y-1">
                {addonGroups.map((group) => (
                  <GroupButton
                    key={group.id}
                    group={group}
                    serviceCount={getServicesForGroup(group.id).length}
                    isSelected={selectedGroupId === group.id}
                    onSelect={() => setSelectedGroupId(group.id)}
                    onDelete={() => handleDeleteGroup(group.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Ungrouped services */}
          {ungroupedServices.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => setSelectedGroupId(null)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors text-sm ${
                  selectedGroupId === null
                    ? "bg-gray-100 border-l-4 border-gray-500"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="font-medium text-gray-700">Ungrouped Services</div>
                <div className="text-xs text-gray-400">{ungroupedServices.length} services</div>
              </button>
            </div>
          )}

          {/* Empty state */}
          {optionGroups.length === 0 && ungroupedServices.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No service groups yet</p>
              <p className="text-xs mt-1">Click + to create a group</p>
            </div>
          )}
        </div>
      </div>

      {/* Services List */}
      <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedGroup?.name || "Ungrouped Services"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {selectedGroupMeta?.isSetupFormation ? (
                <span className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                    Setup & Formation
                  </span>
                  {selectedGroupMeta.setupFee && (
                    <span className="text-amber-600">
                      ${selectedGroupMeta.setupFee} one-time fee
                    </span>
                  )}
                </span>
              ) : selectedGroup?.isAddOn ? (
                "Optional add-on group"
              ) : selectedGroup ? (
                "Included in subscription"
              ) : (
                "Services not assigned to any group"
              )}
            </p>
          </div>
          {selectedGroupId && (
            <button
              onClick={() => setIsAddingService(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Service
            </button>
          )}
        </div>

        {!selectedGroupId && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              Select a service group from the sidebar to add services. Services must belong to a group to be properly managed.
            </p>
          </div>
        )}

        {isAddingService && selectedGroupId && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Service Name
                </label>
                <input
                  type="text"
                  value={newService.title}
                  onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                  placeholder="Enter service name..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  placeholder="Enter description..."
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg resize-none"
                />
              </div>
              {tiers.length === 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    Note: No subscription tiers exist yet. Create tiers in "Tier Definition" first to fully link services to groups.
                  </p>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleAddService}
                  disabled={!newService.title.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add Service
                </button>
                <button
                  onClick={() => {
                    setIsAddingService(false);
                    setNewService({ title: "", description: "" });
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {displayedServices.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg
              className="w-12 h-12 mx-auto mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-lg font-medium mb-1">No services in this group</p>
            <p className="text-sm">
              {selectedGroupId
                ? 'Click "Add Service" to create a new service.'
                : "Select a group to manage its services."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onUpdate={handleUpdateService}
                onDelete={() => handleDeleteService(service.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface GroupButtonProps {
  group: OptionGroup;
  serviceCount: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  setupFee?: number | null;
  isSetup?: boolean;
}

function GroupButton({ group, serviceCount, isSelected, onSelect, onDelete, setupFee, isSetup }: GroupButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const bgColor = isSetup
    ? isSelected ? "bg-amber-50 border-l-4 border-amber-500" : "hover:bg-amber-50/50"
    : group.isAddOn
      ? isSelected ? "bg-purple-50 border-l-4 border-purple-500" : "hover:bg-purple-50/50"
      : isSelected ? "bg-blue-50 border-l-4 border-blue-500" : "hover:bg-gray-50";

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={onSelect}
        className={`w-full text-left px-4 py-2 rounded-lg transition-colors text-sm ${bgColor}`}
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-800">{group.name}</span>
          {isSetup && (
            <span className="px-1.5 py-0.5 text-[10px] bg-amber-100 text-amber-700 rounded">
              SETUP
            </span>
          )}
          {group.isAddOn && (
            <span className="px-1.5 py-0.5 text-[10px] bg-purple-100 text-purple-700 rounded">
              OPTIONAL
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{serviceCount} services</span>
          {setupFee && <span className="text-amber-600">${setupFee} fee</span>}
        </div>
      </button>
      {isHovered && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

interface ServiceCardProps {
  service: Service;
  onUpdate: (service: Service, updates: Partial<Pick<Service, "title" | "description" | "isSetupFormation">>) => void;
  onDelete: () => void;
}

function ServiceCard({ service, onUpdate, onDelete }: ServiceCardProps) {
  const [localTitle, setLocalTitle] = useState(service.title);
  const [localDescription, setLocalDescription] = useState(service.description || "");

  // Sync local state when service changes
  useEffect(() => {
    setLocalTitle(service.title);
    setLocalDescription(service.description || "");
  }, [service.title, service.description]);

  return (
    <div className={`p-4 border rounded-lg transition-colors ${
      service.isSetupFormation
        ? "border-amber-200 bg-amber-50/30"
        : "border-gray-200 hover:border-gray-300"
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={localTitle}
                onChange={(e) => setLocalTitle(e.target.value)}
                onBlur={() => {
                  if (localTitle !== service.title && localTitle.trim()) {
                    onUpdate(service, { title: localTitle.trim() });
                  }
                }}
                className="w-full text-lg font-medium text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none pb-1"
              />
            </div>
            {service.isSetupFormation && (
              <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-full whitespace-nowrap">
                Setup Service
              </span>
            )}
          </div>
          <textarea
            value={localDescription}
            onChange={(e) => setLocalDescription(e.target.value)}
            onBlur={() => {
              if (localDescription !== (service.description || "")) {
                onUpdate(service, { description: localDescription });
              }
            }}
            placeholder="Add a description..."
            rows={2}
            className="w-full text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={onDelete}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

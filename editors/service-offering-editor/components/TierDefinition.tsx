import { useState } from "react";
import { generateId } from "document-model/core";
import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import type {
  ServiceOfferingDocument,
  ServiceOfferingAction,
  ServiceSubscriptionTier,
  BillingCycle,
} from "resourceServices/document-models/service-offering";
import {
  addTier,
  updateTier,
  updateTierPricing,
  deleteTier,
} from "../../../document-models/service-offering/gen/creators.js";

interface TierDefinitionProps {
  document: ServiceOfferingDocument;
  dispatch: DocumentDispatch<ServiceOfferingAction>;
}

const BILLING_CYCLES: { value: BillingCycle; label: string }[] = [
  { value: "MONTHLY", label: "Month" },
  { value: "QUARTERLY", label: "Quarter" },
  { value: "SEMI_ANNUAL", label: "6 Months" },
  { value: "ANNUAL", label: "Year" },
  { value: "ONE_TIME", label: "One Time" },
];

const TIER_COLORS = [
  { border: "border-green-400", bg: "bg-green-400" },
  { border: "border-blue-400", bg: "bg-blue-400" },
  { border: "border-purple-400", bg: "bg-purple-400" },
  { border: "border-orange-400", bg: "bg-orange-400" },
  { border: "border-pink-400", bg: "bg-pink-400" },
];

export function TierDefinition({ document, dispatch }: TierDefinitionProps) {
  const { state } = document;
  const tiers = state.global.tiers ?? [];

  const [isAddingTier, setIsAddingTier] = useState(false);
  const [newTier, setNewTier] = useState({
    name: "",
    amount: "",
    currency: "USD",
    billingCycle: "MONTHLY" as BillingCycle,
    isCustomPricing: false,
  });

  const handleAddTier = () => {
    // For custom pricing tiers, amount is optional
    if (!newTier.name.trim() || (!newTier.isCustomPricing && !newTier.amount)) return;

    dispatch(
      addTier({
        id: generateId(),
        name: newTier.name.trim(),
        amount: newTier.isCustomPricing ? undefined : parseFloat(newTier.amount),
        currency: newTier.currency,
        billingCycle: newTier.billingCycle,
        isCustomPricing: newTier.isCustomPricing,
        lastModified: new Date().toISOString(),
      })
    );

    setNewTier({
      name: "",
      amount: "",
      currency: "USD",
      billingCycle: "MONTHLY",
      isCustomPricing: false,
    });
    setIsAddingTier(false);
  };

  const handleDeleteTier = (tierId: string) => {
    if (!confirm("Are you sure you want to delete this tier?")) return;
    dispatch(
      deleteTier({
        id: tierId,
        lastModified: new Date().toISOString(),
      })
    );
  };

  const getTierColor = (index: number) => TIER_COLORS[index % TIER_COLORS.length];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-6">
        {tiers.map((tier, index) => (
          <TierCard
            key={tier.id}
            tier={tier}
            color={getTierColor(index)}
            dispatch={dispatch}
            onDelete={() => handleDeleteTier(tier.id)}
          />
        ))}

        {/* Add Tier Card */}
        {isAddingTier ? (
          <div className="w-80 bg-white rounded-lg border-2 border-dashed border-gray-300 p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Tier Name
                </label>
                <input
                  type="text"
                  value={newTier.name}
                  onChange={(e) => setNewTier({ ...newTier, name: e.target.value })}
                  placeholder="e.g., Basic, Professional"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-lg font-semibold"
                  autoFocus
                />
              </div>

              <div>
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={newTier.isCustomPricing}
                    onChange={(e) => setNewTier({ ...newTier, isCustomPricing: e.target.checked, amount: "" })}
                    className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-600">Custom Pricing (price varies per client)</span>
                </label>
              </div>

              {!newTier.isCustomPricing && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Recurring Price
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">$</span>
                    <input
                      type="number"
                      value={newTier.amount}
                      onChange={(e) => setNewTier({ ...newTier, amount: e.target.value })}
                      placeholder="0"
                      className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-lg"
                      step="0.01"
                    />
                    <span className="text-gray-500">/</span>
                    <select
                      value={newTier.billingCycle}
                      onChange={(e) =>
                        setNewTier({ ...newTier, billingCycle: e.target.value as BillingCycle })
                      }
                      className="px-3 py-2 border border-gray-200 rounded-lg bg-white"
                    >
                      {BILLING_CYCLES.map((cycle) => (
                        <option key={cycle.value} value={cycle.value}>
                          {cycle.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleAddTier}
                  disabled={!newTier.name.trim() || (!newTier.isCustomPricing && !newTier.amount)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Create Tier
                </button>
                <button
                  onClick={() => {
                    setIsAddingTier(false);
                    setNewTier({ name: "", amount: "", currency: "USD", billingCycle: "MONTHLY", isCustomPricing: false });
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingTier(true)}
            className="w-80 min-h-[220px] bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-3 text-gray-500"
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="font-medium">Add Subscription Tier</span>
          </button>
        )}
      </div>

      {/* Info note about setup fees */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm text-amber-800 font-medium">Setup fees are managed at the service group level</p>
            <p className="text-sm text-amber-700 mt-1">
              Configure setup fees for "Setup & Formation" service groups in the Service Catalog.
              The setup fee applies to all tiers when those services are included.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TierCardProps {
  tier: ServiceSubscriptionTier;
  color: { border: string; bg: string };
  dispatch: DocumentDispatch<ServiceOfferingAction>;
  onDelete: () => void;
}

function TierCard({ tier, color, dispatch, onDelete }: TierCardProps) {
  const [localName, setLocalName] = useState(tier.name);
  const [localAmount, setLocalAmount] = useState(tier.pricing.amount?.toString() || "");
  const [localBillingCycle, setLocalBillingCycle] = useState(tier.pricing.billingCycle);
  const [localDescription, setLocalDescription] = useState(tier.description || "");
  const isCustomPricing = tier.isCustomPricing ?? false;

  const handleNameBlur = () => {
    if (localName !== tier.name && localName.trim()) {
      dispatch(
        updateTier({
          id: tier.id,
          name: localName.trim(),
          lastModified: new Date().toISOString(),
        })
      );
    }
  };

  const handleDescriptionBlur = () => {
    if (localDescription !== (tier.description || "")) {
      dispatch(
        updateTier({
          id: tier.id,
          description: localDescription,
          lastModified: new Date().toISOString(),
        })
      );
    }
  };

  const handlePricingChange = (amount?: string, billingCycle?: BillingCycle) => {
    const newAmount = amount !== undefined
      ? (amount ? parseFloat(amount) : null)
      : tier.pricing.amount;
    const newCycle = billingCycle || tier.pricing.billingCycle;

    // For non-custom pricing, amount is required
    if (!isCustomPricing && (newAmount === null || isNaN(newAmount as number))) return;

    dispatch(
      updateTierPricing({
        tierId: tier.id,
        amount: newAmount,
        billingCycle: newCycle,
        lastModified: new Date().toISOString(),
      })
    );
  };

  return (
    <div className={`w-80 bg-white rounded-lg border-t-4 ${color.border} shadow-sm overflow-hidden`}>
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Tier Name
            </label>
            <input
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onBlur={handleNameBlur}
              className="text-2xl font-bold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none w-full"
            />
          </div>
          <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Custom Pricing Badge */}
        {isCustomPricing && (
          <div className="mb-4 px-3 py-2 bg-orange-100 rounded-lg">
            <span className="text-sm font-medium text-orange-700">Custom Pricing</span>
            <p className="text-xs text-orange-600 mt-1">Price varies per client</p>
          </div>
        )}

        {/* Pricing */}
        {!isCustomPricing && (
          <div>
            <label className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Recurring Price
            </label>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
              <span className="text-gray-500 text-lg">$</span>
              <input
                type="number"
                value={localAmount}
                onChange={(e) => setLocalAmount(e.target.value)}
                onBlur={() => handlePricingChange(localAmount)}
                className="w-20 text-xl font-semibold text-gray-900 bg-transparent focus:outline-none"
                step="0.01"
              />
              <span className="text-gray-400">/</span>
              <div className="relative flex-1">
                <select
                  value={localBillingCycle}
                  onChange={(e) => {
                    const newCycle = e.target.value as BillingCycle;
                    setLocalBillingCycle(newCycle);
                    handlePricingChange(undefined, newCycle);
                  }}
                  className="w-full bg-transparent text-gray-600 appearance-none focus:outline-none cursor-pointer pr-6"
                >
                  {BILLING_CYCLES.map((cycle) => (
                    <option key={cycle.value} value={cycle.value}>
                      {cycle.label}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mt-4">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Description
          </label>
          <textarea
            value={localDescription}
            onChange={(e) => setLocalDescription(e.target.value)}
            onBlur={handleDescriptionBlur}
            placeholder="Add a description..."
            rows={2}
            className="w-full px-3 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Note: Add-on pricing is configured at the service level in The Matrix */}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          Configure service levels in the Matrix view.
        </p>
      </div>
    </div>
  );
}

// Note: Add-on group pricing functionality removed as it's not supported in the current document model schema

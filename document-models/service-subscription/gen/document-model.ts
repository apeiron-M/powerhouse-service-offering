import type { DocumentModelGlobalState } from "document-model";

export const documentModel: DocumentModelGlobalState = {
  author: {
    name: "Powerhouse",
    website: "https://www.powerhouse.inc/",
  },
  description:
    "Document model for a customer's subscription to a service offering. Created programmatically during checkout, capturing selected tier, optional add-ons, and billing information.",
  extension: "",
  id: "powerhouse/service-subscription",
  name: "ServiceSubscription",
  specifications: [
    {
      changeLog: [],
      modules: [
        {
          description: "Operations for managing subscription metadata",
          id: "subscription-management",
          name: "Subscription Management",
          operations: [
            {
              description:
                "Initializes the subscription with offering and customer details",
              errors: [],
              examples: [],
              id: "initialize-subscription",
              name: "INITIALIZE_SUBSCRIPTION",
              reducer:
                'state.id = action.input.id;\nstate.customerId = action.input.customerId;\nstate.serviceOfferingId = action.input.serviceOfferingId;\nstate.resourceTemplateId = action.input.resourceTemplateId;\nstate.selectedTierId = action.input.selectedTierId;\nstate.status = "PENDING";\nstate.createdAt = action.input.createdAt;\nstate.lastModified = action.input.lastModified;',
              schema:
                "input InitializeSubscriptionInput {\n    id: PHID!\n    customerId: PHID!\n    serviceOfferingId: PHID!\n    resourceTemplateId: PHID!\n    selectedTierId: OID!\n    createdAt: DateTime!\n    lastModified: DateTime!\n}",
              scope: "global",
              template: "Initializes the subscription",
            },
            {
              description: "Updates the subscription status",
              errors: [],
              examples: [],
              id: "update-subscription-status",
              name: "UPDATE_SUBSCRIPTION_STATUS",
              reducer:
                "state.status = action.input.status;\nstate.lastModified = action.input.lastModified;",
              schema:
                "input UpdateSubscriptionStatusInput {\n    status: SubscriptionStatus!\n    lastModified: DateTime!\n}",
              scope: "global",
              template: "Updates the subscription status",
            },
            {
              description: "Activates the subscription with start date",
              errors: [],
              examples: [],
              id: "activate-subscription",
              name: "ACTIVATE_SUBSCRIPTION",
              reducer:
                'state.status = "ACTIVE";\nstate.startDate = action.input.startDate;\nstate.currentPeriodStart = action.input.currentPeriodStart;\nstate.currentPeriodEnd = action.input.currentPeriodEnd;\nstate.lastModified = action.input.lastModified;',
              schema:
                "input ActivateSubscriptionInput {\n    startDate: DateTime!\n    currentPeriodStart: DateTime!\n    currentPeriodEnd: DateTime!\n    lastModified: DateTime!\n}",
              scope: "global",
              template: "Activates the subscription",
            },
            {
              description: "Cancels the subscription",
              errors: [],
              examples: [],
              id: "cancel-subscription",
              name: "CANCEL_SUBSCRIPTION",
              reducer:
                'state.status = "CANCELLED";\nstate.cancelledAt = action.input.cancelledAt;\nstate.cancellationReason = action.input.reason || null;\nstate.lastModified = action.input.lastModified;',
              schema:
                "input CancelSubscriptionInput {\n    cancelledAt: DateTime!\n    reason: String\n    lastModified: DateTime!\n}",
              scope: "global",
              template: "Cancels the subscription",
            },
            {
              description: "Renews the subscription for a new period",
              errors: [],
              examples: [],
              id: "renew-subscription",
              name: "RENEW_SUBSCRIPTION",
              reducer:
                "state.currentPeriodStart = action.input.periodStart;\nstate.currentPeriodEnd = action.input.periodEnd;\nstate.lastModified = action.input.lastModified;",
              schema:
                "input RenewSubscriptionInput {\n    periodStart: DateTime!\n    periodEnd: DateTime!\n    lastModified: DateTime!\n}",
              scope: "global",
              template: "Renews the subscription",
            },
          ],
        },
        {
          description: "Operations for managing tier and pricing",
          id: "tier-selection",
          name: "Tier Selection",
          operations: [
            {
              description: "Changes the selected tier",
              errors: [
                {
                  code: "INVALID_TIER_CHANGE",
                  description:
                    "Cannot change tier in current subscription status",
                  id: "invalid-tier-change",
                  name: "InvalidTierChangeError",
                  template: "",
                },
              ],
              examples: [],
              id: "change-tier",
              name: "CHANGE_TIER",
              reducer:
                "state.selectedTierId = action.input.newTierId;\nstate.lastModified = action.input.lastModified;",
              schema:
                "input ChangeTierInput {\n    newTierId: OID!\n    lastModified: DateTime!\n}",
              scope: "global",
              template: "Changes the selected tier",
            },
            {
              description: "Sets the pricing details for the subscription",
              errors: [],
              examples: [],
              id: "set-pricing",
              name: "SET_PRICING",
              reducer:
                "state.pricing = {\n    amount: action.input.amount,\n    currency: action.input.currency,\n    billingCycle: action.input.billingCycle,\n    setupFee: action.input.setupFee || null\n};\nstate.lastModified = action.input.lastModified;",
              schema:
                "input SetPricingInput {\n    amount: Amount_Money!\n    currency: Currency!\n    billingCycle: BillingCycle!\n    setupFee: Amount_Money\n    lastModified: DateTime!\n}",
              scope: "global",
              template: "Sets the pricing details",
            },
          ],
        },
        {
          description: "Operations for managing add-on selections",
          id: "addon-management",
          name: "Add-on Management",
          operations: [
            {
              description: "Adds an optional add-on to the subscription",
              errors: [
                {
                  code: "DUPLICATE_ADDON_ID",
                  description: "This add-on has already been added",
                  id: "duplicate-addon-id",
                  name: "DuplicateAddonIdError",
                  template: "",
                },
              ],
              examples: [],
              id: "add-addon",
              name: "ADD_ADDON",
              reducer:
                "state.selectedAddons.push({\n    id: action.input.id,\n    optionGroupId: action.input.optionGroupId,\n    addedAt: action.input.addedAt\n});\nstate.lastModified = action.input.lastModified;",
              schema:
                "input AddAddonInput {\n    id: OID!\n    optionGroupId: OID!\n    addedAt: DateTime!\n    lastModified: DateTime!\n}",
              scope: "global",
              template: "Adds an optional add-on",
            },
            {
              description: "Removes an add-on from the subscription",
              errors: [
                {
                  code: "ADDON_NOT_FOUND",
                  description: "Add-on with the specified ID does not exist",
                  id: "addon-not-found",
                  name: "AddonNotFoundError",
                  template: "",
                },
              ],
              examples: [],
              id: "remove-addon",
              name: "REMOVE_ADDON",
              reducer:
                "const addonIndex = state.selectedAddons.findIndex(a => a.id === action.input.id);\nif (addonIndex !== -1) {\n    state.selectedAddons.splice(addonIndex, 1);\n}\nstate.lastModified = action.input.lastModified;",
              schema:
                "input RemoveAddonInput {\n    id: OID!\n    lastModified: DateTime!\n}",
              scope: "global",
              template: "Removes an add-on",
            },
          ],
        },
        {
          description: "Operations for managing facet selections",
          id: "facet-selection",
          name: "Facet Selection",
          operations: [
            {
              description: "Sets the selected facet option for a category",
              errors: [],
              examples: [],
              id: "set-facet-selection",
              name: "SET_FACET_SELECTION",
              reducer:
                "const existingIndex = state.facetSelections.findIndex(fs => fs.categoryKey === action.input.categoryKey);\nif (existingIndex !== -1) {\n    state.facetSelections[existingIndex] = {\n        id: action.input.id,\n        categoryKey: action.input.categoryKey,\n        selectedOptionId: action.input.selectedOptionId\n    };\n} else {\n    state.facetSelections.push({\n        id: action.input.id,\n        categoryKey: action.input.categoryKey,\n        selectedOptionId: action.input.selectedOptionId\n    });\n}\nstate.lastModified = action.input.lastModified;",
              schema:
                "input SetFacetSelectionInput {\n    id: OID!\n    categoryKey: String!\n    selectedOptionId: String!\n    lastModified: DateTime!\n}",
              scope: "global",
              template: "Sets a facet selection",
            },
            {
              description: "Removes a facet selection",
              errors: [],
              examples: [],
              id: "remove-facet-selection",
              name: "REMOVE_FACET_SELECTION",
              reducer:
                "const selectionIndex = state.facetSelections.findIndex(fs => fs.categoryKey === action.input.categoryKey);\nif (selectionIndex !== -1) {\n    state.facetSelections.splice(selectionIndex, 1);\n}\nstate.lastModified = action.input.lastModified;",
              schema:
                "input RemoveFacetSelectionInput {\n    categoryKey: String!\n    lastModified: DateTime!\n}",
              scope: "global",
              template: "Removes a facet selection",
            },
          ],
        },
      ],
      state: {
        global: {
          examples: [],
          initialValue:
            '"{\\n    \\"id\\": \\"\\",\\n    \\"customerId\\": \\"\\",\\n    \\"serviceOfferingId\\": \\"\\",\\n    \\"resourceTemplateId\\": \\"\\",\\n    \\"selectedTierId\\": \\"\\",\\n    \\"status\\": \\"PENDING\\",\\n    \\"pricing\\": null,\\n    \\"selectedAddons\\": [],\\n    \\"facetSelections\\": [],\\n    \\"startDate\\": null,\\n    \\"currentPeriodStart\\": null,\\n    \\"currentPeriodEnd\\": null,\\n    \\"cancelledAt\\": null,\\n    \\"cancellationReason\\": null,\\n    \\"createdAt\\": \\"1970-01-01T00:00:00.000Z\\",\\n    \\"lastModified\\": \\"1970-01-01T00:00:00.000Z\\"\\n}"',
          schema:
            "type ServiceSubscriptionState {\n    id: PHID!\n    customerId: PHID!\n    serviceOfferingId: PHID!\n    resourceTemplateId: PHID!\n    selectedTierId: OID!\n    status: SubscriptionStatus!\n    pricing: SubscriptionPricing\n    selectedAddons: [SelectedAddon!]!\n    facetSelections: [FacetSelection!]!\n    startDate: DateTime\n    currentPeriodStart: DateTime\n    currentPeriodEnd: DateTime\n    cancelledAt: DateTime\n    cancellationReason: String\n    createdAt: DateTime!\n    lastModified: DateTime!\n}\n\nenum SubscriptionStatus {\n    PENDING\n    ACTIVE\n    PAUSED\n    CANCELLED\n    EXPIRED\n}\n\ntype SubscriptionPricing {\n    amount: Amount_Money!\n    currency: Currency!\n    billingCycle: BillingCycle!\n    setupFee: Amount_Money\n}\n\nenum BillingCycle {\n    MONTHLY\n    QUARTERLY\n    SEMI_ANNUAL\n    ANNUAL\n    ONE_TIME\n}\n\ntype SelectedAddon {\n    id: OID!\n    optionGroupId: OID!\n    addedAt: DateTime!\n}\n\ntype FacetSelection {\n    id: OID!\n    categoryKey: String!\n    selectedOptionId: String!\n}",
        },
        local: {
          examples: [],
          initialValue: '""',
          schema: "",
        },
      },
      version: 1,
    },
  ],
};

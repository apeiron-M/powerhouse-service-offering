import type { ServiceSubscriptionSubscriptionManagementOperations } from "@powerhousedao/contributor-billing/document-models/service-subscription";

export const serviceSubscriptionSubscriptionManagementOperations: ServiceSubscriptionSubscriptionManagementOperations =
  {
    initializeSubscriptionOperation(state, action) {
          state.id = action.input.id;
          state.customerId = action.input.customerId;
          state.serviceOfferingId = action.input.serviceOfferingId;
          state.resourceTemplateId = action.input.resourceTemplateId;
          state.selectedTierId = action.input.selectedTierId;
          state.status = "PENDING";
          state.createdAt = action.input.createdAt;
          state.lastModified = action.input.lastModified;
      },
    updateSubscriptionStatusOperation(state, action) {
        state.status = action.input.status;
        state.lastModified = action.input.lastModified;
    },
    activateSubscriptionOperation(state, action) {
        state.status = "ACTIVE";
        state.startDate = action.input.startDate;
        state.currentPeriodStart = action.input.currentPeriodStart;
        state.currentPeriodEnd = action.input.currentPeriodEnd;
        state.lastModified = action.input.lastModified;
    },
    cancelSubscriptionOperation(state, action) {
        state.status = "CANCELLED";
        state.cancelledAt = action.input.cancelledAt;
        state.cancellationReason = action.input.reason || null;
        state.lastModified = action.input.lastModified;
    },
    renewSubscriptionOperation(state, action) {
        state.currentPeriodStart = action.input.periodStart;
        state.currentPeriodEnd = action.input.periodEnd;
        state.lastModified = action.input.lastModified;
    },
  };

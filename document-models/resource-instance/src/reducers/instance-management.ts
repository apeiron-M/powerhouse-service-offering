import type { ResourceInstanceInstanceManagementOperations } from "resourceServices/document-models/resource-instance";

export const resourceInstanceInstanceManagementOperations: ResourceInstanceInstanceManagementOperations =
  {
    initializeInstanceOperation(state, action) {
          state.id = action.input.id;
          state.subscriptionId = action.input.subscriptionId;
          state.resourceTemplateId = action.input.resourceTemplateId;
          state.customerId = action.input.customerId;
          state.name = action.input.name;
          state.status = "PROVISIONING";
          state.createdAt = action.input.createdAt;
          state.lastModified = action.input.lastModified;
      },
    updateInstanceStatusOperation(state, action) {
        state.status = action.input.status;
        state.lastModified = action.input.lastModified;
    },
    activateInstanceOperation(state, action) {
        state.status = "ACTIVE";
        state.activatedAt = action.input.activatedAt;
        state.lastModified = action.input.lastModified;
    },
    suspendInstanceOperation(state, action) {
        state.status = "SUSPENDED";
        state.suspendedAt = action.input.suspendedAt;
        state.suspensionReason = action.input.reason || null;
        state.lastModified = action.input.lastModified;
    },
    terminateInstanceOperation(state, action) {
        state.status = "TERMINATED";
        state.terminatedAt = action.input.terminatedAt;
        state.terminationReason = action.input.reason || null;
        state.lastModified = action.input.lastModified;
    },
    updateInstanceNameOperation(state, action) {
        state.name = action.input.name;
        state.lastModified = action.input.lastModified;
    },
  };

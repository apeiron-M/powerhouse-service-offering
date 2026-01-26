import type { ResourceInstanceUsageTrackingOperations } from "@powerhousedao/contributor-billing/document-models/resource-instance";

export const resourceInstanceUsageTrackingOperations: ResourceInstanceUsageTrackingOperations =
  {
    recordUsageOperation(state, action) {
      const existingIndex = state.usageMetrics.findIndex(
        (u) => u.metricKey === action.input.metricKey,
      );
      if (existingIndex !== -1) {
        state.usageMetrics[existingIndex].currentValue = action.input.value;
        state.usageMetrics[existingIndex].lastUpdated = action.input.recordedAt;
      } else {
        state.usageMetrics.push({
          id: action.input.id,
          metricKey: action.input.metricKey,
          currentValue: action.input.value,
          limit: action.input.limit || null,
          resetPeriod: action.input.resetPeriod || null,
          lastUpdated: action.input.recordedAt,
        });
      }
      state.lastModified = action.input.lastModified;
    },
    resetUsageOperation(state, action) {
      const usageIndex = state.usageMetrics.findIndex(
        (u) => u.metricKey === action.input.metricKey,
      );
      if (usageIndex !== -1) {
        state.usageMetrics[usageIndex].currentValue = 0;
        state.usageMetrics[usageIndex].lastUpdated = action.input.resetAt;
      }
      state.lastModified = action.input.lastModified;
    },
  };

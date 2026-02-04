import type { SubscriptionInstanceRequestsOperations } from "@powerhousedao/contributor-billing/document-models/subscription-instance";

export const subscriptionInstanceRequestsOperations: SubscriptionInstanceRequestsOperations =
  {
    createClientRequestOperation(state, action) {
      const { input } = action;

      const newRequest = {
        id: input.requestId,
        type: input.type,
        status: "PENDING" as const,
        requestedAt: input.requestedAt,
        requestedBy: input.requestedBy || null,
        reason: input.reason || null,
        serviceId: input.serviceId || null,
        metricId: input.metricId || null,
        requestedLimit: input.requestedLimit ?? null,
        requestedTierName: input.requestedTierName || null,
        requestedTeamSize: input.requestedTeamSize ?? null,
        processedAt: null,
        processedBy: null,
        operatorResponse: null,
      };

      state.pendingRequests.push(newRequest);
    },

    approveRequestOperation(state, action) {
      const { input } = action;

      const requestIndex = state.pendingRequests.findIndex(
        (r) => r.id === input.requestId,
      );

      if (requestIndex === -1) {
        return;
      }

      const request = state.pendingRequests[requestIndex];

      // Update the request status
      request.status = "APPROVED";
      request.processedAt = input.processedAt;
      request.processedBy = input.processedBy || null;
      request.operatorResponse = input.operatorResponse || null;
    },

    rejectRequestOperation(state, action) {
      const { input } = action;

      const requestIndex = state.pendingRequests.findIndex(
        (r) => r.id === input.requestId,
      );

      if (requestIndex === -1) {
        return;
      }

      const request = state.pendingRequests[requestIndex];

      // Update the request status
      request.status = "REJECTED";
      request.processedAt = input.processedAt;
      request.processedBy = input.processedBy || null;
      request.operatorResponse = input.operatorResponse;
    },

    withdrawRequestOperation(state, action) {
      const { input } = action;

      const requestIndex = state.pendingRequests.findIndex(
        (r) => r.id === input.requestId,
      );

      if (requestIndex === -1) {
        return;
      }

      const request = state.pendingRequests[requestIndex];

      // Only allow withdrawing pending requests
      if (request.status !== "PENDING") {
        return;
      }

      request.status = "WITHDRAWN";
      request.processedAt = input.withdrawnAt;
    },
  };

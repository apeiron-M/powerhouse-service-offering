import type { SubscriptionInstanceCustomerOperations } from "@powerhousedao/contributor-billing/document-models/subscription-instance";

export const subscriptionInstanceCustomerOperations: SubscriptionInstanceCustomerOperations =
  {
    setCustomerTypeOperation(state, action) {
      const { input } = action;
      state.customerType = input.customerType;
      if (
        input.teamMemberCount !== undefined &&
        input.teamMemberCount !== null
      ) {
        state.teamMemberCount = input.teamMemberCount;
      }
    },

    updateTeamMemberCountOperation(state, action) {
      state.teamMemberCount = action.input.teamMemberCount;
    },
  };

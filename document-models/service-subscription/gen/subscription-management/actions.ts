import type { Action } from "document-model";
import type {
  InitializeSubscriptionInput,
  UpdateSubscriptionStatusInput,
  ActivateSubscriptionInput,
  CancelSubscriptionInput,
  RenewSubscriptionInput,
} from "../types.js";

export type InitializeSubscriptionAction = Action & {
  type: "INITIALIZE_SUBSCRIPTION";
  input: InitializeSubscriptionInput;
};
export type UpdateSubscriptionStatusAction = Action & {
  type: "UPDATE_SUBSCRIPTION_STATUS";
  input: UpdateSubscriptionStatusInput;
};
export type ActivateSubscriptionAction = Action & {
  type: "ACTIVATE_SUBSCRIPTION";
  input: ActivateSubscriptionInput;
};
export type CancelSubscriptionAction = Action & {
  type: "CANCEL_SUBSCRIPTION";
  input: CancelSubscriptionInput;
};
export type RenewSubscriptionAction = Action & {
  type: "RENEW_SUBSCRIPTION";
  input: RenewSubscriptionInput;
};

export type ServiceSubscriptionSubscriptionManagementAction =
  | InitializeSubscriptionAction
  | UpdateSubscriptionStatusAction
  | ActivateSubscriptionAction
  | CancelSubscriptionAction
  | RenewSubscriptionAction;

import { type SignalDispatch } from "document-model";
import type {
  InitializeSubscriptionAction,
  UpdateSubscriptionStatusAction,
  ActivateSubscriptionAction,
  CancelSubscriptionAction,
  RenewSubscriptionAction,
} from "./actions.js";
import type { ServiceSubscriptionState } from "../types.js";

export interface ServiceSubscriptionSubscriptionManagementOperations {
  initializeSubscriptionOperation: (
    state: ServiceSubscriptionState,
    action: InitializeSubscriptionAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateSubscriptionStatusOperation: (
    state: ServiceSubscriptionState,
    action: UpdateSubscriptionStatusAction,
    dispatch?: SignalDispatch,
  ) => void;
  activateSubscriptionOperation: (
    state: ServiceSubscriptionState,
    action: ActivateSubscriptionAction,
    dispatch?: SignalDispatch,
  ) => void;
  cancelSubscriptionOperation: (
    state: ServiceSubscriptionState,
    action: CancelSubscriptionAction,
    dispatch?: SignalDispatch,
  ) => void;
  renewSubscriptionOperation: (
    state: ServiceSubscriptionState,
    action: RenewSubscriptionAction,
    dispatch?: SignalDispatch,
  ) => void;
}

import { type SignalDispatch } from "document-model";
import { type ChangeTierAction, type SetPricingAction } from "./actions.js";
import { type ServiceSubscriptionState } from "../types.js";

export interface ServiceSubscriptionTierSelectionOperations {
  changeTierOperation: (
    state: ServiceSubscriptionState,
    action: ChangeTierAction,
    dispatch?: SignalDispatch,
  ) => void;
  setPricingOperation: (
    state: ServiceSubscriptionState,
    action: SetPricingAction,
    dispatch?: SignalDispatch,
  ) => void;
}

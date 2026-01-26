import { type SignalDispatch } from "document-model";
import {
  type AddTierAction,
  type UpdateTierAction,
  type UpdateTierPricingAction,
  type DeleteTierAction,
  type AddTierPricingOptionAction,
  type UpdateTierPricingOptionAction,
  type RemoveTierPricingOptionAction,
  type AddServiceLevelAction,
  type UpdateServiceLevelAction,
  type RemoveServiceLevelAction,
  type AddUsageLimitAction,
  type UpdateUsageLimitAction,
  type RemoveUsageLimitAction,
} from "./actions.js";
import { type ServiceOfferingState } from "../types.js";

export interface ServiceOfferingTierManagementOperations {
  addTierOperation: (
    state: ServiceOfferingState,
    action: AddTierAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateTierOperation: (
    state: ServiceOfferingState,
    action: UpdateTierAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateTierPricingOperation: (
    state: ServiceOfferingState,
    action: UpdateTierPricingAction,
    dispatch?: SignalDispatch,
  ) => void;
  deleteTierOperation: (
    state: ServiceOfferingState,
    action: DeleteTierAction,
    dispatch?: SignalDispatch,
  ) => void;
  addTierPricingOptionOperation: (
    state: ServiceOfferingState,
    action: AddTierPricingOptionAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateTierPricingOptionOperation: (
    state: ServiceOfferingState,
    action: UpdateTierPricingOptionAction,
    dispatch?: SignalDispatch,
  ) => void;
  removeTierPricingOptionOperation: (
    state: ServiceOfferingState,
    action: RemoveTierPricingOptionAction,
    dispatch?: SignalDispatch,
  ) => void;
  addServiceLevelOperation: (
    state: ServiceOfferingState,
    action: AddServiceLevelAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateServiceLevelOperation: (
    state: ServiceOfferingState,
    action: UpdateServiceLevelAction,
    dispatch?: SignalDispatch,
  ) => void;
  removeServiceLevelOperation: (
    state: ServiceOfferingState,
    action: RemoveServiceLevelAction,
    dispatch?: SignalDispatch,
  ) => void;
  addUsageLimitOperation: (
    state: ServiceOfferingState,
    action: AddUsageLimitAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateUsageLimitOperation: (
    state: ServiceOfferingState,
    action: UpdateUsageLimitAction,
    dispatch?: SignalDispatch,
  ) => void;
  removeUsageLimitOperation: (
    state: ServiceOfferingState,
    action: RemoveUsageLimitAction,
    dispatch?: SignalDispatch,
  ) => void;
}

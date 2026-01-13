import { type SignalDispatch } from "document-model";
import {
  type UpdateOfferingInfoAction,
  type UpdateOfferingStatusAction,
  type SetOperatorAction,
  type SetOfferingIdAction,
} from "./actions.js";
import { type ServiceOfferingState } from "../types.js";

export interface ServiceOfferingOfferingManagementOperations {
  updateOfferingInfoOperation: (
    state: ServiceOfferingState,
    action: UpdateOfferingInfoAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateOfferingStatusOperation: (
    state: ServiceOfferingState,
    action: UpdateOfferingStatusAction,
    dispatch?: SignalDispatch,
  ) => void;
  setOperatorOperation: (
    state: ServiceOfferingState,
    action: SetOperatorAction,
    dispatch?: SignalDispatch,
  ) => void;
  setOfferingIdOperation: (
    state: ServiceOfferingState,
    action: SetOfferingIdAction,
    dispatch?: SignalDispatch,
  ) => void;
}

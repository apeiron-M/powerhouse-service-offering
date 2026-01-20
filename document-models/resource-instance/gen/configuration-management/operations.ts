import { type SignalDispatch } from "document-model";
import {
  type SetConfigurationAction,
  type RemoveConfigurationAction,
} from "./actions.js";
import { type ResourceInstanceState } from "../types.js";

export interface ResourceInstanceConfigurationManagementOperations {
  setConfigurationOperation: (
    state: ResourceInstanceState,
    action: SetConfigurationAction,
    dispatch?: SignalDispatch,
  ) => void;
  removeConfigurationOperation: (
    state: ResourceInstanceState,
    action: RemoveConfigurationAction,
    dispatch?: SignalDispatch,
  ) => void;
}

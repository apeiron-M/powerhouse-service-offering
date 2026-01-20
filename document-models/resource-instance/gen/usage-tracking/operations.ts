import { type SignalDispatch } from "document-model";
import { type RecordUsageAction, type ResetUsageAction } from "./actions.js";
import { type ResourceInstanceState } from "../types.js";

export interface ResourceInstanceUsageTrackingOperations {
  recordUsageOperation: (
    state: ResourceInstanceState,
    action: RecordUsageAction,
    dispatch?: SignalDispatch,
  ) => void;
  resetUsageOperation: (
    state: ResourceInstanceState,
    action: ResetUsageAction,
    dispatch?: SignalDispatch,
  ) => void;
}

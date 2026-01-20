import { type Action } from "document-model";
import type { RecordUsageInput, ResetUsageInput } from "../types.js";

export type RecordUsageAction = Action & {
  type: "RECORD_USAGE";
  input: RecordUsageInput;
};
export type ResetUsageAction = Action & {
  type: "RESET_USAGE";
  input: ResetUsageInput;
};

export type ResourceInstanceUsageTrackingAction =
  | RecordUsageAction
  | ResetUsageAction;

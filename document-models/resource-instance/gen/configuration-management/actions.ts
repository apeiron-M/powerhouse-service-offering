import type { Action } from "document-model";
import type {
  SetConfigurationInput,
  RemoveConfigurationInput,
} from "../types.js";

export type SetConfigurationAction = Action & {
  type: "SET_CONFIGURATION";
  input: SetConfigurationInput;
};
export type RemoveConfigurationAction = Action & {
  type: "REMOVE_CONFIGURATION";
  input: RemoveConfigurationInput;
};

export type ResourceInstanceConfigurationManagementAction =
  | SetConfigurationAction
  | RemoveConfigurationAction;

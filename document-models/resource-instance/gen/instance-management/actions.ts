import { type Action } from "document-model";
import type {
  InitializeInstanceInput,
  UpdateInstanceStatusInput,
  ActivateInstanceInput,
  SuspendInstanceInput,
  TerminateInstanceInput,
  UpdateInstanceNameInput,
} from "../types.js";

export type InitializeInstanceAction = Action & {
  type: "INITIALIZE_INSTANCE";
  input: InitializeInstanceInput;
};
export type UpdateInstanceStatusAction = Action & {
  type: "UPDATE_INSTANCE_STATUS";
  input: UpdateInstanceStatusInput;
};
export type ActivateInstanceAction = Action & {
  type: "ACTIVATE_INSTANCE";
  input: ActivateInstanceInput;
};
export type SuspendInstanceAction = Action & {
  type: "SUSPEND_INSTANCE";
  input: SuspendInstanceInput;
};
export type TerminateInstanceAction = Action & {
  type: "TERMINATE_INSTANCE";
  input: TerminateInstanceInput;
};
export type UpdateInstanceNameAction = Action & {
  type: "UPDATE_INSTANCE_NAME";
  input: UpdateInstanceNameInput;
};

export type ResourceInstanceInstanceManagementAction =
  | InitializeInstanceAction
  | UpdateInstanceStatusAction
  | ActivateInstanceAction
  | SuspendInstanceAction
  | TerminateInstanceAction
  | UpdateInstanceNameAction;

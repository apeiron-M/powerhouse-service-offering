import { type SignalDispatch } from "document-model";
import {
  type InitializeInstanceAction,
  type UpdateInstanceStatusAction,
  type ActivateInstanceAction,
  type SuspendInstanceAction,
  type TerminateInstanceAction,
  type UpdateInstanceNameAction,
} from "./actions.js";
import { type ResourceInstanceState } from "../types.js";

export interface ResourceInstanceInstanceManagementOperations {
  initializeInstanceOperation: (
    state: ResourceInstanceState,
    action: InitializeInstanceAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateInstanceStatusOperation: (
    state: ResourceInstanceState,
    action: UpdateInstanceStatusAction,
    dispatch?: SignalDispatch,
  ) => void;
  activateInstanceOperation: (
    state: ResourceInstanceState,
    action: ActivateInstanceAction,
    dispatch?: SignalDispatch,
  ) => void;
  suspendInstanceOperation: (
    state: ResourceInstanceState,
    action: SuspendInstanceAction,
    dispatch?: SignalDispatch,
  ) => void;
  terminateInstanceOperation: (
    state: ResourceInstanceState,
    action: TerminateInstanceAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateInstanceNameOperation: (
    state: ResourceInstanceState,
    action: UpdateInstanceNameAction,
    dispatch?: SignalDispatch,
  ) => void;
}

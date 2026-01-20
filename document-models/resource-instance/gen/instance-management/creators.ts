import { createAction } from "document-model/core";
import {
  InitializeInstanceInputSchema,
  UpdateInstanceStatusInputSchema,
  ActivateInstanceInputSchema,
  SuspendInstanceInputSchema,
  TerminateInstanceInputSchema,
  UpdateInstanceNameInputSchema,
} from "../schema/zod.js";
import type {
  InitializeInstanceInput,
  UpdateInstanceStatusInput,
  ActivateInstanceInput,
  SuspendInstanceInput,
  TerminateInstanceInput,
  UpdateInstanceNameInput,
} from "../types.js";
import type {
  InitializeInstanceAction,
  UpdateInstanceStatusAction,
  ActivateInstanceAction,
  SuspendInstanceAction,
  TerminateInstanceAction,
  UpdateInstanceNameAction,
} from "./actions.js";

export const initializeInstance = (input: InitializeInstanceInput) =>
  createAction<InitializeInstanceAction>(
    "INITIALIZE_INSTANCE",
    { ...input },
    undefined,
    InitializeInstanceInputSchema,
    "global",
  );

export const updateInstanceStatus = (input: UpdateInstanceStatusInput) =>
  createAction<UpdateInstanceStatusAction>(
    "UPDATE_INSTANCE_STATUS",
    { ...input },
    undefined,
    UpdateInstanceStatusInputSchema,
    "global",
  );

export const activateInstance = (input: ActivateInstanceInput) =>
  createAction<ActivateInstanceAction>(
    "ACTIVATE_INSTANCE",
    { ...input },
    undefined,
    ActivateInstanceInputSchema,
    "global",
  );

export const suspendInstance = (input: SuspendInstanceInput) =>
  createAction<SuspendInstanceAction>(
    "SUSPEND_INSTANCE",
    { ...input },
    undefined,
    SuspendInstanceInputSchema,
    "global",
  );

export const terminateInstance = (input: TerminateInstanceInput) =>
  createAction<TerminateInstanceAction>(
    "TERMINATE_INSTANCE",
    { ...input },
    undefined,
    TerminateInstanceInputSchema,
    "global",
  );

export const updateInstanceName = (input: UpdateInstanceNameInput) =>
  createAction<UpdateInstanceNameAction>(
    "UPDATE_INSTANCE_NAME",
    { ...input },
    undefined,
    UpdateInstanceNameInputSchema,
    "global",
  );

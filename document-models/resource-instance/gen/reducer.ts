// TODO: remove eslint-disable rules once refactor is done
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { StateReducer } from "document-model";
import { isDocumentAction, createReducer } from "document-model/core";
import type { ResourceInstancePHState } from "resourceServices/document-models/resource-instance";

import { resourceInstanceInstanceManagementOperations } from "../src/reducers/instance-management.js";
import { resourceInstanceConfigurationManagementOperations } from "../src/reducers/configuration-management.js";
import { resourceInstanceUsageTrackingOperations } from "../src/reducers/usage-tracking.js";

import {
  InitializeInstanceInputSchema,
  UpdateInstanceStatusInputSchema,
  ActivateInstanceInputSchema,
  SuspendInstanceInputSchema,
  TerminateInstanceInputSchema,
  UpdateInstanceNameInputSchema,
  SetConfigurationInputSchema,
  RemoveConfigurationInputSchema,
  RecordUsageInputSchema,
  ResetUsageInputSchema,
} from "./schema/zod.js";

const stateReducer: StateReducer<ResourceInstancePHState> = (
  state,
  action,
  dispatch,
) => {
  if (isDocumentAction(action)) {
    return state;
  }

  switch (action.type) {
    case "INITIALIZE_INSTANCE":
      InitializeInstanceInputSchema().parse(action.input);
      resourceInstanceInstanceManagementOperations.initializeInstanceOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "UPDATE_INSTANCE_STATUS":
      UpdateInstanceStatusInputSchema().parse(action.input);
      resourceInstanceInstanceManagementOperations.updateInstanceStatusOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ACTIVATE_INSTANCE":
      ActivateInstanceInputSchema().parse(action.input);
      resourceInstanceInstanceManagementOperations.activateInstanceOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SUSPEND_INSTANCE":
      SuspendInstanceInputSchema().parse(action.input);
      resourceInstanceInstanceManagementOperations.suspendInstanceOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "TERMINATE_INSTANCE":
      TerminateInstanceInputSchema().parse(action.input);
      resourceInstanceInstanceManagementOperations.terminateInstanceOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "UPDATE_INSTANCE_NAME":
      UpdateInstanceNameInputSchema().parse(action.input);
      resourceInstanceInstanceManagementOperations.updateInstanceNameOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_CONFIGURATION":
      SetConfigurationInputSchema().parse(action.input);
      resourceInstanceConfigurationManagementOperations.setConfigurationOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "REMOVE_CONFIGURATION":
      RemoveConfigurationInputSchema().parse(action.input);
      resourceInstanceConfigurationManagementOperations.removeConfigurationOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "RECORD_USAGE":
      RecordUsageInputSchema().parse(action.input);
      resourceInstanceUsageTrackingOperations.recordUsageOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "RESET_USAGE":
      ResetUsageInputSchema().parse(action.input);
      resourceInstanceUsageTrackingOperations.resetUsageOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    default:
      return state;
  }
};

export const reducer = createReducer<ResourceInstancePHState>(stateReducer);

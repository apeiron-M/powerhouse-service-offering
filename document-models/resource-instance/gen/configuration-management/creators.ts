import { createAction } from "document-model/core";
import {
  SetConfigurationInputSchema,
  RemoveConfigurationInputSchema,
} from "../schema/zod.js";
import type {
  SetConfigurationInput,
  RemoveConfigurationInput,
} from "../types.js";
import type {
  SetConfigurationAction,
  RemoveConfigurationAction,
} from "./actions.js";

export const setConfiguration = (input: SetConfigurationInput) =>
  createAction<SetConfigurationAction>(
    "SET_CONFIGURATION",
    { ...input },
    undefined,
    SetConfigurationInputSchema,
    "global",
  );

export const removeConfiguration = (input: RemoveConfigurationInput) =>
  createAction<RemoveConfigurationAction>(
    "REMOVE_CONFIGURATION",
    { ...input },
    undefined,
    RemoveConfigurationInputSchema,
    "global",
  );

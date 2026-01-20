import { createAction } from "document-model/core";
import {
  RecordUsageInputSchema,
  ResetUsageInputSchema,
} from "../schema/zod.js";
import type { RecordUsageInput, ResetUsageInput } from "../types.js";
import type { RecordUsageAction, ResetUsageAction } from "./actions.js";

export const recordUsage = (input: RecordUsageInput) =>
  createAction<RecordUsageAction>(
    "RECORD_USAGE",
    { ...input },
    undefined,
    RecordUsageInputSchema,
    "global",
  );

export const resetUsage = (input: ResetUsageInput) =>
  createAction<ResetUsageAction>(
    "RESET_USAGE",
    { ...input },
    undefined,
    ResetUsageInputSchema,
    "global",
  );

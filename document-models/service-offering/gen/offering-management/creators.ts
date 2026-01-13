import { createAction } from "document-model/core";
import {
  UpdateOfferingInfoInputSchema,
  UpdateOfferingStatusInputSchema,
  SetOperatorInputSchema,
  SetOfferingIdInputSchema,
} from "../schema/zod.js";
import type {
  UpdateOfferingInfoInput,
  UpdateOfferingStatusInput,
  SetOperatorInput,
  SetOfferingIdInput,
} from "../types.js";
import type {
  UpdateOfferingInfoAction,
  UpdateOfferingStatusAction,
  SetOperatorAction,
  SetOfferingIdAction,
} from "./actions.js";

export const updateOfferingInfo = (input: UpdateOfferingInfoInput) =>
  createAction<UpdateOfferingInfoAction>(
    "UPDATE_OFFERING_INFO",
    { ...input },
    undefined,
    UpdateOfferingInfoInputSchema,
    "global",
  );

export const updateOfferingStatus = (input: UpdateOfferingStatusInput) =>
  createAction<UpdateOfferingStatusAction>(
    "UPDATE_OFFERING_STATUS",
    { ...input },
    undefined,
    UpdateOfferingStatusInputSchema,
    "global",
  );

export const setOperator = (input: SetOperatorInput) =>
  createAction<SetOperatorAction>(
    "SET_OPERATOR",
    { ...input },
    undefined,
    SetOperatorInputSchema,
    "global",
  );

export const setOfferingId = (input: SetOfferingIdInput) =>
  createAction<SetOfferingIdAction>(
    "SET_OFFERING_ID",
    { ...input },
    undefined,
    SetOfferingIdInputSchema,
    "global",
  );

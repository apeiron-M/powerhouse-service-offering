import { createAction } from "document-model/core";
import {
  InitializeSubscriptionInputSchema,
  UpdateSubscriptionStatusInputSchema,
  ActivateSubscriptionInputSchema,
  CancelSubscriptionInputSchema,
  RenewSubscriptionInputSchema,
} from "../schema/zod.js";
import type {
  InitializeSubscriptionInput,
  UpdateSubscriptionStatusInput,
  ActivateSubscriptionInput,
  CancelSubscriptionInput,
  RenewSubscriptionInput,
} from "../types.js";
import type {
  InitializeSubscriptionAction,
  UpdateSubscriptionStatusAction,
  ActivateSubscriptionAction,
  CancelSubscriptionAction,
  RenewSubscriptionAction,
} from "./actions.js";

export const initializeSubscription = (input: InitializeSubscriptionInput) =>
  createAction<InitializeSubscriptionAction>(
    "INITIALIZE_SUBSCRIPTION",
    { ...input },
    undefined,
    InitializeSubscriptionInputSchema,
    "global",
  );

export const updateSubscriptionStatus = (
  input: UpdateSubscriptionStatusInput,
) =>
  createAction<UpdateSubscriptionStatusAction>(
    "UPDATE_SUBSCRIPTION_STATUS",
    { ...input },
    undefined,
    UpdateSubscriptionStatusInputSchema,
    "global",
  );

export const activateSubscription = (input: ActivateSubscriptionInput) =>
  createAction<ActivateSubscriptionAction>(
    "ACTIVATE_SUBSCRIPTION",
    { ...input },
    undefined,
    ActivateSubscriptionInputSchema,
    "global",
  );

export const cancelSubscription = (input: CancelSubscriptionInput) =>
  createAction<CancelSubscriptionAction>(
    "CANCEL_SUBSCRIPTION",
    { ...input },
    undefined,
    CancelSubscriptionInputSchema,
    "global",
  );

export const renewSubscription = (input: RenewSubscriptionInput) =>
  createAction<RenewSubscriptionAction>(
    "RENEW_SUBSCRIPTION",
    { ...input },
    undefined,
    RenewSubscriptionInputSchema,
    "global",
  );

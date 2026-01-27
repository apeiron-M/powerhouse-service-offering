import { createAction } from "document-model/core";
import {
  AddFaqItemInputSchema,
  UpdateFaqItemInputSchema,
  DeleteFaqItemInputSchema,
  ReorderFaqItemsInputSchema,
} from "../schema/zod.js";
import type {
  AddFaqItemInput,
  UpdateFaqItemInput,
  DeleteFaqItemInput,
  ReorderFaqItemsInput,
} from "../types.js";
import type {
  AddFaqItemAction,
  UpdateFaqItemAction,
  DeleteFaqItemAction,
  ReorderFaqItemsAction,
} from "./actions.js";

export const addFaqItem = (input: AddFaqItemInput) =>
  createAction<AddFaqItemAction>(
    "ADD_FAQ_ITEM",
    { ...input },
    undefined,
    AddFaqItemInputSchema,
    "global",
  );

export const updateFaqItem = (input: UpdateFaqItemInput) =>
  createAction<UpdateFaqItemAction>(
    "UPDATE_FAQ_ITEM",
    { ...input },
    undefined,
    UpdateFaqItemInputSchema,
    "global",
  );

export const deleteFaqItem = (input: DeleteFaqItemInput) =>
  createAction<DeleteFaqItemAction>(
    "DELETE_FAQ_ITEM",
    { ...input },
    undefined,
    DeleteFaqItemInputSchema,
    "global",
  );

export const reorderFaqItems = (input: ReorderFaqItemsInput) =>
  createAction<ReorderFaqItemsAction>(
    "REORDER_FAQ_ITEMS",
    { ...input },
    undefined,
    ReorderFaqItemsInputSchema,
    "global",
  );

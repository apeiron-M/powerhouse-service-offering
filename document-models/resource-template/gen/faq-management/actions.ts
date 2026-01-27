import { type Action } from "document-model";
import type {
  AddFaqItemInput,
  UpdateFaqItemInput,
  DeleteFaqItemInput,
  ReorderFaqItemsInput,
} from "../types.js";

export type AddFaqItemAction = Action & {
  type: "ADD_FAQ_ITEM";
  input: AddFaqItemInput;
};
export type UpdateFaqItemAction = Action & {
  type: "UPDATE_FAQ_ITEM";
  input: UpdateFaqItemInput;
};
export type DeleteFaqItemAction = Action & {
  type: "DELETE_FAQ_ITEM";
  input: DeleteFaqItemInput;
};
export type ReorderFaqItemsAction = Action & {
  type: "REORDER_FAQ_ITEMS";
  input: ReorderFaqItemsInput;
};

export type ResourceTemplateFaqManagementAction =
  | AddFaqItemAction
  | UpdateFaqItemAction
  | DeleteFaqItemAction
  | ReorderFaqItemsAction;

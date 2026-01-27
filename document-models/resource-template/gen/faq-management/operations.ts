import { type SignalDispatch } from "document-model";
import {
  type AddFaqItemAction,
  type UpdateFaqItemAction,
  type DeleteFaqItemAction,
  type ReorderFaqItemsAction,
} from "./actions.js";
import { type ResourceTemplateState } from "../types.js";

export interface ResourceTemplateFaqManagementOperations {
  addFaqItemOperation: (
    state: ResourceTemplateState,
    action: AddFaqItemAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateFaqItemOperation: (
    state: ResourceTemplateState,
    action: UpdateFaqItemAction,
    dispatch?: SignalDispatch,
  ) => void;
  deleteFaqItemOperation: (
    state: ResourceTemplateState,
    action: DeleteFaqItemAction,
    dispatch?: SignalDispatch,
  ) => void;
  reorderFaqItemsOperation: (
    state: ResourceTemplateState,
    action: ReorderFaqItemsAction,
    dispatch?: SignalDispatch,
  ) => void;
}

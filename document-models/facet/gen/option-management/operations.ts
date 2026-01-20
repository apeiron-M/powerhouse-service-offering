import { type SignalDispatch } from "document-model";
import {
  type AddOptionAction,
  type UpdateOptionAction,
  type RemoveOptionAction,
  type ReorderOptionsAction,
} from "./actions.js";
import { type FacetState } from "../types.js";

export interface FacetOptionManagementOperations {
  addOptionOperation: (
    state: FacetState,
    action: AddOptionAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateOptionOperation: (
    state: FacetState,
    action: UpdateOptionAction,
    dispatch?: SignalDispatch,
  ) => void;
  removeOptionOperation: (
    state: FacetState,
    action: RemoveOptionAction,
    dispatch?: SignalDispatch,
  ) => void;
  reorderOptionsOperation: (
    state: FacetState,
    action: ReorderOptionsAction,
    dispatch?: SignalDispatch,
  ) => void;
}

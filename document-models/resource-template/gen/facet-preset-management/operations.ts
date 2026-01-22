import { type SignalDispatch } from "document-model";
import {
  type SetFacetPresetAction,
  type RemoveFacetPresetAction,
  type AddPresetOptionAction,
  type RemovePresetOptionAction,
} from "./actions.js";
import { type ResourceTemplateState } from "../types.js";

export interface ResourceTemplateFacetPresetManagementOperations {
  setFacetPresetOperation: (
    state: ResourceTemplateState,
    action: SetFacetPresetAction,
    dispatch?: SignalDispatch,
  ) => void;
  removeFacetPresetOperation: (
    state: ResourceTemplateState,
    action: RemoveFacetPresetAction,
    dispatch?: SignalDispatch,
  ) => void;
  addPresetOptionOperation: (
    state: ResourceTemplateState,
    action: AddPresetOptionAction,
    dispatch?: SignalDispatch,
  ) => void;
  removePresetOptionOperation: (
    state: ResourceTemplateState,
    action: RemovePresetOptionAction,
    dispatch?: SignalDispatch,
  ) => void;
}

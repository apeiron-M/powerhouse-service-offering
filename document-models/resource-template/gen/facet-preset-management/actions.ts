import { type Action } from "document-model";
import type {
  SetFacetPresetInput,
  RemoveFacetPresetInput,
  AddPresetOptionInput,
  RemovePresetOptionInput,
} from "../types.js";

export type SetFacetPresetAction = Action & {
  type: "SET_FACET_PRESET";
  input: SetFacetPresetInput;
};
export type RemoveFacetPresetAction = Action & {
  type: "REMOVE_FACET_PRESET";
  input: RemoveFacetPresetInput;
};
export type AddPresetOptionAction = Action & {
  type: "ADD_PRESET_OPTION";
  input: AddPresetOptionInput;
};
export type RemovePresetOptionAction = Action & {
  type: "REMOVE_PRESET_OPTION";
  input: RemovePresetOptionInput;
};

export type ResourceTemplateFacetPresetManagementAction =
  | SetFacetPresetAction
  | RemoveFacetPresetAction
  | AddPresetOptionAction
  | RemovePresetOptionAction;

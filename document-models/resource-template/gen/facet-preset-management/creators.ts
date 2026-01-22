import { createAction } from "document-model/core";
import {
  SetFacetPresetInputSchema,
  RemoveFacetPresetInputSchema,
  AddPresetOptionInputSchema,
  RemovePresetOptionInputSchema,
} from "../schema/zod.js";
import type {
  SetFacetPresetInput,
  RemoveFacetPresetInput,
  AddPresetOptionInput,
  RemovePresetOptionInput,
} from "../types.js";
import type {
  SetFacetPresetAction,
  RemoveFacetPresetAction,
  AddPresetOptionAction,
  RemovePresetOptionAction,
} from "./actions.js";

export const setFacetPreset = (input: SetFacetPresetInput) =>
  createAction<SetFacetPresetAction>(
    "SET_FACET_PRESET",
    { ...input },
    undefined,
    SetFacetPresetInputSchema,
    "global",
  );

export const removeFacetPreset = (input: RemoveFacetPresetInput) =>
  createAction<RemoveFacetPresetAction>(
    "REMOVE_FACET_PRESET",
    { ...input },
    undefined,
    RemoveFacetPresetInputSchema,
    "global",
  );

export const addPresetOption = (input: AddPresetOptionInput) =>
  createAction<AddPresetOptionAction>(
    "ADD_PRESET_OPTION",
    { ...input },
    undefined,
    AddPresetOptionInputSchema,
    "global",
  );

export const removePresetOption = (input: RemovePresetOptionInput) =>
  createAction<RemovePresetOptionAction>(
    "REMOVE_PRESET_OPTION",
    { ...input },
    undefined,
    RemovePresetOptionInputSchema,
    "global",
  );

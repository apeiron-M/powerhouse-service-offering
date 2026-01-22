// TODO: remove eslint-disable rules once refactor is done
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { StateReducer } from "document-model";
import { isDocumentAction, createReducer } from "document-model/core";
import type { ServiceSubscriptionPHState } from "@powerhousedao/contributor-billing/document-models/service-subscription";

import { serviceSubscriptionSubscriptionManagementOperations } from "../src/reducers/subscription-management.js";
import { serviceSubscriptionTierSelectionOperations } from "../src/reducers/tier-selection.js";
import { serviceSubscriptionAddOnManagementOperations } from "../src/reducers/add-on-management.js";
import { serviceSubscriptionFacetSelectionOperations } from "../src/reducers/facet-selection.js";

import {
  InitializeSubscriptionInputSchema,
  UpdateSubscriptionStatusInputSchema,
  ActivateSubscriptionInputSchema,
  CancelSubscriptionInputSchema,
  RenewSubscriptionInputSchema,
  ChangeTierInputSchema,
  SetPricingInputSchema,
  AddAddonInputSchema,
  RemoveAddonInputSchema,
  SetFacetSelectionInputSchema,
  RemoveFacetSelectionInputSchema,
} from "./schema/zod.js";

const stateReducer: StateReducer<ServiceSubscriptionPHState> = (
  state,
  action,
  dispatch,
) => {
  if (isDocumentAction(action)) {
    return state;
  }

  switch (action.type) {
    case "INITIALIZE_SUBSCRIPTION":
      InitializeSubscriptionInputSchema().parse(action.input);
      serviceSubscriptionSubscriptionManagementOperations.initializeSubscriptionOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "UPDATE_SUBSCRIPTION_STATUS":
      UpdateSubscriptionStatusInputSchema().parse(action.input);
      serviceSubscriptionSubscriptionManagementOperations.updateSubscriptionStatusOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ACTIVATE_SUBSCRIPTION":
      ActivateSubscriptionInputSchema().parse(action.input);
      serviceSubscriptionSubscriptionManagementOperations.activateSubscriptionOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "CANCEL_SUBSCRIPTION":
      CancelSubscriptionInputSchema().parse(action.input);
      serviceSubscriptionSubscriptionManagementOperations.cancelSubscriptionOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "RENEW_SUBSCRIPTION":
      RenewSubscriptionInputSchema().parse(action.input);
      serviceSubscriptionSubscriptionManagementOperations.renewSubscriptionOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "CHANGE_TIER":
      ChangeTierInputSchema().parse(action.input);
      serviceSubscriptionTierSelectionOperations.changeTierOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_PRICING":
      SetPricingInputSchema().parse(action.input);
      serviceSubscriptionTierSelectionOperations.setPricingOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ADD_ADDON":
      AddAddonInputSchema().parse(action.input);
      serviceSubscriptionAddOnManagementOperations.addAddonOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "REMOVE_ADDON":
      RemoveAddonInputSchema().parse(action.input);
      serviceSubscriptionAddOnManagementOperations.removeAddonOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "SET_FACET_SELECTION":
      SetFacetSelectionInputSchema().parse(action.input);
      serviceSubscriptionFacetSelectionOperations.setFacetSelectionOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "REMOVE_FACET_SELECTION":
      RemoveFacetSelectionInputSchema().parse(action.input);
      serviceSubscriptionFacetSelectionOperations.removeFacetSelectionOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    default:
      return state;
  }
};

export const reducer = createReducer<ServiceSubscriptionPHState>(stateReducer);

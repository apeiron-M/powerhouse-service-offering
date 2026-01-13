import { type Action } from "document-model";
import type {
  UpdateOfferingInfoInput,
  UpdateOfferingStatusInput,
  SetOperatorInput,
  SetOfferingIdInput,
} from "../types.js";

export type UpdateOfferingInfoAction = Action & {
  type: "UPDATE_OFFERING_INFO";
  input: UpdateOfferingInfoInput;
};
export type UpdateOfferingStatusAction = Action & {
  type: "UPDATE_OFFERING_STATUS";
  input: UpdateOfferingStatusInput;
};
export type SetOperatorAction = Action & {
  type: "SET_OPERATOR";
  input: SetOperatorInput;
};
export type SetOfferingIdAction = Action & {
  type: "SET_OFFERING_ID";
  input: SetOfferingIdInput;
};

export type ServiceOfferingOfferingManagementAction =
  | UpdateOfferingInfoAction
  | UpdateOfferingStatusAction
  | SetOperatorAction
  | SetOfferingIdAction;

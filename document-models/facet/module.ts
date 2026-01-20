import type { DocumentModelModule } from "document-model";
import { createState } from "document-model";
import { defaultBaseState } from "document-model/core";
import type { FacetPHState } from "resourceServices/document-models/facet";
import {
  actions,
  documentModel,
  reducer,
  utils,
} from "resourceServices/document-models/facet";

/** Document model module for the Todo List document type */
export const Facet: DocumentModelModule<FacetPHState> = {
  reducer,
  actions,
  utils,
  documentModel: createState(defaultBaseState(), documentModel),
};

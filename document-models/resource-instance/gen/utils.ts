import type { DocumentModelUtils } from "document-model";
import {
  baseCreateDocument,
  baseSaveToFileHandle,
  baseLoadFromInput,
  defaultBaseState,
  generateId,
} from "document-model/core";
import type {
  ResourceInstanceGlobalState,
  ResourceInstanceLocalState,
} from "./types.js";
import type { ResourceInstancePHState } from "./types.js";
import { reducer } from "./reducer.js";
import { resourceInstanceDocumentType } from "./document-type.js";
import {
  isResourceInstanceDocument,
  assertIsResourceInstanceDocument,
  isResourceInstanceState,
  assertIsResourceInstanceState,
} from "./document-schema.js";

export const initialGlobalState: ResourceInstanceGlobalState = {
  id: "",
  subscriptionId: "",
  resourceTemplateId: "",
  customerId: "",
  name: "",
  status: "PROVISIONING",
  configuration: [],
  usageMetrics: [],
  activatedAt: null,
  suspendedAt: null,
  suspensionReason: null,
  terminatedAt: null,
  terminationReason: null,
  createdAt: "1970-01-01T00:00:00.000Z",
  lastModified: "1970-01-01T00:00:00.000Z",
};
export const initialLocalState: ResourceInstanceLocalState = {};

export const utils: DocumentModelUtils<ResourceInstancePHState> = {
  fileExtension: "",
  createState(state) {
    return {
      ...defaultBaseState(),
      global: { ...initialGlobalState, ...state?.global },
      local: { ...initialLocalState, ...state?.local },
    };
  },
  createDocument(state) {
    const document = baseCreateDocument(utils.createState, state);

    document.header.documentType = resourceInstanceDocumentType;

    // for backwards compatibility, but this is NOT a valid signed document id
    document.header.id = generateId();

    return document;
  },
  saveToFileHandle(document, input) {
    return baseSaveToFileHandle(document, input);
  },
  loadFromInput(input) {
    return baseLoadFromInput(input, reducer);
  },
  isStateOfType(state) {
    return isResourceInstanceState(state);
  },
  assertIsStateOfType(state) {
    return assertIsResourceInstanceState(state);
  },
  isDocumentOfType(document) {
    return isResourceInstanceDocument(document);
  },
  assertIsDocumentOfType(document) {
    return assertIsResourceInstanceDocument(document);
  },
};

export const createDocument = utils.createDocument;
export const createState = utils.createState;
export const saveToFileHandle = utils.saveToFileHandle;
export const loadFromInput = utils.loadFromInput;
export const isStateOfType = utils.isStateOfType;
export const assertIsStateOfType = utils.assertIsStateOfType;
export const isDocumentOfType = utils.isDocumentOfType;
export const assertIsDocumentOfType = utils.assertIsDocumentOfType;

/**
 * Factory methods for creating ResourceInstanceDocument instances
 */
import type { PHAuthState, PHDocumentState, PHBaseState } from "document-model";
import { createBaseState, defaultBaseState } from "document-model/core";
import type {
  ResourceInstanceDocument,
  ResourceInstanceLocalState,
  ResourceInstanceGlobalState,
  ResourceInstancePHState,
} from "./types.js";
import { createDocument } from "./utils.js";

export function defaultGlobalState(): ResourceInstanceGlobalState {
  return {
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
}

export function defaultLocalState(): ResourceInstanceLocalState {
  return {};
}

export function defaultPHState(): ResourceInstancePHState {
  return {
    ...defaultBaseState(),
    global: defaultGlobalState(),
    local: defaultLocalState(),
  };
}

export function createGlobalState(
  state?: Partial<ResourceInstanceGlobalState>,
): ResourceInstanceGlobalState {
  return {
    ...defaultGlobalState(),
    ...(state || {}),
  } as ResourceInstanceGlobalState;
}

export function createLocalState(
  state?: Partial<ResourceInstanceLocalState>,
): ResourceInstanceLocalState {
  return {
    ...defaultLocalState(),
    ...(state || {}),
  } as ResourceInstanceLocalState;
}

export function createState(
  baseState?: Partial<PHBaseState>,
  globalState?: Partial<ResourceInstanceGlobalState>,
  localState?: Partial<ResourceInstanceLocalState>,
): ResourceInstancePHState {
  return {
    ...createBaseState(baseState?.auth, baseState?.document),
    global: createGlobalState(globalState),
    local: createLocalState(localState),
  };
}

/**
 * Creates a ResourceInstanceDocument with custom global and local state
 * This properly handles the PHBaseState requirements while allowing
 * document-specific state to be set.
 */
export function createResourceInstanceDocument(
  state?: Partial<{
    auth?: Partial<PHAuthState>;
    document?: Partial<PHDocumentState>;
    global?: Partial<ResourceInstanceGlobalState>;
    local?: Partial<ResourceInstanceLocalState>;
  }>,
): ResourceInstanceDocument {
  const document = createDocument(
    state
      ? createState(
          createBaseState(state.auth, state.document),
          state.global,
          state.local,
        )
      : undefined,
  );

  return document;
}

import type { BaseSubgraph } from "@powerhousedao/reactor-api";
import { addFile } from "document-drive";
import { setName } from "document-model";
import {
  actions,
  resourceInstanceDocumentType,
} from "resourceServices/document-models/resource-instance";

import type {
  ResourceInstanceDocument,
  InitializeInstanceInput,
  UpdateInstanceStatusInput,
  ActivateInstanceInput,
  SuspendInstanceInput,
  TerminateInstanceInput,
  UpdateInstanceNameInput,
  SetConfigurationInput,
  RemoveConfigurationInput,
  RecordUsageInput,
  ResetUsageInput,
} from "resourceServices/document-models/resource-instance";

export const getResolvers = (
  subgraph: BaseSubgraph,
): Record<string, unknown> => {
  const reactor = subgraph.reactor;

  return {
    Query: {
      ResourceInstance: async () => {
        return {
          getDocument: async (args: { docId: string; driveId: string }) => {
            const { docId, driveId } = args;

            if (!docId) {
              throw new Error("Document id is required");
            }

            if (driveId) {
              const docIds = await reactor.getDocuments(driveId);
              if (!docIds.includes(docId)) {
                throw new Error(
                  `Document with id ${docId} is not part of ${driveId}`,
                );
              }
            }

            const doc =
              await reactor.getDocument<ResourceInstanceDocument>(docId);
            return {
              driveId: driveId,
              ...doc,
              ...doc.header,
              created: doc.header.createdAtUtcIso,
              lastModified: doc.header.lastModifiedAtUtcIso,
              state: doc.state.global,
              stateJSON: doc.state.global,
              revision: doc.header?.revision?.global ?? 0,
            };
          },
          getDocuments: async (args: { driveId: string }) => {
            const { driveId } = args;
            const docsIds = await reactor.getDocuments(driveId);
            const docs = await Promise.all(
              docsIds.map(async (docId) => {
                const doc =
                  await reactor.getDocument<ResourceInstanceDocument>(docId);
                return {
                  driveId: driveId,
                  ...doc,
                  ...doc.header,
                  created: doc.header.createdAtUtcIso,
                  lastModified: doc.header.lastModifiedAtUtcIso,
                  state: doc.state.global,
                  stateJSON: doc.state.global,
                  revision: doc.header?.revision?.global ?? 0,
                };
              }),
            );

            return docs.filter(
              (doc) => doc.header.documentType === resourceInstanceDocumentType,
            );
          },
        };
      },
    },
    Mutation: {
      ResourceInstance_createDocument: async (
        _: unknown,
        args: { name: string; driveId?: string },
      ) => {
        const { driveId, name } = args;
        const document = await reactor.addDocument(
          resourceInstanceDocumentType,
        );

        if (driveId) {
          await reactor.addAction(
            driveId,
            addFile({
              name,
              id: document.header.id,
              documentType: resourceInstanceDocumentType,
            }),
          );
        }

        if (name) {
          await reactor.addAction(document.header.id, setName(name));
        }

        return document.header.id;
      },

      ResourceInstance_initializeInstance: async (
        _: unknown,
        args: { docId: string; input: InitializeInstanceInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ResourceInstanceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.initializeInstance(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to initializeInstance",
          );
        }

        return true;
      },

      ResourceInstance_updateInstanceStatus: async (
        _: unknown,
        args: { docId: string; input: UpdateInstanceStatusInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ResourceInstanceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateInstanceStatus(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to updateInstanceStatus",
          );
        }

        return true;
      },

      ResourceInstance_activateInstance: async (
        _: unknown,
        args: { docId: string; input: ActivateInstanceInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ResourceInstanceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.activateInstance(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to activateInstance",
          );
        }

        return true;
      },

      ResourceInstance_suspendInstance: async (
        _: unknown,
        args: { docId: string; input: SuspendInstanceInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ResourceInstanceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.suspendInstance(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to suspendInstance");
        }

        return true;
      },

      ResourceInstance_terminateInstance: async (
        _: unknown,
        args: { docId: string; input: TerminateInstanceInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ResourceInstanceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.terminateInstance(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to terminateInstance",
          );
        }

        return true;
      },

      ResourceInstance_updateInstanceName: async (
        _: unknown,
        args: { docId: string; input: UpdateInstanceNameInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ResourceInstanceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateInstanceName(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to updateInstanceName",
          );
        }

        return true;
      },

      ResourceInstance_setConfiguration: async (
        _: unknown,
        args: { docId: string; input: SetConfigurationInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ResourceInstanceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setConfiguration(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to setConfiguration",
          );
        }

        return true;
      },

      ResourceInstance_removeConfiguration: async (
        _: unknown,
        args: { docId: string; input: RemoveConfigurationInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ResourceInstanceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removeConfiguration(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to removeConfiguration",
          );
        }

        return true;
      },

      ResourceInstance_recordUsage: async (
        _: unknown,
        args: { docId: string; input: RecordUsageInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ResourceInstanceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.recordUsage(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to recordUsage");
        }

        return true;
      },

      ResourceInstance_resetUsage: async (
        _: unknown,
        args: { docId: string; input: ResetUsageInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ResourceInstanceDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.resetUsage(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to resetUsage");
        }

        return true;
      },
    },
  };
};

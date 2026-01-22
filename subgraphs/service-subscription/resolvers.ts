import type { BaseSubgraph } from "@powerhousedao/reactor-api";
import { addFile } from "document-drive";
import { setName } from "document-model";
import {
  actions,
  serviceSubscriptionDocumentType,
} from "@powerhousedao/contributor-billing/document-models/service-subscription";

import type {
  ServiceSubscriptionDocument,
  InitializeSubscriptionInput,
  UpdateSubscriptionStatusInput,
  ActivateSubscriptionInput,
  CancelSubscriptionInput,
  RenewSubscriptionInput,
  ChangeTierInput,
  SetPricingInput,
  AddAddonInput,
  RemoveAddonInput,
  SetFacetSelectionInput,
  RemoveFacetSelectionInput,
} from "@powerhousedao/contributor-billing/document-models/service-subscription";

export const getResolvers = (
  subgraph: BaseSubgraph,
): Record<string, unknown> => {
  const reactor = subgraph.reactor;

  return {
    Query: {
      ServiceSubscription: async () => {
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
              await reactor.getDocument<ServiceSubscriptionDocument>(docId);
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
                  await reactor.getDocument<ServiceSubscriptionDocument>(docId);
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
              (doc) =>
                doc.header.documentType === serviceSubscriptionDocumentType,
            );
          },
        };
      },
    },
    Mutation: {
      ServiceSubscription_createDocument: async (
        _: unknown,
        args: { name: string; driveId?: string },
      ) => {
        const { driveId, name } = args;
        const document = await reactor.addDocument(
          serviceSubscriptionDocumentType,
        );

        if (driveId) {
          await reactor.addAction(
            driveId,
            addFile({
              name,
              id: document.header.id,
              documentType: serviceSubscriptionDocumentType,
            }),
          );
        }

        if (name) {
          await reactor.addAction(document.header.id, setName(name));
        }

        return document.header.id;
      },

      ServiceSubscription_initializeSubscription: async (
        _: unknown,
        args: { docId: string; input: InitializeSubscriptionInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<ServiceSubscriptionDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.initializeSubscription(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to initializeSubscription",
          );
        }

        return true;
      },

      ServiceSubscription_updateSubscriptionStatus: async (
        _: unknown,
        args: { docId: string; input: UpdateSubscriptionStatusInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<ServiceSubscriptionDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateSubscriptionStatus(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to updateSubscriptionStatus",
          );
        }

        return true;
      },

      ServiceSubscription_activateSubscription: async (
        _: unknown,
        args: { docId: string; input: ActivateSubscriptionInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<ServiceSubscriptionDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.activateSubscription(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to activateSubscription",
          );
        }

        return true;
      },

      ServiceSubscription_cancelSubscription: async (
        _: unknown,
        args: { docId: string; input: CancelSubscriptionInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<ServiceSubscriptionDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.cancelSubscription(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to cancelSubscription",
          );
        }

        return true;
      },

      ServiceSubscription_renewSubscription: async (
        _: unknown,
        args: { docId: string; input: RenewSubscriptionInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<ServiceSubscriptionDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.renewSubscription(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to renewSubscription",
          );
        }

        return true;
      },

      ServiceSubscription_changeTier: async (
        _: unknown,
        args: { docId: string; input: ChangeTierInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<ServiceSubscriptionDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.changeTier(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to changeTier");
        }

        return true;
      },

      ServiceSubscription_setPricing: async (
        _: unknown,
        args: { docId: string; input: SetPricingInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<ServiceSubscriptionDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setPricing(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setPricing");
        }

        return true;
      },

      ServiceSubscription_addAddon: async (
        _: unknown,
        args: { docId: string; input: AddAddonInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<ServiceSubscriptionDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(docId, actions.addAddon(input));

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addAddon");
        }

        return true;
      },

      ServiceSubscription_removeAddon: async (
        _: unknown,
        args: { docId: string; input: RemoveAddonInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<ServiceSubscriptionDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removeAddon(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to removeAddon");
        }

        return true;
      },

      ServiceSubscription_setFacetSelection: async (
        _: unknown,
        args: { docId: string; input: SetFacetSelectionInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<ServiceSubscriptionDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setFacetSelection(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to setFacetSelection",
          );
        }

        return true;
      },

      ServiceSubscription_removeFacetSelection: async (
        _: unknown,
        args: { docId: string; input: RemoveFacetSelectionInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<ServiceSubscriptionDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removeFacetSelection(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to removeFacetSelection",
          );
        }

        return true;
      },
    },
  };
};

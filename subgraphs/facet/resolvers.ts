import type { BaseSubgraph } from "@powerhousedao/reactor-api";
import { addFile } from "document-drive";
import { setName } from "document-model";
import {
  actions,
  facetDocumentType,
} from "@powerhousedao/contributor-billing/document-models/facet";

import type {
  FacetDocument,
  SetFacetNameInput,
  SetFacetDescriptionInput,
  AddOptionInput,
  UpdateOptionInput,
  RemoveOptionInput,
  ReorderOptionsInput,
} from "@powerhousedao/contributor-billing/document-models/facet";

export const getResolvers = (
  subgraph: BaseSubgraph,
): Record<string, unknown> => {
  const reactor = subgraph.reactor;

  return {
    Query: {
      Facet: async () => {
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

            const doc = await reactor.getDocument<FacetDocument>(docId);
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
                const doc = await reactor.getDocument<FacetDocument>(docId);
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
              (doc) => doc.header.documentType === facetDocumentType,
            );
          },
        };
      },
    },
    Mutation: {
      Facet_createDocument: async (
        _: unknown,
        args: { name: string; driveId?: string },
      ) => {
        const { driveId, name } = args;
        const document = await reactor.addDocument(facetDocumentType);

        if (driveId) {
          await reactor.addAction(
            driveId,
            addFile({
              name,
              id: document.header.id,
              documentType: facetDocumentType,
            }),
          );
        }

        if (name) {
          await reactor.addAction(document.header.id, setName(name));
        }

        return document.header.id;
      },

      Facet_setFacetName: async (
        _: unknown,
        args: { docId: string; input: SetFacetNameInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<FacetDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setFacetName(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setFacetName");
        }

        return true;
      },

      Facet_setFacetDescription: async (
        _: unknown,
        args: { docId: string; input: SetFacetDescriptionInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<FacetDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setFacetDescription(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to setFacetDescription",
          );
        }

        return true;
      },

      Facet_addOption: async (
        _: unknown,
        args: { docId: string; input: AddOptionInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<FacetDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(docId, actions.addOption(input));

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addOption");
        }

        return true;
      },

      Facet_updateOption: async (
        _: unknown,
        args: { docId: string; input: UpdateOptionInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<FacetDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateOption(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to updateOption");
        }

        return true;
      },

      Facet_removeOption: async (
        _: unknown,
        args: { docId: string; input: RemoveOptionInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<FacetDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removeOption(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to removeOption");
        }

        return true;
      },

      Facet_reorderOptions: async (
        _: unknown,
        args: { docId: string; input: ReorderOptionsInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<FacetDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.reorderOptions(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to reorderOptions");
        }

        return true;
      },
    },
  };
};

import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import {
  useDocumentsInSelectedDrive,
  useDocumentsInSelectedFolder,
  useDocumentById,
  useSelectedDocument,
} from "@powerhousedao/reactor-browser";
import type {
  FacetDocument,
  FacetAction,
} from "@powerhousedao/contributor-billing/document-models/facet";
import { isFacetDocument } from "./gen/document-schema.js";

/** Hook to get a Facet document by its id */
export function useFacetDocumentById(
  documentId: string | null | undefined,
): [FacetDocument, DocumentDispatch<FacetAction>] | [undefined, undefined] {
  const [document, dispatch] = useDocumentById(documentId);
  if (!isFacetDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get the selected Facet document */
export function useSelectedFacetDocument():
  | [FacetDocument, DocumentDispatch<FacetAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useSelectedDocument();
  if (!isFacetDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get all Facet documents in the selected drive */
export function useFacetDocumentsInSelectedDrive() {
  const documentsInSelectedDrive = useDocumentsInSelectedDrive();
  return documentsInSelectedDrive?.filter(isFacetDocument);
}

/** Hook to get all Facet documents in the selected folder */
export function useFacetDocumentsInSelectedFolder() {
  const documentsInSelectedFolder = useDocumentsInSelectedFolder();
  return documentsInSelectedFolder?.filter(isFacetDocument);
}

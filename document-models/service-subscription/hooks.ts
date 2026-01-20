import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import {
  useDocumentsInSelectedDrive,
  useDocumentsInSelectedFolder,
  useDocumentById,
  useSelectedDocument,
} from "@powerhousedao/reactor-browser";
import type {
  ServiceSubscriptionDocument,
  ServiceSubscriptionAction,
} from "resourceServices/document-models/service-subscription";
import { isServiceSubscriptionDocument } from "./gen/document-schema.js";

/** Hook to get a ServiceSubscription document by its id */
export function useServiceSubscriptionDocumentById(
  documentId: string | null | undefined,
):
  | [ServiceSubscriptionDocument, DocumentDispatch<ServiceSubscriptionAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useDocumentById(documentId);
  if (!isServiceSubscriptionDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get the selected ServiceSubscription document */
export function useSelectedServiceSubscriptionDocument():
  | [ServiceSubscriptionDocument, DocumentDispatch<ServiceSubscriptionAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useSelectedDocument();
  if (!isServiceSubscriptionDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get all ServiceSubscription documents in the selected drive */
export function useServiceSubscriptionDocumentsInSelectedDrive() {
  const documentsInSelectedDrive = useDocumentsInSelectedDrive();
  return documentsInSelectedDrive?.filter(isServiceSubscriptionDocument);
}

/** Hook to get all ServiceSubscription documents in the selected folder */
export function useServiceSubscriptionDocumentsInSelectedFolder() {
  const documentsInSelectedFolder = useDocumentsInSelectedFolder();
  return documentsInSelectedFolder?.filter(isServiceSubscriptionDocument);
}

import type { DocumentModelModule } from "document-model";
import { ServiceOffering } from "./service-offering/module.js";

export const documentModels: DocumentModelModule<any>[] = [
  ServiceOffering,
];

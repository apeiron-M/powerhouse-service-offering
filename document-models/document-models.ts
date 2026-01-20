import type { DocumentModelModule } from "document-model";
import { ServiceOffering } from "./service-offering/module.js";
import { Facet } from "./facet/module.js";
import { ResourceTemplate } from "./resource-template/module.js";
import { ServiceSubscription } from "./service-subscription/module.js";
import { ResourceInstance } from "./resource-instance/module.js";

export const documentModels: DocumentModelModule<any>[] = [
  Facet,
  ResourceInstance,
  ResourceTemplate,
  ServiceOffering,
  ServiceSubscription,
];

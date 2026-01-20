import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Queries: ServiceSubscription Document
  """
  type ServiceSubscriptionQueries {
    getDocument(docId: PHID!, driveId: PHID): ServiceSubscription
    getDocuments(driveId: String!): [ServiceSubscription!]
  }

  type Query {
    ServiceSubscription: ServiceSubscriptionQueries
  }

  """
  Mutations: ServiceSubscription
  """
  type Mutation {
    ServiceSubscription_createDocument(name: String!, driveId: String): String

    ServiceSubscription_initializeSubscription(
      driveId: String
      docId: PHID
      input: ServiceSubscription_InitializeSubscriptionInput
    ): Int
    ServiceSubscription_updateSubscriptionStatus(
      driveId: String
      docId: PHID
      input: ServiceSubscription_UpdateSubscriptionStatusInput
    ): Int
    ServiceSubscription_activateSubscription(
      driveId: String
      docId: PHID
      input: ServiceSubscription_ActivateSubscriptionInput
    ): Int
    ServiceSubscription_cancelSubscription(
      driveId: String
      docId: PHID
      input: ServiceSubscription_CancelSubscriptionInput
    ): Int
    ServiceSubscription_renewSubscription(
      driveId: String
      docId: PHID
      input: ServiceSubscription_RenewSubscriptionInput
    ): Int
    ServiceSubscription_changeTier(
      driveId: String
      docId: PHID
      input: ServiceSubscription_ChangeTierInput
    ): Int
    ServiceSubscription_setPricing(
      driveId: String
      docId: PHID
      input: ServiceSubscription_SetPricingInput
    ): Int
    ServiceSubscription_addAddon(
      driveId: String
      docId: PHID
      input: ServiceSubscription_AddAddonInput
    ): Int
    ServiceSubscription_removeAddon(
      driveId: String
      docId: PHID
      input: ServiceSubscription_RemoveAddonInput
    ): Int
    ServiceSubscription_setFacetSelection(
      driveId: String
      docId: PHID
      input: ServiceSubscription_SetFacetSelectionInput
    ): Int
    ServiceSubscription_removeFacetSelection(
      driveId: String
      docId: PHID
      input: ServiceSubscription_RemoveFacetSelectionInput
    ): Int
  }

  """
  Module: SubscriptionManagement
  """
  input ServiceSubscription_InitializeSubscriptionInput {
    id: PHID!
    customerId: PHID!
    serviceOfferingId: PHID!
    resourceTemplateId: PHID!
    selectedTierId: OID!
    createdAt: DateTime!
    lastModified: DateTime!
  }
  input ServiceSubscription_UpdateSubscriptionStatusInput {
    status: ServiceSubscription_SubscriptionStatus!
    lastModified: DateTime!
  }
  input ServiceSubscription_ActivateSubscriptionInput {
    startDate: DateTime!
    currentPeriodStart: DateTime!
    currentPeriodEnd: DateTime!
    lastModified: DateTime!
  }
  input ServiceSubscription_CancelSubscriptionInput {
    cancelledAt: DateTime!
    reason: String
    lastModified: DateTime!
  }
  input ServiceSubscription_RenewSubscriptionInput {
    periodStart: DateTime!
    periodEnd: DateTime!
    lastModified: DateTime!
  }

  """
  Module: TierSelection
  """
  input ServiceSubscription_ChangeTierInput {
    newTierId: OID!
    lastModified: DateTime!
  }
  input ServiceSubscription_SetPricingInput {
    amount: Amount_Money!
    currency: Currency!
    billingCycle: ServiceSubscription_BillingCycle!
    setupFee: Amount_Money
    lastModified: DateTime!
  }

  """
  Module: AddOnManagement
  """
  input ServiceSubscription_AddAddonInput {
    id: OID!
    optionGroupId: OID!
    addedAt: DateTime!
    lastModified: DateTime!
  }
  input ServiceSubscription_RemoveAddonInput {
    id: OID!
    lastModified: DateTime!
  }

  """
  Module: FacetSelection
  """
  input ServiceSubscription_SetFacetSelectionInput {
    id: OID!
    categoryKey: String!
    selectedOptionId: String!
    lastModified: DateTime!
  }
  input ServiceSubscription_RemoveFacetSelectionInput {
    categoryKey: String!
    lastModified: DateTime!
  }
`;

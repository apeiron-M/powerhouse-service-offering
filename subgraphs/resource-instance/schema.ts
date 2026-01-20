import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Queries: ResourceInstance Document
  """
  type ResourceInstanceQueries {
    getDocument(docId: PHID!, driveId: PHID): ResourceInstance
    getDocuments(driveId: String!): [ResourceInstance!]
  }

  type Query {
    ResourceInstance: ResourceInstanceQueries
  }

  """
  Mutations: ResourceInstance
  """
  type Mutation {
    ResourceInstance_createDocument(name: String!, driveId: String): String

    ResourceInstance_initializeInstance(
      driveId: String
      docId: PHID
      input: ResourceInstance_InitializeInstanceInput
    ): Int
    ResourceInstance_updateInstanceStatus(
      driveId: String
      docId: PHID
      input: ResourceInstance_UpdateInstanceStatusInput
    ): Int
    ResourceInstance_activateInstance(
      driveId: String
      docId: PHID
      input: ResourceInstance_ActivateInstanceInput
    ): Int
    ResourceInstance_suspendInstance(
      driveId: String
      docId: PHID
      input: ResourceInstance_SuspendInstanceInput
    ): Int
    ResourceInstance_terminateInstance(
      driveId: String
      docId: PHID
      input: ResourceInstance_TerminateInstanceInput
    ): Int
    ResourceInstance_updateInstanceName(
      driveId: String
      docId: PHID
      input: ResourceInstance_UpdateInstanceNameInput
    ): Int
    ResourceInstance_setConfiguration(
      driveId: String
      docId: PHID
      input: ResourceInstance_SetConfigurationInput
    ): Int
    ResourceInstance_removeConfiguration(
      driveId: String
      docId: PHID
      input: ResourceInstance_RemoveConfigurationInput
    ): Int
    ResourceInstance_recordUsage(
      driveId: String
      docId: PHID
      input: ResourceInstance_RecordUsageInput
    ): Int
    ResourceInstance_resetUsage(
      driveId: String
      docId: PHID
      input: ResourceInstance_ResetUsageInput
    ): Int
  }

  """
  Module: InstanceManagement
  """
  input ResourceInstance_InitializeInstanceInput {
    id: PHID!
    subscriptionId: PHID!
    resourceTemplateId: PHID!
    customerId: PHID!
    name: String!
    createdAt: DateTime!
    lastModified: DateTime!
  }
  input ResourceInstance_UpdateInstanceStatusInput {
    status: ResourceInstance_InstanceStatus!
    lastModified: DateTime!
  }
  input ResourceInstance_ActivateInstanceInput {
    activatedAt: DateTime!
    lastModified: DateTime!
  }
  input ResourceInstance_SuspendInstanceInput {
    suspendedAt: DateTime!
    reason: String
    lastModified: DateTime!
  }
  input ResourceInstance_TerminateInstanceInput {
    terminatedAt: DateTime!
    reason: String
    lastModified: DateTime!
  }
  input ResourceInstance_UpdateInstanceNameInput {
    name: String!
    lastModified: DateTime!
  }

  """
  Module: ConfigurationManagement
  """
  input ResourceInstance_SetConfigurationInput {
    id: OID!
    key: String!
    value: String!
    source: ResourceInstance_ConfigSource!
    lastModified: DateTime!
  }
  input ResourceInstance_RemoveConfigurationInput {
    key: String!
    lastModified: DateTime!
  }

  """
  Module: UsageTracking
  """
  input ResourceInstance_RecordUsageInput {
    id: OID!
    metricKey: String!
    value: Int!
    limit: Int
    resetPeriod: ResourceInstance_ResetPeriod
    recordedAt: DateTime!
    lastModified: DateTime!
  }
  input ResourceInstance_ResetUsageInput {
    metricKey: String!
    resetAt: DateTime!
    lastModified: DateTime!
  }
`;

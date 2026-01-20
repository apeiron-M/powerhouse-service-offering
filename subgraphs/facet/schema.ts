import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Queries: Facet Document
  """
  type FacetQueries {
    getDocument(docId: PHID!, driveId: PHID): Facet
    getDocuments(driveId: String!): [Facet!]
  }

  type Query {
    Facet: FacetQueries
  }

  """
  Mutations: Facet
  """
  type Mutation {
    Facet_createDocument(name: String!, driveId: String): String

    Facet_setFacetName(
      driveId: String
      docId: PHID
      input: Facet_SetFacetNameInput
    ): Int
    Facet_setFacetDescription(
      driveId: String
      docId: PHID
      input: Facet_SetFacetDescriptionInput
    ): Int
    Facet_addOption(
      driveId: String
      docId: PHID
      input: Facet_AddOptionInput
    ): Int
    Facet_updateOption(
      driveId: String
      docId: PHID
      input: Facet_UpdateOptionInput
    ): Int
    Facet_removeOption(
      driveId: String
      docId: PHID
      input: Facet_RemoveOptionInput
    ): Int
    Facet_reorderOptions(
      driveId: String
      docId: PHID
      input: Facet_ReorderOptionsInput
    ): Int
  }

  """
  Module: FacetManagement
  """
  input Facet_SetFacetNameInput {
    name: String!
    lastModified: DateTime!
  }
  input Facet_SetFacetDescriptionInput {
    description: String
    lastModified: DateTime!
  }

  """
  Module: OptionManagement
  """
  input Facet_AddOptionInput {
    id: OID!
    label: String!
    description: String
    displayOrder: Int
    isDefault: Boolean
    lastModified: DateTime!
  }
  input Facet_UpdateOptionInput {
    id: OID!
    label: String
    description: String
    displayOrder: Int
    isDefault: Boolean
    lastModified: DateTime!
  }
  input Facet_RemoveOptionInput {
    id: OID!
    lastModified: DateTime!
  }
  input Facet_ReorderOptionsInput {
    optionIds: [OID!]!
    lastModified: DateTime!
  }
`;

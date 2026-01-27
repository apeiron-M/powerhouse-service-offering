/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import {
  reducer,
  utils,
  isResourceInstanceDocument,
  setConfiguration,
  SetConfigurationInputSchema,
  removeConfiguration,
  RemoveConfigurationInputSchema,
} from "@powerhousedao/contributor-billing/document-models/resource-instance";

describe("ConfigurationManagement Operations", () => {
  it("should handle setConfiguration operation", () => {
    const document = utils.createDocument();
    const input = generateMock(SetConfigurationInputSchema());

    const updatedDocument = reducer(document, setConfiguration(input));

    expect(isResourceInstanceDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "SET_CONFIGURATION",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle removeConfiguration operation", () => {
    const document = utils.createDocument();
    const input = generateMock(RemoveConfigurationInputSchema());

    const updatedDocument = reducer(document, removeConfiguration(input));

    expect(isResourceInstanceDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "REMOVE_CONFIGURATION",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});

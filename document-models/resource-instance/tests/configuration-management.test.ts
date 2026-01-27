import { generateMock } from "@powerhousedao/codegen";
import { describe, expect, it } from "vitest";
import {
  reducer,
  utils,
  isResourceInstanceDocument,
  setConfiguration,
  removeConfiguration,
  SetConfigurationInputSchema,
  RemoveConfigurationInputSchema,
} from "resourceServices/document-models/resource-instance";

describe("ConfigurationManagementOperations", () => {
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

/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import {
  reducer,
  utils,
  isResourceTemplateDocument,
  addFaqItem,
  AddFaqItemInputSchema,
  updateFaqItem,
  UpdateFaqItemInputSchema,
  deleteFaqItem,
  DeleteFaqItemInputSchema,
  reorderFaqItems,
  ReorderFaqItemsInputSchema,
} from "resourceServices/document-models/resource-template";

describe("FaqManagement Operations", () => {
  it("should handle addFaqItem operation", () => {
    const document = utils.createDocument();
    const input = generateMock(AddFaqItemInputSchema());

    const updatedDocument = reducer(document, addFaqItem(input));

    expect(isResourceTemplateDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "ADD_FAQ_ITEM",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle updateFaqItem operation", () => {
    const document = utils.createDocument();
    const input = generateMock(UpdateFaqItemInputSchema());

    const updatedDocument = reducer(document, updateFaqItem(input));

    expect(isResourceTemplateDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "UPDATE_FAQ_ITEM",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle deleteFaqItem operation", () => {
    const document = utils.createDocument();
    const input = generateMock(DeleteFaqItemInputSchema());

    const updatedDocument = reducer(document, deleteFaqItem(input));

    expect(isResourceTemplateDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "DELETE_FAQ_ITEM",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle reorderFaqItems operation", () => {
    const document = utils.createDocument();
    const input = generateMock(ReorderFaqItemsInputSchema());

    const updatedDocument = reducer(document, reorderFaqItems(input));

    expect(isResourceTemplateDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "REORDER_FAQ_ITEMS",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});

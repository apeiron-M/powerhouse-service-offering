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
  recordUsage,
  RecordUsageInputSchema,
  resetUsage,
  ResetUsageInputSchema,
} from "@powerhousedao/contributor-billing/document-models/resource-instance";

describe("UsageTracking Operations", () => {
  it("should handle recordUsage operation", () => {
    const document = utils.createDocument();
    const input = generateMock(RecordUsageInputSchema());

    const updatedDocument = reducer(document, recordUsage(input));

    expect(isResourceInstanceDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "RECORD_USAGE",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle resetUsage operation", () => {
    const document = utils.createDocument();
    const input = generateMock(ResetUsageInputSchema());

    const updatedDocument = reducer(document, resetUsage(input));

    expect(isResourceInstanceDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "RESET_USAGE",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});

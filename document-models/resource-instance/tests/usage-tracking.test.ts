import { generateMock } from "@powerhousedao/codegen";
import { describe, expect, it } from "vitest";
import {
  reducer,
  utils,
  isResourceInstanceDocument,
  recordUsage,
  resetUsage,
  RecordUsageInputSchema,
  ResetUsageInputSchema,
} from "@powerhousedao/contributor-billing/document-models/resource-instance";

describe("UsageTrackingOperations", () => {
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

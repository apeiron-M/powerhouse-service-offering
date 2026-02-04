import { generateMock } from "@powerhousedao/codegen";
import { describe, expect, it } from "vitest";
import {
  reducer,
  utils,
  isSubscriptionInstanceDocument,
  createClientRequest,
  approveRequest,
  rejectRequest,
  withdrawRequest,
  CreateClientRequestInputSchema,
  ApproveRequestInputSchema,
  RejectRequestInputSchema,
  WithdrawRequestInputSchema,
} from "@powerhousedao/contributor-billing/document-models/subscription-instance";

describe("RequestsOperations", () => {
  it("should handle createClientRequest operation", () => {
    const document = utils.createDocument();
    const input = generateMock(CreateClientRequestInputSchema());

    const updatedDocument = reducer(document, createClientRequest(input));

    expect(isSubscriptionInstanceDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "CREATE_CLIENT_REQUEST",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle approveRequest operation", () => {
    const document = utils.createDocument();
    const input = generateMock(ApproveRequestInputSchema());

    const updatedDocument = reducer(document, approveRequest(input));

    expect(isSubscriptionInstanceDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "APPROVE_REQUEST",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle rejectRequest operation", () => {
    const document = utils.createDocument();
    const input = generateMock(RejectRequestInputSchema());

    const updatedDocument = reducer(document, rejectRequest(input));

    expect(isSubscriptionInstanceDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "REJECT_REQUEST",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle withdrawRequest operation", () => {
    const document = utils.createDocument();
    const input = generateMock(WithdrawRequestInputSchema());

    const updatedDocument = reducer(document, withdrawRequest(input));

    expect(isSubscriptionInstanceDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "WITHDRAW_REQUEST",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});

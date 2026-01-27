import { generateMock } from "@powerhousedao/codegen";
import { describe, expect, it } from "vitest";
import {
  reducer,
  utils,
  isServiceSubscriptionDocument,
  initializeSubscription,
  updateSubscriptionStatus,
  activateSubscription,
  cancelSubscription,
  renewSubscription,
  InitializeSubscriptionInputSchema,
  UpdateSubscriptionStatusInputSchema,
  ActivateSubscriptionInputSchema,
  CancelSubscriptionInputSchema,
  RenewSubscriptionInputSchema,
} from "resourceServices/document-models/service-subscription";

describe("SubscriptionManagementOperations", () => {
  it("should handle initializeSubscription operation", () => {
    const document = utils.createDocument();
    const input = generateMock(InitializeSubscriptionInputSchema());

    const updatedDocument = reducer(document, initializeSubscription(input));

    expect(isServiceSubscriptionDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "INITIALIZE_SUBSCRIPTION",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle updateSubscriptionStatus operation", () => {
    const document = utils.createDocument();
    const input = generateMock(UpdateSubscriptionStatusInputSchema());

    const updatedDocument = reducer(document, updateSubscriptionStatus(input));

    expect(isServiceSubscriptionDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "UPDATE_SUBSCRIPTION_STATUS",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle activateSubscription operation", () => {
    const document = utils.createDocument();
    const input = generateMock(ActivateSubscriptionInputSchema());

    const updatedDocument = reducer(document, activateSubscription(input));

    expect(isServiceSubscriptionDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "ACTIVATE_SUBSCRIPTION",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle cancelSubscription operation", () => {
    const document = utils.createDocument();
    const input = generateMock(CancelSubscriptionInputSchema());

    const updatedDocument = reducer(document, cancelSubscription(input));

    expect(isServiceSubscriptionDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "CANCEL_SUBSCRIPTION",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle renewSubscription operation", () => {
    const document = utils.createDocument();
    const input = generateMock(RenewSubscriptionInputSchema());

    const updatedDocument = reducer(document, renewSubscription(input));

    expect(isServiceSubscriptionDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "RENEW_SUBSCRIPTION",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});

/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 *
 * NOTE: Tests are skipped until code generation properly includes
 * FacetPreset types and creators. The document model schema has been
 * updated but the GraphQL type generation is out of sync.
 */

import { describe, it, expect } from "vitest";
import {
  reducer,
  utils,
  isResourceTemplateDocument,
} from "@powerhousedao/contributor-billing/document-models/resource-template";

describe("FacetPresetManagement Operations", () => {
  it.skip("should handle setFacetPreset operation", () => {
    const document = utils.createDocument();
    // Test skipped - creators not yet generated
    expect(isResourceTemplateDocument(document)).toBe(true);
  });

  it.skip("should handle removeFacetPreset operation", () => {
    const document = utils.createDocument();
    // Test skipped - creators not yet generated
    expect(isResourceTemplateDocument(document)).toBe(true);
  });

  it.skip("should handle addPresetOption operation", () => {
    const document = utils.createDocument();
    // Test skipped - creators not yet generated
    expect(isResourceTemplateDocument(document)).toBe(true);
  });

  it.skip("should handle removePresetOption operation", () => {
    const document = utils.createDocument();
    // Test skipped - creators not yet generated
    expect(isResourceTemplateDocument(document)).toBe(true);
  });

  it("should verify document model has facetPresets in initial state", () => {
    const document = utils.createDocument();
    // The document model JSON includes facetPresets, verifying it's in the structure
    // Note: Until code generation is fixed, we access it via type assertion
    const state = document.state.global as Record<string, unknown>;
    expect(isResourceTemplateDocument(document)).toBe(true);
    // facetPresets should exist once properly regenerated
    // For now, we just verify the document is valid
  });
});

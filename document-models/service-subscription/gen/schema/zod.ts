import { z } from "zod";
import type {
  ActivateSubscriptionInput,
  AddAddonInput,
  BillingCycle,
  CancelSubscriptionInput,
  ChangeTierInput,
  FacetSelection,
  InitializeSubscriptionInput,
  RemoveAddonInput,
  RemoveFacetSelectionInput,
  RenewSubscriptionInput,
  SelectedAddon,
  ServiceSubscriptionState,
  SetFacetSelectionInput,
  SetPricingInput,
  SubscriptionPricing,
  SubscriptionStatus,
  UpdateSubscriptionStatusInput,
} from "./types.js";

type Properties<T> = Required<{
  [K in keyof T]: z.ZodType<T[K], any, T[K]>;
}>;

type definedNonNullAny = {};

export const isDefinedNonNullAny = (v: any): v is definedNonNullAny =>
  v !== undefined && v !== null;

export const definedNonNullAnySchema = z
  .any()
  .refine((v) => isDefinedNonNullAny(v));

export const BillingCycleSchema = z.enum([
  "ANNUAL",
  "MONTHLY",
  "ONE_TIME",
  "QUARTERLY",
  "SEMI_ANNUAL",
]);

export const SubscriptionStatusSchema = z.enum([
  "ACTIVE",
  "CANCELLED",
  "EXPIRED",
  "PAUSED",
  "PENDING",
]);

export function ActivateSubscriptionInputSchema(): z.ZodObject<
  Properties<ActivateSubscriptionInput>
> {
  return z.object({
    currentPeriodEnd: z.string().datetime(),
    currentPeriodStart: z.string().datetime(),
    lastModified: z.string().datetime(),
    startDate: z.string().datetime(),
  });
}

export function AddAddonInputSchema(): z.ZodObject<Properties<AddAddonInput>> {
  return z.object({
    addedAt: z.string().datetime(),
    id: z.string(),
    lastModified: z.string().datetime(),
    optionGroupId: z.string(),
  });
}

export function CancelSubscriptionInputSchema(): z.ZodObject<
  Properties<CancelSubscriptionInput>
> {
  return z.object({
    cancelledAt: z.string().datetime(),
    lastModified: z.string().datetime(),
    reason: z.string().nullish(),
  });
}

export function ChangeTierInputSchema(): z.ZodObject<
  Properties<ChangeTierInput>
> {
  return z.object({
    lastModified: z.string().datetime(),
    newTierId: z.string(),
  });
}

export function FacetSelectionSchema(): z.ZodObject<
  Properties<FacetSelection>
> {
  return z.object({
    __typename: z.literal("FacetSelection").optional(),
    categoryKey: z.string(),
    id: z.string(),
    selectedOptionId: z.string(),
  });
}

export function InitializeSubscriptionInputSchema(): z.ZodObject<
  Properties<InitializeSubscriptionInput>
> {
  return z.object({
    createdAt: z.string().datetime(),
    customerId: z.string(),
    id: z.string(),
    lastModified: z.string().datetime(),
    resourceTemplateId: z.string(),
    selectedTierId: z.string(),
    serviceOfferingId: z.string(),
  });
}

export function RemoveAddonInputSchema(): z.ZodObject<
  Properties<RemoveAddonInput>
> {
  return z.object({
    id: z.string(),
    lastModified: z.string().datetime(),
  });
}

export function RemoveFacetSelectionInputSchema(): z.ZodObject<
  Properties<RemoveFacetSelectionInput>
> {
  return z.object({
    categoryKey: z.string(),
    lastModified: z.string().datetime(),
  });
}

export function RenewSubscriptionInputSchema(): z.ZodObject<
  Properties<RenewSubscriptionInput>
> {
  return z.object({
    lastModified: z.string().datetime(),
    periodEnd: z.string().datetime(),
    periodStart: z.string().datetime(),
  });
}

export function SelectedAddonSchema(): z.ZodObject<Properties<SelectedAddon>> {
  return z.object({
    __typename: z.literal("SelectedAddon").optional(),
    addedAt: z.string().datetime(),
    id: z.string(),
    optionGroupId: z.string(),
  });
}

export function ServiceSubscriptionStateSchema(): z.ZodObject<
  Properties<ServiceSubscriptionState>
> {
  return z.object({
    __typename: z.literal("ServiceSubscriptionState").optional(),
    cancellationReason: z.string().nullable(),
    cancelledAt: z.string().datetime().nullable(),
    createdAt: z.string().datetime(),
    currentPeriodEnd: z.string().datetime().nullable(),
    currentPeriodStart: z.string().datetime().nullable(),
    customerId: z.string(),
    facetSelections: z.array(FacetSelectionSchema()),
    id: z.string(),
    lastModified: z.string().datetime(),
    pricing: SubscriptionPricingSchema().nullable(),
    resourceTemplateId: z.string(),
    selectedAddons: z.array(SelectedAddonSchema()),
    selectedTierId: z.string(),
    serviceOfferingId: z.string(),
    startDate: z.string().datetime().nullable(),
    status: SubscriptionStatusSchema,
  });
}

export function SetFacetSelectionInputSchema(): z.ZodObject<
  Properties<SetFacetSelectionInput>
> {
  return z.object({
    categoryKey: z.string(),
    id: z.string(),
    lastModified: z.string().datetime(),
    selectedOptionId: z.string(),
  });
}

export function SetPricingInputSchema(): z.ZodObject<
  Properties<SetPricingInput>
> {
  return z.object({
    amount: z.number(),
    billingCycle: BillingCycleSchema,
    currency: z.string(),
    lastModified: z.string().datetime(),
    setupFee: z.number().nullish(),
  });
}

export function SubscriptionPricingSchema(): z.ZodObject<
  Properties<SubscriptionPricing>
> {
  return z.object({
    __typename: z.literal("SubscriptionPricing").optional(),
    amount: z.number(),
    billingCycle: BillingCycleSchema,
    currency: z.string(),
    setupFee: z.number().nullable(),
  });
}

export function UpdateSubscriptionStatusInputSchema(): z.ZodObject<
  Properties<UpdateSubscriptionStatusInput>
> {
  return z.object({
    lastModified: z.string().datetime(),
    status: SubscriptionStatusSchema,
  });
}

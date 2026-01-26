import * as z from "zod";
import type {
  ActivateInstanceInput,
  InitializeInstanceInput,
  InstanceConfiguration,
  RecordUsageInput,
  RemoveConfigurationInput,
  ResetUsageInput,
  ResourceInstanceState,
  SetConfigurationInput,
  SuspendInstanceInput,
  TerminateInstanceInput,
  UpdateInstanceNameInput,
  UpdateInstanceStatusInput,
  UsageMetric,
} from "./types.js";

type Properties<T> = Required<{
  [K in keyof T]: z.ZodType<T[K]>;
}>;

type definedNonNullAny = {};

export const isDefinedNonNullAny = (v: any): v is definedNonNullAny =>
  v !== undefined && v !== null;

export const definedNonNullAnySchema = z
  .any()
  .refine((v) => isDefinedNonNullAny(v));

export const ConfigSourceSchema = z.enum([
  "CUSTOMER_INPUT",
  "FACET_SELECTION",
  "SYSTEM",
  "TIER_DEFAULT",
]);

export const InstanceStatusSchema = z.enum([
  "ACTIVE",
  "ERROR",
  "PROVISIONING",
  "SUSPENDED",
  "TERMINATED",
]);

export const ResetPeriodSchema = z.enum([
  "ANNUAL",
  "DAILY",
  "HOURLY",
  "MONTHLY",
  "QUARTERLY",
  "SEMI_ANNUAL",
  "WEEKLY",
]);

export function ActivateInstanceInputSchema(): z.ZodObject<
  Properties<ActivateInstanceInput>
> {
  return z.object({
    activatedAt: z.string().datetime(),
    lastModified: z.string().datetime(),
  });
}

export function InitializeInstanceInputSchema(): z.ZodObject<
  Properties<InitializeInstanceInput>
> {
  return z.object({
    createdAt: z.string().datetime(),
    customerId: z.string(),
    id: z.string(),
    lastModified: z.string().datetime(),
    name: z.string(),
    resourceTemplateId: z.string(),
    subscriptionId: z.string(),
  });
}

export function InstanceConfigurationSchema(): z.ZodObject<
  Properties<InstanceConfiguration>
> {
  return z.object({
    __typename: z.literal("InstanceConfiguration").optional(),
    id: z.string(),
    key: z.string(),
    source: ConfigSourceSchema,
    value: z.string(),
  });
}

export function RecordUsageInputSchema(): z.ZodObject<
  Properties<RecordUsageInput>
> {
  return z.object({
    id: z.string(),
    lastModified: z.string().datetime(),
    limit: z.number().nullish(),
    metricKey: z.string(),
    recordedAt: z.string().datetime(),
    resetPeriod: ResetPeriodSchema.nullish(),
    value: z.number(),
  });
}

export function RemoveConfigurationInputSchema(): z.ZodObject<
  Properties<RemoveConfigurationInput>
> {
  return z.object({
    key: z.string(),
    lastModified: z.string().datetime(),
  });
}

export function ResetUsageInputSchema(): z.ZodObject<
  Properties<ResetUsageInput>
> {
  return z.object({
    lastModified: z.string().datetime(),
    metricKey: z.string(),
    resetAt: z.string().datetime(),
  });
}

export function ResourceInstanceStateSchema(): z.ZodObject<
  Properties<ResourceInstanceState>
> {
  return z.object({
    __typename: z.literal("ResourceInstanceState").optional(),
    activatedAt: z.string().datetime().nullish(),
    configuration: z.array(z.lazy(() => InstanceConfigurationSchema())),
    createdAt: z.string().datetime(),
    customerId: z.string(),
    id: z.string(),
    lastModified: z.string().datetime(),
    name: z.string(),
    resourceTemplateId: z.string(),
    status: InstanceStatusSchema,
    subscriptionId: z.string(),
    suspendedAt: z.string().datetime().nullish(),
    suspensionReason: z.string().nullish(),
    terminatedAt: z.string().datetime().nullish(),
    terminationReason: z.string().nullish(),
    usageMetrics: z.array(z.lazy(() => UsageMetricSchema())),
  });
}

export function SetConfigurationInputSchema(): z.ZodObject<
  Properties<SetConfigurationInput>
> {
  return z.object({
    id: z.string(),
    key: z.string(),
    lastModified: z.string().datetime(),
    source: ConfigSourceSchema,
    value: z.string(),
  });
}

export function SuspendInstanceInputSchema(): z.ZodObject<
  Properties<SuspendInstanceInput>
> {
  return z.object({
    lastModified: z.string().datetime(),
    reason: z.string().nullish(),
    suspendedAt: z.string().datetime(),
  });
}

export function TerminateInstanceInputSchema(): z.ZodObject<
  Properties<TerminateInstanceInput>
> {
  return z.object({
    lastModified: z.string().datetime(),
    reason: z.string().nullish(),
    terminatedAt: z.string().datetime(),
  });
}

export function UpdateInstanceNameInputSchema(): z.ZodObject<
  Properties<UpdateInstanceNameInput>
> {
  return z.object({
    lastModified: z.string().datetime(),
    name: z.string(),
  });
}

export function UpdateInstanceStatusInputSchema(): z.ZodObject<
  Properties<UpdateInstanceStatusInput>
> {
  return z.object({
    lastModified: z.string().datetime(),
    status: InstanceStatusSchema,
  });
}

export function UsageMetricSchema(): z.ZodObject<Properties<UsageMetric>> {
  return z.object({
    __typename: z.literal("UsageMetric").optional(),
    currentValue: z.number(),
    id: z.string(),
    lastUpdated: z.string().datetime(),
    limit: z.number().nullish(),
    metricKey: z.string(),
    resetPeriod: ResetPeriodSchema.nullish(),
  });
}

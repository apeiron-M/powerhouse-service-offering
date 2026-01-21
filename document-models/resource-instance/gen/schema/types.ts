export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Amount: {
    input: { unit?: string; value?: number };
    output: { unit?: string; value?: number };
  };
  Amount_Crypto: {
    input: { unit: string; value: string };
    output: { unit: string; value: string };
  };
  Amount_Currency: {
    input: { unit: string; value: string };
    output: { unit: string; value: string };
  };
  Amount_Fiat: {
    input: { unit: string; value: number };
    output: { unit: string; value: number };
  };
  Amount_Money: { input: number; output: number };
  Amount_Percentage: { input: number; output: number };
  Amount_Tokens: { input: number; output: number };
  Currency: { input: string; output: string };
  Date: { input: string; output: string };
  DateTime: { input: string; output: string };
  EmailAddress: { input: string; output: string };
  EthereumAddress: { input: string; output: string };
  OID: { input: string; output: string };
  OLabel: { input: string; output: string };
  PHID: { input: string; output: string };
  URL: { input: string; output: string };
  Upload: { input: File; output: File };
};

export type ActivateInstanceInput = {
  activatedAt: Scalars["DateTime"]["input"];
  lastModified: Scalars["DateTime"]["input"];
};

export type ConfigSource =
  | "CUSTOMER_INPUT"
  | "FACET_SELECTION"
  | "SYSTEM"
  | "TIER_DEFAULT";

export type InitializeInstanceInput = {
  createdAt: Scalars["DateTime"]["input"];
  customerId: Scalars["PHID"]["input"];
  id: Scalars["PHID"]["input"];
  lastModified: Scalars["DateTime"]["input"];
  name: Scalars["String"]["input"];
  resourceTemplateId: Scalars["PHID"]["input"];
  subscriptionId: Scalars["PHID"]["input"];
};

export type InstanceConfiguration = {
  id: Scalars["OID"]["output"];
  key: Scalars["String"]["output"];
  source: ConfigSource;
  value: Scalars["String"]["output"];
};

export type InstanceStatus =
  | "ACTIVE"
  | "ERROR"
  | "PROVISIONING"
  | "SUSPENDED"
  | "TERMINATED";

export type RecordUsageInput = {
  id: Scalars["OID"]["input"];
  lastModified: Scalars["DateTime"]["input"];
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  metricKey: Scalars["String"]["input"];
  recordedAt: Scalars["DateTime"]["input"];
  resetPeriod?: InputMaybe<ResetPeriod>;
  value: Scalars["Int"]["input"];
};

export type RemoveConfigurationInput = {
  key: Scalars["String"]["input"];
  lastModified: Scalars["DateTime"]["input"];
};

export type ResetPeriod =
  | "ANNUAL"
  | "DAILY"
  | "HOURLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "SEMI_ANNUAL"
  | "WEEKLY";

export type ResetUsageInput = {
  lastModified: Scalars["DateTime"]["input"];
  metricKey: Scalars["String"]["input"];
  resetAt: Scalars["DateTime"]["input"];
};

export type ResourceInstanceState = {
  activatedAt: Maybe<Scalars["DateTime"]["output"]>;
  configuration: Array<InstanceConfiguration>;
  createdAt: Scalars["DateTime"]["output"];
  customerId: Scalars["PHID"]["output"];
  id: Scalars["PHID"]["output"];
  lastModified: Scalars["DateTime"]["output"];
  name: Scalars["String"]["output"];
  resourceTemplateId: Scalars["PHID"]["output"];
  status: InstanceStatus;
  subscriptionId: Scalars["PHID"]["output"];
  suspendedAt: Maybe<Scalars["DateTime"]["output"]>;
  suspensionReason: Maybe<Scalars["String"]["output"]>;
  terminatedAt: Maybe<Scalars["DateTime"]["output"]>;
  terminationReason: Maybe<Scalars["String"]["output"]>;
  usageMetrics: Array<UsageMetric>;
};

export type SetConfigurationInput = {
  id: Scalars["OID"]["input"];
  key: Scalars["String"]["input"];
  lastModified: Scalars["DateTime"]["input"];
  source: ConfigSource;
  value: Scalars["String"]["input"];
};

export type SuspendInstanceInput = {
  lastModified: Scalars["DateTime"]["input"];
  reason?: InputMaybe<Scalars["String"]["input"]>;
  suspendedAt: Scalars["DateTime"]["input"];
};

export type TerminateInstanceInput = {
  lastModified: Scalars["DateTime"]["input"];
  reason?: InputMaybe<Scalars["String"]["input"]>;
  terminatedAt: Scalars["DateTime"]["input"];
};

export type UpdateInstanceNameInput = {
  lastModified: Scalars["DateTime"]["input"];
  name: Scalars["String"]["input"];
};

export type UpdateInstanceStatusInput = {
  lastModified: Scalars["DateTime"]["input"];
  status: InstanceStatus;
};

export type UsageMetric = {
  currentValue: Scalars["Int"]["output"];
  id: Scalars["OID"]["output"];
  lastUpdated: Scalars["DateTime"]["output"];
  limit: Maybe<Scalars["Int"]["output"]>;
  metricKey: Scalars["String"]["output"];
  resetPeriod: Maybe<ResetPeriod>;
};

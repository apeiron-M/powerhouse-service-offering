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

export type AddFacetBindingInput = {
  bindingId: Scalars["OID"]["input"];
  facetName: Scalars["String"]["input"];
  facetType: Scalars["PHID"]["input"];
  lastModified: Scalars["DateTime"]["input"];
  serviceId: Scalars["OID"]["input"];
  supportedOptions: Array<Scalars["OID"]["input"]>;
};

export type AddOptionGroupInput = {
  defaultSelected: Scalars["Boolean"]["input"];
  description?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["OID"]["input"];
  isAddOn: Scalars["Boolean"]["input"];
  lastModified: Scalars["DateTime"]["input"];
  name: Scalars["String"]["input"];
};

export type AddServiceInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  displayOrder?: InputMaybe<Scalars["Int"]["input"]>;
  id: Scalars["OID"]["input"];
  isSetupFormation?: InputMaybe<Scalars["Boolean"]["input"]>;
  lastModified: Scalars["DateTime"]["input"];
  parentServiceId?: InputMaybe<Scalars["OID"]["input"]>;
  title: Scalars["String"]["input"];
};

export type AddServiceLevelInput = {
  annexes?: InputMaybe<Scalars["String"]["input"]>;
  customValue?: InputMaybe<Scalars["String"]["input"]>;
  lastModified: Scalars["DateTime"]["input"];
  level: ServiceLevel | `${ServiceLevel}`;
  optionGroupId?: InputMaybe<Scalars["OID"]["input"]>;
  serviceId: Scalars["OID"]["input"];
  serviceLevelId: Scalars["OID"]["input"];
  setupFee?: InputMaybe<Scalars["Amount_Money"]["input"]>;
  tierId: Scalars["OID"]["input"];
  variations?: InputMaybe<Scalars["String"]["input"]>;
};

export type AddTierInput = {
  amount?: InputMaybe<Scalars["Amount_Money"]["input"]>;
  billingCycle: BillingCycle | `${BillingCycle}`;
  currency: Scalars["Currency"]["input"];
  description?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["OID"]["input"];
  isCustomPricing?: InputMaybe<Scalars["Boolean"]["input"]>;
  lastModified: Scalars["DateTime"]["input"];
  name: Scalars["String"]["input"];
  setupFee?: InputMaybe<Scalars["Amount_Money"]["input"]>;
};

export type AddUsageLimitInput = {
  lastModified: Scalars["DateTime"]["input"];
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  limitId: Scalars["OID"]["input"];
  metric: Scalars["String"]["input"];
  notes?: InputMaybe<Scalars["String"]["input"]>;
  resetPeriod?: InputMaybe<ResetPeriod | `${ResetPeriod}`>;
  serviceId: Scalars["OID"]["input"];
  tierId: Scalars["OID"]["input"];
};

export type BillingCycle =
  | "ANNUAL"
  | "MONTHLY"
  | "ONE_TIME"
  | "QUARTERLY"
  | "SEMI_ANNUAL";

export type DeleteOptionGroupInput = {
  id: Scalars["OID"]["input"];
  lastModified: Scalars["DateTime"]["input"];
};

export type DeleteServiceInput = {
  id: Scalars["OID"]["input"];
  lastModified: Scalars["DateTime"]["input"];
};

export type DeleteTierInput = {
  id: Scalars["OID"]["input"];
  lastModified: Scalars["DateTime"]["input"];
};

export type OptionGroup = {
  defaultSelected: Scalars["Boolean"]["output"];
  description: Maybe<Scalars["String"]["output"]>;
  id: Scalars["OID"]["output"];
  isAddOn: Scalars["Boolean"]["output"];
  name: Scalars["String"]["output"];
};

export type RemoveFacetBindingInput = {
  bindingId: Scalars["OID"]["input"];
  lastModified: Scalars["DateTime"]["input"];
  serviceId: Scalars["OID"]["input"];
};

export type RemoveServiceLevelInput = {
  lastModified: Scalars["DateTime"]["input"];
  serviceLevelId: Scalars["OID"]["input"];
  tierId: Scalars["OID"]["input"];
};

export type RemoveUsageLimitInput = {
  lastModified: Scalars["DateTime"]["input"];
  limitId: Scalars["OID"]["input"];
  tierId: Scalars["OID"]["input"];
};

export type ResetPeriod =
  | "ANNUAL"
  | "DAILY"
  | "HOURLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "SEMI_ANNUAL"
  | "WEEKLY";

export type ResourceFacetBinding = {
  facetName: Scalars["String"]["output"];
  facetType: Scalars["PHID"]["output"];
  id: Scalars["OID"]["output"];
  supportedOptions: Array<Scalars["OID"]["output"]>;
};

export type Service = {
  description: Maybe<Scalars["String"]["output"]>;
  displayOrder: Maybe<Scalars["Int"]["output"]>;
  facetBindings: Array<ResourceFacetBinding>;
  id: Scalars["OID"]["output"];
  isSetupFormation: Scalars["Boolean"]["output"];
  parentServiceId: Maybe<Scalars["OID"]["output"]>;
  title: Scalars["String"]["output"];
};

export type ServiceLevel =
  | "CUSTOM"
  | "INCLUDED"
  | "NOT_APPLICABLE"
  | "NOT_INCLUDED"
  | "OPTIONAL"
  | "VARIABLE";

export type ServiceLevelBinding = {
  annexes: Maybe<Scalars["String"]["output"]>;
  customValue: Maybe<Scalars["String"]["output"]>;
  id: Scalars["OID"]["output"];
  level: ServiceLevel | `${ServiceLevel}`;
  optionGroupId: Maybe<Scalars["OID"]["output"]>;
  serviceId: Scalars["OID"]["output"];
  setupFee: Maybe<Scalars["Amount_Money"]["output"]>;
  variations: Maybe<Scalars["String"]["output"]>;
};

export type ServiceOfferingState = {
  id: Scalars["PHID"]["output"];
  infoLink: Maybe<Scalars["URL"]["output"]>;
  lastModified: Scalars["DateTime"]["output"];
  operatorId: Scalars["PHID"]["output"];
  optionGroups: Array<OptionGroup>;
  services: Array<Service>;
  status: ServiceStatus | `${ServiceStatus}`;
  summary: Scalars["String"]["output"];
  tiers: Array<ServiceSubscriptionTier>;
  title: Scalars["String"]["output"];
};

export type ServicePricing = {
  amount: Maybe<Scalars["Amount_Money"]["output"]>;
  billingCycle: BillingCycle | `${BillingCycle}`;
  currency: Scalars["Currency"]["output"];
  setupFee: Maybe<Scalars["Amount_Money"]["output"]>;
};

export type ServiceStatus = "ACTIVE" | "COMING_SOON" | "DEPRECATED" | "DRAFT";

export type ServiceSubscriptionTier = {
  description: Maybe<Scalars["String"]["output"]>;
  id: Scalars["OID"]["output"];
  isCustomPricing: Scalars["Boolean"]["output"];
  name: Scalars["String"]["output"];
  pricing: ServicePricing;
  serviceLevels: Array<ServiceLevelBinding>;
  usageLimits: Array<ServiceUsageLimit>;
};

export type ServiceUsageLimit = {
  id: Scalars["OID"]["output"];
  limit: Maybe<Scalars["Int"]["output"]>;
  metric: Scalars["String"]["output"];
  notes: Maybe<Scalars["String"]["output"]>;
  resetPeriod: Maybe<ResetPeriod | `${ResetPeriod}`>;
  serviceId: Scalars["OID"]["output"];
};

export type SetOfferingIdInput = {
  id: Scalars["PHID"]["input"];
  lastModified: Scalars["DateTime"]["input"];
};

export type SetOperatorInput = {
  lastModified: Scalars["DateTime"]["input"];
  operatorId: Scalars["PHID"]["input"];
};

export type UpdateOfferingInfoInput = {
  infoLink?: InputMaybe<Scalars["URL"]["input"]>;
  lastModified: Scalars["DateTime"]["input"];
  summary?: InputMaybe<Scalars["String"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateOfferingStatusInput = {
  lastModified: Scalars["DateTime"]["input"];
  status: ServiceStatus | `${ServiceStatus}`;
};

export type UpdateOptionGroupInput = {
  defaultSelected?: InputMaybe<Scalars["Boolean"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["OID"]["input"];
  isAddOn?: InputMaybe<Scalars["Boolean"]["input"]>;
  lastModified: Scalars["DateTime"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateServiceInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  displayOrder?: InputMaybe<Scalars["Int"]["input"]>;
  id: Scalars["OID"]["input"];
  isSetupFormation?: InputMaybe<Scalars["Boolean"]["input"]>;
  lastModified: Scalars["DateTime"]["input"];
  parentServiceId?: InputMaybe<Scalars["OID"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateServiceLevelInput = {
  annexes?: InputMaybe<Scalars["String"]["input"]>;
  customValue?: InputMaybe<Scalars["String"]["input"]>;
  lastModified: Scalars["DateTime"]["input"];
  level?: InputMaybe<ServiceLevel | `${ServiceLevel}`>;
  optionGroupId?: InputMaybe<Scalars["OID"]["input"]>;
  serviceLevelId: Scalars["OID"]["input"];
  setupFee?: InputMaybe<Scalars["Amount_Money"]["input"]>;
  tierId: Scalars["OID"]["input"];
  variations?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateTierInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["OID"]["input"];
  isCustomPricing?: InputMaybe<Scalars["Boolean"]["input"]>;
  lastModified: Scalars["DateTime"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateTierPricingInput = {
  amount?: InputMaybe<Scalars["Amount_Money"]["input"]>;
  billingCycle?: InputMaybe<BillingCycle | `${BillingCycle}`>;
  currency?: InputMaybe<Scalars["Currency"]["input"]>;
  lastModified: Scalars["DateTime"]["input"];
  setupFee?: InputMaybe<Scalars["Amount_Money"]["input"]>;
  tierId: Scalars["OID"]["input"];
};

export type UpdateUsageLimitInput = {
  lastModified: Scalars["DateTime"]["input"];
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  limitId: Scalars["OID"]["input"];
  metric?: InputMaybe<Scalars["String"]["input"]>;
  notes?: InputMaybe<Scalars["String"]["input"]>;
  resetPeriod?: InputMaybe<ResetPeriod | `${ResetPeriod}`>;
  tierId: Scalars["OID"]["input"];
};

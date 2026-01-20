import type { DocumentModelGlobalState } from "document-model";

export const documentModel: DocumentModelGlobalState = {
  author: {
    name: "Powerhouse",
    website: "https://www.powerhouse.inc/",
  },
  description:
    "Document model for an instantiated resource based on a subscription. Represents the actual deployed/provisioned service resource for a customer, tracking configuration, usage, and operational state.",
  extension: "",
  id: "powerhouse/resource-instance",
  name: "ResourceInstance",
  specifications: [
    {
      changeLog: [],
      modules: [
        {
          description: "Operations for managing resource instance lifecycle",
          id: "instance-management",
          name: "Instance Management",
          operations: [
            {
              description:
                "Initializes the resource instance from a subscription",
              errors: [],
              examples: [],
              id: "initialize-instance",
              name: "INITIALIZE_INSTANCE",
              reducer:
                'state.id = action.input.id;\nstate.subscriptionId = action.input.subscriptionId;\nstate.resourceTemplateId = action.input.resourceTemplateId;\nstate.customerId = action.input.customerId;\nstate.name = action.input.name;\nstate.status = "PROVISIONING";\nstate.createdAt = action.input.createdAt;\nstate.lastModified = action.input.lastModified;',
              schema:
                "input InitializeInstanceInput {\n    id: PHID!\n    subscriptionId: PHID!\n    resourceTemplateId: PHID!\n    customerId: PHID!\n    name: String!\n    createdAt: DateTime!\n    lastModified: DateTime!\n}",
              scope: "global",
              template: "Initializes the resource instance",
            },
            {
              description: "Updates the instance status",
              errors: [],
              examples: [],
              id: "update-instance-status",
              name: "UPDATE_INSTANCE_STATUS",
              reducer:
                "state.status = action.input.status;\nstate.lastModified = action.input.lastModified;",
              schema:
                "input UpdateInstanceStatusInput {\n    status: InstanceStatus!\n    lastModified: DateTime!\n}",
              scope: "global",
              template: "Updates the instance status",
            },
            {
              description: "Marks the instance as active/ready",
              errors: [],
              examples: [],
              id: "activate-instance",
              name: "ACTIVATE_INSTANCE",
              reducer:
                'state.status = "ACTIVE";\nstate.activatedAt = action.input.activatedAt;\nstate.lastModified = action.input.lastModified;',
              schema:
                "input ActivateInstanceInput {\n    activatedAt: DateTime!\n    lastModified: DateTime!\n}",
              scope: "global",
              template: "Activates the instance",
            },
            {
              description: "Suspends the resource instance",
              errors: [],
              examples: [],
              id: "suspend-instance",
              name: "SUSPEND_INSTANCE",
              reducer:
                'state.status = "SUSPENDED";\nstate.suspendedAt = action.input.suspendedAt;\nstate.suspensionReason = action.input.reason || null;\nstate.lastModified = action.input.lastModified;',
              schema:
                "input SuspendInstanceInput {\n    suspendedAt: DateTime!\n    reason: String\n    lastModified: DateTime!\n}",
              scope: "global",
              template: "Suspends the instance",
            },
            {
              description: "Terminates the resource instance",
              errors: [],
              examples: [],
              id: "terminate-instance",
              name: "TERMINATE_INSTANCE",
              reducer:
                'state.status = "TERMINATED";\nstate.terminatedAt = action.input.terminatedAt;\nstate.terminationReason = action.input.reason || null;\nstate.lastModified = action.input.lastModified;',
              schema:
                "input TerminateInstanceInput {\n    terminatedAt: DateTime!\n    reason: String\n    lastModified: DateTime!\n}",
              scope: "global",
              template: "Terminates the instance",
            },
            {
              description: "Updates the instance name",
              errors: [],
              examples: [],
              id: "update-instance-name",
              name: "UPDATE_INSTANCE_NAME",
              reducer:
                "state.name = action.input.name;\nstate.lastModified = action.input.lastModified;",
              schema:
                "input UpdateInstanceNameInput {\n    name: String!\n    lastModified: DateTime!\n}",
              scope: "global",
              template: "Updates the instance name",
            },
          ],
        },
        {
          description:
            "Operations for managing instance configuration based on facet selections",
          id: "configuration-management",
          name: "Configuration Management",
          operations: [
            {
              description: "Sets a configuration value for the instance",
              errors: [],
              examples: [],
              id: "set-configuration",
              name: "SET_CONFIGURATION",
              reducer:
                "const existingIndex = state.configuration.findIndex(c => c.key === action.input.key);\nif (existingIndex !== -1) {\n    state.configuration[existingIndex] = {\n        id: action.input.id,\n        key: action.input.key,\n        value: action.input.value,\n        source: action.input.source\n    };\n} else {\n    state.configuration.push({\n        id: action.input.id,\n        key: action.input.key,\n        value: action.input.value,\n        source: action.input.source\n    });\n}\nstate.lastModified = action.input.lastModified;",
              schema:
                "input SetConfigurationInput {\n    id: OID!\n    key: String!\n    value: String!\n    source: ConfigSource!\n    lastModified: DateTime!\n}",
              scope: "global",
              template: "Sets a configuration value",
            },
            {
              description: "Removes a configuration value",
              errors: [],
              examples: [],
              id: "remove-configuration",
              name: "REMOVE_CONFIGURATION",
              reducer:
                "const configIndex = state.configuration.findIndex(c => c.key === action.input.key);\nif (configIndex !== -1) {\n    state.configuration.splice(configIndex, 1);\n}\nstate.lastModified = action.input.lastModified;",
              schema:
                "input RemoveConfigurationInput {\n    key: String!\n    lastModified: DateTime!\n}",
              scope: "global",
              template: "Removes a configuration value",
            },
          ],
        },
        {
          description: "Operations for tracking usage metrics",
          id: "usage-tracking",
          name: "Usage Tracking",
          operations: [
            {
              description: "Records usage for a metric",
              errors: [],
              examples: [],
              id: "record-usage",
              name: "RECORD_USAGE",
              reducer:
                "const existingIndex = state.usageMetrics.findIndex(u => u.metricKey === action.input.metricKey);\nif (existingIndex !== -1) {\n    state.usageMetrics[existingIndex].currentValue = action.input.value;\n    state.usageMetrics[existingIndex].lastUpdated = action.input.recordedAt;\n} else {\n    state.usageMetrics.push({\n        id: action.input.id,\n        metricKey: action.input.metricKey,\n        currentValue: action.input.value,\n        limit: action.input.limit || null,\n        resetPeriod: action.input.resetPeriod || null,\n        lastUpdated: action.input.recordedAt\n    });\n}\nstate.lastModified = action.input.lastModified;",
              schema:
                "input RecordUsageInput {\n    id: OID!\n    metricKey: String!\n    value: Int!\n    limit: Int\n    resetPeriod: ResetPeriod\n    recordedAt: DateTime!\n    lastModified: DateTime!\n}",
              scope: "global",
              template: "Records usage for a metric",
            },
            {
              description: "Resets usage for a metric (e.g., at period end)",
              errors: [],
              examples: [],
              id: "reset-usage",
              name: "RESET_USAGE",
              reducer:
                "const usageIndex = state.usageMetrics.findIndex(u => u.metricKey === action.input.metricKey);\nif (usageIndex !== -1) {\n    state.usageMetrics[usageIndex].currentValue = 0;\n    state.usageMetrics[usageIndex].lastUpdated = action.input.resetAt;\n}\nstate.lastModified = action.input.lastModified;",
              schema:
                "input ResetUsageInput {\n    metricKey: String!\n    resetAt: DateTime!\n    lastModified: DateTime!\n}",
              scope: "global",
              template: "Resets usage for a metric",
            },
          ],
        },
      ],
      state: {
        global: {
          examples: [],
          initialValue:
            '"{\\n    \\"id\\": \\"\\",\\n    \\"subscriptionId\\": \\"\\",\\n    \\"resourceTemplateId\\": \\"\\",\\n    \\"customerId\\": \\"\\",\\n    \\"name\\": \\"\\",\\n    \\"status\\": \\"PROVISIONING\\",\\n    \\"configuration\\": [],\\n    \\"usageMetrics\\": [],\\n    \\"activatedAt\\": null,\\n    \\"suspendedAt\\": null,\\n    \\"suspensionReason\\": null,\\n    \\"terminatedAt\\": null,\\n    \\"terminationReason\\": null,\\n    \\"createdAt\\": \\"1970-01-01T00:00:00.000Z\\",\\n    \\"lastModified\\": \\"1970-01-01T00:00:00.000Z\\"\\n}"',
          schema:
            "type ResourceInstanceState {\n    id: PHID!\n    subscriptionId: PHID!\n    resourceTemplateId: PHID!\n    customerId: PHID!\n    name: String!\n    status: InstanceStatus!\n    configuration: [InstanceConfiguration!]!\n    usageMetrics: [UsageMetric!]!\n    activatedAt: DateTime\n    suspendedAt: DateTime\n    suspensionReason: String\n    terminatedAt: DateTime\n    terminationReason: String\n    createdAt: DateTime!\n    lastModified: DateTime!\n}\n\nenum InstanceStatus {\n    PROVISIONING\n    ACTIVE\n    SUSPENDED\n    TERMINATED\n    ERROR\n}\n\ntype InstanceConfiguration {\n    id: OID!\n    key: String!\n    value: String!\n    source: ConfigSource!\n}\n\nenum ConfigSource {\n    FACET_SELECTION\n    TIER_DEFAULT\n    CUSTOMER_INPUT\n    SYSTEM\n}\n\ntype UsageMetric {\n    id: OID!\n    metricKey: String!\n    currentValue: Int!\n    limit: Int\n    resetPeriod: ResetPeriod\n    lastUpdated: DateTime!\n}\n\nenum ResetPeriod {\n    HOURLY\n    DAILY\n    WEEKLY\n    MONTHLY\n    QUARTERLY\n    SEMI_ANNUAL\n    ANNUAL\n}",
        },
        local: {
          examples: [],
          initialValue: '""',
          schema: "",
        },
      },
      version: 1,
    },
  ],
};

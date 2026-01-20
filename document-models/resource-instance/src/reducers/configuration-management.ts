import type { ResourceInstanceConfigurationManagementOperations } from "resourceServices/document-models/resource-instance";

export const resourceInstanceConfigurationManagementOperations: ResourceInstanceConfigurationManagementOperations =
  {
    setConfigurationOperation(state, action) {
          const existingIndex = state.configuration.findIndex(c => c.key === action.input.key);
          if (existingIndex !== -1) {
              state.configuration[existingIndex] = {
                  id: action.input.id,
                  key: action.input.key,
                  value: action.input.value,
                  source: action.input.source
              };
          } else {
              state.configuration.push({
                  id: action.input.id,
                  key: action.input.key,
                  value: action.input.value,
                  source: action.input.source
              });
          }
          state.lastModified = action.input.lastModified;
      },
    removeConfigurationOperation(state, action) {
        const configIndex = state.configuration.findIndex(c => c.key === action.input.key);
        if (configIndex !== -1) {
            state.configuration.splice(configIndex, 1);
        }
        state.lastModified = action.input.lastModified;
    },
  };

import type { ServiceOfferingOfferingManagementOperations } from "resourceServices/document-models/service-offering";

export const serviceOfferingOfferingManagementOperations: ServiceOfferingOfferingManagementOperations = {
    updateOfferingInfoOperation(state, action) {
        if (action.input.title) {
            state.title = action.input.title;
        }
        if (action.input.summary) {
            state.summary = action.input.summary;
        }
        if (action.input.infoLink !== undefined && action.input.infoLink !== null) {
            state.infoLink = action.input.infoLink;
        }
        state.lastModified = action.input.lastModified;
    },
    updateOfferingStatusOperation(state, action) {
        state.status = action.input.status;
        state.lastModified = action.input.lastModified;
    },
    setOperatorOperation(state, action) {
        state.operatorId = action.input.operatorId;
        state.lastModified = action.input.lastModified;
    },
    setOfferingIdOperation(state, action) {
        state.id = action.input.id;
        state.lastModified = action.input.lastModified;
    }
};

export type ErrorCode =
  | "FacetPresetNotFoundError"
  | "AddPresetOptionNotFoundError"
  | "RemovePresetOptionNotFoundError";

export interface ReducerError {
  errorCode: ErrorCode;
}

export class FacetPresetNotFoundError extends Error implements ReducerError {
  errorCode = "FacetPresetNotFoundError" as ErrorCode;
  constructor(message = "FacetPresetNotFoundError") {
    super(message);
  }
}

export class AddPresetOptionNotFoundError
  extends Error
  implements ReducerError
{
  errorCode = "AddPresetOptionNotFoundError" as ErrorCode;
  constructor(message = "AddPresetOptionNotFoundError") {
    super(message);
  }
}

export class RemovePresetOptionNotFoundError
  extends Error
  implements ReducerError
{
  errorCode = "RemovePresetOptionNotFoundError" as ErrorCode;
  constructor(message = "RemovePresetOptionNotFoundError") {
    super(message);
  }
}

export const errors = {
  RemoveFacetPreset: {
    FacetPresetNotFoundError,
  },
  AddPresetOption: {
    AddPresetOptionNotFoundError,
  },
  RemovePresetOption: {
    RemovePresetOptionNotFoundError,
  },
};

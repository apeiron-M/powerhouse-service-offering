export type ErrorCode =
  | "DuplicateFaqIdError"
  | "FaqNotFoundError"
  | "DeleteFaqNotFoundError";

export interface ReducerError {
  errorCode: ErrorCode;
}

export class DuplicateFaqIdError extends Error implements ReducerError {
  errorCode = "DuplicateFaqIdError" as ErrorCode;
  constructor(message = "DuplicateFaqIdError") {
    super(message);
  }
}

export class FaqNotFoundError extends Error implements ReducerError {
  errorCode = "FaqNotFoundError" as ErrorCode;
  constructor(message = "FaqNotFoundError") {
    super(message);
  }
}

export class DeleteFaqNotFoundError extends Error implements ReducerError {
  errorCode = "DeleteFaqNotFoundError" as ErrorCode;
  constructor(message = "DeleteFaqNotFoundError") {
    super(message);
  }
}

export const errors = {
  AddFaqItem: {
    DuplicateFaqIdError,
  },
  UpdateFaqItem: {
    FaqNotFoundError,
  },
  DeleteFaqItem: {
    DeleteFaqNotFoundError,
  },
};

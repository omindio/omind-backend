import { AppError } from "@libraries/error-handler";

export default class SamePasswordError extends AppError {
    constructor(message) {
      super(message || 'New password need to be different than old.', 404);
    }
}
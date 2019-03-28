import { AppError } from "@libraries/error-handler";

export default class UnauthorizedAccessError extends AppError {
    constructor(message) {
      super(message || 'Invalid credentials.', 401);
    }
}
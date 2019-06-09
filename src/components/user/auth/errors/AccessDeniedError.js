import { AppError } from "@libraries/error-handler";

export default class AccessDeniedError extends AppError {
    constructor(message) {
      super(message || 'Access denied. Insufficient permission.', 403);
    }
}
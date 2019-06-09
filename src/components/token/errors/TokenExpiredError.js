import { AppError } from "@libraries/error-handler";

export default class TokenExpiredError extends AppError {
    constructor(message) {
      super(message || 'Token has expired.', 404);
    }
}
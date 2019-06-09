import { AppError } from "@libraries/error-handler";

export default class UserVerifiedError extends AppError {
    constructor(message) {
      super(message || 'User is verified.', 404);
    }
}
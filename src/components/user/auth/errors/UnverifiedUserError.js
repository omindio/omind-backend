import { AppError } from "@libraries/error-handler";

export default class UnverifiedUserError extends AppError {
    constructor(message) {
      super(message || 'Unverified User.', 401);
    }
}
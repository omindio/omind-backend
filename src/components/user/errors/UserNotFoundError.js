import { AppError } from "@libraries/error-handler";

export default class UserNotFound extends AppError {
    constructor(message) {
      super(message || 'User not found.', 404);
    }
}
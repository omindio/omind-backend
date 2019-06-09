import { AppError } from "@libraries/error-handler";

export default class EmailAlreadyExistsError extends AppError {
    constructor(message) {
      super(message || 'Email already exists.', 404);
    }
}
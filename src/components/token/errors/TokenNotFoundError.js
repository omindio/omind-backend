import { AppError } from "@libraries/error-handler";

export default class TokenNotFound extends AppError {
    constructor(message) {
      super(message || 'Token not found.', 404);
    }
}
import { AppError } from '@libraries/Error';

export default class UserVerifiedError extends AppError {
  constructor(message) {
    super(message || 'User is verified.', 404);
  }
}

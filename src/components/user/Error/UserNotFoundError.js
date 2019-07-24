import { AppError } from '@libraries/Error';

export default class UserNotFoundError extends AppError {
  constructor(message) {
    super(message || 'User not found.', 404);
  }
}

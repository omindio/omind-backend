import { AppError } from '@libraries/Error';

export default class UserNotFound extends AppError {
  constructor(message) {
    super(message || 'User not found.', 404);
  }
}

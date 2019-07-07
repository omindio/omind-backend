import { AppError } from '@libraries/Error';

export default class UnauthorizedAccessError extends AppError {
  constructor(message) {
    super(message || 'Invalid credentials.', 401);
  }
}

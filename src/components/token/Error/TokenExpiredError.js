import { AppError } from '@libraries/Error';

export default class TokenExpiredError extends AppError {
  constructor(message) {
    super(message || 'Token has expired.', 404);
  }
}

import { AppError } from '@libraries/Error';

export default class TokenNotFoundError extends AppError {
  constructor(message) {
    super(message || 'Token not found.', 404);
  }
}

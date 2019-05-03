import { AppError } from '@libraries/Error';

export default class TokenNotFound extends AppError {
  constructor(message) {
    super(message || 'Token not found.', 404);
  }
}

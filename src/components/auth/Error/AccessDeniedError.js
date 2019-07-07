import { AppError } from '@libraries/Error';

export default class AccessDeniedError extends AppError {
  constructor(message) {
    super(message || 'Access denied. Insufficient permission.', 403);
  }
}

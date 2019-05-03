import { AppError } from '@libraries/Error';

export default class UnverifiedUserError extends AppError {
  constructor(message) {
    super(message || 'Unverified User.', 401);
  }
}

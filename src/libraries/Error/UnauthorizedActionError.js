import AppError from './AppError';

export default class UnauthorizedActionError extends AppError {
  constructor(message) {
    super(message || 'Unauthorized Action.', 403);
  }
}

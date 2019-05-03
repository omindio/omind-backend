import AppError from './AppError';

export default class InstanceofError extends AppError {
  constructor(message) {
    super(message || 'Invalid instance.', 500);
  }
}

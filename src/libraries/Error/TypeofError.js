import AppError from './AppError';

export default class TypeofError extends AppError {
  constructor(message) {
    super(message || 'Invalid Type.', 500);
  }
}

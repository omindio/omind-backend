import { AppError } from '@libraries/Error';

export default class EmailAlreadyExistsError extends AppError {
  constructor(message) {
    super(message || 'Email already exists.', 404);
  }
}

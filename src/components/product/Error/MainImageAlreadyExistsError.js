import { AppError } from '@libraries/Error';

export default class MainImageAlreadyExistsError extends AppError {
  constructor(message) {
    super(message || 'Main Image already exists.', 404);
  }
}

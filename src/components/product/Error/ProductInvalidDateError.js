import { AppError } from '@libraries/Error';

export default class ProductInvalidDateError extends AppError {
  constructor(message) {
    super(message || 'Invalid date format.', 404);
  }
}

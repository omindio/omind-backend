import { AppError } from '@libraries/Error';

export default class ProductAlreadyExistsError extends AppError {
  constructor(message) {
    super(message || 'Product already exists.', 404);
  }
}

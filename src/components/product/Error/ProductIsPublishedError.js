import { AppError } from '@libraries/Error';

export default class ProductIsPublishedError extends AppError {
  constructor(message) {
    super(message || 'Can not remove a published Product.', 404);
  }
}

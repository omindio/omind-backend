import { AppError } from '@libraries/Error';

export default class ImageNotFoundError extends AppError {
  constructor(message) {
    super(message || 'Image does not exists.', 404);
  }
}

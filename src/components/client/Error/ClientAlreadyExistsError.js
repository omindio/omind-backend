import { AppError } from '@libraries/Error';

export default class ClientAlreadyExistsError extends AppError {
  constructor(message) {
    super(message || 'Client already exists.', 404);
  }
}

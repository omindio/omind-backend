import { AppError } from '@libraries/Error';

export default class BankAccountNotFoundError extends AppError {
  constructor(message) {
    super(message || 'Bank Account not found.', 404);
  }
}

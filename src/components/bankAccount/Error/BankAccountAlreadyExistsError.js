import { AppError } from '@libraries/Error';

export default class BankAccountAlreadyExistsError extends AppError {
  constructor(message) {
    super(message || 'Bank Account already exists.', 404);
  }
}

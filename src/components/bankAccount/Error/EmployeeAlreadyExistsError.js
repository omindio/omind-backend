import { AppError } from '@libraries/Error';

export default class EmployeeAlreadyExistsError extends AppError {
  constructor(message) {
    super(message || 'Employee already exists.', 404);
  }
}

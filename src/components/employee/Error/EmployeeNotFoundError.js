import { AppError } from '@libraries/Error';

export default class EmployeeNotFoundError extends AppError {
  constructor(message) {
    super(message || 'Employee not found.', 404);
  }
}

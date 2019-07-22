import { AppError } from '@libraries/Error';

export default class ProjectAlreadyExistsError extends AppError {
  constructor(message) {
    super(message || 'Project already exists.', 404);
  }
}

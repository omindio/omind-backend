import { AppError } from '@libraries/Error';

export default class ProjectNotFoundError extends AppError {
  constructor(message) {
    super(message || 'Project not found.', 404);
  }
}

import { AppError } from '@libraries/Error';

export default class ProjectNotFound extends AppError {
  constructor(message) {
    super(message || 'Project not found.', 404);
  }
}

import AppError from './AppError';

export default class MissingParameterError extends AppError {
  constructor(params = []) {
    super('Missing Parameters: ' + params.join(), 400);
  }
}

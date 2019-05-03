import { AppError } from '@libraries/Error';

export default class InvalidTypeError extends AppError {
  constructor(parameter, type) {
    super(parameter + ' need to be valid ' + type, 400);
  }
}

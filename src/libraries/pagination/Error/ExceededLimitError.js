import { AppError } from '@libraries/Error';

export default class ExceededLimitError extends AppError {
  constructor(limit) {
    super('Limit can not set more than ' + limit, 400);
  }
}

import AppError from './AppError';

export default class UndefinedPropertyError extends AppError {
  constructor(property) {
    super('Undefined property: ' + property, 500);
  }
}

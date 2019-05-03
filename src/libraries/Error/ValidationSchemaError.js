import AppError from './AppError';

export default class ValidationSchemaError extends AppError {
  constructor(error) {
    let errors = {};
    if (typeof error === 'object') {
      errors = error.details.map(({ message, path }) => ({
        path: path.join(),
        message: message.replace(/['"]/g, ''),
      }));

      /*
        Group errors from PATH.
      */
      errors = errors.reduce(
        (objectsByKeyValue, obj) => ({
          ...objectsByKeyValue,
          [obj.path]: (objectsByKeyValue[obj.path] || []).concat(obj.message),
        }),
        {},
      );
    }

    super(JSON.stringify(errors) || 'Error in validation Schema.', 400);
  }
}

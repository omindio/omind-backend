import AppError from "./AppError";

export default class ValidationSchemaError extends AppError {
    constructor(error) {
      if (typeof error === 'object') {
        error = JSON.stringify(
          error.details.map(({message})=> ({
              message: message.replace(/['"]/g, '')
          }))
        );
      }

      super(error || 'Error in validation Schema.', 400);
    }
}
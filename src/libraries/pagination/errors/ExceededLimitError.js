
import { AppError } from "@libraries/error-handler";

export default class ExceededLimitError extends AppError {
    constructor(limit) {
      super('Limit can not set more than '+limit, 400);
    }
}
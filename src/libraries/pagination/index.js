import { ExceededLimitError, InvalidTypeError } from './Error';

export const initialize = async (page, limit) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  if (page === 0) page = 1;

  validate(page, limit);

  return {
    page: page,
    limit: limit,
    skip: limit * (page - 1),
  };
};

const validate = (page, limit) => {
  if (!Number.isInteger(page)) throw new ExceededLimitError('page', 'integer');
  if (!Number.isInteger(limit)) throw new InvalidTypeError('limit', 'integer');
  if (limit > 100) throw new ExceededLimitError('100');
};

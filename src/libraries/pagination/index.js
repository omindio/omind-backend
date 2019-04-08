import { ExceededLimitError, InvalidTypeError } from './errors';

export const initialize = async (page, limit) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    if(page === 0)
        page = 1;

    try{
        _validate(page, limit);
    } catch (err) {
        throw err;
    }
    
    return {
        page: page,
        limit: limit,
        skip: limit*(page-1)
    }
};

const _validate = (page, limit) => {
    if (!Number.isInteger(page))
        throw new ExceededLimitError('page', 'integer');
    if (!Number.isInteger(limit))
        throw new InvalidTypeError('limit', 'integer');
    if (limit > 100)
        throw new ExceededLimitError('100');
}
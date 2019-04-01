import Winston from '@libraries/winston';

export const initialize = (app) => {
    app.use((err, req, res, next) => {   
        const status = err.status || 500;
        const error = {
            id: req.correlationId(),
            info: `${req.ip} - -\"${req.method} ${req.originalUrl} HTTP/${req.httpVersion}\" ${err.status ||
                500} - ${req.headers["user-agent"]}`,
            status: status,
            type: err.name || 'Internal Server Error',
            error: err.message || err,
        };
        //print error on log file
        Winston.error(JSON.stringify(error));     
        //http response    
        res.status(status).json(error);
    });    
}

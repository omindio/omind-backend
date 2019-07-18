import Winston from '@libraries/winston';

//TODO: Add info param to Log. Doesn't show response.
export const initialize = app => {
  app.use((err, req, res, next) => {
    const status = err.status || 500;
    const error = {
      id: req.correlationId(),
      status: status,
      type: err.name || 'Internal Server Error',
      message: err.message || err,
    };
    //http response
    res.status(status).json(error);

    error.info = `${req.ip} - -\"${req.method} ${req.originalUrl} HTTP/${
      req.httpVersion
    }\" ${err.status || 500} - ${req.headers['user-agent']}`;

    //print error on log file
    if (err.status === 500) {
      Winston.error(JSON.stringify(error));
    }
  });
};

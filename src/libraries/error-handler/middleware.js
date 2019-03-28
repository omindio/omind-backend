//TODO: Register error logs in file or db
export const initialize = (app) => {
    app.use((err, req, res, next) => {
        if (!err.status) err.status = 500;

        res.status(err.status).json({
            status: err.status,
            type: err.name,
            error: err.message
        });
    });
}
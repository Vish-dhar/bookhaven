// Small helper: create an Error that carries an HTTP status code.
// Services throw it, controllers read error.status.

const createError = (message, status) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

module.exports = createError;

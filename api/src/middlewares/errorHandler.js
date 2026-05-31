// Middleware para capturar y estandarizar los errores en toda la aplicación
const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${err.message}`);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Error interno del servidor';

    res.status(statusCode).json({
        error: true,
        message: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = errorHandler;

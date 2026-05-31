const jwt = require('jsonwebtoken');

// Middleware para verificar si existe y es válido el token JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // El token suele venir en el formato "Bearer <token>"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ error: true, message: 'Se requiere un token de autenticación (Bearer)' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verificar el token con la firma
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded; // Guardar la información del usuario en la request
        next();
    } catch (error) {
        return res.status(401).json({ error: true, message: 'Token inválido o expirado' });
    }
};

// Middleware Factory para verificar roles específicos
const checkRole = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(500).json({ error: true, message: 'No se ha verificado el token del usuario' });
        }

        // Si el rol del usuario está dentro de los roles permitidos
        if (rolesPermitidos.includes(req.usuario.rol_nombre)) {
            next();
        } else {
            return res.status(403).json({ error: true, message: 'No tiene los permisos necesarios (Rol requerido)' });
        }
    };
};

module.exports = {
    verifyToken,
    checkRole
};

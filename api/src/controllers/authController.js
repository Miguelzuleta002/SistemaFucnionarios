const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsuarioDAO = require('../dao/UsuarioDAO');

class AuthController {
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: true, message: 'Email y contraseña son requeridos' });
            }

            // 1. Buscar el usuario
            const usuario = await UsuarioDAO.findByEmail(email);
            if (!usuario) {
                return res.status(401).json({ error: true, message: 'Credenciales inválidas' });
            }

            // 2. Verificar la contraseña
            const validPassword = await bcrypt.compare(password, usuario.password);
            if (!validPassword) {
                return res.status(401).json({ error: true, message: 'Credenciales inválidas' });
            }

            // 3. Generar token JWT
            const payload = {
                id: usuario.id,
                email: usuario.email,
                rol_id: usuario.rol_id,
                rol_nombre: usuario.rol_nombre
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN || '24h'
            });

            // 4. Retornar token e información básica del usuario
            res.json({
                error: false,
                message: 'Autenticación exitosa',
                data: {
                    token,
                    usuario: {
                        id: usuario.id,
                        email: usuario.email,
                        rol: usuario.rol_nombre
                    }
                }
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController;

const pool = require('../config/db');

class UsuarioDAO {
    // Buscar usuario por su correo electrónico (incluyendo la información de su rol)
    static async findByEmail(email) {
        const query = `
            SELECT u.id, u.email, u.password, u.rol_id, r.nombre as rol_nombre
            FROM usuarios u
            INNER JOIN roles r ON u.rol_id = r.id
            WHERE u.email = ?
        `;
        const [rows] = await pool.execute(query, [email]);
        return rows[0]; // Retorna el usuario o undefined si no existe
    }

    // Crear un nuevo usuario
    static async create(userData) {
        const { email, password, rol_id } = userData;
        const query = `INSERT INTO usuarios (email, password, rol_id) VALUES (?, ?, ?)`;
        const [result] = await pool.execute(query, [email, password, rol_id]);
        return result.insertId;
    }
    
    // Obtener roles disponibles para validación
    static async getRoleByName(nombre) {
        const query = `SELECT id, nombre FROM roles WHERE nombre = ?`;
        const [rows] = await pool.execute(query, [nombre]);
        return rows[0];
    }
}

module.exports = UsuarioDAO;

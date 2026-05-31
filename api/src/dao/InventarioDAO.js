const pool = require('../config/db');

class InventarioDAO {
    static async getAll() {
        const query = `
            SELECT i.id, i.serial, i.modelo, i.descripcion, i.color, i.precio, 
                   u.email as usuario_encargado, m.nombre as marca, 
                   e.nombre as estado, t.nombre as tipo
            FROM inventarios i
            LEFT JOIN usuarios u ON i.usuario_id = u.id
            LEFT JOIN marcas m ON i.marca_id = m.id
            LEFT JOIN estados_equipos e ON i.estado_equipo_id = e.id
            LEFT JOIN tipos_equipos t ON i.tipo_equipo_id = t.id
            ORDER BY i.id DESC
        `;
        const [rows] = await pool.execute(query);
        return rows;
    }

    static async create(data, usuario_id) {
        const { serial, modelo, descripcion, color, precio, marca_id, estado_equipo_id, tipo_equipo_id } = data;
        const query = `
            INSERT INTO inventarios (serial, modelo, descripcion, color, precio, usuario_id, marca_id, estado_equipo_id, tipo_equipo_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.execute(query, [
            serial, modelo, descripcion || null, color || null, precio || 0, 
            usuario_id, marca_id, estado_equipo_id, tipo_equipo_id
        ]);
        return result.insertId;
    }

    static async update(id, data) {
        const { serial, modelo, descripcion, color, precio, marca_id, estado_equipo_id, tipo_equipo_id } = data;
        const query = `
            UPDATE inventarios 
            SET serial=?, modelo=?, descripcion=?, color=?, precio=?, marca_id=?, estado_equipo_id=?, tipo_equipo_id=?
            WHERE id = ?
        `;
        const [result] = await pool.execute(query, [
            serial, modelo, descripcion || null, color || null, precio || 0, 
            marca_id, estado_equipo_id, tipo_equipo_id, id
        ]);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const query = 'DELETE FROM inventarios WHERE id = ?';
        const [result] = await pool.execute(query, [id]);
        return result.affectedRows > 0;
    }

    static async getOpciones() {
        const [marcas] = await pool.execute('SELECT id, nombre FROM marcas');
        const [estados] = await pool.execute('SELECT id, nombre FROM estados_equipos');
        const [tipos] = await pool.execute('SELECT id, nombre FROM tipos_equipos');
        return { marcas, estados, tipos };
    }
}

module.exports = InventarioDAO;

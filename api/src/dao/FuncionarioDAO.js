const pool = require('../config/db');

class FuncionarioDAO {
    static async getAll() {
        const query = 'SELECT * FROM funcionarios WHERE estado = 1 ORDER BY id DESC';
        const [rows] = await pool.execute(query);
        return rows;
    }

    static async getById(id) {
        const query = 'SELECT * FROM funcionarios WHERE id = ? AND estado = 1';
        const [rows] = await pool.execute(query, [id]);
        return rows[0];
    }

    static async create(data) {
        const { nombres, apellidos, documento, email, telefono, direccion } = data;
        const query = `
            INSERT INTO funcionarios (nombres, apellidos, documento, email, telefono, direccion) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.execute(query, [
            nombres, apellidos, documento, email, telefono, direccion || null
        ]);
        return result.insertId;
    }

    static async update(id, data) {
        const { nombres, apellidos, documento, email, telefono, direccion } = data;
        const query = `
            UPDATE funcionarios 
            SET nombres = ?, apellidos = ?, documento = ?, email = ?, telefono = ?, direccion = ?
            WHERE id = ? AND estado = 1
        `;
        const [result] = await pool.execute(query, [
            nombres, apellidos, documento, email, telefono, direccion || null, id
        ]);
        return result.affectedRows > 0;
    }

    // Usaremos un borrado lógico (Soft delete) cambiando el estado a 0
    static async delete(id) {
        const query = 'UPDATE funcionarios SET estado = 0 WHERE id = ?';
        const [result] = await pool.execute(query, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = FuncionarioDAO;

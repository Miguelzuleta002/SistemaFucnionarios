const FuncionarioDAO = require('../dao/FuncionarioDAO');

class FuncionarioController {
    static async listar(req, res, next) {
        try {
            const funcionarios = await FuncionarioDAO.getAll();
            res.json({ error: false, data: funcionarios });
        } catch (error) {
            next(error);
        }
    }

    static async obtenerPorId(req, res, next) {
        try {
            const id = req.params.id;
            const funcionario = await FuncionarioDAO.getById(id);
            if (!funcionario) {
                return res.status(404).json({ error: true, message: 'Funcionario no encontrado' });
            }
            res.json({ error: false, data: funcionario });
        } catch (error) {
            next(error);
        }
    }

    static async crear(req, res, next) {
        try {
            const { nombres, apellidos, documento, email, telefono, direccion } = req.body;
            
            // Validaciones básicas
            if (!nombres || !apellidos || !documento || !email) {
                return res.status(400).json({ error: true, message: 'Faltan campos obligatorios (nombres, apellidos, documento, email)' });
            }

            const insertId = await FuncionarioDAO.create(req.body);
            res.status(201).json({ error: false, message: 'Funcionario creado', data: { id: insertId } });
        } catch (error) {
            // Manejar error de documento o email duplicado de MySQL
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: true, message: 'El documento o correo electrónico ya está registrado' });
            }
            next(error);
        }
    }

    static async editar(req, res, next) {
        try {
            const id = req.params.id;
            const actualizado = await FuncionarioDAO.update(id, req.body);
            
            if (!actualizado) {
                return res.status(404).json({ error: true, message: 'Funcionario no encontrado o no se pudo actualizar' });
            }
            
            res.json({ error: false, message: 'Funcionario actualizado correctamente' });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: true, message: 'El documento o correo electrónico ya está registrado' });
            }
            next(error);
        }
    }

    static async eliminar(req, res, next) {
        try {
            const id = req.params.id;
            const eliminado = await FuncionarioDAO.delete(id);
            
            if (!eliminado) {
                return res.status(404).json({ error: true, message: 'Funcionario no encontrado' });
            }
            
            res.json({ error: false, message: 'Funcionario eliminado correctamente' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = FuncionarioController;

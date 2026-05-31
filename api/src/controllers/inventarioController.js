const InventarioDAO = require('../dao/InventarioDAO');

class InventarioController {
    static async listar(req, res, next) {
        try {
            const inventarios = await InventarioDAO.getAll();
            res.json({ error: false, data: inventarios });
        } catch (error) {
            next(error);
        }
    }

    static async obtenerOpciones(req, res, next) {
        try {
            const opciones = await InventarioDAO.getOpciones();
            res.json({ error: false, data: opciones });
        } catch (error) {
            next(error);
        }
    }

    static async crear(req, res, next) {
        try {
            const { serial, modelo, marca_id, estado_equipo_id, tipo_equipo_id } = req.body;
            if (!serial || !modelo || !marca_id || !estado_equipo_id || !tipo_equipo_id) {
                return res.status(400).json({ error: true, message: 'Faltan campos obligatorios' });
            }
            
            // Usaremos el ID del usuario que hace la petición como usuario encargado
            const usuario_id = req.usuario.id; 
            
            const insertId = await InventarioDAO.create(req.body, usuario_id);
            res.status(201).json({ error: false, message: 'Inventario creado', data: { id: insertId } });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: true, message: 'El serial del inventario ya existe' });
            }
            next(error);
        }
    }

    static async editar(req, res, next) {
        try {
            const id = req.params.id;
            const actualizado = await InventarioDAO.update(id, req.body);
            if (!actualizado) {
                return res.status(404).json({ error: true, message: 'Inventario no encontrado' });
            }
            res.json({ error: false, message: 'Inventario actualizado' });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: true, message: 'El serial ya existe en otro registro' });
            }
            next(error);
        }
    }

    static async eliminar(req, res, next) {
        try {
            const id = req.params.id;
            const eliminado = await InventarioDAO.delete(id);
            if (!eliminado) {
                return res.status(404).json({ error: true, message: 'Inventario no encontrado' });
            }
            res.json({ error: false, message: 'Inventario eliminado' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = InventarioController;

const express = require('express');
const router = express.Router();
const InventarioController = require('../controllers/inventarioController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

router.use(verifyToken);

// Docentes y Administradores
router.get('/', checkRole(['Administrador', 'Docente']), InventarioController.listar);

// Solo Administradores
router.get('/opciones', checkRole(['Administrador']), InventarioController.obtenerOpciones);
router.post('/', checkRole(['Administrador']), InventarioController.crear);
router.put('/:id', checkRole(['Administrador']), InventarioController.editar);
router.delete('/:id', checkRole(['Administrador']), InventarioController.eliminar);

module.exports = router;

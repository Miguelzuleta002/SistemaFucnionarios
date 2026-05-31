const express = require('express');
const router = express.Router();
const FuncionarioController = require('../controllers/funcionarioController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// Todas las rutas de funcionarios requieren autenticación y rol de Administrador
// "Solo debe permitir [al docente] listar inventarios", por lo tanto funcionarios es de Admin.
router.use(verifyToken);
router.use(checkRole(['Administrador']));

// Rutas CRUD
router.get('/', FuncionarioController.listar);
router.get('/:id', FuncionarioController.obtenerPorId);
router.post('/', FuncionarioController.crear);
router.put('/:id', FuncionarioController.editar);
router.delete('/:id', FuncionarioController.eliminar);

module.exports = router;

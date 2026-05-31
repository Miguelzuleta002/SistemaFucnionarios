const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// Ruta para iniciar sesión (Abierta)
router.post('/login', AuthController.login);

module.exports = router;

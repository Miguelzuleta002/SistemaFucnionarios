require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json()); // Parseo de JSON

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'API del Sistema de Gestión de Funcionarios en ejecución' });
});

// Importación de rutas (Se agregarán en la Fase 3 y 4)
const authRoutes = require('./routes/auth.routes');
const funcionariosRoutes = require('./routes/funcionarios.routes');
const inventariosRoutes = require('./routes/inventarios.routes');

app.use('/api/auth', authRoutes);
app.use('/api/funcionarios', funcionariosRoutes);
app.use('/api/inventarios', inventariosRoutes);

// Middleware de manejo de errores (siempre al final de las rutas)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});

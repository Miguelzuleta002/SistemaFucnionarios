const mysql = require('mysql2/promise');
require('dotenv').config();

// Crear el pool de conexiones a la base de datos
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sistema_funcionarios',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Probar la conexión inicial
pool.getConnection()
    .then(connection => {
        console.log('✅ Base de datos conectada exitosamente');
        connection.release();
    })
    .catch(error => {
        console.error('❌ Error al conectar a la base de datos:', error.message);
    });

module.exports = pool;

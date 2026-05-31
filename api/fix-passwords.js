const pool = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function fix() {
    try {
        const hash = await bcrypt.hash('admin123', 10);
        await pool.execute('UPDATE usuarios SET password = ?', [hash]);
        console.log('✅ Contraseñas actualizadas a admin123.');
    } catch (e) {
        console.error('Error:', e);
    } finally {
        process.exit(0);
    }
}
fix();

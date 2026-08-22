const db = require('../config/db');

class AdminTextosModel {
    static getAll() {
        const rows = db.prepare('SELECT * FROM ConfiguracionTextos').all();
        const obj = {};
        rows.forEach(r => obj[r.clave] = r.valor);
        return obj;
    }

    static updateAll(data) {
        // SQLite upsert
        const stmt = db.prepare('INSERT INTO ConfiguracionTextos (clave, valor) VALUES (?, ?) ON CONFLICT(clave) DO UPDATE SET valor = excluded.valor');
        const updateMany = db.transaction((textos) => {
            for (const [key, value] of Object.entries(textos)) {
                stmt.run(key, value);
            }
        });
        updateMany(data);
    }
}
module.exports = AdminTextosModel;

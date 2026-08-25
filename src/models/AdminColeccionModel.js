const db = require('../config/db');

class AdminColeccionModel {
    static getAll() {
        return db.prepare('SELECT * FROM Coleccion ORDER BY orden ASC').all();
    }
    
    static create(data) {
        const stmt = db.prepare(`
            INSERT INTO Coleccion (nombre, descripcion, imagen_inspiracion_url, orden, administrador_id)
            VALUES (?, ?, ?, ?, ?)
        `);
        const info = stmt.run(data.nombre, data.descripcion || '', data.imagen_inspiracion_url || '', data.orden || 0, data.administrador_id);
        return info.lastInsertRowid;
    }

    static update(id, data) {
        const stmt = db.prepare(`
            UPDATE Coleccion 
            SET nombre = ?, descripcion = ?, imagen_inspiracion_url = ?, orden = ?
            WHERE id = ?
        `);
        const info = stmt.run(data.nombre, data.descripcion || '', data.imagen_inspiracion_url || '', data.orden || 0, id);
        return info.changes;
    }

    static delete(id) {
        // Also update trabajos to remove coleccion_id
        db.prepare('UPDATE Trabajo SET coleccion_id = NULL WHERE coleccion_id = ?').run(id);
        const stmt = db.prepare('DELETE FROM Coleccion WHERE id = ?');
        const info = stmt.run(id);
        return info.changes;
    }
}
module.exports = AdminColeccionModel;

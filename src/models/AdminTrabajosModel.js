const db = require('../config/db');

class AdminTrabajosModel {
    static getAll() {
        return db.prepare('SELECT * FROM Trabajo ORDER BY id DESC').all();
    }
    
    static create(data) {
        const stmt = db.prepare(`
            INSERT INTO Trabajo (titulo, descripcion, imagen_url, imagenes_extra, categoria, orden, coleccion_id, administrador_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const info = stmt.run(data.titulo, data.descripcion || '', data.imagen_url, data.imagenes_extra || '[]', data.categoria || '', data.orden || 0, data.coleccion_id, data.administrador_id);
        return info.lastInsertRowid;
    }

    static update(id, data) {
        const stmt = db.prepare(`
            UPDATE Trabajo 
            SET titulo = ?, descripcion = ?, imagen_url = ?, imagenes_extra = ?, categoria = ?, orden = ?, coleccion_id = ?
            WHERE id = ?
        `);
        const info = stmt.run(data.titulo, data.descripcion || '', data.imagen_url, data.imagenes_extra || '[]', data.categoria || '', data.orden || 0, data.coleccion_id, id);
        return info.changes;
    }

    static delete(id) {
        const stmt = db.prepare('DELETE FROM Trabajo WHERE id = ?');
        const info = stmt.run(id);
        return info.changes;
    }
}
module.exports = AdminTrabajosModel;

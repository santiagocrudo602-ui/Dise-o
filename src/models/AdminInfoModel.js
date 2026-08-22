const db = require('../config/db');

class AdminInfoModel {
    static updatePerfil(data) {
        const stmt = db.prepare('UPDATE PerfilInfo SET texto_sobre_mi = ?, foto_perfil_url = ? WHERE id = (SELECT id FROM PerfilInfo LIMIT 1)');
        return stmt.run(data.texto_sobre_mi || '', data.foto_perfil_url || '').changes;
    }

    static getContactos() {
        return db.prepare('SELECT * FROM Contacto').all();
    }

    static createContacto(data) {
        const stmt = db.prepare('INSERT INTO Contacto (tipo, valor, visible, perfil_info_id) VALUES (?, ?, ?, (SELECT id FROM PerfilInfo LIMIT 1))');
        return stmt.run(data.tipo, data.valor, data.visible !== undefined ? data.visible : 1).lastInsertRowid;
    }

    static updateContacto(id, data) {
        const updates = [];
        const values = [];
        if (data.valor !== undefined) {
            updates.push('valor = ?');
            values.push(data.valor);
        }
        if (data.visible !== undefined) {
            updates.push('visible = ?');
            values.push(data.visible);
        }
        if (updates.length === 0) return 0;
        
        values.push(id);
        const stmt = db.prepare(`UPDATE Contacto SET ${updates.join(', ')} WHERE id = ?`);
        return stmt.run(...values).changes;
    }

    static deleteContacto(id) {
        const stmt = db.prepare('DELETE FROM Contacto WHERE id = ?');
        return stmt.run(id).changes;
    }
}
module.exports = AdminInfoModel;

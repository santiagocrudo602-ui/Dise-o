const db = require('../config/db');

class PublicModel {
    static getColecciones() {
        return db.prepare('SELECT * FROM Coleccion ORDER BY orden ASC').all();
    }

    static getTrabajos() {
        return db.prepare('SELECT * FROM Trabajo ORDER BY orden ASC').all();
    }

    static getTrabajoById(id) {
        return db.prepare('SELECT * FROM Trabajo WHERE id = ?').get(id);
    }

    static getPerfil() {
        return db.prepare('SELECT id, texto_sobre_mi, foto_perfil_url FROM PerfilInfo LIMIT 1').get();
    }

    static getContactosVisibles() {
        return db.prepare('SELECT id, tipo, valor FROM Contacto WHERE visible = 1').all();
    }
}

module.exports = PublicModel;

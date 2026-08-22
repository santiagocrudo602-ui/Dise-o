const db = require('../config/db');

class AdminModel {
    static getAdmin(usuario) {
        const stmt = db.prepare('SELECT * FROM Administrador WHERE usuario = ?');
        return stmt.get(usuario);
    }

    static getAdminById(id) {
        const stmt = db.prepare('SELECT * FROM Administrador WHERE id = ?');
        return stmt.get(id);
    }

    static update2FA(id, secret, habilitado) {
        const stmt = db.prepare('UPDATE Administrador SET twofa_secret = ?, twofa_habilitado = ? WHERE id = ?');
        return stmt.run(secret, habilitado, id);
    }
}

module.exports = AdminModel;

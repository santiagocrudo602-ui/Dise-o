const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const AdminModel = require('../models/AdminModel');

const JWT_SECRET = process.env.JWT_SECRET || 'reemplazar_por_un_secreto_seguro';

const login = async (req, res) => {
    const { key } = req.body;
    if (!key) return res.status(401).json({ error: 'Credenciales inválidas' });

    const admin = AdminModel.getAdmin('magnet');
    if (!admin) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(key, admin.password_hash);
    if (!isMatch) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    if (admin.twofa_habilitado === 0) {
        const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: '2h' });
        return res.json({ token, requires2FA: false });
    } else {
        const token = jwt.sign({ adminId: admin.id, stage: 'pending_2fa' }, JWT_SECRET, { expiresIn: '5m' });
        return res.json({ token, requires2FA: true });
    }
};

const verify2FA = (req, res) => {
    const { token_parcial, codigo } = req.body;

    if (!token_parcial || !codigo) {
        return res.status(401).json({ error: 'Faltan datos' });
    }

    try {
        const decoded = jwt.verify(token_parcial, JWT_SECRET);
        if (decoded.stage !== 'pending_2fa') {
            return res.status(401).json({ error: 'Token inválido para esta operación' });
        }

        const admin = AdminModel.getAdminById(decoded.adminId);
        if (!admin || !admin.twofa_secret) {
            return res.status(401).json({ error: '2FA no configurado correctamente' });
        }

        const verified = speakeasy.totp.verify({
            secret: admin.twofa_secret,
            encoding: 'base32',
            token: codigo
        });

        if (verified) {
            const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: '2h' });
            return res.json({ token });
        } else {
            return res.status(401).json({ error: 'Código inválido' });
        }
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

const setup2FA = async (req, res) => {
    const secret = speakeasy.generateSecret({ name: 'Magnet.is Portfolio' });
    AdminModel.update2FA(req.adminId, secret.base32, 0);

    qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
        if (err) return res.status(500).json({ error: 'Error generando QR' });
        res.json({ qrCode: data_url, secret: secret.base32 });
    });
};

const enable2FA = (req, res) => {
    const { codigo } = req.body;
    const admin = AdminModel.getAdminById(req.adminId);

    if (!admin || !admin.twofa_secret) {
        return res.status(400).json({ error: '2FA no iniciado' });
    }

    const verified = speakeasy.totp.verify({
        secret: admin.twofa_secret,
        encoding: 'base32',
        token: codigo
    });

    if (verified) {
        AdminModel.update2FA(req.adminId, admin.twofa_secret, 1);
        res.json({ success: true, message: '2FA habilitado correctamente' });
    } else {
        res.status(400).json({ error: 'Código inválido' });
    }
};

const disable2FA = (req, res) => {
    AdminModel.update2FA(req.adminId, null, 0);
    res.json({ success: true, message: '2FA deshabilitado' });
};

module.exports = {
    login,
    verify2FA,
    setup2FA,
    enable2FA,
    disable2FA
};

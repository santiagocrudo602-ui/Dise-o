const AdminInfoModel = require('../models/AdminInfoModel');

const updatePerfil = (req, res) => {
    const changes = AdminInfoModel.updatePerfil(req.body);
    res.json({ success: true, changes });
};

const getContactos = (req, res) => {
    res.json(AdminInfoModel.getContactos());
};

const createContacto = (req, res) => {
    const { tipo, valor, visible } = req.body;
    if (!['Instagram', 'WhatsApp', 'Email'].includes(tipo) || !valor) {
        return res.status(400).json({ error: 'Datos de contacto inválidos' });
    }
    const id = AdminInfoModel.createContacto({ tipo, valor, visible });
    res.json({ success: true, id });
};

const updateContacto = (req, res) => {
    const { id } = req.params;
    const { valor, visible } = req.body;
    const changes = AdminInfoModel.updateContacto(id, { valor, visible });
    if (changes === 0) return res.status(404).json({ error: 'Contacto no encontrado' });
    res.json({ success: true });
};

const deleteContacto = (req, res) => {
    const { id } = req.params;
    const changes = AdminInfoModel.deleteContacto(id);
    if (changes === 0) return res.status(404).json({ error: 'Contacto no encontrado' });
    res.json({ success: true });
};

module.exports = {
    updatePerfil, getContactos, createContacto, updateContacto, deleteContacto
};

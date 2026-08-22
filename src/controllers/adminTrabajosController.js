const AdminTrabajosModel = require('../models/AdminTrabajosModel');

const getTrabajos = (req, res) => {
    res.json(AdminTrabajosModel.getAll());
};

const createTrabajo = (req, res) => {
    const { titulo, descripcion, imagen_url, categoria, orden } = req.body;
    if (!titulo || !imagen_url) {
        return res.status(400).json({ error: 'Falta título o imagen_url' });
    }
    const id = AdminTrabajosModel.create({
        titulo, descripcion, imagen_url, categoria, orden, administrador_id: req.adminId
    });
    res.json({ success: true, id });
};

const updateTrabajo = (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, imagen_url, categoria, orden } = req.body;
    if (!titulo || !imagen_url) {
        return res.status(400).json({ error: 'Falta título o imagen_url' });
    }
    const changes = AdminTrabajosModel.update(id, {
        titulo, descripcion, imagen_url, categoria, orden
    });
    if (changes === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json({ success: true });
};

const deleteTrabajo = (req, res) => {
    const { id } = req.params;
    const changes = AdminTrabajosModel.delete(id);
    if (changes === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json({ success: true });
};

const uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Falta archivo' });
    }
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
};

module.exports = {
    getTrabajos, createTrabajo, updateTrabajo, deleteTrabajo, uploadImage
};

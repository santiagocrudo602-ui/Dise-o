const AdminColeccionModel = require('../models/AdminColeccionModel');

const getColecciones = (req, res) => {
    res.json(AdminColeccionModel.getAll());
};

const createColeccion = (req, res) => {
    const { nombre, descripcion, imagen_inspiracion_url, orden } = req.body;
    if (!nombre) {
        return res.status(400).json({ error: 'Falta nombre' });
    }
    const id = AdminColeccionModel.create({
        nombre, descripcion, imagen_inspiracion_url, orden, administrador_id: req.adminId
    });
    res.json({ success: true, id });
};

const updateColeccion = (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, imagen_inspiracion_url, orden } = req.body;
    if (!nombre) {
        return res.status(400).json({ error: 'Falta nombre' });
    }
    const changes = AdminColeccionModel.update(id, {
        nombre, descripcion, imagen_inspiracion_url, orden
    });
    if (changes === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json({ success: true });
};

const deleteColeccion = (req, res) => {
    const { id } = req.params;
    const changes = AdminColeccionModel.delete(id);
    if (changes === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json({ success: true });
};

module.exports = {
    getColecciones, createColeccion, updateColeccion, deleteColeccion
};

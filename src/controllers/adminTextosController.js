const AdminTextosModel = require('../models/AdminTextosModel');

const getTextos = (req, res) => {
    res.json(AdminTextosModel.getAll());
};

const updateTextos = (req, res) => {
    try {
        AdminTextosModel.updateAll(req.body);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error actualizando textos' });
    }
};

module.exports = { getTextos, updateTextos };

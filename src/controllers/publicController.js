const PublicModel = require('../models/PublicModel');



const getTrabajos = (req, res) => {
    const trabajos = PublicModel.getTrabajos();
    res.json(trabajos);
};

const getTrabajoById = (req, res) => {
    const trabajo = PublicModel.getTrabajoById(req.params.id);
    if (!trabajo) {
        return res.status(404).json({ error: 'diseño no disponible' });
    }
    res.json(trabajo);
};

const getPerfil = (req, res) => {
    const perfil = PublicModel.getPerfil();
    res.json(perfil || {});
};

const getContactos = (req, res) => {
    const contactos = PublicModel.getContactosVisibles();
    res.json(contactos);
};

module.exports = {
    getTrabajos,
    getTrabajoById,
    getPerfil,
    getContactos
};

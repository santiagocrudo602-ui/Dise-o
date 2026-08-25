const PublicModel = require('../models/PublicModel');

const getColecciones = (req, res) => {
    try {
        const colecciones = PublicModel.getColecciones();
        const trabajos = PublicModel.getTrabajos();
        
        // Group trabajos by coleccion_id
        const coleccionesConTrabajos = colecciones.map(c => {
            return {
                ...c,
                trabajos: trabajos.filter(t => t.coleccion_id === c.id)
            };
        });
        
        // Add "unassigned" works if any (or just as a default collection)
        const unassigned = trabajos.filter(t => !t.coleccion_id);
        if (unassigned.length > 0) {
            coleccionesConTrabajos.push({
                id: null,
                nombre: 'Otros Diseños',
                descripcion: '',
                imagen_inspiracion_url: '',
                trabajos: unassigned
            });
        }
        
        res.json(coleccionesConTrabajos);
    } catch (e) {
        res.status(500).json({ error: 'Error del servidor' });
    }
};

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
    getColecciones,
    getTrabajos,
    getTrabajoById,
    getPerfil,
    getContactos
};

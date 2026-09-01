const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');


router.get('/trabajos', publicController.getTrabajos);
router.get('/trabajos/:id', publicController.getTrabajoById);
router.get('/perfil', publicController.getPerfil);
router.get('/contactos', publicController.getContactos);
// Textos
const adminTextosController = require('../controllers/adminTextosController');
router.get('/textos', adminTextosController.getTextos);

module.exports = router;

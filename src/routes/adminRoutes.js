const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const adminTrabajosController = require('../controllers/adminTrabajosController');
const adminColeccionController = require('../controllers/adminColeccionController');
const adminInfoController = require('../controllers/adminInfoController');
const adminTextosController = require('../controllers/adminTextosController');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../public/uploads/');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Formato de imagen no soportado'), false);
    }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

// Trabajos
router.get('/trabajos', adminTrabajosController.getTrabajos);
router.post('/trabajos', adminTrabajosController.createTrabajo);
router.put('/trabajos/:id', adminTrabajosController.updateTrabajo);
router.delete('/trabajos/:id', adminTrabajosController.deleteTrabajo);
router.post('/upload', upload.single('imagen'), adminTrabajosController.uploadImage);
router.post('/upload-multiple', upload.array('imagenes_extra', 10), adminTrabajosController.uploadMultipleImages);

// Colecciones
router.get('/colecciones', adminColeccionController.getColecciones);
router.post('/colecciones', adminColeccionController.createColeccion);
router.put('/colecciones/:id', adminColeccionController.updateColeccion);
router.delete('/colecciones/:id', adminColeccionController.deleteColeccion);

// Perfil
router.put('/perfil', adminInfoController.updatePerfil);

// Contactos
router.get('/contactos', adminInfoController.getContactos);
router.post('/contactos', adminInfoController.createContacto);
router.put('/contactos/:id', adminInfoController.updateContacto);
router.delete('/contactos/:id', adminInfoController.deleteContacto);

// Textos
router.put('/textos', adminTextosController.updateTextos);

// Manejo de error de multer
router.use((err, req, res, next) => {
    if (err) {
        res.status(400).json({ error: err.message });
    } else {
        next();
    }
});

module.exports = router;

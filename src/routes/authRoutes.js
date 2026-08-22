const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.post('/login', authController.login);
router.post('/verify-2fa', authController.verify2FA);

router.post('/2fa/setup', requireAuth, authController.setup2FA);
router.post('/2fa/enable', requireAuth, authController.enable2FA);
router.post('/2fa/disable', requireAuth, authController.disable2FA);

module.exports = router;

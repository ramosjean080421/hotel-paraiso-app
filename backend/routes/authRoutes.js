const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para que el frontend envíe el token de Google para verificación
router.post('/google-login', authController.googleLogin);

module.exports = router;
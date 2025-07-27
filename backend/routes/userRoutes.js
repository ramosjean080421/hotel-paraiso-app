// backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); 



// Definimos la ruta para el registro de usuarios
// POST /api/users/register
router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/profile', protect, userController.getUserProfile);


module.exports = router;
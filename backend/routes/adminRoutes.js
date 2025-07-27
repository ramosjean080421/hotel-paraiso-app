const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const adminRoomController = require('../controllers/adminRoomController');
const adminController = require('../controllers/adminController'); 
const adminUserController = require('../controllers/adminUserController'); 


// Ruta de prueba
router.get('/test', protect, isAdmin, (req, res) => {
  res.json({ message: '¡Bienvenido, Admin! Has accedido a una ruta protegida.' });
});

// --- Rutas para Gestión de Habitaciones ---
router.post('/rooms', protect, isAdmin, upload.single('image'), adminRoomController.createRoom);
router.put('/rooms/:id', protect, isAdmin, upload.single('image'), adminRoomController.updateRoom);
router.delete('/rooms/:id', protect, isAdmin, adminRoomController.deleteRoom);
router.get('/reservations', protect, isAdmin, adminController.getAllReservations);
router.get('/users', protect, isAdmin, adminUserController.getAllUsers);
router.put('/users/:id', protect, isAdmin, adminUserController.updateUser);
router.put('/users/:id/role', protect, isAdmin, adminUserController.updateUserRole);
router.delete('/users/:id', protect, isAdmin, adminUserController.deleteUser);
router.get('/users/:id', protect, isAdmin, adminUserController.getUserById);

module.exports = router;
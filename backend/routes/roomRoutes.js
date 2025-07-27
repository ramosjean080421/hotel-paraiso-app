// backend/routes/roomRoutes.js
const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// GET /api/rooms - Obtener todas las habitaciones
router.get('/', roomController.getAllRooms);

// GET /api/rooms/:id - Obtener una habitación por ID
router.get('/:id', roomController.getRoomById);

// GET /api/rooms/:id/bookings - Obtener las reservas de una habitación
router.get('/:id/bookings', roomController.getRoomBookings);

module.exports = router;
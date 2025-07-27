// backend/routes/reservationRoutes.js
const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware'); // Importamos nuestro guardia

// POST /api/reservations - Ruta protegida para crear una reserva
router.post('/', protect, reservationController.createReservation);
router.get('/my-reservations', protect, reservationController.getMyReservations);
router.delete('/:id', protect, reservationController.cancelMyReservation);


module.exports = router;
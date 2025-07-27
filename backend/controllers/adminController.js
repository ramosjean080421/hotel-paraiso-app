// backend/controllers/adminController.js

const { Reservation, User, Room } = require('../database/setup');

// Controlador para obtener TODAS las reservas del hotel
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      include: [
        {
          model: User,
          attributes: ['name', 'email'] // Incluir nombre y email del usuario
        },
        {
          model: Room,
          attributes: ['name'] // Incluir nombre de la habitación
        }
      ],
      order: [['start_date', 'DESC']] // Ordenar por las más recientes primero
    });

    res.status(200).json(reservations);
  } catch (error) {
    console.error("Error al obtener todas las reservas:", error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};
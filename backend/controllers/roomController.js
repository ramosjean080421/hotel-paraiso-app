// backend/controllers/roomController.js
const { Room, Reservation } = require('../database/setup');

// Controlador para obtener todas las habitaciones
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll();
    res.status(200).json(rooms);
  } catch (error) {
    console.error('Error al obtener las habitaciones:', error);
    res.status(500).json({ message: 'Error en el servidor al obtener las habitaciones.' });
  }
};

// Controlador para obtener una sola habitación por su ID
exports.getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findByPk(id);

    if (room) {
      res.status(200).json(room);
    } else {
      res.status(404).json({ message: 'Habitación no encontrada.' });
    }
  } catch (error) {
    console.error('Error al obtener la habitación:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

// Controlador para obtener las reservas de una habitación específica
exports.getRoomBookings = async (req, res) => {
  try {
    const { id } = req.params;
    const bookings = await Reservation.findAll({
      where: { room_id: id },
      attributes: ['start_date', 'end_date']
    });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las reservas de la habitación.' });
  }
};
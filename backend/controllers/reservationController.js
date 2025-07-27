// backend/controllers/reservationController.js

const { Reservation, Room } = require('../database/setup');
const { Op } = require('sequelize');

// Controlador para crear una nueva reserva
exports.createReservation = async (req, res) => {
  try {
    const { roomId, startDate, endDate } = req.body;
    const userId = req.user.id;

    if (!roomId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Faltan datos para la reserva.' });
    }

    const existingReservation = await Reservation.findOne({
      where: {
        room_id: roomId,
        [Op.and]: [
          { start_date: { [Op.lt]: endDate } },
          { end_date: { [Op.gt]: startDate } }
        ]
      }
    });

    if (existingReservation) {
      return res.status(409).json({ message: 'La habitación no está disponible para las fechas seleccionadas.' });
    }

    const newReservation = await Reservation.create({
      user_id: userId,
      room_id: roomId,
      start_date: startDate,
      end_date: endDate,
      status: 'confirmed'
    });

    res.status(201).json({
      message: '¡Habitación reservada exitosamente!',
      reservation: newReservation
    });

  } catch (error) {
    console.error('Error al crear la reserva:', error);
    res.status(500).json({ message: 'Error en el servidor al crear la reserva.' });
  }
};

// Controlador para obtener las reservas del usuario actual
exports.getMyReservations = async (req, res) => {
  try {
    const userId = req.user.id;
    const reservations = await Reservation.findAll({
      where: { user_id: userId },
      include: [{
        model: Room,
        attributes: ['name', 'image_url']
      }],
      order: [['start_date', 'ASC']]
    });
    res.status(200).json(reservations);
  } catch (error) {
    console.error('Error al obtener las reservas:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

// Controlador para que un usuario cancele su propia reserva
exports.cancelMyReservation = async (req, res) => {
  try {
    const { id } = req.params; // ID de la reserva a cancelar
    const userId = req.user.id; // ID del usuario autenticado

    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reserva no encontrada.' });
    }

    // Comprobación de seguridad: Asegurarse de que el usuario solo pueda borrar sus propias reservas
    if (reservation.user_id !== userId) {
      return res.status(403).json({ message: 'Acceso denegado. No puedes cancelar esta reserva.' });
    }

    await reservation.destroy();
    res.status(200).json({ message: 'Reserva cancelada exitosamente.' });

  } catch (error) {
    console.error('Error al cancelar la reserva:', error);
    res.status(500).json({ message: 'Error en el servidor al cancelar la reserva.' });
  }
};
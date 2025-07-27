// backend/controllers/adminRoomController.js
const { Room } = require('../database/setup');

const BASE_URL = 'http://localhost:3001';

// Crear una nueva habitación (sin cambios)
exports.createRoom = async (req, res) => {
  const { name, description, capacity, price_per_night } = req.body;
  const image_url = req.file ? `${BASE_URL}/public/images/${req.file.filename}` : null;

  try {
    const newRoom = await Room.create({ name, description, capacity, price_per_night, image_url });
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la habitación.', error });
  }
};

// --- FUNCIÓN DE ACTUALIZACIÓN CORREGIDA ---
exports.updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findByPk(id);

    if (!room) {
      return res.status(404).json({ message: 'Habitación no encontrada.' });
    }

    // Objeto con los datos a actualizar
    const dataToUpdate = {
      name: req.body.name,
      description: req.body.description,
      capacity: req.body.capacity,
      price_per_night: req.body.price_per_night,
    };

    // Si se sube un nuevo archivo de imagen, añade la nueva URL a los datos a actualizar.
    // Si no, la imagen existente se conservará.
    if (req.file) {
      dataToUpdate.image_url = `${BASE_URL}/public/images/${req.file.filename}`;
    }

    await room.update(dataToUpdate);
    res.status(200).json(room);

  } catch (error) {
    console.error("Error al actualizar la habitación:", error); // Añadimos un log más detallado
    res.status(500).json({ message: 'Error al actualizar la habitación.' });
  }
};

// --- AÑADIR ESTA NUEVA FUNCIÓN ---
// Eliminar una habitación
exports.deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findByPk(id);

    if (!room) {
      return res.status(404).json({ message: 'Habitación no encontrada.' });
    }

    await room.destroy(); // Elimina la fila de la base de datos
    res.status(200).json({ message: 'Habitación eliminada exitosamente.' });

  } catch (error) {
    console.error("Error al eliminar la habitación:", error);
    res.status(500).json({ message: 'Error al eliminar la habitación.' });
  }
};
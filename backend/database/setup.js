// backend/database/setup.js

const sequelize = require('./connection');

// Importar los modelos
const User = require('../models/User');
const Room = require('../models/Room');
const Reservation = require('../models/Reservation');

// --- Definir las Asociaciones ---

// Un Usuario puede tener muchas Reservas (One-to-Many)
User.hasMany(Reservation, {
  foreignKey: 'user_id', 
  onDelete: 'CASCADE'
});

// Una Reserva pertenece a un solo Usuario (Belongs-to)
Reservation.belongsTo(User, {
  foreignKey: 'user_id'
});

// Una Habitación puede tener muchas Reservas (One-to-Many)
Room.hasMany(Reservation, {
  foreignKey: 'room_id'
});

// Una Reserva pertenece a una sola Habitación (Belongs-to)
Reservation.belongsTo(Room, {
  foreignKey: 'room_id'
});

// Exportar la conexión y los modelos para usarlos en otras partes
module.exports = {
  sequelize,
  User,
  Room,
  Reservation
};
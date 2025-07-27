// backend/models/Reservation.js

const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Reservation = sequelize.define('Reservation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // Esta es una Clave Foránea que hace referencia al 'id' en la tabla de Usuarios.
    references: {
      model: 'Users', // Nombre de la tabla de referencia
      key: 'id'
    }
  },
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // Esta es una Clave Foránea que hace referencia al 'id' en la tabla de Habitaciones.
    references: {
      model: 'Rooms', // Nombre de la tabla de referencia
      key: 'id'
    }
  },
  start_date: {
    type: DataTypes.DATEONLY, // Guarda solo la fecha (YYYY-MM-DD), sin hora.
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending', // Ej: pending, confirmed, cancelled
  }
}, {
  timestamps: true, // Para las reservas, sí queremos saber cuándo se crearon (createdAt)
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

module.exports = Reservation;
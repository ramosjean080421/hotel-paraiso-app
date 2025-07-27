// backend/models/Room.js

const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Room = sequelize.define('Room', {
  // Definimos los atributos del modelo
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Ej: Suite Presidencial, Habitación Doble'
  },
  description: {
    type: DataTypes.TEXT, // Usamos TEXT para descripciones largas
    allowNull: false
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Número de personas que puede hospedar'
  },
  price_per_night: {
    type: DataTypes.DECIMAL(10, 2), // Ideal para manejar dinero
    allowNull: false
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true // Puede ser opcional al crear la habitación
  }
}, {
  timestamps: false
});

module.exports = Room;
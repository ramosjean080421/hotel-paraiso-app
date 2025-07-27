// backend/models/User.js

const { DataTypes } = require('sequelize');
// La clave está aquí: importamos la instancia que exportamos antes.
const sequelize = require('../database/connection');

// Ahora 'sequelize' es la instancia correcta y tiene el método .define()
const User = sequelize.define('User', {
  // ... el resto de tu código del modelo
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'client',
    allowNull: false
  }
}, {
  timestamps: false
});

module.exports = User;
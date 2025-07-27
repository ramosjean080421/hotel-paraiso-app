// backend/database/connection.js

const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, process.env.DB_NAME || 'hotel.db'),
  logging: false, 
});

// La clave está aquí: exportamos la instancia directamente.
module.exports = sequelize;
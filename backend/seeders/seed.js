const { sequelize, Room, User } = require('../database/setup');
const bcrypt = require('bcrypt');

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Base de datos sincronizada. Tablas recreadas.');

    // --- Datos de Habitaciones ---
    const roomsData = [
      { name: 'Suite Deluxe con Vista al Mar', description: 'Una espaciosa suite con balcón privado y vistas panorámicas al océano.', capacity: 2, price_per_night: 250.00, image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945' },
      { name: 'Habitación Familiar Estándar', description: 'Cómoda habitación con dos camas dobles, ideal para familias.', capacity: 4, price_per_night: 180.00, image_url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6' },
      { name: 'Habitación Individual Ejecutiva', description: 'Diseñada para el viajero de negocios, con cama queen y Wi-Fi de alta velocidad.', capacity: 1, price_per_night: 120.00, image_url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32' },
      { name: 'Penthouse de Lujo', description: 'La joya del hotel. Terraza privada con jacuzzi y servicio de mayordomo.', capacity: 3, price_per_night: 550.00, image_url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39' },
      { name: 'Bungalow Privado en Jardín', description: 'Un bungalow aislado rodeado de vegetación tropical. Máxima privacidad.', capacity: 2, price_per_night: 220.00, image_url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9' },
      { name: 'Habitación Doble Económica', description: 'Nuestra opción más asequible sin sacrificar comodidad.', capacity: 2, price_per_night: 95.00, image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b' }
    ];
    await Room.bulkCreate(roomsData);
    console.log('✅ Datos de 6 habitaciones insertados.');

    // --- Datos de Usuarios ---
    const usersData = [
      {
        name: 'Admin Hotel',
        email: 'admin@hotel.com',
        password: await bcrypt.hash('adminpassword', 10), // Contraseña: adminpassword
        role: 'admin',
      },
      {
        name: 'Cliente de Prueba',
        email: 'cliente@hotel.com',
        password: await bcrypt.hash('clientpassword', 10), // Contraseña: clientpassword
        role: 'client',
      },
    ];
    await User.bulkCreate(usersData);
    console.log('✅ Usuarios de ejemplo (admin y cliente) creados.');

    console.log('¡Sembrado de la base de datos completado!');
  } catch (error) {
    console.error('❌ Error al sembrar la base de datos:', error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();
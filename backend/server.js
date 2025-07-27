require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./database/setup');

const app = express();
const PORT = process.env.PORT || 3001;

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());
app.use('/public', express.static('public'));

// --- RUTAS ---
const userRoutes = require('./routes/userRoutes');
const roomRoutes = require('./routes/roomRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const adminRoutes = require('./routes/adminRoutes'); 

app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/reservations', reservationRoutes); 
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API del Hotel Paraíso funcionando correctamente' });
});

const main = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida.');
    
    await sequelize.sync({ force: false }); 
    console.log('✅ Modelos sincronizados con la base de datos.');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error);
  }
};
 
main();
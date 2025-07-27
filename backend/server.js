require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./database/setup');
const session = require('express-session');
const passport = require('passport');


const app = express();
const PORT = process.env.PORT || 3001;

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json()); // Solo se necesita una vez
app.use('/public', express.static('public'));

// Configuración de Sesión para Passport
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// --- RUTAS ---
const userRoutes = require('./routes/userRoutes');
const roomRoutes = require('./routes/roomRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const adminRoutes = require('./routes/adminRoutes'); 
const authRoutes = require('./routes/authRoutes'); 


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
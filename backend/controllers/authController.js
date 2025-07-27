// backend/controllers/authController.js
const { OAuth2Client } = require('google-auth-library');
const { User } = require('../database/setup');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email } = ticket.getPayload();

    // Busca si el usuario ya existe en nuestra base de datos
    let user = await User.findOne({ where: { email } });

    // Si no existe, lo crea
    if (!user) {
      user = await User.create({
        name: name,
        email: email,
        // La contraseña es null para usuarios de Google
      });
    }

    // Crea un token JWT de NUESTRA aplicación para el usuario
    const appTokenPayload = {
      id: user.id,
      name: user.name,
      role: user.role,
    };
    
    const appToken = jwt.sign(appTokenPayload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token: appToken });

  } catch (error) {
    console.error("Error en la autenticación con Google:", error);
    res.status(400).json({ message: 'La autenticación con Google falló.' });
  }
};
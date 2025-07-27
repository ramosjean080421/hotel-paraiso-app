const { User } = require('../database/setup');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendWelcomeEmail } = require('../services/emailService');

// Controlador para registrar un nuevo usuario
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    await sendWelcomeEmail(newUser.email, newUser.name);

    res.status(201).json({
      message: 'Usuario registrado exitosamente.',
      userId: newUser.id
    });

  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ message: 'Hubo un error al registrar el usuario.' });
  }
};

// Controlador para iniciar sesión
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const payload = {
      id: user.id,
      name: user.name,
      role: user.role
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({
      message: 'Inicio de sesión exitoso.',
      token: token
    });

  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: 'Hubo un error en el servidor.' });
  }
};

// Controlador para obtener el perfil del usuario autenticado
exports.getUserProfile = (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(404).json({ message: 'Usuario no encontrado.' });
  }
};
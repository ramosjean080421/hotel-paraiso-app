const jwt = require('jsonwebtoken');
const { User } = require('../database/setup');

// Middleware para proteger rutas (verifica el token)
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      next();
    } catch (error) {
      return res.status(401).json({ message: 'No autorizado, token inválido.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No autorizado, no se encontró token.' });
  }
};

// Middleware para verificar si el usuario es Admin
exports.isAdmin = (req, res, next) => {
  // Este middleware se debe usar DESPUÉS de 'protect'
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
  }
};
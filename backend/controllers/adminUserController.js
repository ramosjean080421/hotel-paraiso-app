// backend/controllers/adminUserController.js
const { User } = require('../database/setup');
const bcrypt = require('bcrypt'); // <-- Importar bcrypt

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

// --- FUNCIÓN DE ACTUALIZACIÓN MODIFICADA ---
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });
    
    const dataToUpdate = { name, email };

    // Si se proporciona una nueva contraseña, la encriptamos
    if (password && password.trim() !== '') {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    await user.update(dataToUpdate);
    res.status(200).json({ message: 'Usuario actualizado.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario.' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });
    
    const newRole = user.role === 'admin' ? 'client' : 'admin';
    await user.update({ role: newRole });
    res.status(200).json({ message: `Rol de usuario actualizado a ${newRole}.` });
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar el rol.' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

    await user.destroy();
    res.status(200).json({ message: 'Usuario eliminado exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario.' });
  }
};
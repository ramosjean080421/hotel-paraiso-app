import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, TextField, Button, Paper, CircularProgress } from '@mui/material';
import { useNotification } from '../../context/NotificationContext';

export default function AdminUserFormPage() {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // <-- Nuevo estado para la contraseña
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`http://localhost:3001/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setName(response.data.name);
        setEmail(response.data.email);
      } catch (error) {
        showNotification('No se pudo cargar la información del usuario.', 'error');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchUser();
    }
  }, [id, showNotification]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const dataToUpdate: { name: string; email: string; password?: string } = { name, email };
      
      // Solo incluimos la contraseña en la petición si el campo no está vacío
      if (password.trim() !== '') {
        dataToUpdate.password = password;
      }

      await axios.put(`http://localhost:3001/api/admin/users/${id}`, 
        dataToUpdate,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification('Usuario actualizado exitosamente.', 'success');
      navigate('/admin/users');
    } catch (err) {
      showNotification('Error al actualizar el usuario.', 'error');
    }
  };

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Editar Usuario
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField 
            label="Nombre" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            fullWidth 
            required 
            margin="normal" 
          />
          <TextField 
            label="Email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            fullWidth 
            required 
            margin="normal" 
          />
          {/* --- CAMPO DE CONTRASEÑA AÑADIDO --- */}
          <TextField 
            label="Nueva Contraseña" 
            type="password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            fullWidth 
            margin="normal"
            helperText="Dejar en blanco para no cambiar la contraseña"
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            Guardar Cambios
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
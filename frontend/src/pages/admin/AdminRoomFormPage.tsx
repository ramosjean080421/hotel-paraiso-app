import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, TextField, Button } from '@mui/material';
import { useNotification } from '../../context/NotificationContext';

export default function AdminRoomFormPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const [roomData, setRoomData] = useState({
    name: '',
    description: '',
    capacity: '',
    price_per_night: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditMode) {
      const fetchRoom = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/api/rooms/${id}`);
          const { name, description, capacity, price_per_night } = response.data;
          setRoomData({ name, description, capacity: String(capacity), price_per_night: String(price_per_night) });
        } catch (err) {
          showNotification('No se pudieron cargar los datos de la habitación.', 'error');
        }
      };
      fetchRoom();
    }
  }, [id, isEditMode, showNotification]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomData({ ...roomData, [event.target.name]: event.target.value });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImage(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', roomData.name);
    formData.append('description', roomData.description);
    formData.append('capacity', roomData.capacity);
    formData.append('price_per_night', roomData.price_per_night);
    if (image) {
      formData.append('image', image);
    }

    try {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          'Content-Type': 'multipart/-form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      if (isEditMode) {
        await axios.put(`http://localhost:3001/api/admin/rooms/${id}`, formData, config);
      } else {
        await axios.post('http://localhost:3001/api/admin/rooms', formData, config);
      }
      
      showNotification(`Habitación ${isEditMode ? 'actualizada' : 'creada'} exitosamente.`, 'success');
      navigate('/admin/rooms');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} la habitación.`;
      showNotification(errorMessage, 'error');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEditMode ? 'Editar Habitación' : 'Añadir Nueva Habitación'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField label="Nombre" name="name" value={roomData.name} onChange={handleChange} fullWidth required margin="normal" />
        <TextField label="Descripción" name="description" value={roomData.description} onChange={handleChange} fullWidth required margin="normal" multiline rows={4} />
        <TextField label="Capacidad" name="capacity" type="number" value={roomData.capacity} onChange={handleChange} fullWidth required margin="normal" />
        <TextField label="Precio por Noche" name="price_per_night" type="number" value={roomData.price_per_night} onChange={handleChange} fullWidth required margin="normal" />
        <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
          {isEditMode ? 'Cambiar Imagen (Opcional)' : 'Seleccionar Imagen'}
          <input type="file" name="image" hidden onChange={handleFileChange} />
        </Button>
        {image && <Typography sx={{ mt: 1 }}>Archivo seleccionado: {image.name}</Typography>}
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
          {isEditMode ? 'Guardar Cambios' : 'Guardar Habitación'}
        </Button>
      </Box>
    </Container>
  );
}
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider, CircularProgress, Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // <-- 1. Importar useNavigate
import dayjs from 'dayjs';
import { useNotification } from '../context/NotificationContext';

interface Reservation {
  id: number;
  start_date: string;
  end_date: string;
  Room: {
    name: string;
    image_url: string;
  };
}

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showNotification } = useNotification();
  const navigate = useNavigate(); // <-- 2. Hook para navegar

  const [openDialog, setOpenDialog] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState<number | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No estás autenticado.');
        
        const response = await axios.get('http://localhost:3001/api/reservations/my-reservations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReservations(response.data);
      } catch (err) {
        setError('No se pudieron cargar tus reservas.');
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const handleOpenDialog = (id: number) => {
    setReservationToCancel(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setReservationToCancel(null);
  };

  const handleConfirmCancel = async () => {
    if (!reservationToCancel) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.delete(`http://localhost:3001/api/reservations/${reservationToCancel}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setReservations(reservations.filter(res => res.id !== reservationToCancel));
      showNotification(response.data.message, 'success');
      navigate('/rooms'); // <-- 3. Redirigir a la página de habitaciones
    } catch (error) {
      showNotification('No se pudo cancelar la reserva.', 'error');
    } finally {
      handleCloseDialog();
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
  if (error) return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mis Reservas
        </Typography>
        {reservations.length === 0 ? (
          <Typography>Aún no has realizado ninguna reserva.</Typography>
        ) : (
          <List>
            {reservations.map((res) => (
              <Box key={res.id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar variant="rounded" src={res.Room.image_url} sx={{ width: 100, height: 100, mr: 2 }} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={res.Room.name}
                    secondary={`Del ${dayjs(res.start_date).format('DD/MM/YYYY')} al ${dayjs(res.end_date).format('DD/MM/YYYY')}`}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {/* 4. Se elimina el botón 'Editar' */}
                    <Button variant="contained" color="error" size="small" onClick={() => handleOpenDialog(res.id)}>Cancelar Reserva</Button>
                  </Box>
                </ListItem>
                <Divider variant="inset" component="li" />
              </Box>
            ))}
          </List>
        )}
      </Container>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar Cancelación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas cancelar tu reserva? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Volver</Button>
          <Button onClick={handleConfirmCancel} color="error" autoFocus>
            Sí, Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
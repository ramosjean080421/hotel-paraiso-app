import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, CircularProgress, Alert, Paper, Button, Divider, Grid } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

interface Room {
  id: number;
  name: string;
  description: string;
  capacity: number;
  price_per_night: string;
  image_url: string;
}

interface Booking {
  start_date: string;
  end_date: string;
}

export default function RoomDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [roomDetailsResponse, bookingsResponse] = await Promise.all([
          axios.get(`http://localhost:3001/api/rooms/${id}`),
          axios.get(`http://localhost:3001/api/rooms/${id}/bookings`)
        ]);
        setRoom(roomDetailsResponse.data);
        setBookings(bookingsResponse.data);
      } catch (err) {
        setError('No se pudo cargar la información de la habitación.');
      } finally {
        setLoading(false);
      }
    };
    fetchRoomData();
  }, [id]);

  const shouldDisableDate = (date: Dayjs) => {
    for (const booking of bookings) {
      const start = dayjs(booking.start_date);
      const end = dayjs(booking.end_date);
      if (date.isBetween(start.subtract(1, 'day'), end.add(1, 'day'))) {
        return true;
      }
    }
    return false;
  };

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      showNotification('Por favor, selecciona ambas fechas.', 'warning');
      return;
    }
    if (!user || !room) {
      showNotification('Debes iniciar sesión para reservar.', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        'http://localhost:3001/api/reservations',
        {
          roomId: room.id,
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD'),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification(response.data.message, 'success');
      // Volver a cargar las reservas para actualizar el calendario
      const bookingsResponse = await axios.get(`http://localhost:3001/api/rooms/${id}/bookings`);
      setBookings(bookingsResponse.data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al realizar la reserva.';
      showNotification(errorMessage, 'error');
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;
  if (!room) return <Alert severity="warning" sx={{ m: 4 }}>Habitación no encontrada.</Alert>;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3}>
          <img src={room.image_url} alt={room.name} style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
          <Box sx={{ p: 3 }}>
            <Typography variant="h3" component="h1" gutterBottom>{room.name}</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>{room.description}</Typography>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Capacidad máxima: {room.capacity} personas</Typography>
              <Typography variant="h5" color="primary">${room.price_per_night} / noche</Typography>
            </Box>
            <Divider sx={{ my: 4 }} />
            {user ? (
              <Box>
                <Typography variant="h5" component="h2" gutterBottom>
                  Realiza tu Reserva
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={5}>
                    <DatePicker 
                      label="Fecha de llegada" 
                      value={startDate} 
                      onChange={(newValue) => setStartDate(newValue)} 
                      shouldDisableDate={shouldDisableDate}
                      disablePast 
                      sx={{ width: '100%' }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <DatePicker 
                      label="Fecha de salida" 
                      value={endDate} 
                      onChange={(newValue) => setEndDate(newValue)} 
                      shouldDisableDate={shouldDisableDate}
                      disablePast
                      sx={{ width: '100%' }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Button variant="contained" size="large" onClick={handleBooking} fullWidth>
                      Reservar
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Alert severity="info">
                Por favor, <Link to="/login" style={{ color: 'inherit' }}>inicia sesión</Link> para poder reservar esta habitación.
              </Alert>
            )}
          </Box>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
}
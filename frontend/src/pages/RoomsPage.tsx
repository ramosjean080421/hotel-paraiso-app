import { useState, useEffect } from 'react';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Room {
  id: number;
  name: string;
  description: string;
  capacity: number;
  price_per_night: number;
  image_url: string;
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/rooms');
        setRooms(response.data);
      } catch (err) {
        setError('No se pudieron cargar las habitaciones.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  if (loading) return <Typography sx={{ mt: 4, textAlign: 'center' }}>Cargando habitaciones...</Typography>;
  if (error) return <Typography sx={{ mt: 4, textAlign: 'center', color: 'red' }}>{error}</Typography>;

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Nuestras Habitaciones
      </Typography>
      <Grid container spacing={4}>
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <Grid item key={room.id} xs={12} sm={6} md={4}>
              <Link to={`/rooms/${room.id}`} style={{ textDecoration: 'none' }}>
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  }
                }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={room.image_url || 'https://via.placeholder.com/300x140?text=Sin+Imagen'}
                    alt={room.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2" color="text.primary">
                      {room.name}
                    </Typography>
                    <Typography color="text.secondary">
                      {room.description}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                       <Typography variant="body1" color="text.secondary">
                         Capacidad: {room.capacity} personas
                       </Typography>
                       <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                         ${room.price_per_night} / noche
                       </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))
        ) : (
          <Typography sx={{ width: '100%', mt: 4, textAlign: 'center' }}>
            No hay habitaciones para mostrar en este momento.
          </Typography>
        )}
      </Grid>
    </Container>
  );
}
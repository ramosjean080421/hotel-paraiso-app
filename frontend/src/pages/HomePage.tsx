import { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Paper, List, ListItem, ListItemIcon, ListItemText, Card, CardMedia, CardContent, Button, Divider, TextField } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './HomePage.css';
import { StarBorder, RoomService, Park, PeopleOutline } from '@mui/icons-material';
import { useNotification } from '../context/NotificationContext';

interface Room {
  id: number;
  name: string;
  description: string;
  capacity: number;
  price_per_night: number;
  image_url: string;
}

export default function HomePage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const { showNotification } = useNotification();
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/rooms');
        setRooms(response.data);
      } catch (error) {
        console.error("Error al cargar las habitaciones:", error);
      }
    };
    fetchRooms();
  }, []);

  const handleContactChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm({ ...contactForm, [event.target.name]: event.target.value });
  };

  const handleContactSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Datos del formulario de contacto:", contactForm);
    showNotification('Gracias por tu mensaje, te contactaremos pronto.', 'success');
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <>
      {/* --- SECCIÓN 1: BIENVENIDA --- */}
      <Box 
        id="inicio" 
        sx={{ 
          position: 'relative',
          height: '100vh',
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'flex-end',
          backgroundImage: `url(/hero-background.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff',
        }}
      >
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
        <Container maxWidth="lg" sx={{ textAlign: 'right', position: 'relative', zIndex: 1 }}>
          <Box sx={{ maxWidth: '50%', ml: 'auto' }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Bienvenido al Hotel Paraíso
            </Typography>
            <Typography variant="h5" paragraph>
              Tu escapada de lujo te espera. Descubre nuestras exclusivas habitaciones y servicios.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Divider />

      {/* --- SECCIÓN 2: NOSOTROS --- */}
      <Box id="nosotros" sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Paper elevation={6} sx={{ borderRadius: '8px', overflow: 'hidden' }}><img src="https://images.unsplash.com/photo-1564501049412-61c2a3083791" alt="Lobby del Hotel Paraíso" style={{ width: '100%', height: 'auto', display: 'block' }} /></Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h2" gutterBottom>Sobre Nosotros</Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>Nuestra Historia</Typography>
              <Typography variant="body1" paragraph sx={{ mt: 1 }}>En el corazón de un paraíso tropical, el Hotel Paraíso ofrece una experiencia inigualable que combina lujo, confort y naturaleza.</Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, mt: 2 }}>Valores</Typography>
              <List>
                <ListItem><ListItemIcon><StarBorder color="primary" /></ListItemIcon><ListItemText primary="Calidad en cada detalle" /></ListItem>
                <ListItem><ListItemIcon><RoomService color="primary" /></ListItemIcon><ListItemText primary="Servicio personalizado" /></ListItem>
                <ListItem><ListItemIcon><Park color="primary" /></ListItemIcon><ListItemText primary="Compromiso con el entorno" /></ListItem>
                <ListItem><ListItemIcon><PeopleOutline color="primary" /></ListItemIcon><ListItemText primary="Ambiente acogedor" /></ListItem>
              </List>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Divider />

      {/* --- SECCIÓN 3: HABITACIONES --- */}
      <Box id="habitaciones" sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" gutterBottom align="center">Nuestras Habitaciones</Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {rooms.slice(0, 3).map((room) => (
              <Grid item key={room.id} xs={12} sm={6} md={4}>
                <Link to={`/rooms/${room.id}`} style={{ textDecoration: 'none' }}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6, } }}>
                    <CardMedia component="img" height="200" image={room.image_url} alt={room.name} />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2" color="text.primary">{room.name}</Typography>
                      <Typography variant="h6" color="primary" sx={{ mt: 1 }}>${room.price_per_night} / noche</Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4 }}><Link to="/rooms" style={{ textDecoration: 'none' }}><Button variant="outlined" size="large">Ver Todas las Habitaciones</Button></Link></Box>
        </Container>
      </Box>

      <Divider />

      {/* --- SECCIÓN 4: UBICACIÓN (CORREGIDA) --- */}
      <Box id="ubicacion" sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" gutterBottom align="center">Encuéntranos</Typography>
          <Grid container spacing={4} sx={{ mt: 4 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h5" component="h3" gutterBottom>Hotel Paraíso - Sede Lima</Typography>
              <Typography variant="body1" paragraph>
                Malecón de la Reserva 615<br/>
                Miraflores, Lima<br/>
                Perú
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Teléfono:</strong> +51 1 123 4567<br/>
                <strong>Email:</strong> contacto.lima@hotelparaiso.com
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={6} sx={{ height: '400px', borderRadius: '8px', overflow: 'hidden' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.983177828078!2d-77.0300959851868!3d-12.11281899142343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c811a14c6267%3A0x6285511e032ed128!2sJW%20Marriott%20Hotel%20Lima!5e0!3m2!1ses-419!2spe!4v1689000000000!5m2!1ses-419!2spe"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Divider />

      {/* --- SECCIÓN 5: CONTACTO --- */}
      <Box id="contacto" sx={{ py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" gutterBottom align="center">Contacto</Typography>
          <Typography variant="body1" align="center" color="text.secondary" paragraph>
            ¿Tienes alguna pregunta? Envíanos un mensaje y nuestro equipo se pondrá en contacto contigo a la brevedad.
          </Typography>
          <Box 
            component="form" 
            onSubmit={handleContactSubmit}
            sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '600px', mx: 'auto' }}
          >
            <TextField label="Nombre" name="name" value={contactForm.name} onChange={handleContactChange} required />
            <TextField label="Correo Electrónico" name="email" type="email" value={contactForm.email} onChange={handleContactChange} required />
            <TextField label="Mensaje" name="message" value={contactForm.message} onChange={handleContactChange} required multiline rows={4} />
            <Button type="submit" variant="contained" size="large">
              Enviar Mensaje
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
}
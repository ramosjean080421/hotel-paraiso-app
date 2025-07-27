import { Container, Grid, Typography, Box, Link as MuiLink, Divider, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{ bgcolor: 'background.paper', py: 6 }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Columna 1: Logo y Descripción */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Hotel Paraíso
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Un espacio acogedor para disfrutar de una escapada de lujo inolvidable.
            </Typography>
          </Grid>

          {/* Columna 2: Enlaces Rápidos */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Enlaces Rápidos
            </Typography>
            <MuiLink component={RouterLink} to="/" display="block" color="text.secondary" underline="hover">Inicio</MuiLink>
            <MuiLink component={RouterLink} to="/rooms" display="block" color="text.secondary" underline="hover">Habitaciones</MuiLink>
            <MuiLink href="/#nosotros" display="block" color="text.secondary" underline="hover">Nosotros</MuiLink>
            <MuiLink href="/#ubicacion" display="block" color="text.secondary" underline="hover">Ubicación</MuiLink>
          </Grid>

          {/* Columna 3: Llamada a la Acción */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              ¿Listo para tu escapada?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Explora nuestras habitaciones y encuentra el paraíso que te espera.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              component={RouterLink} 
              to="/rooms" 
              sx={{ mt: 2 }}
            >
              Reservar Ahora
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />
        
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' Hotel Paraíso. Todos los derechos reservados.'}
        </Typography>
      </Container>
    </Box>
  );
}
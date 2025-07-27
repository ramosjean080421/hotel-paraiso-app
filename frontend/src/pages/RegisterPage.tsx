import { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await axios.post('http://localhost:3001/api/users/register', {
        name,
        email,
        password
      });

      showNotification('¡Registro exitoso! Ahora puedes iniciar sesión.', 'success');
      navigate('/login');

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Hubo un error al registrar.';
      showNotification(errorMessage, 'error');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={6} // <-- Añade el efecto de sombra "flotante"
        sx={{
          marginTop: 8,
          padding: 4, // <-- Añade un relleno interno
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2, // <-- Define los bordes redondeados
        }}
      >
        <Typography component="h1" variant="h5">
          Crear Cuenta
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                required
                fullWidth
                id="name"
                label="Nombre Completo"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Correo Electrónico"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Registrarse
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography variant="body2">
                  {"¿Ya tienes una cuenta? Inicia sesión"}
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
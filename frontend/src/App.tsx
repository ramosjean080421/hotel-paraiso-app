// App.tsx
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Snackbar, Alert, Fab, Box, Toolbar } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider, useNotification } from './context/NotificationContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RoomsPage from './pages/RoomsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RoomDetailPage from './pages/RoomDetailPage';
import MyReservationsPage from './pages/MyReservationsPage';
import AdminLayout from './layouts/AdminLayout';
import AdminRoomsPage from './pages/admin/AdminRoomsPage';
import AdminRoomFormPage from './pages/admin/AdminRoomFormPage';
import AdminReservationsPage from './pages/admin/AdminReservationsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminUserFormPage from './pages/admin/AdminUserFormPage';

function NotificationManager() {
  const { notification, handleClose } = useNotification();
  return (
    <Snackbar
      open={notification.open}
      // autoHideDuration={6000} // Puedes usar notification.autoHideDuration si lo configuraste
      autoHideDuration={notification.autoHideDuration || 6000} // Usamos el del estado o un fallback
      onClose={handleClose} // Aquí es correcto, espera (event, reason)
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      {/* *** CORRECCIÓN CLAVE AQUÍ *** */}
      {/* El onClose del Alert solo espera el evento, no la razón. */}
      {/* Envolvemos handleClose en una función de flecha para adaptar su firma. */}
      <Alert onClose={(event) => handleClose(event, 'timeout')} severity={notification.severity} sx={{ width: '100%' }} variant="filled">
        {notification.message}
      </Alert>
    </Snackbar>
  );
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#D94D1A' },
    background: { default: '#121212', paper: '#1e1e1e' },
    text: { primary: '#ffffff', secondary: '#b3b3b3' },
  },
});

function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      <Navbar />
      {!isHomePage && <Toolbar />}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/rooms/:id" element={<RoomDetailPage />} />
            <Route path="/my-reservations" element={<MyReservationsPage />} />
            <Route element={<AdminLayout />}>
              <Route path="/admin/rooms" element={<AdminRoomsPage />} />
              <Route path="/admin/rooms/new" element={<AdminRoomFormPage />} />
              <Route path="/admin/rooms/edit/:id" element={<AdminRoomFormPage />} />
              <Route path="/admin/reservations" element={<AdminReservationsPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/users/edit/:id" element={<AdminUserFormPage />} />
            </Route>
          </Routes>
        </Box>
        <Footer />
      </div>
      <Fab color="success" sx={{ position: 'fixed', bottom: 32, right: 32 }} component="a" href="https://wa.me/51978757528" target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon />
      </Fab>
      <NotificationManager />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </ThemeProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
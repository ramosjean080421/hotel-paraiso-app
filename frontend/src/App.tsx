import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Snackbar, Alert, Fab, Box, Toolbar } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import AdminUserFormPage from './pages/admin/AdminUserFormPage';
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
import { GoogleOAuthProvider } from '@react-oauth/google';

function NotificationManager() {
  const { notification, handleClose } = useNotification();
  return (
    <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert onClose={handleClose} severity={notification.severity} sx={{ width: '100%' }} variant="filled">
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
  const googleClientId = "635672023107-mbevruu0toebdlmsq9quu4ehqetk8gkj.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
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
    </GoogleOAuthProvider>
  );
}

export default App;
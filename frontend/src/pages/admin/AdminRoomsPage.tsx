import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, 
  DialogContent, DialogContentText, DialogTitle, Box 
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';

interface Room {
  id: number;
  name: string;
  capacity: number;
  price_per_night: string;
}

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const { showNotification } = useNotification();
  const [openDialog, setOpenDialog] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/rooms');
        setRooms(response.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        showNotification('No se pudieron cargar las habitaciones.', 'error');
      }
    };
    fetchRooms();
  }, []);

  const handleOpenDialog = (id: number) => {
    setRoomToDelete(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setRoomToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!roomToDelete) return;
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.delete(`http://localhost:3001/api/admin/rooms/${roomToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setRooms(rooms.filter(room => room.id !== roomToDelete));
      showNotification(response.data.message, 'success');
    } catch (error) {
      showNotification('No se pudo eliminar la habitación.', 'error');
    } finally {
      handleCloseDialog();
    }
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Habitaciones
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
          component={Link}
          to="/admin/rooms/new"
        >
          Añadir Nueva Habitación
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Capacidad</TableCell>
                <TableCell>Precio / Noche</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>{room.id}</TableCell>
                  <TableCell>{room.name}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell>${room.price_per_night}</TableCell>
                  <TableCell align="right">
                    {/* --- CAMBIOS DE ESTILO AQUÍ --- */}
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Button
                        size="small"
                        variant="outlined"
                        component={Link}
                        to={`/admin/rooms/edit/${room.id}`}
                      >
                        Editar
                      </Button>
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="error" 
                        onClick={() => handleOpenDialog(room.id)}
                      >
                        Eliminar
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar esta habitación? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
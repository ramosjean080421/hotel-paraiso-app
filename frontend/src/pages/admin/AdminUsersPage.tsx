import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import dayjs from 'dayjs';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'client' | 'admin';
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();
  const [openDialog, setOpenDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:3001/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      showNotification('No se pudieron cargar los usuarios.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChangeRole = async (userId: number) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(`http://localhost:3001/api/admin/users/${userId}/role`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification(response.data.message, 'success');
      fetchUsers();
    } catch (error) {
      showNotification('Error al cambiar el rol.', 'error');
    }
  };

  const handleOpenDialog = (id: number) => {
    setUserToDelete(id);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => setOpenDialog(false);

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.delete(`http://localhost:3001/api/admin/users/${userToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification(response.data.message, 'success');
      fetchUsers();
    } catch (error) {
      showNotification('Error al eliminar el usuario.', 'error');
    } finally {
      handleCloseDialog();
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Usuarios
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Miembro Desde</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{dayjs(user.createdAt).format('DD/MM/YYYY')}</TableCell>
                  <TableCell align="right">
                    {/* --- CAMBIOS DE ESTILO AQUÍ --- */}
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        component={Link} 
                        to={`/admin/users/edit/${user.id}`}
                      >
                        Editar
                      </Button>
                      <Button 
                        size="small" 
                        variant="contained" 
                        onClick={() => handleChangeRole(user.id)}
                      >
                        {user.role === 'admin' ? 'Hacer Cliente' : 'Hacer Admin'}
                      </Button>
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="error" 
                        onClick={() => handleOpenDialog(user.id)}
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
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent><DialogContentText>¿Estás seguro? Esta acción es irreversible.</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
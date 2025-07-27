// context/NotificationContext.tsx
import { createContext, useState, useContext, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AlertColor } from '@mui/material/Alert';
import type { SnackbarCloseReason } from '@mui/material/Snackbar'; // Importamos el tipo para reason

interface NotificationState {
  message: string;
  severity: AlertColor;
  open: boolean;
  autoHideDuration?: number;
}

interface NotificationContextType {
  notification: NotificationState;
  showNotification: (message: string, severity: AlertColor, autoHideDuration?: number) => void;
  // La firma es correcta, solo ajustaremos el nombre del parámetro en la implementación
  handleClose: (event: Event | React.SyntheticEvent, reason: SnackbarCloseReason) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<NotificationState>({
    message: '',
    severity: 'success',
    open: false,
    autoHideDuration: 6000,
  });

  const showNotification = useCallback((message: string, severity: AlertColor, autoHideDuration: number = 6000) => {
    setNotification({ message, severity, open: true, autoHideDuration });
  }, []);

  // *** CORRECCIÓN PARA LA ADVERTENCIA DE 'event' NO LEÍDO ***
  // Cambiamos 'event' a '_event' para indicar que es un parámetro intencionalmente no utilizado.
  const handleClose = useCallback((_event: Event | React.SyntheticEvent, reason: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification((prev) => ({ ...prev, open: false }));
  }, []);

  const contextValue = {
    showNotification,
    notification,
    handleClose,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe ser usado dentro de un NotificationProvider');
  }
  return context;
};
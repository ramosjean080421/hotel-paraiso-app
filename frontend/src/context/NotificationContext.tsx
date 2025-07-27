import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import type { AlertColor } from '@mui/material/Alert';

interface NotificationState {
  message: string;
  severity: AlertColor;
  open: boolean;
}

interface NotificationContextType {
  notification: NotificationState;
  showNotification: (message: string, severity: AlertColor) => void;
  handleClose: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<NotificationState>({
    message: '',
    severity: 'success',
    open: false,
  });

  const showNotification = (message: string, severity: AlertColor) => {
    setNotification({ message, severity, open: true });
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

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
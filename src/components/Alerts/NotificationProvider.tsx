import React, { createContext, useContext, useState, ReactNode } from 'react';
import Notification from './Notification';

interface NotificationState {
  visible: boolean;
  title?: string;
  message: string;
  type: 'success' | 'error';
  duration?: number;
  buttonEnabled?: boolean;
  callback?: () => void;
}

interface NotificationContextType {
  show: (options: {
    type: 'success' | 'error';
    title?: string;
    message: string; 
    duration?: number;
    buttonEnabled?: boolean;
    callback?: () => void;
  }) => void;
  hide: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationState>({
    visible: false,
    message: '',
    type: 'success',
    callback: undefined,
  });

  const show = (options: {
    type: 'success' | 'error';
    title?: string;
    message: string;
    duration?: number;
    buttonEnabled?: boolean;
    callback?: () => void;
  }) => {
    setNotification({
      ...options,
      visible: true,
    });
  };

  const hide = () => {
    setNotification(prev => ({ ...prev, visible: false }));
  };

  const handleHide = () => {
    hide();
    notification.callback?.();
  };

  return (
    <NotificationContext.Provider value={{ show, hide }}>
      {children}
      <Notification
        {...notification}
        onHide={handleHide}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
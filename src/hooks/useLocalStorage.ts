import { useState, useEffect } from 'react';
import { User } from '@/types/User';

const USERS_KEY = 'gymjared_users';

export const useLocalStorage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuarios del localStorage al iniciar
  useEffect(() => {
    const loadUsers = () => {
      try {
        const savedUsers = localStorage.getItem(USERS_KEY);
        if (savedUsers) {
          setUsers(JSON.parse(savedUsers));
        }
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Guardar usuarios en localStorage
  const saveUsers = (newUsers: User[]) => {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(newUsers));
      setUsers(newUsers);
    } catch (error) {
      console.error('Error saving users:', error);
    }
  };

  // Agregar nuevo usuario
  const addUser = (userData: Omit<User, 'id' | 'fechaCreacion' | 'fechaUltimaActualizacion'>) => {
    const now = new Date().toISOString();
    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
      fechaCreacion: now,
      fechaUltimaActualizacion: now,
    };
    
    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    return newUser;
  };

  // Actualizar usuario
  const updateUser = (id: string, updates: Partial<User>) => {
    const updatedUsers = users.map(user => 
      user.id === id 
        ? { ...user, ...updates, fechaUltimaActualizacion: new Date().toISOString() }
        : user
    );
    saveUsers(updatedUsers);
  };

  // Eliminar usuario
  const deleteUser = (id: string) => {
    const updatedUsers = users.filter(user => user.id !== id);
    saveUsers(updatedUsers);
  };

  // Marcar pago
  const togglePaymentStatus = (id: string) => {
    const updatedUsers = users.map(user => 
      user.id === id 
        ? { 
            ...user, 
            estadoPago: (user.estadoPago === 'pagado' ? 'no-pagado' : 'pagado') as 'pagado' | 'no-pagado',
            mesActual: new Date().toISOString().slice(0, 7), // YYYY-MM
            fechaUltimaActualizacion: new Date().toISOString()
          }
        : user
    );
    saveUsers(updatedUsers);
  };

  // Obtener usuarios que deben pagar este mes
  const getUsersToPayThisMonth = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return users.filter(user => 
      user.mesActual !== currentMonth || user.estadoPago === 'no-pagado'
    );
  };

  // Obtener usuarios que vencen pronto (próximos 3 días)
  const getUsersExpiringSoon = () => {
    const today = new Date();
    const currentDay = today.getDate();
    
    return users.filter(user => {
      const daysUntilPayment = user.diaPago - currentDay;
      return daysUntilPayment >= 0 && daysUntilPayment <= 3 && user.estadoPago === 'no-pagado';
    });
  };

  return {
    users,
    isLoading,
    addUser,
    updateUser,
    deleteUser,
    togglePaymentStatus,
    getUsersToPayThisMonth,
    getUsersExpiringSoon,
  };
};
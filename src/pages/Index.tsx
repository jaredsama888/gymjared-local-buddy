import { useState, useMemo } from 'react';
import { User } from '@/types/User';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { UserCard } from '@/components/UserCard';
import { UserForm } from '@/components/UserForm';
import { SearchFilters } from '@/components/SearchFilters';
import { StatsCards } from '@/components/StatsCards';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Plus, Dumbbell } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  const {
    users,
    isLoading,
    addUser,
    updateUser,
    deleteUser,
    togglePaymentStatus,
  } = useLocalStorage();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'paid' | 'expiring'>('all');

  // Filtrar y buscar usuarios
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Aplicar filtros
    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentDay = new Date().getDate();

    switch (activeFilter) {
      case 'pending':
        filtered = users.filter(user => 
          user.estadoPago === 'no-pagado' || user.mesActual !== currentMonth
        );
        break;
      case 'paid':
        filtered = users.filter(user => 
          user.estadoPago === 'pagado' && user.mesActual === currentMonth
        );
        break;
      case 'expiring':
        filtered = users.filter(user => {
          const daysUntilPayment = user.diaPago - currentDay;
          return daysUntilPayment >= 0 && daysUntilPayment <= 3 && user.estadoPago === 'no-pagado';
        });
        break;
      default:
        filtered = users;
    }

    // Aplicar búsqueda
    if (searchQuery.trim()) {
      filtered = filtered.filter(user =>
        user.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [users, searchQuery, activeFilter]);

  const handleAddUser = (userData: any) => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    addUser({
      ...userData,
      mesActual: currentMonth,
    });
  };

  const handleEditUser = (userData: any) => {
    if (editingUser) {
      updateUser(editingUser.id, userData);
      setEditingUser(null);
    }
  };

  const handleFormSubmit = (userData: any) => {
    if (editingUser) {
      handleEditUser(userData);
    } else {
      handleAddUser(userData);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteUser(id);
    toast({
      title: "Usuario eliminado",
      description: "El usuario ha sido eliminado correctamente"
    });
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando GymJared...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Dumbbell className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">GymJared</h1>
                <p className="text-sm text-muted-foreground">Gestión de gimnasio</p>
              </div>
            </div>
            <Button 
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus size={18} />
              Nuevo Usuario
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Estadísticas */}
        <StatsCards users={users} />

        {/* Búsqueda y filtros */}
        <SearchFilters
          onSearch={setSearchQuery}
          onFilter={setActiveFilter}
          activeFilter={activeFilter}
        />

        {/* Lista de usuarios */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            {filteredUsers.length === 0 
              ? 'No se encontraron usuarios' 
              : `${filteredUsers.length} usuario${filteredUsers.length !== 1 ? 's' : ''} encontrado${filteredUsers.length !== 1 ? 's' : ''}`
            }
          </h2>
          
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                {users.length === 0 
                  ? 'No hay usuarios registrados aún' 
                  : 'No se encontraron usuarios con estos criterios'
                }
              </div>
              {users.length === 0 && (
                <Button onClick={() => setIsFormOpen(true)}>
                  <Plus size={18} className="mr-2" />
                  Agregar primer usuario
                </Button>
              )}
            </div>
          ) : (
            <ScrollArea className="h-[60vh]">
              <div className="space-y-4 pr-4">
                {filteredUsers.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onTogglePayment={togglePaymentStatus}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>

      {/* Formulario de usuario */}
      <UserForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        editingUser={editingUser}
      />
    </div>
  );
};

export default Index;

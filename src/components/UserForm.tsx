import { useState, useEffect } from 'react';
import { User, UserFormData } from '@/types/User';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  editingUser?: User | null;
}

export const UserForm = ({ isOpen, onClose, onSubmit, editingUser }: UserFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<UserFormData>({
    nombre: '',
    email: '',
    password: '',
    diaPago: 1,
    estadoPago: 'no-pagado'
  });

  useEffect(() => {
    if (editingUser) {
      setFormData({
        nombre: editingUser.nombre,
        email: editingUser.email,
        password: editingUser.password,
        diaPago: editingUser.diaPago,
        estadoPago: editingUser.estadoPago
      });
    } else {
      setFormData({
        nombre: '',
        email: '',
        password: '',
        diaPago: 1,
        estadoPago: 'no-pagado'
      });
    }
  }, [editingUser, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    if (formData.diaPago < 1 || formData.diaPago > 31) {
      toast({
        title: "Error",
        description: "El día de pago debe estar entre 1 y 31",
        variant: "destructive"
      });
      return;
    }

    onSubmit(formData);
    onClose();
    
    toast({
      title: "Éxito",
      description: editingUser ? "Usuario actualizado correctamente" : "Usuario agregado correctamente"
    });
  };

  const handleInputChange = (field: keyof UserFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre completo *</Label>
            <Input
              id="nombre"
              type="text"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              placeholder="Ingresa el nombre completo"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email">Correo electrónico *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="usuario@email.com"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">Contraseña *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Contraseña del usuario"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="diaPago">Día de pago *</Label>
            <Input
              id="diaPago"
              type="number"
              min="1"
              max="31"
              value={formData.diaPago}
              onChange={(e) => handleInputChange('diaPago', parseInt(e.target.value))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="estadoPago">Estado de pago</Label>
            <Select 
              value={formData.estadoPago} 
              onValueChange={(value) => handleInputChange('estadoPago', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-pagado">No pagado</SelectItem>
                <SelectItem value="pagado">Pagado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
            >
              {editingUser ? 'Actualizar' : 'Agregar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
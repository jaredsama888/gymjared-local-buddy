import { User } from '@/types/User';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, CreditCard, Mail, Calendar, Key } from 'lucide-react';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onTogglePayment: (id: string) => void;
}

export const UserCard = ({ user, onEdit, onDelete, onTogglePayment }: UserCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getPaymentStatusColor = (status: string) => {
    return status === 'pagado' ? 'bg-primary' : 'bg-destructive';
  };

  const getPaymentBadgeText = (status: string) => {
    return status === 'pagado' ? 'Pagado' : 'Pendiente';
  };

  return (
    <Card className="w-full border-border/50 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{user.nombre}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <Mail size={14} />
              <span>{user.email}</span>
            </div>
          </div>
          <Badge className={getPaymentStatusColor(user.estadoPago)}>
            {getPaymentBadgeText(user.estadoPago)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Key size={14} className="text-secondary" />
          <span className="text-muted-foreground">Contraseña:</span>
          <span className="font-medium">{user.password}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar size={14} className="text-primary" />
          <span className="text-muted-foreground">Día de pago:</span>
          <span className="font-medium">{user.diaPago}</span>
        </div>
        
        <div className="text-sm">
          <span className="text-muted-foreground">Mes actual:</span>
          <span className="ml-2 font-medium">{user.mesActual}</span>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Última actualización: {formatDate(user.fechaUltimaActualizacion)}
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(user)}
            className="flex-1"
          >
            <Edit size={14} className="mr-1" />
            Editar
          </Button>
          
          <Button
            size="sm"
            variant={user.estadoPago === 'pagado' ? 'secondary' : 'default'}
            onClick={() => onTogglePayment(user.id)}
            className="flex-1"
          >
            <CreditCard size={14} className="mr-1" />
            {user.estadoPago === 'pagado' ? 'Marcar impago' : 'Marcar pagado'}
          </Button>
          
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(user.id)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
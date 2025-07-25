import { User } from '@/types/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CreditCard, AlertTriangle, Calendar } from 'lucide-react';

interface StatsCardsProps {
  users: User[];
}

export const StatsCards = ({ users }: StatsCardsProps) => {
  const totalUsers = users.length;
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  const paidUsers = users.filter(user => 
    user.estadoPago === 'pagado' && user.mesActual === currentMonth
  ).length;
  
  const pendingUsers = users.filter(user => 
    user.estadoPago === 'no-pagado' || user.mesActual !== currentMonth
  ).length;

  const today = new Date();
  const currentDay = today.getDate();
  const expiringUsers = users.filter(user => {
    const daysUntilPayment = user.diaPago - currentDay;
    return daysUntilPayment >= 0 && daysUntilPayment <= 3 && user.estadoPago === 'no-pagado';
  }).length;

  const stats = [
    {
      title: 'Total Usuarios',
      value: totalUsers,
      icon: Users,
      color: 'text-primary'
    },
    {
      title: 'Pagados',
      value: paidUsers,
      icon: CreditCard,
      color: 'text-primary'
    },
    {
      title: 'Pendientes',
      value: pendingUsers,
      icon: AlertTriangle,
      color: 'text-destructive'
    },
    {
      title: 'Vencen Pronto',
      value: expiringUsers,
      icon: Calendar,
      color: 'text-secondary'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => (
        <Card key={index} className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <stat.icon size={16} className={stat.color} />
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
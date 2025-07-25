export interface User {
  id: string;
  nombre: string;
  email: string;
  password: string;
  diaPago: number; // día del mes (1-31)
  mesActual: string; // formato YYYY-MM
  estadoPago: 'pagado' | 'no-pagado';
  fechaCreacion: string;
  fechaUltimaActualizacion: string;
}

export interface UserFormData {
  nombre: string;
  email: string;
  password: string;
  diaPago: number;
  estadoPago: 'pagado' | 'no-pagado';
}
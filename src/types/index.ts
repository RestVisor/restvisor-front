export type UserRole = 'admin' | 'waiter' | 'chef';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface Table {
  id: number;
  numero: number;
  estado: string;
}

export interface Order {
  id: number;
  tableNumber: number;
  created_at: string;
  status: string;
  orderDetails: OrderDetail[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

export interface OrderDetail {
  id: number;
  order_id: number;
  producto_id: number;
  cantidad: number;
}
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
  active: boolean;
  details?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}

export interface OrderDetail {
  id: number;
  order_id: number;
  producto_id: number;
  cantidad: number;
}

// Extended properties for Order to handle different API response formats
export interface ExtendedOrder extends Order {
    order_details?: OrderDetail[];
}

// Extended OrderDetail to handle embedded product information
export interface ExtendedOrderDetail extends OrderDetail {
    products?: Product;
    product?: Product;
}

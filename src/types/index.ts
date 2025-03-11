export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'main' | 'sides' | 'drinks' | 'desserts';
  available: boolean;
  image?: string;
  description?: string;
  stock?: number;
  estimatedPrepTime?: number; // in minutes
}

export interface OrderItem extends MenuItem {
  quantity: number;
  notes?: string;
  startedAt?: Date;
  completedAt?: Date;
}

export interface Order {
  id: string;
  tableNumber?: number;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'paid';
  total: number;
  createdAt: Date;
  updatedAt: Date;
  waiterName?: string;
  chefName?: string;
  estimatedCompletionTime?: Date;
  actualCompletionTime?: Date;
  preparationNotes?: string;
}

export interface Table {
  number: number;
  seats: number;
  status: 'available' | 'occupied' | 'reserved';
  currentOrderId?: string;
}

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
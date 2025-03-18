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
  id: number;             // Tipo id como número (int4 en la base de datos)
  numero: number;         // Número de la mesa
  state: string;          // Estado de la mesa (ocupada, libre, etc.)
}

export interface Order {
  id: number;             // Tipo id como número (int4 en la base de datos)
  tableNumber: number;    // Número de la mesa asociada al pedido
  dateCreated: Date;      // Fecha y hora de creación del pedido (timestamp)
  state: string;         // Estado del pedido (pendiente, completado, etc.)
}

export interface Product {
  id: number;             // Tipo id como número (int4 en la base de datos)
  name: string;           // Nombre del producto
  description: string;    // Descripción del producto
  price: number;          // Precio del producto (numérico en la base de datos)
}

export interface OrderDetail {
  id: number;             // Tipo id como número (int4 en la base de datos)
  order_id: number;      // Relación con el pedido (clave foránea)
  product_id: number;    // Relación con el producto (clave foránea)
  amount: number;       // Cantidad del producto en el pedido
}

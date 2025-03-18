export type UserRole = 'admin' | 'camarero' | 'cocinero';

export interface User {
  id: number;           
  username: string;     
  email: string;      
  password: string;       
  role: UserRole;       
}

export interface AuthState {
  user: User | null;     
  isAuthenticated: boolean; 
}


export interface Table {
  id: number;             
  numero: number;         
  state: string;         
}

// Interfaz para la tabla `pedidos`
export interface Pedido {
  id: number;             // ID del pedido, tipo entero
  tableNumber: number;    // Número de la mesa relacionada con el pedido
  dateCreated: Date;      // Fecha de creación del pedido
  estado: string;         // Estado del pedido (ej. "pendiente", "en preparación", "completado")
}

// Interfaz para la tabla `productos`
export interface Producto {
  id: number;             // ID del producto, tipo entero
  name: string;           // Nombre del producto
  descripcion: string;    // Descripción del producto
  price: number;          // Precio del producto
}


export interface DetallePedido {
  id: number;            
  pedido_id: number;      
  producto_id: number;  
  cantidad: number;      
}
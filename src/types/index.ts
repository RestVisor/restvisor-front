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

export interface Order {
  id: number;           
  tableNumber: number;  
  dateCreated: Date;     
  state: string;       
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
  product_id: number;  
  amount: number;      
}
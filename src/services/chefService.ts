import axios from 'axios';
import { authService } from './authService';

// Types
export interface OrderItem {
    id: number;
    producto_id: number;
    pedido_id: number;
    cantidad: number;
    products: {
        id: number;
        name: string;
        description: string | null;
        price: number;
        category: string | null;
        stock: number;
    };
}

export interface Order {
    id: number;
    tableNumber: number;
    status: string;
    created_at: string;
    active: boolean;
    details: string;
    tables: {
        numero: number;
    };
    order_details: OrderItem[];
}

// Response type for updateOrderStatus
export interface UpdateOrderStatusResponse {
    message: string;
    order: Order;
}

// Base API URL from environment variable or default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create an axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
    const token = authService.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const chefService = {
    // Fetch all active orders
    getActiveOrders: async (): Promise<Order[]> => {
        try {
            const response = await api.get('/orders/active');
            return response.data;
        } catch (error) {
            console.error('Error fetching active orders:', error);
            throw error;
        }
    },

    // Update order status
    updateOrderStatus: async (orderId: number, status: string): Promise<UpdateOrderStatusResponse> => {
        try {
            const response = await api.put(`/orders/${orderId}/status`, { status });
            return response.data;
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    },
};

import axios from 'axios';
import { Product } from '../types';
import { authService } from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getProductStock = async (productId: number): Promise<number> => {
    try {
        const token = authService.getToken();
        if (!token) {
            throw new Error('No token found, please log in');
        }

        const response = await axios.get(`${API_URL}/products/${productId}/stock`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.stock;
    } catch (error) {
        console.error('Error al obtener el stock del producto:', error);
        return 0;
    }
}; 
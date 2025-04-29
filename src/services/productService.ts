import axios from 'axios';
import { Product } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getProductStock = async (productId: number): Promise<number> => {
    try {
        const response = await axios.get(`${API_URL}/products/${productId}/stock`);
        return response.data.stock;
    } catch (error) {
        console.error('Error al obtener el stock del producto:', error);
        return 0;
    }
}; 
import axios from 'axios';
import { Order, OrderDetail } from '../types';
import { authService } from './authService';

const API_URL = import.meta.env.VITE_API_URL;

export const getTablesAPI = async () => {
    const token = authService.getToken();
    if (!token) {
        throw new Error('No token found, please log in');
    }

    try {
        const response = await axios.get(`${API_URL}/tables`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching tables:', error);
        throw error;
    }
};

export const getMenuItemsAPI = async () => {
    const token = authService.getToken();
    if (!token) {
        throw new Error('No token found, please log in');
    }

    try {
        const response = await axios.get(`${API_URL}/products`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching menu items:', error);
        throw error;
    }
};

export const submitOrderAPI = async (order: Order) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found, please log in');
    }

    try {
        const response = await axios.post(
            `${API_URL}/orders`, 
            order,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error submitting order:', error);
        return null;
    }
};

export const submitDetailOrderAPI = async (orderId: number, detail: OrderDetail) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found, please log in');
    }

    try {
        const response = await axios.post(
            `${API_URL}/orderDetails`,
            {
                ...detail,
                pedido_id: orderId,
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error submitting order detail:', error);
        return null;
    }
};

export const updateTableState = async (tableId: number, estado: string) => {
    const token = authService.getToken();
    if (!token) {
        throw new Error('No token found, please log in');
    }

    try {
        const response = await axios.post(
            `${API_URL}/tables/${tableId}/estado`,
            { estado },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating table state:', error);
        throw error;
    }
};

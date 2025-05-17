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
            {
                ...order,
                active: true,
                details: order.details || ''
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

export const getActiveOrdersByTable = async (tableNumber: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found, please log in');
    }

    try {
        console.log('Fetching active orders for table:', tableNumber);
        const response = await axios.get(
            `${API_URL}/orders/mesa/${tableNumber}/activos`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('Response from backend:', response.data);

        // La respuesta ya viene en el formato correcto, solo necesitamos mapear los detalles
        if (response.data && response.data.order_details) {
            return {
                id: response.data.id,
                tableNumber: response.data.tableNumber,
                status: response.data.status,
                created_at: response.data.created_at,
                active: response.data.active,
                orderDetails: response.data.order_details.map((detail: any) => ({
                    id: detail.producto_id,
                    cantidad: detail.cantidad,
                    producto_id: detail.producto_id,
                    pedido_id: response.data.id,
                    product: {
                        id: detail.products.id,
                        name: detail.products.name,
                        description: detail.products.description,
                        price: detail.products.price,
                        category: detail.products.category,
                        stock: detail.products.stock
                    }
                }))
            };
        } else {
            console.warn('Unexpected response structure:', response.data);
            return null;
        }
    } catch (error) {
        console.error('Error fetching active orders by table:', error);
        return null;
    }
};

//CONSEGUIR LOS PEDIDOS ACTIVOS
export const getActiveOrders = async (): Promise<Order[]> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found, please log in');
        }

        const response = await axios.get(`${API_URL}/orders/active`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener los pedidos activos:', error);
        return [];
    }
};

export const getTableHistoryForTodayAPI = async (tableNumber: number): Promise<Order[]> => {
    const token = authService.getToken();
    if (!token) {
        throw new Error('No token found, please log in');
    }

    try {
        console.log(`Fetching history for table ${tableNumber}`);
        const response = await axios.get(`${API_URL}/orders/mesa/${tableNumber}/historial-hoy`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        console.log(`History response for table ${tableNumber}:`, response.data);
        
        // The backend returns { message: string, tableNumber: number, orders: Order[] }
        if (response.data && Array.isArray(response.data.orders)) {
            const orders = response.data.orders;
            
            // Transform orderDetails if necessary for compatibility
            const formattedOrders = orders.map(order => {
                // Make sure orderDetails exists and is correctly formatted
                const orderDetails = order.orderDetails || order.order_details || [];
                
                return {
                    ...order,
                    // Ensure consistent field name
                    orderDetails: orderDetails.map(detail => ({
                        ...detail,
                        // Ensure pedido_id is present
                        pedido_id: detail.pedido_id || detail.order_id || order.id
                    }))
                };
            });
            
            console.log(`Formatted history data for table ${tableNumber}:`, formattedOrders);
            return formattedOrders;
        }
        
        // If the backend returns a response with an empty orders array
        if (response.data && response.data.message && Array.isArray(response.data.orders)) {
            console.log(`No history found for table ${tableNumber} (empty array in response)`);
            return [];
        }
        
        console.warn('Unexpected response structure for table history:', response.data);
        return []; // Return empty array for unexpected structure
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
            // If the API returns 404, it means no history was found, so return an empty array.
            console.log(`No history found for table ${tableNumber} (404 response)`);
            return [];
        }
        console.error(`Error fetching history for table ${tableNumber}:`, error);
        throw error; // Re-throw other errors
    }
};

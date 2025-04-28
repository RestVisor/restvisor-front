import { useState, useEffect, useCallback } from 'react';
import { chefService, Order } from '../services/chefService';
import { toast } from 'react-hot-toast';

export const useChefOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<string>('all');
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

    // Calculate order stats
    const getOrderStats = useCallback(() => {
        if (!orders.length) {
            return {
                total: 0,
                pending: 0,
                inProgress: 0,
                ready: 0,
            };
        }

        return {
            total: orders.length,
            pending: orders.filter((order) => order.status === 'pending').length,
            inProgress: orders.filter((order) => order.status === 'en preparación').length,
            ready: orders.filter((order) => order.status === 'listo').length,
        };
    }, [orders]);

    // Calculate order counts for filters
    const getOrderCounts = useCallback(() => {
        if (!orders.length) {
            return {
                all: 0,
                pending: 0,
                'en preparación': 0,
                listo: 0,
            };
        }

        return {
            all: orders.length,
            pending: orders.filter((order) => order.status === 'pending').length,
            'en preparación': orders.filter((order) => order.status === 'en preparación').length,
            listo: orders.filter((order) => order.status === 'listo').length,
        };
    }, [orders]);

    // Fetch orders
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await chefService.getActiveOrders();
            setOrders(data);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to fetch orders. Please try again.');
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    }, []);

    // Update order status
    const updateOrderStatus = useCallback(async (orderId: number, status: string) => {
        try {
            await chefService.updateOrderStatus(orderId, status);
            // Trigger a refresh
            setRefreshTrigger((prev) => prev + 1);
            toast.success(`Order status updated to ${status}`);
        } catch (err) {
            console.error('Error updating order status:', err);
            toast.error('Failed to update order status');
        }
    }, []);

    // Handle filter change
    const handleFilterChange = useCallback((filter: string) => {
        setActiveFilter(filter);
    }, []);

    // Filter orders based on active filter
    useEffect(() => {
        if (activeFilter === 'all') {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter((order) => order.status === activeFilter));
        }
    }, [orders, activeFilter]);

    // Fetch orders on mount and when refreshTrigger changes
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders, refreshTrigger]);

    // Set up polling to refresh orders every 30 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchOrders();
        }, 30000);

        return () => clearInterval(intervalId);
    }, [fetchOrders]);

    return {
        orders: filteredOrders,
        loading,
        error,
        orderStats: getOrderStats(),
        orderCounts: getOrderCounts(),
        activeFilter,
        handleFilterChange,
        updateOrderStatus,
        refreshOrders: fetchOrders,
    };
};

export default useChefOrders;

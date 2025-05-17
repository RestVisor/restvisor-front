import React, { useState } from 'react';
import { useTablesAndMenu } from '../hooks/useTablesAndMenu';
import { Table, Product, Order, OrderDetail } from '../types';
import { useAuth } from '../hooks/useAuth';
import TableManagement from '../components/waiter/TableManagement';
import MenuSection from '../components/waiter/MenuSection';
import OrderStatus from '../components/waiter/OrderStatus';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const WaiterDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const {
        tables,
        menuItems,
        pendingOrders,
        activeOrders,
        setActiveOrders,
        tablesWithReadyOrders,
        getTables,
        addOrder,
        submitOrder
    } = useTablesAndMenu();

    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [currentOrder, setCurrentOrder] = useState<Order>({
        id: Date.now(),
        tableNumber: 0,
        status: 'pending',
        created_at: new Date().toISOString(),
        orderDetails: [],
        active: true,
        details: ''
    });

    const handleTableSelect = async (table: Table) => {
        setSelectedTable(table);
        setCurrentOrder({
            ...currentOrder,
            tableNumber: table.numero,
            orderDetails: []
        });
    };

    const handleAddMenuItem = (product: Product) => {
        setCurrentOrder(prevOrder => {
            // Check if product is already in the order
            const existingProductIndex = prevOrder.orderDetails.findIndex(
                item => item.producto_id === product.id
            );

            if (existingProductIndex >= 0) {
                // Product already exists, increase quantity
                const newOrderDetails = [...prevOrder.orderDetails];
                newOrderDetails[existingProductIndex] = {
                    ...newOrderDetails[existingProductIndex],
                    cantidad: newOrderDetails[existingProductIndex].cantidad + 1
                };
                return {
                    ...prevOrder,
                    orderDetails: newOrderDetails
                };
            } else {
                // Add new product to order
                const newDetail: OrderDetail = {
                    id: Date.now(),
                    order_id: prevOrder.id,
                    producto_id: product.id,
                    cantidad: 1
                };
                return {
                    ...prevOrder,
                    orderDetails: [...prevOrder.orderDetails, newDetail]
                };
            }
        });
    };

    const handleRemoveItem = (orderDetail: OrderDetail) => {
        setCurrentOrder(prevOrder => ({
            ...prevOrder,
            orderDetails: prevOrder.orderDetails.filter(item => item.id !== orderDetail.id)
        }));
    };

    const calculateTotal = () => {
        return currentOrder.orderDetails
            .reduce((total, item) => {
                const product = menuItems.find(menuItem => menuItem.id === item.producto_id);
                return total + (product ? product.price * item.cantidad : 0);
            }, 0)
            .toFixed(2);
    };

    const handleUpdateOrderDetails = (details: string) => {
        setCurrentOrder(prevOrder => ({
            ...prevOrder,
            details
        }));
    };

    const handleSubmitOrder = async () => {
        if (!selectedTable || currentOrder.orderDetails.length === 0) return;

        try {
            // Use submitOrder from the context
            await submitOrder(currentOrder);

            // Reset the current order with a new ID
            setCurrentOrder({
                id: Date.now(),
                tableNumber: selectedTable.numero,
                status: 'pending',
                created_at: new Date().toISOString(),
                orderDetails: [],
                active: true,
                details: ''
            });

            // Notify user of success
            toast.success('Pedido enviado correctamente', {
                duration: 3000,
                position: 'top-center',
                icon: '🍽️',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
        } catch (error) {
            console.error('Error submitting order:', error);
            toast.error('Error al enviar el pedido', {
                duration: 3000,
                position: 'top-center',
            });
        }
    };

    const handlePayOrder = async () => {
        if (!selectedTable) return;
        
        try {
            // Get token from local storage
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found, please log in');
            }

            // Update all active orders for this table to inactive (mark as paid)
            const response = await axios.post(
                `${API_URL}/orders/desactivar`,
                { numero_mesa: selectedTable.numero },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                // Refresh tables after successful payment
                await getTables();
                
                // Reset selected table and current order
                setSelectedTable(null);
                setCurrentOrder({
                    id: Date.now(),
                    tableNumber: 0,
                    status: 'pending',
                    created_at: new Date().toISOString(),
                    orderDetails: [],
                    active: true,
                    details: ''
                });
                
                // Notify user
                toast.success('Pago registrado y mesa liberada', {
                    duration: 3000,
                    position: 'top-center',
                    icon: '💰',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                });
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            toast.error('Error al procesar el pago', {
                duration: 3000,
                position: 'top-center',
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <Toaster />
            
            {/* Header/Nav */}
            <nav className="bg-black/30 backdrop-blur-sm fixed w-full z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">
                        Panel <span className="text-blue-400">Servicio de Mesa</span>
                    </h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-300">Bienvenido, {user?.name}</span>
                        <button
                            onClick={logout}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-6 py-24">
                <div className="grid grid-cols-1 gap-8">
                    {/* First row: Tables and Menu side by side */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Tables section - takes the left column */}
                        <div className="h-full">
                            <TableManagement 
                                tables={tables} 
                                handleTableSelect={handleTableSelect}
                                selectedTableId={selectedTable?.id || null}
                            />
                        </div>
                        
                        {/* Menu section - takes the right column */}
                        <div className="h-full">
                            <MenuSection menuItems={menuItems} handleAddMenuItem={handleAddMenuItem} />
                        </div>
                    </div>
                    
                    {/* Second row: Order Details - takes full width */}
                    <div className="col-span-1">
                        <OrderStatus
                            selectedTable={selectedTable}
                            currentOrder={currentOrder}
                            handleRemoveItem={handleRemoveItem}
                            calculateTotal={calculateTotal}
                            handleSubmitOrder={handleSubmitOrder}
                            handlePayOrder={handlePayOrder}
                            menuItems={menuItems}
                            onUpdateDetails={handleUpdateOrderDetails}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default WaiterDashboard;

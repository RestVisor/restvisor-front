import React, { useState } from 'react';
import { useTablesAndMenu } from '../hooks/useTablesAndMenu';
import { Table, Product, Order, OrderDetail } from '../types';
import { useAuth } from '../hooks/useAuth';
import TableManagement from '../components/waiter/TableManagement';
import MenuSection from '../components/waiter/MenuSection';
import OrderStatus from '../components/waiter/OrderStatus';
import TableMapModal from '../components/waiter/TableMapModal';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { updateOrdersToDelivered } from '../services/api';

const API_URL = import.meta.env.VITE_API_URL;

const WaiterDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const {
        tables,
        menuItems,
        tablesWithReadyOrders,
        getTables,
        submitOrder
    } = useTablesAndMenu();

    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
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
        
        // Close the map modal if it's open when a table is selected
        if (isMapModalOpen) {
            setIsMapModalOpen(false);
        }

        // Check if this table has ready orders that need to be marked as delivered
        if (tablesWithReadyOrders.includes(table.numero)) {
            try {
                const updated = await updateOrdersToDelivered(table.numero);
                if (updated) {
                    // Refresh tables to update the UI
                    await getTables();
                    
                    // Show success notification
                    toast.success('Pedido marcado como entregado', {
                        duration: 3000,
                        position: 'top-center',
                        icon: '✅',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    });
                }
            } catch (error) {
                console.error('Error updating orders to delivered:', error);
                toast.error('Error al marcar pedido como entregado', {
                    duration: 3000,
                    position: 'top-center',
                });
            }
        }
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
                tableNumber: 0,
                status: 'pending',
                created_at: new Date().toISOString(),
                orderDetails: [],
                active: true,
                details: ''
            });

            // Clear the selected table
            setSelectedTable(null);

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
                        <button
                            onClick={() => setIsMapModalOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                            </svg>
                            Mapa
                        </button>
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
                <div className="grid grid-cols-1 gap-6">
                    {/* First row: Tables taking full width */}
                    <div className="col-span-1">
                        <TableManagement 
                            tables={tables} 
                            handleTableSelect={handleTableSelect}
                            selectedTableId={selectedTable?.id || null}
                        />
                    </div>
                    
                    {/* Second row: Menu and Order Details side by side */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Menu section - takes the left column */}
                        <div className="h-full">
                            <MenuSection menuItems={menuItems} handleAddMenuItem={handleAddMenuItem} />
                        </div>
                        
                        {/* Order Details section - takes the right column */}
                        <div className="h-full">
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
                </div>
            </main>
            
            {/* Table Map Modal */}
            <TableMapModal 
                isOpen={isMapModalOpen}
                onClose={() => setIsMapModalOpen(false)}
                tables={tables}
                onTableSelect={handleTableSelect}
                selectedTableId={selectedTable?.id || null}
                tablesWithReadyOrders={tablesWithReadyOrders}
            />
        </div>
    );
};

export default WaiterDashboard;

import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { generateReceiptPDF } from '../utils/receiptGenerator';
import { getAllOrdersWithDetailsAPI } from '../services/api';

const API_URL = import.meta.env.VITE_API_URL;

interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'chef' | 'waiter';
}

interface Table {
    id: number;
    numero: number;
    estado: 'disponible' | 'ocupada' | 'reservada';
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
}

// New interface for stock management
interface StockMovement {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    type: 'entrada' | 'salida';
    reason: string;
    date: string;
}

// Define interfaces for order history
interface OrderDetail {
    id: number;
    pedido_id: number;
    producto_id: number;
    cantidad: number;
    products?: Product;
}

interface Order {
    id: number;
    tableNumber: number;
    created_at: string;
    status: string;
    active: boolean;
    details?: string;
    order_details: OrderDetail[];
}

type TabType = 'users' | 'tables' | 'products' | 'stock' | 'orders';
type EditingItem = User | Table | Product | StockMovement | null;

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('users');
    const [users, setUsers] = useState<User[]>([]);
    const [tables, setTables] = useState<Table[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);
    const [orderStatusFilter, setOrderStatusFilter] = useState<string>('');
    const [editingItem, setEditingItem] = useState<EditingItem>(null);

    const {
        register: registerUser,
        handleSubmit: handleSubmitUser,
        reset: resetUser,
        setValue: setUserValue,
    } = useForm<User>();

    const {
        register: registerTable,
        handleSubmit: handleSubmitTable,
        reset: resetTable,
        setValue: setTableValue,
    } = useForm<Table>();

    const {
        register: registerProduct,
        handleSubmit: handleSubmitProduct,
        reset: resetProduct,
        setValue: setProductValue,
        formState: { errors: productErrors },
    } = useForm<Product>();

    const {
        register: registerStockMovement,
        handleSubmit: handleSubmitStockMovement,
        reset: resetStockMovement,
        formState: { errors: stockErrors },
    } = useForm<StockMovement & { productId: number }>();

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            };

            if (activeTab === 'users') {
                const response = await fetch(`${API_URL}/users`, { headers });
                const data = await response.json();
                setUsers(data);
            } else if (activeTab === 'tables') {
                const response = await fetch(`${API_URL}/tables`, { headers });
                const data = await response.json();
                setTables(data);
            } else if (activeTab === 'products' || activeTab === 'stock') {
                const response = await fetch(`${API_URL}/products`, { headers });
                const data = await response.json();
                setProducts(data);

                // If we're on the stock tab, also fetch stock movements
                if (activeTab === 'stock') {
                    // This endpoint would need to be implemented in the backend
                    try {
                        const stockResponse = await fetch(`${API_URL}/stock-movements`, { headers });
                        if (stockResponse.ok) {
                            const stockData = await stockResponse.json();
                            setStockMovements(stockData);
                        }
                    } catch (error) {
                        console.error('Error fetching stock movements:', error);
                        // If the endpoint doesn't exist yet, use mock data
                        const mockData: StockMovement[] = [];
                        setStockMovements(mockData);
                    }
                }
            } else if (activeTab === 'orders') {
                // Fetch all orders for the orders history tab
                setIsLoadingOrders(true);
                try {
                    console.log('Fetching orders with filter:', orderStatusFilter);
                    // Use the new API function with filters if status filter is set
                    const filters = orderStatusFilter ? { status: orderStatusFilter } : undefined;
                    const data = await getAllOrdersWithDetailsAPI(filters);
                    console.log('Received orders:', data);
                    setOrders(data);
                } catch (error) {
                    console.error('Error fetching orders:', error);
                } finally {
                    setIsLoadingOrders(false);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSubmit = async (data: User | Table | Product | (StockMovement & { productId: number })) => {
        try {
            const token = localStorage.getItem('token');

            // Handle stock movements separately
            if (activeTab === 'stock' && 'productId' in data && 'type' in data) {
                // This would need to be implemented in the backend
                const stockData = data as StockMovement & { productId: number };
                const url = `${API_URL}/stock-movements`;

                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            ...stockData,
                            date: new Date().toISOString(),
                        }),
                    });

                    if (!response.ok) throw new Error('Failed to save stock movement');

                    // Update the product stock based on the movement type
                    const product = products.find((p) => p.id === parseInt(stockData.productId.toString()));
                    if (product) {
                        const newStock =
                            stockData.type === 'entrada'
                                ? product.stock + stockData.quantity
                                : Math.max(0, product.stock - stockData.quantity);

                        // Update the product stock
                        await fetch(`${API_URL}/products/${product.id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                ...product,
                                stock: newStock,
                            }),
                        });
                    }

                    fetchData();
                    resetForm();
                    return;
                } catch (error) {
                    console.error('Stock movement not implemented yet:', error);
                    // If the endpoint doesn't exist, just update the product stock directly
                    const product = products.find((p) => p.id === parseInt(stockData.productId.toString()));
                    if (product) {
                        const newStock =
                            stockData.type === 'entrada'
                                ? product.stock + stockData.quantity
                                : Math.max(0, product.stock - stockData.quantity);

                        await fetch(`${API_URL}/products/${product.id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                ...product,
                                stock: newStock,
                            }),
                        });

                        alert(`Inventario actualizado. Nuevo stock para ${product.name}: ${newStock}`);
                        fetchData();
                        resetForm();
                        return;
                    }
                }
            }

            // Handle normal CRUD operations
            const method = editingItem ? 'PUT' : 'POST';
            let endpoint;

            if (activeTab === 'users') endpoint = 'users';
            else if (activeTab === 'tables') {
                if (editingItem) {
                    // Si estamos editando una mesa, usamos el endpoint específico para actualizar el estado
                    const tableData = data as Table;
                    const response = await fetch(`${API_URL}/tables/${editingItem.id}/estado`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ estado: tableData.estado }),
                    });

                    if (!response.ok) throw new Error('Failed to update table state');
                    fetchData();
                    resetForm();
                    setEditingItem(null);
                    return;
                }
                endpoint = 'tables';
            }
            else if (activeTab === 'products') endpoint = 'products';
            else return; // Should not happen

            const url = editingItem ? `${API_URL}/${endpoint}/${editingItem.id}` : `${API_URL}/${endpoint}`;

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to save item');

            fetchData();
            resetForm();
            setEditingItem(null);
        } catch (error) {
            console.error('Error saving item:', error);
        }
    };

    const handleEdit = (item: User | Table | Product | StockMovement) => {
        setEditingItem(item);
        if (activeTab === 'users' && 'email' in item) {
            Object.keys(item).forEach((key) => {
                setUserValue(key as keyof User, item[key as keyof User]);
            });
        } else if (activeTab === 'tables' && 'numero' in item) {
            Object.keys(item).forEach((key) => {
                setTableValue(key as keyof Table, item[key as keyof Table]);
            });
        } else if (activeTab === 'products' && 'price' in item) {
            Object.keys(item).forEach((key) => {
                setProductValue(key as keyof Product, item[key as keyof Product]);
            });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            let endpoint;

            if (activeTab === 'users') endpoint = 'users';
            else if (activeTab === 'tables') endpoint = 'tables';
            else if (activeTab === 'products') endpoint = 'products';
            else return; // Don't handle stock deletions yet

            const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Failed to delete item');
            fetchData();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const resetForm = () => {
        if (activeTab === 'users') resetUser();
        else if (activeTab === 'tables') resetTable();
        else if (activeTab === 'products') resetProduct();
        else if (activeTab === 'stock') resetStockMovement();
    };

    const renderForm = () => {
        switch (activeTab) {
            case 'users':
                return (
                    <form onSubmit={handleSubmitUser(handleSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-gray-300">Nombre</label>
                            <input
                                type="text"
                                {...registerUser('name', { required: 'El nombre es obligatorio' })}
                                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg mt-1 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300">Email/Nif</label>
                            <input
                                type="text"
                                {...registerUser('email', { required: 'El email/nif es obligatorio' })}
                                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg mt-1 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300">Contraseña</label>
                            <input
                                type="password"
                                {...registerUser('password', { required: !editingItem })}
                                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg mt-1 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300">Rol</label>
                            <select
                                {...registerUser('role', { required: 'El rol es obligatorio' })}
                                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg mt-1 text-white focus:outline-none focus:border-blue-400"
                            >
                                <option value="waiter">Camarero</option>
                                <option value="chef">Chef</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 w-full"
                            >
                                {editingItem ? 'Actualizar Usuario' : 'Añadir Usuario'}
                            </button>
                            {editingItem && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        resetForm();
                                        setEditingItem(null);
                                    }}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 w-full"
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                );
            case 'tables':
                return (
                    <form onSubmit={handleSubmitTable(handleSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-gray-300">Número de Mesa</label>
                            <input
                                type="number"
                                {...registerTable('numero', { required: 'El número de mesa es obligatorio' })}
                                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg mt-1 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300">Estado</label>
                            <select
                                {...registerTable('estado', { required: 'El estado es obligatorio' })}
                                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg mt-1 text-white focus:outline-none focus:border-blue-400"
                            >
                                <option value="disponible">Disponible</option>
                                <option value="ocupada">Ocupada</option>
                                <option value="reservada">Reservada</option>
                            </select>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 w-full"
                            >
                                {editingItem ? 'Actualizar Mesa' : 'Añadir Mesa'}
                            </button>
                            {editingItem && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        resetForm();
                                        setEditingItem(null);
                                    }}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 w-full"
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                );
            case 'products':
                return (
                    <form onSubmit={handleSubmitProduct(handleSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-gray-300">Nombre</label>
                            <input
                                type="text"
                                {...registerProduct('name', { required: 'El nombre es obligatorio' })}
                                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg mt-1 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300">Descripción</label>
                            <textarea
                                {...registerProduct('description')}
                                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg mt-1 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300">Precio</label>
                            <input
                                type="number"
                                step="0.01"
                                {...registerProduct('price', { required: 'El precio es obligatorio' })}
                                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg mt-1 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300">Categoría</label>
                            <input
                                type="text"
                                {...registerProduct('category')}
                                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg mt-1 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300">Stock</label>
                            <input
                                type="number"
                                {...registerProduct('stock', {
                                    required: 'El stock es obligatorio',
                                    min: { value: 0, message: 'El stock no puede ser negativo' },
                                })}
                                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg mt-1 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                            />
                            {productErrors.stock && (
                                <p className="text-red-500 text-sm">{productErrors.stock.message}</p>
                            )}
                        </div>
                        <div className="flex space-x-2">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 w-full"
                            >
                                {editingItem ? 'Actualizar Producto' : 'Añadir Producto'}
                            </button>
                            {editingItem && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        resetForm();
                                        setEditingItem(null);
                                    }}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 w-full"
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                );
            case 'stock':
                return (
                    <form onSubmit={handleSubmitStockMovement(handleSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-gray-300">Producto</label>
                            <select
                                {...registerStockMovement('productId', {
                                    required: 'El producto es obligatorio',
                                    valueAsNumber: true,
                                })}
                                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg mt-1 text-white focus:outline-none focus:border-blue-400"
                            >
                                <option value="">Seleccionar producto</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name} (Stock actual: {product.stock})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-300">Tipo de Movimiento</label>
                            <select
                                {...registerStockMovement('type', { required: 'El tipo de movimiento es obligatorio' })}
                                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg mt-1 text-white focus:outline-none focus:border-blue-400"
                            >
                                <option value="entrada">Entrada (Añadir stock)</option>
                                <option value="salida">Salida (Restar stock)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-300">Cantidad</label>
                            <input
                                type="number"
                                {...registerStockMovement('quantity', {
                                    required: 'La cantidad es obligatoria',
                                    min: { value: 1, message: 'La cantidad debe ser al menos 1' },
                                    valueAsNumber: true,
                                })}
                                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg mt-1 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                            />
                            {stockErrors.quantity && (
                                <p className="text-red-500 text-sm">{stockErrors.quantity.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-gray-300">Motivo</label>
                            <textarea
                                {...registerStockMovement('reason', { required: 'El motivo es obligatorio' })}
                                placeholder="Ej: Compra a proveedor, consumo, caducidad..."
                                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg mt-1 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                            />
                        </div>
                        <div className="flex space-x-2">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 w-full"
                            >
                                Registrar Movimiento
                            </button>
                            {editingItem && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        resetForm();
                                        setEditingItem(null);
                                    }}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 w-full"
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                );
            case 'orders':
                return <h3 className="text-lg font-medium text-white mb-4">Historial de Pedidos</h3>; // No form needed for orders tab
            default:
                return null;
        }
    };

    // Handle downloading receipt for an order
    const handleDownloadReceipt = (order: Order) => {
        // Get the order details
        const orderItems = order.order_details || [];
        
        // Calculate the total amount
        const totalAmount = orderItems.reduce((sum, detail) => {
            const product = products.find(p => p.id === detail.producto_id);
            const price = detail.products?.price || product?.price || 0;
            return sum + (price * detail.cantidad);
        }, 0).toFixed(2);
        
        // Generate the PDF receipt
        const receiptUrl = generateReceiptPDF(
            order.tableNumber, 
            orderItems.map(detail => ({
                id: detail.id,
                order_id: order.id,
                producto_id: detail.producto_id,
                cantidad: detail.cantidad
            })),
            products,
            totalAmount
        );
        
        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = receiptUrl;
        downloadLink.download = `ticket-mesa-${order.tableNumber}-${new Date(order.created_at).getTime()}.pdf`;
        
        // Trigger the download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Revoke the blob URL to free up memory
        setTimeout(() => URL.revokeObjectURL(receiptUrl), 100);
    };

    // Update to handle status filter change
    const handleStatusFilterChange = (status: string) => {
        setOrderStatusFilter(status);
        // Fetch data with the updated filter after state has been set
        setTimeout(() => {
            if (activeTab === 'orders') {
                fetchData();
            }
        }, 0);
    };

    const renderList = () => {
        switch (activeTab) {
            case 'users':
                return (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Nombre
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Rol
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800/30 divide-y divide-gray-700">
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                            {user.role === 'admin'
                                                ? 'Administrador'
                                                : user.role === 'chef'
                                                    ? 'Chef'
                                                    : 'Camarero'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="text-blue-400 hover:text-blue-300 mr-2"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'tables':
                return (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Número
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800/30 divide-y divide-gray-700">
                                {tables.map((table) => (
                                    <tr key={table.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{table.numero}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                            {table.estado === 'disponible'
                                                ? 'Disponible'
                                                : table.estado === 'ocupada'
                                                    ? 'Ocupada'
                                                    : 'Reservada'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleEdit(table)}
                                                className="text-blue-400 hover:text-blue-300 mr-2"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(table.id)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'products':
                return (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Nombre
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Descripción
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Precio
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Categoría
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800/30 divide-y divide-gray-700">
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                            {product.description}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">${product.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                            {product.category}
                                        </td>
                                        <td
                                            className={`px-6 py-4 whitespace-nowrap ${product.stock === 0
                                                    ? 'text-red-400'
                                                    : product.stock < 5
                                                        ? 'text-yellow-400'
                                                        : 'text-green-400'
                                                }`}
                                        >
                                            {product.stock === 0 ? 'Agotado' : product.stock}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="text-blue-400 hover:text-blue-300 mr-2"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'stock':
                return (
                    <div>
                        <h3 className="text-lg font-medium text-white mb-4">Productos con Stock Bajo</h3>
                        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {products
                                .filter((product) => product.stock < 5)
                                .map((product) => (
                                    <div
                                        key={product.id}
                                        className={`p-4 rounded-lg ${product.stock === 0
                                                ? 'bg-red-900/30 border border-red-800'
                                                : 'bg-yellow-900/30 border border-yellow-800'
                                            }`}
                                    >
                                        <h4 className="font-semibold text-white">{product.name}</h4>
                                        <p
                                            className={`text-sm ${product.stock === 0 ? 'text-red-400' : 'text-yellow-400'
                                                }`}
                                        >
                                            Stock: {product.stock === 0 ? 'Agotado' : product.stock}
                                        </p>
                                        <p className="text-gray-400 text-sm mt-1">Categoría: {product.category}</p>
                                    </div>
                                ))}
                        </div>

                        <h3 className="text-lg font-medium text-white mb-4">Historial de Movimientos</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-800/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Fecha
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Producto
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Tipo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Cantidad
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Motivo
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-800/30 divide-y divide-gray-700">
                                    {stockMovements.length > 0 ? (
                                        stockMovements.map((movement) => (
                                            <tr key={movement.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                                    {new Date(movement.date).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                                    {movement.productName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${movement.type === 'entrada'
                                                                ? 'bg-green-900 text-green-400'
                                                                : 'bg-red-900 text-red-400'
                                                            }`}
                                                    >
                                                        {movement.type === 'entrada' ? 'Entrada' : 'Salida'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                                    {movement.quantity}
                                                </td>
                                                <td className="px-6 py-4 text-gray-300">{movement.reason}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                                                No hay movimientos de stock registrados
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'orders':
                return (
                    <div>
                        
                        {isLoadingOrders ? (
                            <div className="flex justify-center items-center py-10">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                No se encontraron pedidos en el sistema.
                            </div>
                        ) : (
                            <div className="space-y-4">

                                {/* Orders list */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {orders.map((order) => (
                                        <div 
                                            key={order.id} 
                                            className="bg-gray-800/60 rounded-lg p-4 border border-gray-700/40 hover:border-blue-500/40 transition-colors"
                                        >
                                            <div className="flex justify-between items-center mb-3">
                                                <div>
                                                    <span className="bg-blue-600/50 text-blue-200 text-xs font-medium px-2 py-1 rounded-full">
                                                        Mesa {order.tableNumber}
                                                    </span>
                                                </div>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                                                    order.status === 'pagado' ? 'bg-green-600/40 text-green-200' :
                                                    order.status === 'entregado' ? 'bg-blue-600/40 text-blue-200' :
                                                    order.status === 'listo' ? 'bg-yellow-600/40 text-yellow-200' :
                                                    order.status === 'en preparación' ? 'bg-orange-600/40 text-orange-200' :
                                                    'bg-gray-600/40 text-gray-200'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            
                                            <div className="text-xs text-gray-300 mb-2">
                                                {new Date(order.created_at).toLocaleDateString()} {' '}
                                                {new Date(order.created_at).toLocaleTimeString()}
                                            </div>
                                            
                                            <div className="mb-3">
                                                <h4 className="text-sm font-medium text-white mb-1">Detalles:</h4>
                                                <ul className="max-h-32 overflow-y-auto text-sm bg-gray-900/50 rounded-md p-2">
                                                    {order.order_details && order.order_details.map((detail) => {
                                                        const product = products.find(p => p.id === detail.producto_id) || 
                                                                       detail.products;
                                                        const productName = product?.name || 'Producto desconocido';
                                                        return (
                                                            <li key={detail.id} className="flex justify-between py-1 border-b border-gray-700/50">
                                                                <span className="text-gray-200">{productName} x{detail.cantidad}</span>
                                                                <span className="text-gray-200 font-medium">${((product?.price || 0) * detail.cantidad).toFixed(2)}</span>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                            
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-white font-medium">
                                                    Total: ${order.order_details?.reduce((sum, detail) => {
                                                        const product = products.find(p => p.id === detail.producto_id) || 
                                                                       detail.products;
                                                        return sum + ((product?.price || 0) * detail.cantidad);
                                                    }, 0).toFixed(2) || '0.00'}
                                                </span>
                                                <button
                                                    onClick={() => handleDownloadReceipt(order)}
                                                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 rounded flex items-center"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 mr-1">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                                    </svg>
                                                    Descargar Ticket
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Header/Nav */}
            <nav className="bg-black/30 backdrop-blur-sm fixed w-full z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">
                        Panel <span className="text-blue-400">Administrador</span>
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

            <main className="container mx-auto px-6 py-32">
                <div className="mb-6">
                    <div className="border-b border-gray-700">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`${activeTab === 'users'
                                        ? 'border-blue-400 text-blue-400'
                                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200`}
                            >
                                Usuarios
                            </button>
                            <button
                                onClick={() => setActiveTab('tables')}
                                className={`${activeTab === 'tables'
                                        ? 'border-blue-400 text-blue-400'
                                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200`}
                            >
                                Mesas
                            </button>
                            <button
                                onClick={() => setActiveTab('products')}
                                className={`${activeTab === 'products'
                                        ? 'border-blue-400 text-blue-400'
                                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200`}
                            >
                                Productos
                            </button>
                            <button
                                onClick={() => setActiveTab('stock')}
                                className={`${activeTab === 'stock'
                                        ? 'border-blue-400 text-blue-400'
                                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200`}
                            >
                                Inventario
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`${activeTab === 'orders'
                                        ? 'border-blue-400 text-blue-400'
                                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200`}
                            >
                                Pedidos
                            </button>
                        </nav>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className={`lg:col-span-1 bg-black/30 backdrop-blur-sm p-6 rounded-lg shadow-xl ${activeTab === 'orders' ? 'hidden lg:block' : ''}`}>
                        <h2 className="text-xl font-semibold mb-4 text-white">
                            {activeTab === 'orders' ? '' : editingItem
                                ? `Editar ${activeTab === 'users'
                                    ? 'Usuario'
                                    : activeTab === 'tables'
                                        ? 'Mesa'
                                        : activeTab === 'products'
                                            ? 'Producto'
                                            : 'Movimiento de Stock'
                                }`
                                : `Añadir ${activeTab === 'users'
                                    ? 'Usuario'
                                    : activeTab === 'tables'
                                        ? 'Mesa'
                                        : activeTab === 'products'
                                            ? 'Producto'
                                            : 'Movimiento de Stock'
                                }`}
                        </h2>
                        <div className="text-gray-300">{renderForm()}</div>
                    </div>
                    <div className={`${activeTab === 'orders' ? 'lg:col-span-3' : 'lg:col-span-2'} bg-black/30 backdrop-blur-sm p-6 rounded-lg shadow-xl`}>
                        <h2 className="text-xl font-semibold mb-4 text-white">
                            {activeTab === 'users'
                                ? 'Lista de Usuarios'
                                : activeTab === 'tables'
                                    ? 'Lista de Mesas'
                                    : activeTab === 'products'
                                        ? 'Lista de Productos'
                                        : activeTab === 'stock'
                                            ? 'Historial de Inventario'
                                            : ''}
                        </h2>
                        {renderList()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;

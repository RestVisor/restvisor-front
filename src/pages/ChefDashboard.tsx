import { useAuth } from '../hooks/useAuth';
import useChefOrders from '../hooks/useChefOrders';
import { Toaster } from 'react-hot-toast';
import OrderCard from '../components/chef/OrderCard';
import OrderFilters from '../components/chef/OrderFilters';
import StatCards from '../components/chef/StatCards';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

// Define Product type
interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
}

const ChefDashboard = () => {
    const { user, logout } = useAuth();
    const {
        orders,
        loading,
        error,
        orderStats,
        orderCounts,
        activeFilter,
        handleFilterChange,
        updateOrderStatus,
        refreshOrders,
    } = useChefOrders();

    // Add state for products data
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    // Fetch products data
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoadingProducts(true);
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/products`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
                toast.error('Error loading inventory data');
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchProducts();
    }, []);

    // Filter products with low stock (less than 10 units)
    const lowStockProducts = products.filter((product) => product.stock < 10).sort((a, b) => a.stock - b.stock); // Sort by lowest stock first

    // Function to request stock replenishment
    const requestRestocking = async (productId: number) => {
        try {
            const token = localStorage.getItem('token');
            const product = products.find((p) => p.id === productId);

            if (!product) return;

            // Create a stock movement entry (entrada)
            const response = await fetch(`${API_URL}/stock-movements`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productId: product.id,
                    quantity: 20, // Default restock amount
                    type: 'entrada',
                    reason: 'Reposición de inventario solicitada por Chef',
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to request restocking');
            }

            // Refresh the products data
            const updatedResponse = await fetch(`${API_URL}/products`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (updatedResponse.ok) {
                const updatedData = await updatedResponse.json();
                setProducts(updatedData);
                toast.success(`Inventory updated for ${product.name}`);
            }
        } catch (error) {
            console.error('Error requesting restocking:', error);
            toast.error('Failed to request restocking');
        }
    };

    const requestAllRestocking = async () => {
        try {
            // Request restocking for all low-stock products
            await Promise.all(lowStockProducts.map((product) => requestRestocking(product.id)));
            toast.success('Restocking requested for all low stock items');
        } catch (error) {
            console.error('Error requesting multiple restocking:', error);
            toast.error('Failed to request restocking for some items');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <Toaster position="top-right" />

            {/* Header/Nav */}
            <nav className="bg-black/30 backdrop-blur-sm fixed w-full z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">
                        Chef <span className="text-blue-400">Dashboard</span>
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
                {/* Stats Section */}
                <StatCards stats={orderStats} />

                {/* Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Orders Section - Takes up 2/3 of the grid on large screens */}
                    <div className="lg:col-span-2">
                        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 shadow-xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-white">Pedidos</h2>
                                <button
                                    onClick={refreshOrders}
                                    className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-all duration-200"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <OrderFilters
                                activeFilter={activeFilter}
                                orderCount={orderCounts}
                                onFilterChange={handleFilterChange}
                            />

                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            ) : error ? (
                                <div className="bg-red-500/20 text-red-200 p-4 rounded-lg">{error}</div>
                            ) : orders.length === 0 ? (
                                <div className="bg-gray-800/30 text-gray-400 p-8 rounded-lg text-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-12 w-12 mx-auto mb-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                                        />
                                    </svg>
                                    <p className="text-lg">No se encontraron pedidos</p>
                                    <p className="text-sm mt-2">Cuando lleguen nuevos pedidos, aparecerán aquí</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                    {orders.map((order) => (
                                        <OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Kitchen Info Section - Takes up 1/3 of the grid on large screens */}
                    <div>
                        {/* Kitchen Inventory Section */}
                        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 shadow-xl mb-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-white">Inventario de Cocina</h2>
                                <button
                                    onClick={() => refreshOrders()}
                                    className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-all duration-200"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-gray-800/50 rounded-lg p-4">
                                    <h3 className="text-lg font-medium text-white mb-2">Productos con Poco Stock</h3>

                                    {loadingProducts ? (
                                        <div className="flex justify-center items-center h-32">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                        </div>
                                    ) : lowStockProducts.length === 0 ? (
                                        <div className="text-center py-4 text-gray-400">
                                            <p>No hay productos con poco stock</p>
                                            <p className="text-sm mt-1">Todos los niveles de inventario son buenos</p>
                                        </div>
                                    ) : (
                                        <ul className="space-y-2 text-gray-300">
                                            {lowStockProducts.map((product) => (
                                                <li key={product.id} className="flex justify-between">
                                                    <span>{product.name}</span>
                                                    <span
                                                        className={
                                                            product.stock <= 2
                                                                ? 'text-red-400'
                                                                : product.stock <= 5
                                                                ? 'text-yellow-400'
                                                                : 'text-gray-300'
                                                        }
                                                    >
                                                        {product.stock} unidades
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {lowStockProducts.length > 0 && (
                                        <div className="mt-4">
                                            <button
                                                onClick={requestAllRestocking}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 w-full"
                                            >
                                                Solicitar Reposición
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 shadow-xl">
                            <h2 className="text-xl font-semibold mb-6 text-white">Acciones Rápidas</h2>
                            <div className="space-y-3">
                                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 w-full flex items-center justify-between">
                                    <span>Marcar Todos los Pedidos Listos como Entregados</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </button>
                                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 w-full flex items-center justify-between">
                                    <span>Solicitud de Pedido Especial</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </button>
                                <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 w-full flex items-center justify-between">
                                    <span>Actualizar Especiales del Día</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ChefDashboard;

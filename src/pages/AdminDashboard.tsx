import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

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

type TabType = 'users' | 'tables' | 'products';
type EditingItem = User | Table | Product | null;

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('users');
    const [users, setUsers] = useState<User[]>([]);
    const [tables, setTables] = useState<Table[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
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
    } = useForm<Product>();

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
            } else if (activeTab === 'products') {
                const response = await fetch(`${API_URL}/products`, { headers });
                const data = await response.json();
                setProducts(data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSubmit = async (data: User | Table | Product) => {
        try {
            const token = localStorage.getItem('token');
            const method = editingItem ? 'PUT' : 'POST';
            const endpoint = activeTab === 'users' ? 'usuarios' : activeTab;
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

    const handleEdit = (item: User | Table | Product) => {
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
            const endpoint = activeTab === 'users' ? 'usuarios' : activeTab;
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
        else resetProduct();
    };

    const renderForm = () => {
        switch (activeTab) {
            case 'users':
                return (
                    <form onSubmit={handleSubmitUser(handleSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-gray-300">Name</label>
                            <input
                                type="text"
                                {...registerUser('name', { required: 'Name is required' })}
                                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg mt-1 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300">Email</label>
                            <input
                                type="email"
                                {...registerUser('email', { required: 'Email is required' })}
                                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg mt-1 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300">Password</label>
                            <input
                                type="password"
                                {...registerUser('password', { required: !editingItem })}
                                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg mt-1 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300">Role</label>
                            <select
                                {...registerUser('role', { required: 'Role is required' })}
                                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg mt-1 text-white focus:outline-none focus:border-blue-400"
                            >
                                <option value="waiter">Waiter</option>
                                <option value="chef">Chef</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 w-full"
                            >
                                {editingItem ? 'Update User' : 'Add User'}
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
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                );
            case 'tables':
                return (
                    <form onSubmit={handleSubmitTable(handleSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-gray-300">Table Number</label>
                            <input
                                type="number"
                                {...registerTable('numero', { required: 'Table number is required' })}
                                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg mt-1 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300">Status</label>
                            <select
                                {...registerTable('estado', { required: 'Status is required' })}
                                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg mt-1 text-white focus:outline-none focus:border-blue-400"
                            >
                                <option value="disponible">Available</option>
                                <option value="ocupada">Occupied</option>
                                <option value="reservada">Reserved</option>
                            </select>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 w-full"
                            >
                                {editingItem ? 'Update Table' : 'Add Table'}
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
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                );
            case 'products':
                return (
                    <form onSubmit={handleSubmitProduct(handleSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-gray-300">Name</label>
                            <input
                                type="text"
                                {...registerProduct('name', { required: 'Name is required' })}
                                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg mt-1 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300">Description</label>
                            <textarea
                                {...registerProduct('description')}
                                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg mt-1 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300">Price</label>
                            <input
                                type="number"
                                step="0.01"
                                {...registerProduct('price', { required: 'Price is required' })}
                                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg mt-1 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300">Category</label>
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
                                {...registerProduct("stock", {
                                    required: "Stock is required",
                              })}
                                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg mt-1 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                             />
                       </div>
                        <div className="flex space-x-2">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 w-full"
                            >
                                {editingItem ? 'Update Product' : 'Add Product'}
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
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                );
            default:
                return null;
        }
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
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800/30 divide-y divide-gray-700">
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{user.role}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="text-blue-400 hover:text-blue-300 mr-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                Delete
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
                                        Number
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800/30 divide-y divide-gray-700">
                                {tables.map((table) => (
                                    <tr key={table.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{table.numero}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{table.estado}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleEdit(table)}
                                                className="text-blue-400 hover:text-blue-300 mr-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(table.id)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                Delete
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
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Actions
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
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="text-blue-400 hover:text-blue-300 mr-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
                        Admin <span className="text-blue-400">Dashboard</span>
                    </h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-300">Welcome, {user?.name}</span>
                        <button
                            onClick={logout}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                        >
                            Logout
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
                                className={`${
                                    activeTab === 'users'
                                        ? 'border-blue-400 text-blue-400'
                                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200`}
                            >
                                Users
                            </button>
                            <button
                                onClick={() => setActiveTab('tables')}
                                className={`${
                                    activeTab === 'tables'
                                        ? 'border-blue-400 text-blue-400'
                                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200`}
                            >
                                Tables
                            </button>
                            <button
                                onClick={() => setActiveTab('products')}
                                className={`${
                                    activeTab === 'products'
                                        ? 'border-blue-400 text-blue-400'
                                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200`}
                            >
                                Products
                            </button>
                        </nav>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 bg-black/30 backdrop-blur-sm p-6 rounded-lg shadow-xl">
                        <h2 className="text-xl font-semibold mb-4 text-white">
                            {editingItem ? `Edit ${activeTab.slice(0, -1)}` : `Add New ${activeTab.slice(0, -1)}`}
                        </h2>
                        <div className="text-gray-300">{renderForm()}</div>
                    </div>
                    <div className="lg:col-span-2 bg-black/30 backdrop-blur-sm p-6 rounded-lg shadow-xl">
                        <h2 className="text-xl font-semibold mb-4 text-white">
                            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} List
                        </h2>
                        {renderList()}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-black/30 backdrop-blur-sm py-12">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold text-white mb-8">
                            Admin <span className="text-blue-400">Dashboard</span>
                        </span>
                        <p className="text-gray-400 text-center max-w-md mb-8">
                            Manage your restaurant efficiently with this modern platform.
                        </p>
                        <div className="flex space-x-6">
                            <span className="text-gray-400 hover:text-blue-400 cursor-pointer transition-colors">
                                Contact
                            </span>
                            <span className="text-gray-400 hover:text-blue-400 cursor-pointer transition-colors">
                                Support
                            </span>
                            <span className="text-gray-400 hover:text-blue-400 cursor-pointer transition-colors">
                                Privacy
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AdminDashboard;

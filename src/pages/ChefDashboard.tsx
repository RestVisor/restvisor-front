import { useAuth } from '../hooks/useAuth';

const ChefDashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Header/Nav */}
            <nav className="bg-black/30 backdrop-blur-sm fixed w-full z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">
                        Chef <span className="text-blue-400">Dashboard</span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {/* Active Orders Section */}
                    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 shadow-xl">
                        <h2 className="text-xl font-semibold mb-6 text-white">Active Orders</h2>
                        <div className="space-y-4">
                            <div className="bg-gray-800/50 rounded-lg p-4">
                                <h3 className="text-lg font-medium text-white mb-2">Table 1</h3>
                                <ul className="space-y-2 text-gray-300">
                                    <li>2x Hamburger</li>
                                    <li>1x French Fries</li>
                                </ul>
                                <div className="mt-4">
                                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 w-full">
                                        Mark as Ready
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Menu Management Section */}
                    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 shadow-xl">
                        <h2 className="text-xl font-semibold mb-6 text-white">Menu Management</h2>
                        <div className="space-y-4">
                            <div className="bg-gray-800/50 rounded-lg p-4">
                                <h3 className="text-lg font-medium text-white mb-2">Today's Specials</h3>
                                <ul className="space-y-2 text-gray-300">
                                    <li>Chef's Special Pasta</li>
                                    <li>Grilled Salmon</li>
                                    <li>Chocolate Lava Cake</li>
                                </ul>
                                <div className="mt-4">
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 w-full">
                                        Update Specials
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kitchen Inventory Section */}
                    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 shadow-xl">
                        <h2 className="text-xl font-semibold mb-6 text-white">Kitchen Inventory</h2>
                        <div className="space-y-4">
                            <div className="bg-gray-800/50 rounded-lg p-4">
                                <h3 className="text-lg font-medium text-white mb-2">Low Stock Items</h3>
                                <ul className="space-y-2 text-gray-300">
                                    <li>Tomatoes - 2kg remaining</li>
                                    <li>Chicken - 5kg remaining</li>
                                    <li>Olive Oil - 1L remaining</li>
                                </ul>
                                <div className="mt-4">
                                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 w-full">
                                        Request Restock
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-black/30 backdrop-blur-sm py-12">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold text-white mb-8">
                            Chef <span className="text-blue-400">Dashboard</span>
                        </span>
                        <p className="text-gray-400 text-center max-w-md mb-8">
                            Manage your kitchen efficiently with our modern restaurant management platform.
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

export default ChefDashboard;

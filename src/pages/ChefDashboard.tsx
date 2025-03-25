import { useAuth } from '../hooks/useAuth';
import { getOrderList } from '../hooks/orders';
import { Order } from '../types'
import { useState, useEffect } from "react";

const ChefDashboard = () => {
  const [pedidos, setPedidos] = useState<Order[]>([]);
  const { user, logout } = useAuth();
  
  useEffect(() => {

    const fetchPedidos = async () => {
      try {
        const listaPedidos = await getOrderList();
        console.log(listaPedidos);
        setPedidos(listaPedidos);
      } catch (error) {
        console.error("Error al obtener pedidos:", error);
      }
    };
  
    fetchPedidos();

  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Chef Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Active Orders</h2>
            <p className="text-gray-600">View and manage current kitchen orders</p>
            <div className="flex flex-wrap gap-4">
              {pedidos.map((pedido) => (
                <div key={pedido.id} className="p-3 border rounded-lg shadow-sm bg-white">
                  <p><strong>ID:</strong> {pedido.id}</p>
                  <p><strong>Fecha:</strong> {pedido.created_at}</p>
                  <p><strong>Estado:</strong> {pedido.status}</p>
                  <p><strong>Mesa:</strong> {pedido.tableNumber}</p>
                </div>
              ))}
            </div>
          </div>
         
        </div>
      </main>
    </div>
  );
};

export default ChefDashboard; 

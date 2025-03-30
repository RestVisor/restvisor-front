import { useAuth } from '../hooks/useAuth';
import { getOrderList } from '../hooks/orders';
import { Order } from '../types';
import { useState, useEffect } from "react";

const ChefDashboard = () => {
  const [pedidos, setPedidos] = useState<Order[]>([]);
  const { user, logout } = useAuth();
  
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const listaPedidos = await getOrderList();
        setPedidos(listaPedidos);
      } catch (error) {
        console.error("Error al obtener pedidos:", error);
      }
    };
    fetchPedidos();
  }, []);

  const updateOrderStatus = (id, newStatus) => {
    console.log(id, newStatus)
    setPedidos(prevPedidos =>
      prevPedidos.map(pedido =>
        pedido.id == id ? { ...pedido, status: newStatus } : pedido
      )
    );
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("id", id);
  };

  const handleDrop = (e, newStatus) => {
    const id = e.dataTransfer.getData("id");
    updateOrderStatus(id, newStatus);
  };

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["Recibido", "En Preparación", "Terminado"].map(status => (
            <div 
              key={status} 
              className="bg-white p-6 rounded-lg shadow min-h-[300px]"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, status)}
            >
              <h2 className="text-xl font-semibold mb-4">{status}</h2>
              <div className="space-y-4">
                {pedidos.filter(pedido => pedido.status.toLowerCase() === status.toLowerCase()).map((pedido) => (
                  <div 
                    key={pedido.id} 
                    className="p-3 border rounded-lg shadow-sm bg-gray-50 cursor-grab"
                    draggable
                    onDragStart={(e) => handleDragStart(e, pedido.id)}
                  >
                    <p><strong>ID:</strong> {pedido.id}</p>
                    <p><strong>Fecha:</strong> {pedido.created_at}</p>
                    <p><strong>Mesa:</strong> {pedido.tableNumber}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ChefDashboard;